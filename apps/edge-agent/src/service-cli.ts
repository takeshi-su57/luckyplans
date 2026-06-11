import {
  installEdgeService,
  redactServiceText,
  restartEdgeService,
  statusEdgeService,
  uninstallEdgeService,
} from './service-manager';

const USAGE = 'Usage: service-cli <install|status|restart|uninstall>';

type ServiceCliAction = 'install' | 'status' | 'restart' | 'uninstall';

type ServiceCliDeps = {
  install: () => Promise<void>;
  status: () => Promise<{ stdout: string; stderr: string }>;
  restart: () => Promise<void>;
  uninstall: () => Promise<void>;
  info: (message: string) => void;
  error: (message: string) => void;
  secrets: Array<string | undefined>;
};

function buildDefaultDeps(): ServiceCliDeps {
  return {
    install: () => installEdgeService(),
    status: () => statusEdgeService(),
    restart: () => restartEdgeService(),
    uninstall: () => uninstallEdgeService(),
    info: (message) => process.stdout.write(`${message}\n`),
    error: (message) => console.error(message),
    secrets: [],
  };
}

function isAction(value: string | undefined): value is ServiceCliAction {
  return value === 'install' || value === 'status' || value === 'restart' || value === 'uninstall';
}

function renderError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export async function runServiceCli(
  args: string[],
  deps: Partial<ServiceCliDeps> = {},
): Promise<number> {
  const resolved = { ...buildDefaultDeps(), ...deps };
  const action = args[0];

  if (!isAction(action)) {
    resolved.error(USAGE);
    return 1;
  }

  try {
    if (action === 'install') {
      await resolved.install();
      resolved.info('Edge service install completed.');
      return 0;
    }

    if (action === 'status') {
      const output = await resolved.status();
      if (output.stdout) {
        resolved.info(output.stdout.trimEnd());
      }
      if (output.stderr) {
        resolved.error(output.stderr.trimEnd());
      }
      return 0;
    }

    if (action === 'restart') {
      await resolved.restart();
      resolved.info('Edge service restart completed.');
      return 0;
    }

    await resolved.uninstall();
    resolved.info('Edge service uninstall completed.');
    return 0;
  } catch (error) {
    const redacted = redactServiceText(renderError(error), resolved.secrets);
    resolved.error(redacted);
    return 1;
  }
}

if (process.env.NODE_ENV !== 'test') {
  void runServiceCli(process.argv.slice(2)).then((exitCode) => {
    process.exitCode = exitCode;
  });
}
