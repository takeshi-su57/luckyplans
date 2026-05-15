const test = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');

const originalLoad = Module._load;
Module._load = function patchedLoader(request, parent, isMain) {
  if (request === '@nestjs/common') {
    return {
      Injectable: () => (target) => target,
      Logger: class {
        log() {}
        error() {}
        warn() {}
      },
    };
  }
  if (request === '@luckyplans/shared') {
    return {
      generateId: () => 'generated-id',
      WorkerStatus: {
        ACTIVE: 'ACTIVE',
        DISABLED: 'DISABLED',
      },
    };
  }
  if (request === '@luckyplans/prisma') {
    return {
      PrismaClient: class {},
    };
  }
  if (request === '@prisma/adapter-pg') {
    return {
      PrismaPg: class {},
    };
  }
  return originalLoad(request, parent, isMain);
};

const { CoreService } = require('../dist/core.service.js');

test('createWorker creates active worker via prisma', async () => {
  let called = false;
  const prisma = {
    worker: {
      create: async (args) => {
        called = true;
        return {
          id: 'w1',
          name: args.data.name,
          status: 'ACTIVE',
        };
      },
    },
  };

  const service = new CoreService(prisma);
  const result = await service.createWorker({
    name: 'edge-1',
    platform: 'windows-x64',
    version: '0.1.0',
  });

  assert.equal(called, true);
  assert.equal(result.status, 'ACTIVE');
});

test('getWorkers queries workers ordered by createdAt desc', async () => {
  let orderByArg;
  const prisma = {
    worker: {
      findMany: async (args) => {
        orderByArg = args.orderBy;
        return [];
      },
    },
  };

  const service = new CoreService(prisma);
  await service.getWorkers();

  assert.deepEqual(orderByArg, { createdAt: 'desc' });
});

test('disableWorker updates worker status to DISABLED', async () => {
  let updateArgs;
  const prisma = {
    worker: {
      findUnique: async () => ({ id: 'w1', status: 'ACTIVE' }),
      update: async (args) => {
        updateArgs = args;
        return { id: 'w1', status: 'DISABLED' };
      },
    },
  };

  const service = new CoreService(prisma);
  const result = await service.disableWorker('w1');

  assert.deepEqual(updateArgs, {
    where: { id: 'w1' },
    data: { status: 'DISABLED' },
  });
  assert.equal(result.status, 'DISABLED');
});
