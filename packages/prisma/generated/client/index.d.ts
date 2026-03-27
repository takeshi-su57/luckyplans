
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Profile
 * 
 */
export type Profile = $Result.DefaultSelection<Prisma.$ProfilePayload>
/**
 * Model SocialLink
 * 
 */
export type SocialLink = $Result.DefaultSelection<Prisma.$SocialLinkPayload>
/**
 * Model SkillCategory
 * 
 */
export type SkillCategory = $Result.DefaultSelection<Prisma.$SkillCategoryPayload>
/**
 * Model Project
 * 
 */
export type Project = $Result.DefaultSelection<Prisma.$ProjectPayload>
/**
 * Model Skill
 * 
 */
export type Skill = $Result.DefaultSelection<Prisma.$SkillPayload>
/**
 * Model Experience
 * 
 */
export type Experience = $Result.DefaultSelection<Prisma.$ExperiencePayload>
/**
 * Model Education
 * 
 */
export type Education = $Result.DefaultSelection<Prisma.$EducationPayload>
/**
 * Model Certification
 * 
 */
export type Certification = $Result.DefaultSelection<Prisma.$CertificationPayload>
/**
 * Model Language
 * 
 */
export type Language = $Result.DefaultSelection<Prisma.$LanguagePayload>
/**
 * Model Award
 * 
 */
export type Award = $Result.DefaultSelection<Prisma.$AwardPayload>
/**
 * Model Hobby
 * 
 */
export type Hobby = $Result.DefaultSelection<Prisma.$HobbyPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Proficiency: {
  BEGINNER: 'BEGINNER',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
  EXPERT: 'EXPERT'
};

export type Proficiency = (typeof Proficiency)[keyof typeof Proficiency]

}

export type Proficiency = $Enums.Proficiency

export const Proficiency: typeof $Enums.Proficiency

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Profiles
 * const profiles = await prisma.profile.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Profiles
   * const profiles = await prisma.profile.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.profile`: Exposes CRUD operations for the **Profile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Profiles
    * const profiles = await prisma.profile.findMany()
    * ```
    */
  get profile(): Prisma.ProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.socialLink`: Exposes CRUD operations for the **SocialLink** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SocialLinks
    * const socialLinks = await prisma.socialLink.findMany()
    * ```
    */
  get socialLink(): Prisma.SocialLinkDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.skillCategory`: Exposes CRUD operations for the **SkillCategory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SkillCategories
    * const skillCategories = await prisma.skillCategory.findMany()
    * ```
    */
  get skillCategory(): Prisma.SkillCategoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.project`: Exposes CRUD operations for the **Project** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Projects
    * const projects = await prisma.project.findMany()
    * ```
    */
  get project(): Prisma.ProjectDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.skill`: Exposes CRUD operations for the **Skill** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Skills
    * const skills = await prisma.skill.findMany()
    * ```
    */
  get skill(): Prisma.SkillDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.experience`: Exposes CRUD operations for the **Experience** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Experiences
    * const experiences = await prisma.experience.findMany()
    * ```
    */
  get experience(): Prisma.ExperienceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.education`: Exposes CRUD operations for the **Education** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Educations
    * const educations = await prisma.education.findMany()
    * ```
    */
  get education(): Prisma.EducationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.certification`: Exposes CRUD operations for the **Certification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Certifications
    * const certifications = await prisma.certification.findMany()
    * ```
    */
  get certification(): Prisma.CertificationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.language`: Exposes CRUD operations for the **Language** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Languages
    * const languages = await prisma.language.findMany()
    * ```
    */
  get language(): Prisma.LanguageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.award`: Exposes CRUD operations for the **Award** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Awards
    * const awards = await prisma.award.findMany()
    * ```
    */
  get award(): Prisma.AwardDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.hobby`: Exposes CRUD operations for the **Hobby** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Hobbies
    * const hobbies = await prisma.hobby.findMany()
    * ```
    */
  get hobby(): Prisma.HobbyDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.5.0
   * Query Engine version: 280c870be64f457428992c43c1f6d557fab6e29e
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Profile: 'Profile',
    SocialLink: 'SocialLink',
    SkillCategory: 'SkillCategory',
    Project: 'Project',
    Skill: 'Skill',
    Experience: 'Experience',
    Education: 'Education',
    Certification: 'Certification',
    Language: 'Language',
    Award: 'Award',
    Hobby: 'Hobby'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "profile" | "socialLink" | "skillCategory" | "project" | "skill" | "experience" | "education" | "certification" | "language" | "award" | "hobby"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Profile: {
        payload: Prisma.$ProfilePayload<ExtArgs>
        fields: Prisma.ProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          findFirst: {
            args: Prisma.ProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          findMany: {
            args: Prisma.ProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[]
          }
          create: {
            args: Prisma.ProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          createMany: {
            args: Prisma.ProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[]
          }
          delete: {
            args: Prisma.ProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          update: {
            args: Prisma.ProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          deleteMany: {
            args: Prisma.ProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[]
          }
          upsert: {
            args: Prisma.ProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          aggregate: {
            args: Prisma.ProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProfile>
          }
          groupBy: {
            args: Prisma.ProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProfileCountArgs<ExtArgs>
            result: $Utils.Optional<ProfileCountAggregateOutputType> | number
          }
        }
      }
      SocialLink: {
        payload: Prisma.$SocialLinkPayload<ExtArgs>
        fields: Prisma.SocialLinkFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SocialLinkFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialLinkPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SocialLinkFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialLinkPayload>
          }
          findFirst: {
            args: Prisma.SocialLinkFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialLinkPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SocialLinkFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialLinkPayload>
          }
          findMany: {
            args: Prisma.SocialLinkFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialLinkPayload>[]
          }
          create: {
            args: Prisma.SocialLinkCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialLinkPayload>
          }
          createMany: {
            args: Prisma.SocialLinkCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SocialLinkCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialLinkPayload>[]
          }
          delete: {
            args: Prisma.SocialLinkDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialLinkPayload>
          }
          update: {
            args: Prisma.SocialLinkUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialLinkPayload>
          }
          deleteMany: {
            args: Prisma.SocialLinkDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SocialLinkUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SocialLinkUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialLinkPayload>[]
          }
          upsert: {
            args: Prisma.SocialLinkUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SocialLinkPayload>
          }
          aggregate: {
            args: Prisma.SocialLinkAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSocialLink>
          }
          groupBy: {
            args: Prisma.SocialLinkGroupByArgs<ExtArgs>
            result: $Utils.Optional<SocialLinkGroupByOutputType>[]
          }
          count: {
            args: Prisma.SocialLinkCountArgs<ExtArgs>
            result: $Utils.Optional<SocialLinkCountAggregateOutputType> | number
          }
        }
      }
      SkillCategory: {
        payload: Prisma.$SkillCategoryPayload<ExtArgs>
        fields: Prisma.SkillCategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SkillCategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillCategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SkillCategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillCategoryPayload>
          }
          findFirst: {
            args: Prisma.SkillCategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillCategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SkillCategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillCategoryPayload>
          }
          findMany: {
            args: Prisma.SkillCategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillCategoryPayload>[]
          }
          create: {
            args: Prisma.SkillCategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillCategoryPayload>
          }
          createMany: {
            args: Prisma.SkillCategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SkillCategoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillCategoryPayload>[]
          }
          delete: {
            args: Prisma.SkillCategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillCategoryPayload>
          }
          update: {
            args: Prisma.SkillCategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillCategoryPayload>
          }
          deleteMany: {
            args: Prisma.SkillCategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SkillCategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SkillCategoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillCategoryPayload>[]
          }
          upsert: {
            args: Prisma.SkillCategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillCategoryPayload>
          }
          aggregate: {
            args: Prisma.SkillCategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSkillCategory>
          }
          groupBy: {
            args: Prisma.SkillCategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<SkillCategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.SkillCategoryCountArgs<ExtArgs>
            result: $Utils.Optional<SkillCategoryCountAggregateOutputType> | number
          }
        }
      }
      Project: {
        payload: Prisma.$ProjectPayload<ExtArgs>
        fields: Prisma.ProjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findFirst: {
            args: Prisma.ProjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findMany: {
            args: Prisma.ProjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          create: {
            args: Prisma.ProjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          createMany: {
            args: Prisma.ProjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          delete: {
            args: Prisma.ProjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          update: {
            args: Prisma.ProjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          deleteMany: {
            args: Prisma.ProjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          upsert: {
            args: Prisma.ProjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          aggregate: {
            args: Prisma.ProjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProject>
          }
          groupBy: {
            args: Prisma.ProjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectCountAggregateOutputType> | number
          }
        }
      }
      Skill: {
        payload: Prisma.$SkillPayload<ExtArgs>
        fields: Prisma.SkillFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SkillFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SkillFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>
          }
          findFirst: {
            args: Prisma.SkillFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SkillFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>
          }
          findMany: {
            args: Prisma.SkillFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>[]
          }
          create: {
            args: Prisma.SkillCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>
          }
          createMany: {
            args: Prisma.SkillCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SkillCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>[]
          }
          delete: {
            args: Prisma.SkillDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>
          }
          update: {
            args: Prisma.SkillUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>
          }
          deleteMany: {
            args: Prisma.SkillDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SkillUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SkillUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>[]
          }
          upsert: {
            args: Prisma.SkillUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SkillPayload>
          }
          aggregate: {
            args: Prisma.SkillAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSkill>
          }
          groupBy: {
            args: Prisma.SkillGroupByArgs<ExtArgs>
            result: $Utils.Optional<SkillGroupByOutputType>[]
          }
          count: {
            args: Prisma.SkillCountArgs<ExtArgs>
            result: $Utils.Optional<SkillCountAggregateOutputType> | number
          }
        }
      }
      Experience: {
        payload: Prisma.$ExperiencePayload<ExtArgs>
        fields: Prisma.ExperienceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExperienceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExperiencePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExperienceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExperiencePayload>
          }
          findFirst: {
            args: Prisma.ExperienceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExperiencePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExperienceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExperiencePayload>
          }
          findMany: {
            args: Prisma.ExperienceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExperiencePayload>[]
          }
          create: {
            args: Prisma.ExperienceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExperiencePayload>
          }
          createMany: {
            args: Prisma.ExperienceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExperienceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExperiencePayload>[]
          }
          delete: {
            args: Prisma.ExperienceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExperiencePayload>
          }
          update: {
            args: Prisma.ExperienceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExperiencePayload>
          }
          deleteMany: {
            args: Prisma.ExperienceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExperienceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ExperienceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExperiencePayload>[]
          }
          upsert: {
            args: Prisma.ExperienceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExperiencePayload>
          }
          aggregate: {
            args: Prisma.ExperienceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExperience>
          }
          groupBy: {
            args: Prisma.ExperienceGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExperienceGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExperienceCountArgs<ExtArgs>
            result: $Utils.Optional<ExperienceCountAggregateOutputType> | number
          }
        }
      }
      Education: {
        payload: Prisma.$EducationPayload<ExtArgs>
        fields: Prisma.EducationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EducationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EducationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EducationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EducationPayload>
          }
          findFirst: {
            args: Prisma.EducationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EducationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EducationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EducationPayload>
          }
          findMany: {
            args: Prisma.EducationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EducationPayload>[]
          }
          create: {
            args: Prisma.EducationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EducationPayload>
          }
          createMany: {
            args: Prisma.EducationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EducationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EducationPayload>[]
          }
          delete: {
            args: Prisma.EducationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EducationPayload>
          }
          update: {
            args: Prisma.EducationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EducationPayload>
          }
          deleteMany: {
            args: Prisma.EducationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EducationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EducationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EducationPayload>[]
          }
          upsert: {
            args: Prisma.EducationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EducationPayload>
          }
          aggregate: {
            args: Prisma.EducationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEducation>
          }
          groupBy: {
            args: Prisma.EducationGroupByArgs<ExtArgs>
            result: $Utils.Optional<EducationGroupByOutputType>[]
          }
          count: {
            args: Prisma.EducationCountArgs<ExtArgs>
            result: $Utils.Optional<EducationCountAggregateOutputType> | number
          }
        }
      }
      Certification: {
        payload: Prisma.$CertificationPayload<ExtArgs>
        fields: Prisma.CertificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CertificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CertificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CertificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CertificationPayload>
          }
          findFirst: {
            args: Prisma.CertificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CertificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CertificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CertificationPayload>
          }
          findMany: {
            args: Prisma.CertificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CertificationPayload>[]
          }
          create: {
            args: Prisma.CertificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CertificationPayload>
          }
          createMany: {
            args: Prisma.CertificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CertificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CertificationPayload>[]
          }
          delete: {
            args: Prisma.CertificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CertificationPayload>
          }
          update: {
            args: Prisma.CertificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CertificationPayload>
          }
          deleteMany: {
            args: Prisma.CertificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CertificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CertificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CertificationPayload>[]
          }
          upsert: {
            args: Prisma.CertificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CertificationPayload>
          }
          aggregate: {
            args: Prisma.CertificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCertification>
          }
          groupBy: {
            args: Prisma.CertificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<CertificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.CertificationCountArgs<ExtArgs>
            result: $Utils.Optional<CertificationCountAggregateOutputType> | number
          }
        }
      }
      Language: {
        payload: Prisma.$LanguagePayload<ExtArgs>
        fields: Prisma.LanguageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LanguageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LanguagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LanguageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LanguagePayload>
          }
          findFirst: {
            args: Prisma.LanguageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LanguagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LanguageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LanguagePayload>
          }
          findMany: {
            args: Prisma.LanguageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LanguagePayload>[]
          }
          create: {
            args: Prisma.LanguageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LanguagePayload>
          }
          createMany: {
            args: Prisma.LanguageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LanguageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LanguagePayload>[]
          }
          delete: {
            args: Prisma.LanguageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LanguagePayload>
          }
          update: {
            args: Prisma.LanguageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LanguagePayload>
          }
          deleteMany: {
            args: Prisma.LanguageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LanguageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LanguageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LanguagePayload>[]
          }
          upsert: {
            args: Prisma.LanguageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LanguagePayload>
          }
          aggregate: {
            args: Prisma.LanguageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLanguage>
          }
          groupBy: {
            args: Prisma.LanguageGroupByArgs<ExtArgs>
            result: $Utils.Optional<LanguageGroupByOutputType>[]
          }
          count: {
            args: Prisma.LanguageCountArgs<ExtArgs>
            result: $Utils.Optional<LanguageCountAggregateOutputType> | number
          }
        }
      }
      Award: {
        payload: Prisma.$AwardPayload<ExtArgs>
        fields: Prisma.AwardFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AwardFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AwardPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AwardFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AwardPayload>
          }
          findFirst: {
            args: Prisma.AwardFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AwardPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AwardFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AwardPayload>
          }
          findMany: {
            args: Prisma.AwardFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AwardPayload>[]
          }
          create: {
            args: Prisma.AwardCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AwardPayload>
          }
          createMany: {
            args: Prisma.AwardCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AwardCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AwardPayload>[]
          }
          delete: {
            args: Prisma.AwardDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AwardPayload>
          }
          update: {
            args: Prisma.AwardUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AwardPayload>
          }
          deleteMany: {
            args: Prisma.AwardDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AwardUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AwardUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AwardPayload>[]
          }
          upsert: {
            args: Prisma.AwardUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AwardPayload>
          }
          aggregate: {
            args: Prisma.AwardAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAward>
          }
          groupBy: {
            args: Prisma.AwardGroupByArgs<ExtArgs>
            result: $Utils.Optional<AwardGroupByOutputType>[]
          }
          count: {
            args: Prisma.AwardCountArgs<ExtArgs>
            result: $Utils.Optional<AwardCountAggregateOutputType> | number
          }
        }
      }
      Hobby: {
        payload: Prisma.$HobbyPayload<ExtArgs>
        fields: Prisma.HobbyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.HobbyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HobbyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.HobbyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HobbyPayload>
          }
          findFirst: {
            args: Prisma.HobbyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HobbyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.HobbyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HobbyPayload>
          }
          findMany: {
            args: Prisma.HobbyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HobbyPayload>[]
          }
          create: {
            args: Prisma.HobbyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HobbyPayload>
          }
          createMany: {
            args: Prisma.HobbyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.HobbyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HobbyPayload>[]
          }
          delete: {
            args: Prisma.HobbyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HobbyPayload>
          }
          update: {
            args: Prisma.HobbyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HobbyPayload>
          }
          deleteMany: {
            args: Prisma.HobbyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.HobbyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.HobbyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HobbyPayload>[]
          }
          upsert: {
            args: Prisma.HobbyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HobbyPayload>
          }
          aggregate: {
            args: Prisma.HobbyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateHobby>
          }
          groupBy: {
            args: Prisma.HobbyGroupByArgs<ExtArgs>
            result: $Utils.Optional<HobbyGroupByOutputType>[]
          }
          count: {
            args: Prisma.HobbyCountArgs<ExtArgs>
            result: $Utils.Optional<HobbyCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    profile?: ProfileOmit
    socialLink?: SocialLinkOmit
    skillCategory?: SkillCategoryOmit
    project?: ProjectOmit
    skill?: SkillOmit
    experience?: ExperienceOmit
    education?: EducationOmit
    certification?: CertificationOmit
    language?: LanguageOmit
    award?: AwardOmit
    hobby?: HobbyOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ProfileCountOutputType
   */

  export type ProfileCountOutputType = {
    projects: number
    skills: number
    experiences: number
    socialLinks: number
    skillCategories: number
    education: number
    certifications: number
    languages: number
    awards: number
    hobbies: number
  }

  export type ProfileCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | ProfileCountOutputTypeCountProjectsArgs
    skills?: boolean | ProfileCountOutputTypeCountSkillsArgs
    experiences?: boolean | ProfileCountOutputTypeCountExperiencesArgs
    socialLinks?: boolean | ProfileCountOutputTypeCountSocialLinksArgs
    skillCategories?: boolean | ProfileCountOutputTypeCountSkillCategoriesArgs
    education?: boolean | ProfileCountOutputTypeCountEducationArgs
    certifications?: boolean | ProfileCountOutputTypeCountCertificationsArgs
    languages?: boolean | ProfileCountOutputTypeCountLanguagesArgs
    awards?: boolean | ProfileCountOutputTypeCountAwardsArgs
    hobbies?: boolean | ProfileCountOutputTypeCountHobbiesArgs
  }

  // Custom InputTypes
  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfileCountOutputType
     */
    select?: ProfileCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountSkillsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SkillWhereInput
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountExperiencesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExperienceWhereInput
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountSocialLinksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SocialLinkWhereInput
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountSkillCategoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SkillCategoryWhereInput
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountEducationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EducationWhereInput
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountCertificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CertificationWhereInput
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountLanguagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LanguageWhereInput
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountAwardsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AwardWhereInput
  }

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeCountHobbiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HobbyWhereInput
  }


  /**
   * Count Type SkillCategoryCountOutputType
   */

  export type SkillCategoryCountOutputType = {
    skills: number
  }

  export type SkillCategoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    skills?: boolean | SkillCategoryCountOutputTypeCountSkillsArgs
  }

  // Custom InputTypes
  /**
   * SkillCategoryCountOutputType without action
   */
  export type SkillCategoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillCategoryCountOutputType
     */
    select?: SkillCategoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SkillCategoryCountOutputType without action
   */
  export type SkillCategoryCountOutputTypeCountSkillsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SkillWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Profile
   */

  export type AggregateProfile = {
    _count: ProfileCountAggregateOutputType | null
    _min: ProfileMinAggregateOutputType | null
    _max: ProfileMaxAggregateOutputType | null
  }

  export type ProfileMinAggregateOutputType = {
    id: string | null
    userId: string | null
    email: string | null
    firstName: string | null
    lastName: string | null
    avatarUrl: string | null
    bio: string | null
    headline: string | null
    location: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProfileMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    email: string | null
    firstName: string | null
    lastName: string | null
    avatarUrl: string | null
    bio: string | null
    headline: string | null
    location: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProfileCountAggregateOutputType = {
    id: number
    userId: number
    email: number
    firstName: number
    lastName: number
    avatarUrl: number
    bio: number
    headline: number
    location: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProfileMinAggregateInputType = {
    id?: true
    userId?: true
    email?: true
    firstName?: true
    lastName?: true
    avatarUrl?: true
    bio?: true
    headline?: true
    location?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProfileMaxAggregateInputType = {
    id?: true
    userId?: true
    email?: true
    firstName?: true
    lastName?: true
    avatarUrl?: true
    bio?: true
    headline?: true
    location?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProfileCountAggregateInputType = {
    id?: true
    userId?: true
    email?: true
    firstName?: true
    lastName?: true
    avatarUrl?: true
    bio?: true
    headline?: true
    location?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Profile to aggregate.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Profiles
    **/
    _count?: true | ProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProfileMaxAggregateInputType
  }

  export type GetProfileAggregateType<T extends ProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProfile[P]>
      : GetScalarType<T[P], AggregateProfile[P]>
  }




  export type ProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfileWhereInput
    orderBy?: ProfileOrderByWithAggregationInput | ProfileOrderByWithAggregationInput[]
    by: ProfileScalarFieldEnum[] | ProfileScalarFieldEnum
    having?: ProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProfileCountAggregateInputType | true
    _min?: ProfileMinAggregateInputType
    _max?: ProfileMaxAggregateInputType
  }

  export type ProfileGroupByOutputType = {
    id: string
    userId: string
    email: string
    firstName: string | null
    lastName: string | null
    avatarUrl: string | null
    bio: string | null
    headline: string | null
    location: string | null
    createdAt: Date
    updatedAt: Date
    _count: ProfileCountAggregateOutputType | null
    _min: ProfileMinAggregateOutputType | null
    _max: ProfileMaxAggregateOutputType | null
  }

  type GetProfileGroupByPayload<T extends ProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProfileGroupByOutputType[P]>
            : GetScalarType<T[P], ProfileGroupByOutputType[P]>
        }
      >
    >


  export type ProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    email?: boolean
    firstName?: boolean
    lastName?: boolean
    avatarUrl?: boolean
    bio?: boolean
    headline?: boolean
    location?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    projects?: boolean | Profile$projectsArgs<ExtArgs>
    skills?: boolean | Profile$skillsArgs<ExtArgs>
    experiences?: boolean | Profile$experiencesArgs<ExtArgs>
    socialLinks?: boolean | Profile$socialLinksArgs<ExtArgs>
    skillCategories?: boolean | Profile$skillCategoriesArgs<ExtArgs>
    education?: boolean | Profile$educationArgs<ExtArgs>
    certifications?: boolean | Profile$certificationsArgs<ExtArgs>
    languages?: boolean | Profile$languagesArgs<ExtArgs>
    awards?: boolean | Profile$awardsArgs<ExtArgs>
    hobbies?: boolean | Profile$hobbiesArgs<ExtArgs>
    _count?: boolean | ProfileCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profile"]>

  export type ProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    email?: boolean
    firstName?: boolean
    lastName?: boolean
    avatarUrl?: boolean
    bio?: boolean
    headline?: boolean
    location?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["profile"]>

  export type ProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    email?: boolean
    firstName?: boolean
    lastName?: boolean
    avatarUrl?: boolean
    bio?: boolean
    headline?: boolean
    location?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["profile"]>

  export type ProfileSelectScalar = {
    id?: boolean
    userId?: boolean
    email?: boolean
    firstName?: boolean
    lastName?: boolean
    avatarUrl?: boolean
    bio?: boolean
    headline?: boolean
    location?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "email" | "firstName" | "lastName" | "avatarUrl" | "bio" | "headline" | "location" | "createdAt" | "updatedAt", ExtArgs["result"]["profile"]>
  export type ProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | Profile$projectsArgs<ExtArgs>
    skills?: boolean | Profile$skillsArgs<ExtArgs>
    experiences?: boolean | Profile$experiencesArgs<ExtArgs>
    socialLinks?: boolean | Profile$socialLinksArgs<ExtArgs>
    skillCategories?: boolean | Profile$skillCategoriesArgs<ExtArgs>
    education?: boolean | Profile$educationArgs<ExtArgs>
    certifications?: boolean | Profile$certificationsArgs<ExtArgs>
    languages?: boolean | Profile$languagesArgs<ExtArgs>
    awards?: boolean | Profile$awardsArgs<ExtArgs>
    hobbies?: boolean | Profile$hobbiesArgs<ExtArgs>
    _count?: boolean | ProfileCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ProfileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Profile"
    objects: {
      projects: Prisma.$ProjectPayload<ExtArgs>[]
      skills: Prisma.$SkillPayload<ExtArgs>[]
      experiences: Prisma.$ExperiencePayload<ExtArgs>[]
      socialLinks: Prisma.$SocialLinkPayload<ExtArgs>[]
      skillCategories: Prisma.$SkillCategoryPayload<ExtArgs>[]
      education: Prisma.$EducationPayload<ExtArgs>[]
      certifications: Prisma.$CertificationPayload<ExtArgs>[]
      languages: Prisma.$LanguagePayload<ExtArgs>[]
      awards: Prisma.$AwardPayload<ExtArgs>[]
      hobbies: Prisma.$HobbyPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      email: string
      firstName: string | null
      lastName: string | null
      avatarUrl: string | null
      bio: string | null
      headline: string | null
      location: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["profile"]>
    composites: {}
  }

  type ProfileGetPayload<S extends boolean | null | undefined | ProfileDefaultArgs> = $Result.GetResult<Prisma.$ProfilePayload, S>

  type ProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProfileCountAggregateInputType | true
    }

  export interface ProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Profile'], meta: { name: 'Profile' } }
    /**
     * Find zero or one Profile that matches the filter.
     * @param {ProfileFindUniqueArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProfileFindUniqueArgs>(args: SelectSubset<T, ProfileFindUniqueArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Profile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProfileFindUniqueOrThrowArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, ProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Profile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindFirstArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProfileFindFirstArgs>(args?: SelectSubset<T, ProfileFindFirstArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Profile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindFirstOrThrowArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, ProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Profiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Profiles
     * const profiles = await prisma.profile.findMany()
     * 
     * // Get first 10 Profiles
     * const profiles = await prisma.profile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const profileWithIdOnly = await prisma.profile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProfileFindManyArgs>(args?: SelectSubset<T, ProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Profile.
     * @param {ProfileCreateArgs} args - Arguments to create a Profile.
     * @example
     * // Create one Profile
     * const Profile = await prisma.profile.create({
     *   data: {
     *     // ... data to create a Profile
     *   }
     * })
     * 
     */
    create<T extends ProfileCreateArgs>(args: SelectSubset<T, ProfileCreateArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Profiles.
     * @param {ProfileCreateManyArgs} args - Arguments to create many Profiles.
     * @example
     * // Create many Profiles
     * const profile = await prisma.profile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProfileCreateManyArgs>(args?: SelectSubset<T, ProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Profiles and returns the data saved in the database.
     * @param {ProfileCreateManyAndReturnArgs} args - Arguments to create many Profiles.
     * @example
     * // Create many Profiles
     * const profile = await prisma.profile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Profiles and only return the `id`
     * const profileWithIdOnly = await prisma.profile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, ProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Profile.
     * @param {ProfileDeleteArgs} args - Arguments to delete one Profile.
     * @example
     * // Delete one Profile
     * const Profile = await prisma.profile.delete({
     *   where: {
     *     // ... filter to delete one Profile
     *   }
     * })
     * 
     */
    delete<T extends ProfileDeleteArgs>(args: SelectSubset<T, ProfileDeleteArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Profile.
     * @param {ProfileUpdateArgs} args - Arguments to update one Profile.
     * @example
     * // Update one Profile
     * const profile = await prisma.profile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProfileUpdateArgs>(args: SelectSubset<T, ProfileUpdateArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Profiles.
     * @param {ProfileDeleteManyArgs} args - Arguments to filter Profiles to delete.
     * @example
     * // Delete a few Profiles
     * const { count } = await prisma.profile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProfileDeleteManyArgs>(args?: SelectSubset<T, ProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Profiles
     * const profile = await prisma.profile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProfileUpdateManyArgs>(args: SelectSubset<T, ProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Profiles and returns the data updated in the database.
     * @param {ProfileUpdateManyAndReturnArgs} args - Arguments to update many Profiles.
     * @example
     * // Update many Profiles
     * const profile = await prisma.profile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Profiles and only return the `id`
     * const profileWithIdOnly = await prisma.profile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, ProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Profile.
     * @param {ProfileUpsertArgs} args - Arguments to update or create a Profile.
     * @example
     * // Update or create a Profile
     * const profile = await prisma.profile.upsert({
     *   create: {
     *     // ... data to create a Profile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Profile we want to update
     *   }
     * })
     */
    upsert<T extends ProfileUpsertArgs>(args: SelectSubset<T, ProfileUpsertArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileCountArgs} args - Arguments to filter Profiles to count.
     * @example
     * // Count the number of Profiles
     * const count = await prisma.profile.count({
     *   where: {
     *     // ... the filter for the Profiles we want to count
     *   }
     * })
    **/
    count<T extends ProfileCountArgs>(
      args?: Subset<T, ProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Profile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProfileAggregateArgs>(args: Subset<T, ProfileAggregateArgs>): Prisma.PrismaPromise<GetProfileAggregateType<T>>

    /**
     * Group by Profile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProfileGroupByArgs['orderBy'] }
        : { orderBy?: ProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Profile model
   */
  readonly fields: ProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Profile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    projects<T extends Profile$projectsArgs<ExtArgs> = {}>(args?: Subset<T, Profile$projectsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    skills<T extends Profile$skillsArgs<ExtArgs> = {}>(args?: Subset<T, Profile$skillsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    experiences<T extends Profile$experiencesArgs<ExtArgs> = {}>(args?: Subset<T, Profile$experiencesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExperiencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    socialLinks<T extends Profile$socialLinksArgs<ExtArgs> = {}>(args?: Subset<T, Profile$socialLinksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SocialLinkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    skillCategories<T extends Profile$skillCategoriesArgs<ExtArgs> = {}>(args?: Subset<T, Profile$skillCategoriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SkillCategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    education<T extends Profile$educationArgs<ExtArgs> = {}>(args?: Subset<T, Profile$educationArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EducationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    certifications<T extends Profile$certificationsArgs<ExtArgs> = {}>(args?: Subset<T, Profile$certificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CertificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    languages<T extends Profile$languagesArgs<ExtArgs> = {}>(args?: Subset<T, Profile$languagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    awards<T extends Profile$awardsArgs<ExtArgs> = {}>(args?: Subset<T, Profile$awardsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AwardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    hobbies<T extends Profile$hobbiesArgs<ExtArgs> = {}>(args?: Subset<T, Profile$hobbiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HobbyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Profile model
   */
  interface ProfileFieldRefs {
    readonly id: FieldRef<"Profile", 'String'>
    readonly userId: FieldRef<"Profile", 'String'>
    readonly email: FieldRef<"Profile", 'String'>
    readonly firstName: FieldRef<"Profile", 'String'>
    readonly lastName: FieldRef<"Profile", 'String'>
    readonly avatarUrl: FieldRef<"Profile", 'String'>
    readonly bio: FieldRef<"Profile", 'String'>
    readonly headline: FieldRef<"Profile", 'String'>
    readonly location: FieldRef<"Profile", 'String'>
    readonly createdAt: FieldRef<"Profile", 'DateTime'>
    readonly updatedAt: FieldRef<"Profile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Profile findUnique
   */
  export type ProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile findUniqueOrThrow
   */
  export type ProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile findFirst
   */
  export type ProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Profiles.
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Profiles.
     */
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[]
  }

  /**
   * Profile findFirstOrThrow
   */
  export type ProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Profiles.
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Profiles.
     */
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[]
  }

  /**
   * Profile findMany
   */
  export type ProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profiles to fetch.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Profiles.
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Profiles.
     */
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[]
  }

  /**
   * Profile create
   */
  export type ProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a Profile.
     */
    data: XOR<ProfileCreateInput, ProfileUncheckedCreateInput>
  }

  /**
   * Profile createMany
   */
  export type ProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Profiles.
     */
    data: ProfileCreateManyInput | ProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Profile createManyAndReturn
   */
  export type ProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * The data used to create many Profiles.
     */
    data: ProfileCreateManyInput | ProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Profile update
   */
  export type ProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a Profile.
     */
    data: XOR<ProfileUpdateInput, ProfileUncheckedUpdateInput>
    /**
     * Choose, which Profile to update.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile updateMany
   */
  export type ProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Profiles.
     */
    data: XOR<ProfileUpdateManyMutationInput, ProfileUncheckedUpdateManyInput>
    /**
     * Filter which Profiles to update
     */
    where?: ProfileWhereInput
    /**
     * Limit how many Profiles to update.
     */
    limit?: number
  }

  /**
   * Profile updateManyAndReturn
   */
  export type ProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * The data used to update Profiles.
     */
    data: XOR<ProfileUpdateManyMutationInput, ProfileUncheckedUpdateManyInput>
    /**
     * Filter which Profiles to update
     */
    where?: ProfileWhereInput
    /**
     * Limit how many Profiles to update.
     */
    limit?: number
  }

  /**
   * Profile upsert
   */
  export type ProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the Profile to update in case it exists.
     */
    where: ProfileWhereUniqueInput
    /**
     * In case the Profile found by the `where` argument doesn't exist, create a new Profile with this data.
     */
    create: XOR<ProfileCreateInput, ProfileUncheckedCreateInput>
    /**
     * In case the Profile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProfileUpdateInput, ProfileUncheckedUpdateInput>
  }

  /**
   * Profile delete
   */
  export type ProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter which Profile to delete.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile deleteMany
   */
  export type ProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Profiles to delete
     */
    where?: ProfileWhereInput
    /**
     * Limit how many Profiles to delete.
     */
    limit?: number
  }

  /**
   * Profile.projects
   */
  export type Profile$projectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    cursor?: ProjectWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Profile.skills
   */
  export type Profile$skillsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    where?: SkillWhereInput
    orderBy?: SkillOrderByWithRelationInput | SkillOrderByWithRelationInput[]
    cursor?: SkillWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SkillScalarFieldEnum | SkillScalarFieldEnum[]
  }

  /**
   * Profile.experiences
   */
  export type Profile$experiencesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Experience
     */
    select?: ExperienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Experience
     */
    omit?: ExperienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExperienceInclude<ExtArgs> | null
    where?: ExperienceWhereInput
    orderBy?: ExperienceOrderByWithRelationInput | ExperienceOrderByWithRelationInput[]
    cursor?: ExperienceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExperienceScalarFieldEnum | ExperienceScalarFieldEnum[]
  }

  /**
   * Profile.socialLinks
   */
  export type Profile$socialLinksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialLink
     */
    select?: SocialLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SocialLink
     */
    omit?: SocialLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SocialLinkInclude<ExtArgs> | null
    where?: SocialLinkWhereInput
    orderBy?: SocialLinkOrderByWithRelationInput | SocialLinkOrderByWithRelationInput[]
    cursor?: SocialLinkWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SocialLinkScalarFieldEnum | SocialLinkScalarFieldEnum[]
  }

  /**
   * Profile.skillCategories
   */
  export type Profile$skillCategoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillCategory
     */
    select?: SkillCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillCategory
     */
    omit?: SkillCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillCategoryInclude<ExtArgs> | null
    where?: SkillCategoryWhereInput
    orderBy?: SkillCategoryOrderByWithRelationInput | SkillCategoryOrderByWithRelationInput[]
    cursor?: SkillCategoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SkillCategoryScalarFieldEnum | SkillCategoryScalarFieldEnum[]
  }

  /**
   * Profile.education
   */
  export type Profile$educationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Education
     */
    select?: EducationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Education
     */
    omit?: EducationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationInclude<ExtArgs> | null
    where?: EducationWhereInput
    orderBy?: EducationOrderByWithRelationInput | EducationOrderByWithRelationInput[]
    cursor?: EducationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EducationScalarFieldEnum | EducationScalarFieldEnum[]
  }

  /**
   * Profile.certifications
   */
  export type Profile$certificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certification
     */
    select?: CertificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certification
     */
    omit?: CertificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CertificationInclude<ExtArgs> | null
    where?: CertificationWhereInput
    orderBy?: CertificationOrderByWithRelationInput | CertificationOrderByWithRelationInput[]
    cursor?: CertificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CertificationScalarFieldEnum | CertificationScalarFieldEnum[]
  }

  /**
   * Profile.languages
   */
  export type Profile$languagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Language
     */
    omit?: LanguageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageInclude<ExtArgs> | null
    where?: LanguageWhereInput
    orderBy?: LanguageOrderByWithRelationInput | LanguageOrderByWithRelationInput[]
    cursor?: LanguageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LanguageScalarFieldEnum | LanguageScalarFieldEnum[]
  }

  /**
   * Profile.awards
   */
  export type Profile$awardsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Award
     */
    select?: AwardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Award
     */
    omit?: AwardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwardInclude<ExtArgs> | null
    where?: AwardWhereInput
    orderBy?: AwardOrderByWithRelationInput | AwardOrderByWithRelationInput[]
    cursor?: AwardWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AwardScalarFieldEnum | AwardScalarFieldEnum[]
  }

  /**
   * Profile.hobbies
   */
  export type Profile$hobbiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hobby
     */
    select?: HobbySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hobby
     */
    omit?: HobbyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HobbyInclude<ExtArgs> | null
    where?: HobbyWhereInput
    orderBy?: HobbyOrderByWithRelationInput | HobbyOrderByWithRelationInput[]
    cursor?: HobbyWhereUniqueInput
    take?: number
    skip?: number
    distinct?: HobbyScalarFieldEnum | HobbyScalarFieldEnum[]
  }

  /**
   * Profile without action
   */
  export type ProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
  }


  /**
   * Model SocialLink
   */

  export type AggregateSocialLink = {
    _count: SocialLinkCountAggregateOutputType | null
    _avg: SocialLinkAvgAggregateOutputType | null
    _sum: SocialLinkSumAggregateOutputType | null
    _min: SocialLinkMinAggregateOutputType | null
    _max: SocialLinkMaxAggregateOutputType | null
  }

  export type SocialLinkAvgAggregateOutputType = {
    sortOrder: number | null
  }

  export type SocialLinkSumAggregateOutputType = {
    sortOrder: number | null
  }

  export type SocialLinkMinAggregateOutputType = {
    id: string | null
    profileId: string | null
    platform: string | null
    url: string | null
    label: string | null
    sortOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SocialLinkMaxAggregateOutputType = {
    id: string | null
    profileId: string | null
    platform: string | null
    url: string | null
    label: string | null
    sortOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SocialLinkCountAggregateOutputType = {
    id: number
    profileId: number
    platform: number
    url: number
    label: number
    sortOrder: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SocialLinkAvgAggregateInputType = {
    sortOrder?: true
  }

  export type SocialLinkSumAggregateInputType = {
    sortOrder?: true
  }

  export type SocialLinkMinAggregateInputType = {
    id?: true
    profileId?: true
    platform?: true
    url?: true
    label?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SocialLinkMaxAggregateInputType = {
    id?: true
    profileId?: true
    platform?: true
    url?: true
    label?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SocialLinkCountAggregateInputType = {
    id?: true
    profileId?: true
    platform?: true
    url?: true
    label?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SocialLinkAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SocialLink to aggregate.
     */
    where?: SocialLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SocialLinks to fetch.
     */
    orderBy?: SocialLinkOrderByWithRelationInput | SocialLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SocialLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SocialLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SocialLinks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SocialLinks
    **/
    _count?: true | SocialLinkCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SocialLinkAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SocialLinkSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SocialLinkMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SocialLinkMaxAggregateInputType
  }

  export type GetSocialLinkAggregateType<T extends SocialLinkAggregateArgs> = {
        [P in keyof T & keyof AggregateSocialLink]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSocialLink[P]>
      : GetScalarType<T[P], AggregateSocialLink[P]>
  }




  export type SocialLinkGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SocialLinkWhereInput
    orderBy?: SocialLinkOrderByWithAggregationInput | SocialLinkOrderByWithAggregationInput[]
    by: SocialLinkScalarFieldEnum[] | SocialLinkScalarFieldEnum
    having?: SocialLinkScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SocialLinkCountAggregateInputType | true
    _avg?: SocialLinkAvgAggregateInputType
    _sum?: SocialLinkSumAggregateInputType
    _min?: SocialLinkMinAggregateInputType
    _max?: SocialLinkMaxAggregateInputType
  }

  export type SocialLinkGroupByOutputType = {
    id: string
    profileId: string
    platform: string
    url: string
    label: string | null
    sortOrder: number
    createdAt: Date
    updatedAt: Date
    _count: SocialLinkCountAggregateOutputType | null
    _avg: SocialLinkAvgAggregateOutputType | null
    _sum: SocialLinkSumAggregateOutputType | null
    _min: SocialLinkMinAggregateOutputType | null
    _max: SocialLinkMaxAggregateOutputType | null
  }

  type GetSocialLinkGroupByPayload<T extends SocialLinkGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SocialLinkGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SocialLinkGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SocialLinkGroupByOutputType[P]>
            : GetScalarType<T[P], SocialLinkGroupByOutputType[P]>
        }
      >
    >


  export type SocialLinkSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    platform?: boolean
    url?: boolean
    label?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["socialLink"]>

  export type SocialLinkSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    platform?: boolean
    url?: boolean
    label?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["socialLink"]>

  export type SocialLinkSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    platform?: boolean
    url?: boolean
    label?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["socialLink"]>

  export type SocialLinkSelectScalar = {
    id?: boolean
    profileId?: boolean
    platform?: boolean
    url?: boolean
    label?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SocialLinkOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "profileId" | "platform" | "url" | "label" | "sortOrder" | "createdAt" | "updatedAt", ExtArgs["result"]["socialLink"]>
  export type SocialLinkInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type SocialLinkIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type SocialLinkIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }

  export type $SocialLinkPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SocialLink"
    objects: {
      profile: Prisma.$ProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      profileId: string
      platform: string
      url: string
      label: string | null
      sortOrder: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["socialLink"]>
    composites: {}
  }

  type SocialLinkGetPayload<S extends boolean | null | undefined | SocialLinkDefaultArgs> = $Result.GetResult<Prisma.$SocialLinkPayload, S>

  type SocialLinkCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SocialLinkFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SocialLinkCountAggregateInputType | true
    }

  export interface SocialLinkDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SocialLink'], meta: { name: 'SocialLink' } }
    /**
     * Find zero or one SocialLink that matches the filter.
     * @param {SocialLinkFindUniqueArgs} args - Arguments to find a SocialLink
     * @example
     * // Get one SocialLink
     * const socialLink = await prisma.socialLink.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SocialLinkFindUniqueArgs>(args: SelectSubset<T, SocialLinkFindUniqueArgs<ExtArgs>>): Prisma__SocialLinkClient<$Result.GetResult<Prisma.$SocialLinkPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SocialLink that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SocialLinkFindUniqueOrThrowArgs} args - Arguments to find a SocialLink
     * @example
     * // Get one SocialLink
     * const socialLink = await prisma.socialLink.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SocialLinkFindUniqueOrThrowArgs>(args: SelectSubset<T, SocialLinkFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SocialLinkClient<$Result.GetResult<Prisma.$SocialLinkPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SocialLink that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SocialLinkFindFirstArgs} args - Arguments to find a SocialLink
     * @example
     * // Get one SocialLink
     * const socialLink = await prisma.socialLink.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SocialLinkFindFirstArgs>(args?: SelectSubset<T, SocialLinkFindFirstArgs<ExtArgs>>): Prisma__SocialLinkClient<$Result.GetResult<Prisma.$SocialLinkPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SocialLink that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SocialLinkFindFirstOrThrowArgs} args - Arguments to find a SocialLink
     * @example
     * // Get one SocialLink
     * const socialLink = await prisma.socialLink.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SocialLinkFindFirstOrThrowArgs>(args?: SelectSubset<T, SocialLinkFindFirstOrThrowArgs<ExtArgs>>): Prisma__SocialLinkClient<$Result.GetResult<Prisma.$SocialLinkPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SocialLinks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SocialLinkFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SocialLinks
     * const socialLinks = await prisma.socialLink.findMany()
     * 
     * // Get first 10 SocialLinks
     * const socialLinks = await prisma.socialLink.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const socialLinkWithIdOnly = await prisma.socialLink.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SocialLinkFindManyArgs>(args?: SelectSubset<T, SocialLinkFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SocialLinkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SocialLink.
     * @param {SocialLinkCreateArgs} args - Arguments to create a SocialLink.
     * @example
     * // Create one SocialLink
     * const SocialLink = await prisma.socialLink.create({
     *   data: {
     *     // ... data to create a SocialLink
     *   }
     * })
     * 
     */
    create<T extends SocialLinkCreateArgs>(args: SelectSubset<T, SocialLinkCreateArgs<ExtArgs>>): Prisma__SocialLinkClient<$Result.GetResult<Prisma.$SocialLinkPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SocialLinks.
     * @param {SocialLinkCreateManyArgs} args - Arguments to create many SocialLinks.
     * @example
     * // Create many SocialLinks
     * const socialLink = await prisma.socialLink.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SocialLinkCreateManyArgs>(args?: SelectSubset<T, SocialLinkCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SocialLinks and returns the data saved in the database.
     * @param {SocialLinkCreateManyAndReturnArgs} args - Arguments to create many SocialLinks.
     * @example
     * // Create many SocialLinks
     * const socialLink = await prisma.socialLink.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SocialLinks and only return the `id`
     * const socialLinkWithIdOnly = await prisma.socialLink.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SocialLinkCreateManyAndReturnArgs>(args?: SelectSubset<T, SocialLinkCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SocialLinkPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SocialLink.
     * @param {SocialLinkDeleteArgs} args - Arguments to delete one SocialLink.
     * @example
     * // Delete one SocialLink
     * const SocialLink = await prisma.socialLink.delete({
     *   where: {
     *     // ... filter to delete one SocialLink
     *   }
     * })
     * 
     */
    delete<T extends SocialLinkDeleteArgs>(args: SelectSubset<T, SocialLinkDeleteArgs<ExtArgs>>): Prisma__SocialLinkClient<$Result.GetResult<Prisma.$SocialLinkPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SocialLink.
     * @param {SocialLinkUpdateArgs} args - Arguments to update one SocialLink.
     * @example
     * // Update one SocialLink
     * const socialLink = await prisma.socialLink.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SocialLinkUpdateArgs>(args: SelectSubset<T, SocialLinkUpdateArgs<ExtArgs>>): Prisma__SocialLinkClient<$Result.GetResult<Prisma.$SocialLinkPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SocialLinks.
     * @param {SocialLinkDeleteManyArgs} args - Arguments to filter SocialLinks to delete.
     * @example
     * // Delete a few SocialLinks
     * const { count } = await prisma.socialLink.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SocialLinkDeleteManyArgs>(args?: SelectSubset<T, SocialLinkDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SocialLinks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SocialLinkUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SocialLinks
     * const socialLink = await prisma.socialLink.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SocialLinkUpdateManyArgs>(args: SelectSubset<T, SocialLinkUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SocialLinks and returns the data updated in the database.
     * @param {SocialLinkUpdateManyAndReturnArgs} args - Arguments to update many SocialLinks.
     * @example
     * // Update many SocialLinks
     * const socialLink = await prisma.socialLink.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SocialLinks and only return the `id`
     * const socialLinkWithIdOnly = await prisma.socialLink.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SocialLinkUpdateManyAndReturnArgs>(args: SelectSubset<T, SocialLinkUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SocialLinkPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SocialLink.
     * @param {SocialLinkUpsertArgs} args - Arguments to update or create a SocialLink.
     * @example
     * // Update or create a SocialLink
     * const socialLink = await prisma.socialLink.upsert({
     *   create: {
     *     // ... data to create a SocialLink
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SocialLink we want to update
     *   }
     * })
     */
    upsert<T extends SocialLinkUpsertArgs>(args: SelectSubset<T, SocialLinkUpsertArgs<ExtArgs>>): Prisma__SocialLinkClient<$Result.GetResult<Prisma.$SocialLinkPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SocialLinks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SocialLinkCountArgs} args - Arguments to filter SocialLinks to count.
     * @example
     * // Count the number of SocialLinks
     * const count = await prisma.socialLink.count({
     *   where: {
     *     // ... the filter for the SocialLinks we want to count
     *   }
     * })
    **/
    count<T extends SocialLinkCountArgs>(
      args?: Subset<T, SocialLinkCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SocialLinkCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SocialLink.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SocialLinkAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SocialLinkAggregateArgs>(args: Subset<T, SocialLinkAggregateArgs>): Prisma.PrismaPromise<GetSocialLinkAggregateType<T>>

    /**
     * Group by SocialLink.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SocialLinkGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SocialLinkGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SocialLinkGroupByArgs['orderBy'] }
        : { orderBy?: SocialLinkGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SocialLinkGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSocialLinkGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SocialLink model
   */
  readonly fields: SocialLinkFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SocialLink.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SocialLinkClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    profile<T extends ProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProfileDefaultArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SocialLink model
   */
  interface SocialLinkFieldRefs {
    readonly id: FieldRef<"SocialLink", 'String'>
    readonly profileId: FieldRef<"SocialLink", 'String'>
    readonly platform: FieldRef<"SocialLink", 'String'>
    readonly url: FieldRef<"SocialLink", 'String'>
    readonly label: FieldRef<"SocialLink", 'String'>
    readonly sortOrder: FieldRef<"SocialLink", 'Int'>
    readonly createdAt: FieldRef<"SocialLink", 'DateTime'>
    readonly updatedAt: FieldRef<"SocialLink", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SocialLink findUnique
   */
  export type SocialLinkFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialLink
     */
    select?: SocialLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SocialLink
     */
    omit?: SocialLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SocialLinkInclude<ExtArgs> | null
    /**
     * Filter, which SocialLink to fetch.
     */
    where: SocialLinkWhereUniqueInput
  }

  /**
   * SocialLink findUniqueOrThrow
   */
  export type SocialLinkFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialLink
     */
    select?: SocialLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SocialLink
     */
    omit?: SocialLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SocialLinkInclude<ExtArgs> | null
    /**
     * Filter, which SocialLink to fetch.
     */
    where: SocialLinkWhereUniqueInput
  }

  /**
   * SocialLink findFirst
   */
  export type SocialLinkFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialLink
     */
    select?: SocialLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SocialLink
     */
    omit?: SocialLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SocialLinkInclude<ExtArgs> | null
    /**
     * Filter, which SocialLink to fetch.
     */
    where?: SocialLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SocialLinks to fetch.
     */
    orderBy?: SocialLinkOrderByWithRelationInput | SocialLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SocialLinks.
     */
    cursor?: SocialLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SocialLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SocialLinks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SocialLinks.
     */
    distinct?: SocialLinkScalarFieldEnum | SocialLinkScalarFieldEnum[]
  }

  /**
   * SocialLink findFirstOrThrow
   */
  export type SocialLinkFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialLink
     */
    select?: SocialLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SocialLink
     */
    omit?: SocialLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SocialLinkInclude<ExtArgs> | null
    /**
     * Filter, which SocialLink to fetch.
     */
    where?: SocialLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SocialLinks to fetch.
     */
    orderBy?: SocialLinkOrderByWithRelationInput | SocialLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SocialLinks.
     */
    cursor?: SocialLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SocialLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SocialLinks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SocialLinks.
     */
    distinct?: SocialLinkScalarFieldEnum | SocialLinkScalarFieldEnum[]
  }

  /**
   * SocialLink findMany
   */
  export type SocialLinkFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialLink
     */
    select?: SocialLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SocialLink
     */
    omit?: SocialLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SocialLinkInclude<ExtArgs> | null
    /**
     * Filter, which SocialLinks to fetch.
     */
    where?: SocialLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SocialLinks to fetch.
     */
    orderBy?: SocialLinkOrderByWithRelationInput | SocialLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SocialLinks.
     */
    cursor?: SocialLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SocialLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SocialLinks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SocialLinks.
     */
    distinct?: SocialLinkScalarFieldEnum | SocialLinkScalarFieldEnum[]
  }

  /**
   * SocialLink create
   */
  export type SocialLinkCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialLink
     */
    select?: SocialLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SocialLink
     */
    omit?: SocialLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SocialLinkInclude<ExtArgs> | null
    /**
     * The data needed to create a SocialLink.
     */
    data: XOR<SocialLinkCreateInput, SocialLinkUncheckedCreateInput>
  }

  /**
   * SocialLink createMany
   */
  export type SocialLinkCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SocialLinks.
     */
    data: SocialLinkCreateManyInput | SocialLinkCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SocialLink createManyAndReturn
   */
  export type SocialLinkCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialLink
     */
    select?: SocialLinkSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SocialLink
     */
    omit?: SocialLinkOmit<ExtArgs> | null
    /**
     * The data used to create many SocialLinks.
     */
    data: SocialLinkCreateManyInput | SocialLinkCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SocialLinkIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SocialLink update
   */
  export type SocialLinkUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialLink
     */
    select?: SocialLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SocialLink
     */
    omit?: SocialLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SocialLinkInclude<ExtArgs> | null
    /**
     * The data needed to update a SocialLink.
     */
    data: XOR<SocialLinkUpdateInput, SocialLinkUncheckedUpdateInput>
    /**
     * Choose, which SocialLink to update.
     */
    where: SocialLinkWhereUniqueInput
  }

  /**
   * SocialLink updateMany
   */
  export type SocialLinkUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SocialLinks.
     */
    data: XOR<SocialLinkUpdateManyMutationInput, SocialLinkUncheckedUpdateManyInput>
    /**
     * Filter which SocialLinks to update
     */
    where?: SocialLinkWhereInput
    /**
     * Limit how many SocialLinks to update.
     */
    limit?: number
  }

  /**
   * SocialLink updateManyAndReturn
   */
  export type SocialLinkUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialLink
     */
    select?: SocialLinkSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SocialLink
     */
    omit?: SocialLinkOmit<ExtArgs> | null
    /**
     * The data used to update SocialLinks.
     */
    data: XOR<SocialLinkUpdateManyMutationInput, SocialLinkUncheckedUpdateManyInput>
    /**
     * Filter which SocialLinks to update
     */
    where?: SocialLinkWhereInput
    /**
     * Limit how many SocialLinks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SocialLinkIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SocialLink upsert
   */
  export type SocialLinkUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialLink
     */
    select?: SocialLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SocialLink
     */
    omit?: SocialLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SocialLinkInclude<ExtArgs> | null
    /**
     * The filter to search for the SocialLink to update in case it exists.
     */
    where: SocialLinkWhereUniqueInput
    /**
     * In case the SocialLink found by the `where` argument doesn't exist, create a new SocialLink with this data.
     */
    create: XOR<SocialLinkCreateInput, SocialLinkUncheckedCreateInput>
    /**
     * In case the SocialLink was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SocialLinkUpdateInput, SocialLinkUncheckedUpdateInput>
  }

  /**
   * SocialLink delete
   */
  export type SocialLinkDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialLink
     */
    select?: SocialLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SocialLink
     */
    omit?: SocialLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SocialLinkInclude<ExtArgs> | null
    /**
     * Filter which SocialLink to delete.
     */
    where: SocialLinkWhereUniqueInput
  }

  /**
   * SocialLink deleteMany
   */
  export type SocialLinkDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SocialLinks to delete
     */
    where?: SocialLinkWhereInput
    /**
     * Limit how many SocialLinks to delete.
     */
    limit?: number
  }

  /**
   * SocialLink without action
   */
  export type SocialLinkDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SocialLink
     */
    select?: SocialLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SocialLink
     */
    omit?: SocialLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SocialLinkInclude<ExtArgs> | null
  }


  /**
   * Model SkillCategory
   */

  export type AggregateSkillCategory = {
    _count: SkillCategoryCountAggregateOutputType | null
    _avg: SkillCategoryAvgAggregateOutputType | null
    _sum: SkillCategorySumAggregateOutputType | null
    _min: SkillCategoryMinAggregateOutputType | null
    _max: SkillCategoryMaxAggregateOutputType | null
  }

  export type SkillCategoryAvgAggregateOutputType = {
    sortOrder: number | null
  }

  export type SkillCategorySumAggregateOutputType = {
    sortOrder: number | null
  }

  export type SkillCategoryMinAggregateOutputType = {
    id: string | null
    profileId: string | null
    name: string | null
    sortOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SkillCategoryMaxAggregateOutputType = {
    id: string | null
    profileId: string | null
    name: string | null
    sortOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SkillCategoryCountAggregateOutputType = {
    id: number
    profileId: number
    name: number
    sortOrder: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SkillCategoryAvgAggregateInputType = {
    sortOrder?: true
  }

  export type SkillCategorySumAggregateInputType = {
    sortOrder?: true
  }

  export type SkillCategoryMinAggregateInputType = {
    id?: true
    profileId?: true
    name?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SkillCategoryMaxAggregateInputType = {
    id?: true
    profileId?: true
    name?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SkillCategoryCountAggregateInputType = {
    id?: true
    profileId?: true
    name?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SkillCategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SkillCategory to aggregate.
     */
    where?: SkillCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SkillCategories to fetch.
     */
    orderBy?: SkillCategoryOrderByWithRelationInput | SkillCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SkillCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SkillCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SkillCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SkillCategories
    **/
    _count?: true | SkillCategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SkillCategoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SkillCategorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SkillCategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SkillCategoryMaxAggregateInputType
  }

  export type GetSkillCategoryAggregateType<T extends SkillCategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateSkillCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSkillCategory[P]>
      : GetScalarType<T[P], AggregateSkillCategory[P]>
  }




  export type SkillCategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SkillCategoryWhereInput
    orderBy?: SkillCategoryOrderByWithAggregationInput | SkillCategoryOrderByWithAggregationInput[]
    by: SkillCategoryScalarFieldEnum[] | SkillCategoryScalarFieldEnum
    having?: SkillCategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SkillCategoryCountAggregateInputType | true
    _avg?: SkillCategoryAvgAggregateInputType
    _sum?: SkillCategorySumAggregateInputType
    _min?: SkillCategoryMinAggregateInputType
    _max?: SkillCategoryMaxAggregateInputType
  }

  export type SkillCategoryGroupByOutputType = {
    id: string
    profileId: string
    name: string
    sortOrder: number
    createdAt: Date
    updatedAt: Date
    _count: SkillCategoryCountAggregateOutputType | null
    _avg: SkillCategoryAvgAggregateOutputType | null
    _sum: SkillCategorySumAggregateOutputType | null
    _min: SkillCategoryMinAggregateOutputType | null
    _max: SkillCategoryMaxAggregateOutputType | null
  }

  type GetSkillCategoryGroupByPayload<T extends SkillCategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SkillCategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SkillCategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SkillCategoryGroupByOutputType[P]>
            : GetScalarType<T[P], SkillCategoryGroupByOutputType[P]>
        }
      >
    >


  export type SkillCategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    name?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
    skills?: boolean | SkillCategory$skillsArgs<ExtArgs>
    _count?: boolean | SkillCategoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["skillCategory"]>

  export type SkillCategorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    name?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["skillCategory"]>

  export type SkillCategorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    name?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["skillCategory"]>

  export type SkillCategorySelectScalar = {
    id?: boolean
    profileId?: boolean
    name?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SkillCategoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "profileId" | "name" | "sortOrder" | "createdAt" | "updatedAt", ExtArgs["result"]["skillCategory"]>
  export type SkillCategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
    skills?: boolean | SkillCategory$skillsArgs<ExtArgs>
    _count?: boolean | SkillCategoryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SkillCategoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type SkillCategoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }

  export type $SkillCategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SkillCategory"
    objects: {
      profile: Prisma.$ProfilePayload<ExtArgs>
      skills: Prisma.$SkillPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      profileId: string
      name: string
      sortOrder: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["skillCategory"]>
    composites: {}
  }

  type SkillCategoryGetPayload<S extends boolean | null | undefined | SkillCategoryDefaultArgs> = $Result.GetResult<Prisma.$SkillCategoryPayload, S>

  type SkillCategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SkillCategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SkillCategoryCountAggregateInputType | true
    }

  export interface SkillCategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SkillCategory'], meta: { name: 'SkillCategory' } }
    /**
     * Find zero or one SkillCategory that matches the filter.
     * @param {SkillCategoryFindUniqueArgs} args - Arguments to find a SkillCategory
     * @example
     * // Get one SkillCategory
     * const skillCategory = await prisma.skillCategory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SkillCategoryFindUniqueArgs>(args: SelectSubset<T, SkillCategoryFindUniqueArgs<ExtArgs>>): Prisma__SkillCategoryClient<$Result.GetResult<Prisma.$SkillCategoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SkillCategory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SkillCategoryFindUniqueOrThrowArgs} args - Arguments to find a SkillCategory
     * @example
     * // Get one SkillCategory
     * const skillCategory = await prisma.skillCategory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SkillCategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, SkillCategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SkillCategoryClient<$Result.GetResult<Prisma.$SkillCategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SkillCategory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillCategoryFindFirstArgs} args - Arguments to find a SkillCategory
     * @example
     * // Get one SkillCategory
     * const skillCategory = await prisma.skillCategory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SkillCategoryFindFirstArgs>(args?: SelectSubset<T, SkillCategoryFindFirstArgs<ExtArgs>>): Prisma__SkillCategoryClient<$Result.GetResult<Prisma.$SkillCategoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SkillCategory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillCategoryFindFirstOrThrowArgs} args - Arguments to find a SkillCategory
     * @example
     * // Get one SkillCategory
     * const skillCategory = await prisma.skillCategory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SkillCategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, SkillCategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__SkillCategoryClient<$Result.GetResult<Prisma.$SkillCategoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SkillCategories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillCategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SkillCategories
     * const skillCategories = await prisma.skillCategory.findMany()
     * 
     * // Get first 10 SkillCategories
     * const skillCategories = await prisma.skillCategory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const skillCategoryWithIdOnly = await prisma.skillCategory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SkillCategoryFindManyArgs>(args?: SelectSubset<T, SkillCategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SkillCategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SkillCategory.
     * @param {SkillCategoryCreateArgs} args - Arguments to create a SkillCategory.
     * @example
     * // Create one SkillCategory
     * const SkillCategory = await prisma.skillCategory.create({
     *   data: {
     *     // ... data to create a SkillCategory
     *   }
     * })
     * 
     */
    create<T extends SkillCategoryCreateArgs>(args: SelectSubset<T, SkillCategoryCreateArgs<ExtArgs>>): Prisma__SkillCategoryClient<$Result.GetResult<Prisma.$SkillCategoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SkillCategories.
     * @param {SkillCategoryCreateManyArgs} args - Arguments to create many SkillCategories.
     * @example
     * // Create many SkillCategories
     * const skillCategory = await prisma.skillCategory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SkillCategoryCreateManyArgs>(args?: SelectSubset<T, SkillCategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SkillCategories and returns the data saved in the database.
     * @param {SkillCategoryCreateManyAndReturnArgs} args - Arguments to create many SkillCategories.
     * @example
     * // Create many SkillCategories
     * const skillCategory = await prisma.skillCategory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SkillCategories and only return the `id`
     * const skillCategoryWithIdOnly = await prisma.skillCategory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SkillCategoryCreateManyAndReturnArgs>(args?: SelectSubset<T, SkillCategoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SkillCategoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SkillCategory.
     * @param {SkillCategoryDeleteArgs} args - Arguments to delete one SkillCategory.
     * @example
     * // Delete one SkillCategory
     * const SkillCategory = await prisma.skillCategory.delete({
     *   where: {
     *     // ... filter to delete one SkillCategory
     *   }
     * })
     * 
     */
    delete<T extends SkillCategoryDeleteArgs>(args: SelectSubset<T, SkillCategoryDeleteArgs<ExtArgs>>): Prisma__SkillCategoryClient<$Result.GetResult<Prisma.$SkillCategoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SkillCategory.
     * @param {SkillCategoryUpdateArgs} args - Arguments to update one SkillCategory.
     * @example
     * // Update one SkillCategory
     * const skillCategory = await prisma.skillCategory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SkillCategoryUpdateArgs>(args: SelectSubset<T, SkillCategoryUpdateArgs<ExtArgs>>): Prisma__SkillCategoryClient<$Result.GetResult<Prisma.$SkillCategoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SkillCategories.
     * @param {SkillCategoryDeleteManyArgs} args - Arguments to filter SkillCategories to delete.
     * @example
     * // Delete a few SkillCategories
     * const { count } = await prisma.skillCategory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SkillCategoryDeleteManyArgs>(args?: SelectSubset<T, SkillCategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SkillCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillCategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SkillCategories
     * const skillCategory = await prisma.skillCategory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SkillCategoryUpdateManyArgs>(args: SelectSubset<T, SkillCategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SkillCategories and returns the data updated in the database.
     * @param {SkillCategoryUpdateManyAndReturnArgs} args - Arguments to update many SkillCategories.
     * @example
     * // Update many SkillCategories
     * const skillCategory = await prisma.skillCategory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SkillCategories and only return the `id`
     * const skillCategoryWithIdOnly = await prisma.skillCategory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SkillCategoryUpdateManyAndReturnArgs>(args: SelectSubset<T, SkillCategoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SkillCategoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SkillCategory.
     * @param {SkillCategoryUpsertArgs} args - Arguments to update or create a SkillCategory.
     * @example
     * // Update or create a SkillCategory
     * const skillCategory = await prisma.skillCategory.upsert({
     *   create: {
     *     // ... data to create a SkillCategory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SkillCategory we want to update
     *   }
     * })
     */
    upsert<T extends SkillCategoryUpsertArgs>(args: SelectSubset<T, SkillCategoryUpsertArgs<ExtArgs>>): Prisma__SkillCategoryClient<$Result.GetResult<Prisma.$SkillCategoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SkillCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillCategoryCountArgs} args - Arguments to filter SkillCategories to count.
     * @example
     * // Count the number of SkillCategories
     * const count = await prisma.skillCategory.count({
     *   where: {
     *     // ... the filter for the SkillCategories we want to count
     *   }
     * })
    **/
    count<T extends SkillCategoryCountArgs>(
      args?: Subset<T, SkillCategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SkillCategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SkillCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillCategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SkillCategoryAggregateArgs>(args: Subset<T, SkillCategoryAggregateArgs>): Prisma.PrismaPromise<GetSkillCategoryAggregateType<T>>

    /**
     * Group by SkillCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillCategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SkillCategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SkillCategoryGroupByArgs['orderBy'] }
        : { orderBy?: SkillCategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SkillCategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSkillCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SkillCategory model
   */
  readonly fields: SkillCategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SkillCategory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SkillCategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    profile<T extends ProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProfileDefaultArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    skills<T extends SkillCategory$skillsArgs<ExtArgs> = {}>(args?: Subset<T, SkillCategory$skillsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SkillCategory model
   */
  interface SkillCategoryFieldRefs {
    readonly id: FieldRef<"SkillCategory", 'String'>
    readonly profileId: FieldRef<"SkillCategory", 'String'>
    readonly name: FieldRef<"SkillCategory", 'String'>
    readonly sortOrder: FieldRef<"SkillCategory", 'Int'>
    readonly createdAt: FieldRef<"SkillCategory", 'DateTime'>
    readonly updatedAt: FieldRef<"SkillCategory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SkillCategory findUnique
   */
  export type SkillCategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillCategory
     */
    select?: SkillCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillCategory
     */
    omit?: SkillCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillCategoryInclude<ExtArgs> | null
    /**
     * Filter, which SkillCategory to fetch.
     */
    where: SkillCategoryWhereUniqueInput
  }

  /**
   * SkillCategory findUniqueOrThrow
   */
  export type SkillCategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillCategory
     */
    select?: SkillCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillCategory
     */
    omit?: SkillCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillCategoryInclude<ExtArgs> | null
    /**
     * Filter, which SkillCategory to fetch.
     */
    where: SkillCategoryWhereUniqueInput
  }

  /**
   * SkillCategory findFirst
   */
  export type SkillCategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillCategory
     */
    select?: SkillCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillCategory
     */
    omit?: SkillCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillCategoryInclude<ExtArgs> | null
    /**
     * Filter, which SkillCategory to fetch.
     */
    where?: SkillCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SkillCategories to fetch.
     */
    orderBy?: SkillCategoryOrderByWithRelationInput | SkillCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SkillCategories.
     */
    cursor?: SkillCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SkillCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SkillCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SkillCategories.
     */
    distinct?: SkillCategoryScalarFieldEnum | SkillCategoryScalarFieldEnum[]
  }

  /**
   * SkillCategory findFirstOrThrow
   */
  export type SkillCategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillCategory
     */
    select?: SkillCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillCategory
     */
    omit?: SkillCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillCategoryInclude<ExtArgs> | null
    /**
     * Filter, which SkillCategory to fetch.
     */
    where?: SkillCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SkillCategories to fetch.
     */
    orderBy?: SkillCategoryOrderByWithRelationInput | SkillCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SkillCategories.
     */
    cursor?: SkillCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SkillCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SkillCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SkillCategories.
     */
    distinct?: SkillCategoryScalarFieldEnum | SkillCategoryScalarFieldEnum[]
  }

  /**
   * SkillCategory findMany
   */
  export type SkillCategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillCategory
     */
    select?: SkillCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillCategory
     */
    omit?: SkillCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillCategoryInclude<ExtArgs> | null
    /**
     * Filter, which SkillCategories to fetch.
     */
    where?: SkillCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SkillCategories to fetch.
     */
    orderBy?: SkillCategoryOrderByWithRelationInput | SkillCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SkillCategories.
     */
    cursor?: SkillCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SkillCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SkillCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SkillCategories.
     */
    distinct?: SkillCategoryScalarFieldEnum | SkillCategoryScalarFieldEnum[]
  }

  /**
   * SkillCategory create
   */
  export type SkillCategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillCategory
     */
    select?: SkillCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillCategory
     */
    omit?: SkillCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillCategoryInclude<ExtArgs> | null
    /**
     * The data needed to create a SkillCategory.
     */
    data: XOR<SkillCategoryCreateInput, SkillCategoryUncheckedCreateInput>
  }

  /**
   * SkillCategory createMany
   */
  export type SkillCategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SkillCategories.
     */
    data: SkillCategoryCreateManyInput | SkillCategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SkillCategory createManyAndReturn
   */
  export type SkillCategoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillCategory
     */
    select?: SkillCategorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SkillCategory
     */
    omit?: SkillCategoryOmit<ExtArgs> | null
    /**
     * The data used to create many SkillCategories.
     */
    data: SkillCategoryCreateManyInput | SkillCategoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillCategoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SkillCategory update
   */
  export type SkillCategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillCategory
     */
    select?: SkillCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillCategory
     */
    omit?: SkillCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillCategoryInclude<ExtArgs> | null
    /**
     * The data needed to update a SkillCategory.
     */
    data: XOR<SkillCategoryUpdateInput, SkillCategoryUncheckedUpdateInput>
    /**
     * Choose, which SkillCategory to update.
     */
    where: SkillCategoryWhereUniqueInput
  }

  /**
   * SkillCategory updateMany
   */
  export type SkillCategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SkillCategories.
     */
    data: XOR<SkillCategoryUpdateManyMutationInput, SkillCategoryUncheckedUpdateManyInput>
    /**
     * Filter which SkillCategories to update
     */
    where?: SkillCategoryWhereInput
    /**
     * Limit how many SkillCategories to update.
     */
    limit?: number
  }

  /**
   * SkillCategory updateManyAndReturn
   */
  export type SkillCategoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillCategory
     */
    select?: SkillCategorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SkillCategory
     */
    omit?: SkillCategoryOmit<ExtArgs> | null
    /**
     * The data used to update SkillCategories.
     */
    data: XOR<SkillCategoryUpdateManyMutationInput, SkillCategoryUncheckedUpdateManyInput>
    /**
     * Filter which SkillCategories to update
     */
    where?: SkillCategoryWhereInput
    /**
     * Limit how many SkillCategories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillCategoryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SkillCategory upsert
   */
  export type SkillCategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillCategory
     */
    select?: SkillCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillCategory
     */
    omit?: SkillCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillCategoryInclude<ExtArgs> | null
    /**
     * The filter to search for the SkillCategory to update in case it exists.
     */
    where: SkillCategoryWhereUniqueInput
    /**
     * In case the SkillCategory found by the `where` argument doesn't exist, create a new SkillCategory with this data.
     */
    create: XOR<SkillCategoryCreateInput, SkillCategoryUncheckedCreateInput>
    /**
     * In case the SkillCategory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SkillCategoryUpdateInput, SkillCategoryUncheckedUpdateInput>
  }

  /**
   * SkillCategory delete
   */
  export type SkillCategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillCategory
     */
    select?: SkillCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillCategory
     */
    omit?: SkillCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillCategoryInclude<ExtArgs> | null
    /**
     * Filter which SkillCategory to delete.
     */
    where: SkillCategoryWhereUniqueInput
  }

  /**
   * SkillCategory deleteMany
   */
  export type SkillCategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SkillCategories to delete
     */
    where?: SkillCategoryWhereInput
    /**
     * Limit how many SkillCategories to delete.
     */
    limit?: number
  }

  /**
   * SkillCategory.skills
   */
  export type SkillCategory$skillsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    where?: SkillWhereInput
    orderBy?: SkillOrderByWithRelationInput | SkillOrderByWithRelationInput[]
    cursor?: SkillWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SkillScalarFieldEnum | SkillScalarFieldEnum[]
  }

  /**
   * SkillCategory without action
   */
  export type SkillCategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillCategory
     */
    select?: SkillCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillCategory
     */
    omit?: SkillCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillCategoryInclude<ExtArgs> | null
  }


  /**
   * Model Project
   */

  export type AggregateProject = {
    _count: ProjectCountAggregateOutputType | null
    _avg: ProjectAvgAggregateOutputType | null
    _sum: ProjectSumAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  export type ProjectAvgAggregateOutputType = {
    sortOrder: number | null
  }

  export type ProjectSumAggregateOutputType = {
    sortOrder: number | null
  }

  export type ProjectMinAggregateOutputType = {
    id: string | null
    profileId: string | null
    title: string | null
    description: string | null
    liveUrl: string | null
    repoUrl: string | null
    sortOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectMaxAggregateOutputType = {
    id: string | null
    profileId: string | null
    title: string | null
    description: string | null
    liveUrl: string | null
    repoUrl: string | null
    sortOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectCountAggregateOutputType = {
    id: number
    profileId: number
    title: number
    description: number
    images: number
    liveUrl: number
    repoUrl: number
    tags: number
    sortOrder: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProjectAvgAggregateInputType = {
    sortOrder?: true
  }

  export type ProjectSumAggregateInputType = {
    sortOrder?: true
  }

  export type ProjectMinAggregateInputType = {
    id?: true
    profileId?: true
    title?: true
    description?: true
    liveUrl?: true
    repoUrl?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectMaxAggregateInputType = {
    id?: true
    profileId?: true
    title?: true
    description?: true
    liveUrl?: true
    repoUrl?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectCountAggregateInputType = {
    id?: true
    profileId?: true
    title?: true
    description?: true
    images?: true
    liveUrl?: true
    repoUrl?: true
    tags?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Project to aggregate.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Projects
    **/
    _count?: true | ProjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProjectAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProjectSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectMaxAggregateInputType
  }

  export type GetProjectAggregateType<T extends ProjectAggregateArgs> = {
        [P in keyof T & keyof AggregateProject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProject[P]>
      : GetScalarType<T[P], AggregateProject[P]>
  }




  export type ProjectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithAggregationInput | ProjectOrderByWithAggregationInput[]
    by: ProjectScalarFieldEnum[] | ProjectScalarFieldEnum
    having?: ProjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectCountAggregateInputType | true
    _avg?: ProjectAvgAggregateInputType
    _sum?: ProjectSumAggregateInputType
    _min?: ProjectMinAggregateInputType
    _max?: ProjectMaxAggregateInputType
  }

  export type ProjectGroupByOutputType = {
    id: string
    profileId: string
    title: string
    description: string | null
    images: string[]
    liveUrl: string | null
    repoUrl: string | null
    tags: string[]
    sortOrder: number
    createdAt: Date
    updatedAt: Date
    _count: ProjectCountAggregateOutputType | null
    _avg: ProjectAvgAggregateOutputType | null
    _sum: ProjectSumAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  type GetProjectGroupByPayload<T extends ProjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectGroupByOutputType[P]>
        }
      >
    >


  export type ProjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    title?: boolean
    description?: boolean
    images?: boolean
    liveUrl?: boolean
    repoUrl?: boolean
    tags?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    title?: boolean
    description?: boolean
    images?: boolean
    liveUrl?: boolean
    repoUrl?: boolean
    tags?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    title?: boolean
    description?: boolean
    images?: boolean
    liveUrl?: boolean
    repoUrl?: boolean
    tags?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectScalar = {
    id?: boolean
    profileId?: boolean
    title?: boolean
    description?: boolean
    images?: boolean
    liveUrl?: boolean
    repoUrl?: boolean
    tags?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProjectOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "profileId" | "title" | "description" | "images" | "liveUrl" | "repoUrl" | "tags" | "sortOrder" | "createdAt" | "updatedAt", ExtArgs["result"]["project"]>
  export type ProjectInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type ProjectIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type ProjectIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }

  export type $ProjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Project"
    objects: {
      profile: Prisma.$ProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      profileId: string
      title: string
      description: string | null
      images: string[]
      liveUrl: string | null
      repoUrl: string | null
      tags: string[]
      sortOrder: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["project"]>
    composites: {}
  }

  type ProjectGetPayload<S extends boolean | null | undefined | ProjectDefaultArgs> = $Result.GetResult<Prisma.$ProjectPayload, S>

  type ProjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectCountAggregateInputType | true
    }

  export interface ProjectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Project'], meta: { name: 'Project' } }
    /**
     * Find zero or one Project that matches the filter.
     * @param {ProjectFindUniqueArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectFindUniqueArgs>(args: SelectSubset<T, ProjectFindUniqueArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Project that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectFindUniqueOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectFindFirstArgs>(args?: SelectSubset<T, ProjectFindFirstArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Projects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Projects
     * const projects = await prisma.project.findMany()
     * 
     * // Get first 10 Projects
     * const projects = await prisma.project.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectWithIdOnly = await prisma.project.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectFindManyArgs>(args?: SelectSubset<T, ProjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Project.
     * @param {ProjectCreateArgs} args - Arguments to create a Project.
     * @example
     * // Create one Project
     * const Project = await prisma.project.create({
     *   data: {
     *     // ... data to create a Project
     *   }
     * })
     * 
     */
    create<T extends ProjectCreateArgs>(args: SelectSubset<T, ProjectCreateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Projects.
     * @param {ProjectCreateManyArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectCreateManyArgs>(args?: SelectSubset<T, ProjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Projects and returns the data saved in the database.
     * @param {ProjectCreateManyAndReturnArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Project.
     * @param {ProjectDeleteArgs} args - Arguments to delete one Project.
     * @example
     * // Delete one Project
     * const Project = await prisma.project.delete({
     *   where: {
     *     // ... filter to delete one Project
     *   }
     * })
     * 
     */
    delete<T extends ProjectDeleteArgs>(args: SelectSubset<T, ProjectDeleteArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Project.
     * @param {ProjectUpdateArgs} args - Arguments to update one Project.
     * @example
     * // Update one Project
     * const project = await prisma.project.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectUpdateArgs>(args: SelectSubset<T, ProjectUpdateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Projects.
     * @param {ProjectDeleteManyArgs} args - Arguments to filter Projects to delete.
     * @example
     * // Delete a few Projects
     * const { count } = await prisma.project.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectDeleteManyArgs>(args?: SelectSubset<T, ProjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectUpdateManyArgs>(args: SelectSubset<T, ProjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects and returns the data updated in the database.
     * @param {ProjectUpdateManyAndReturnArgs} args - Arguments to update many Projects.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProjectUpdateManyAndReturnArgs>(args: SelectSubset<T, ProjectUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Project.
     * @param {ProjectUpsertArgs} args - Arguments to update or create a Project.
     * @example
     * // Update or create a Project
     * const project = await prisma.project.upsert({
     *   create: {
     *     // ... data to create a Project
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Project we want to update
     *   }
     * })
     */
    upsert<T extends ProjectUpsertArgs>(args: SelectSubset<T, ProjectUpsertArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectCountArgs} args - Arguments to filter Projects to count.
     * @example
     * // Count the number of Projects
     * const count = await prisma.project.count({
     *   where: {
     *     // ... the filter for the Projects we want to count
     *   }
     * })
    **/
    count<T extends ProjectCountArgs>(
      args?: Subset<T, ProjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectAggregateArgs>(args: Subset<T, ProjectAggregateArgs>): Prisma.PrismaPromise<GetProjectAggregateType<T>>

    /**
     * Group by Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectGroupByArgs['orderBy'] }
        : { orderBy?: ProjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Project model
   */
  readonly fields: ProjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Project.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    profile<T extends ProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProfileDefaultArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Project model
   */
  interface ProjectFieldRefs {
    readonly id: FieldRef<"Project", 'String'>
    readonly profileId: FieldRef<"Project", 'String'>
    readonly title: FieldRef<"Project", 'String'>
    readonly description: FieldRef<"Project", 'String'>
    readonly images: FieldRef<"Project", 'String[]'>
    readonly liveUrl: FieldRef<"Project", 'String'>
    readonly repoUrl: FieldRef<"Project", 'String'>
    readonly tags: FieldRef<"Project", 'String[]'>
    readonly sortOrder: FieldRef<"Project", 'Int'>
    readonly createdAt: FieldRef<"Project", 'DateTime'>
    readonly updatedAt: FieldRef<"Project", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Project findUnique
   */
  export type ProjectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findUniqueOrThrow
   */
  export type ProjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findFirst
   */
  export type ProjectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findFirstOrThrow
   */
  export type ProjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findMany
   */
  export type ProjectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Projects to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project create
   */
  export type ProjectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to create a Project.
     */
    data: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
  }

  /**
   * Project createMany
   */
  export type ProjectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Project createManyAndReturn
   */
  export type ProjectCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Project update
   */
  export type ProjectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to update a Project.
     */
    data: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
    /**
     * Choose, which Project to update.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project updateMany
   */
  export type ProjectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
  }

  /**
   * Project updateManyAndReturn
   */
  export type ProjectUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Project upsert
   */
  export type ProjectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The filter to search for the Project to update in case it exists.
     */
    where: ProjectWhereUniqueInput
    /**
     * In case the Project found by the `where` argument doesn't exist, create a new Project with this data.
     */
    create: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
    /**
     * In case the Project was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
  }

  /**
   * Project delete
   */
  export type ProjectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter which Project to delete.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project deleteMany
   */
  export type ProjectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Projects to delete
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to delete.
     */
    limit?: number
  }

  /**
   * Project without action
   */
  export type ProjectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
  }


  /**
   * Model Skill
   */

  export type AggregateSkill = {
    _count: SkillCountAggregateOutputType | null
    _avg: SkillAvgAggregateOutputType | null
    _sum: SkillSumAggregateOutputType | null
    _min: SkillMinAggregateOutputType | null
    _max: SkillMaxAggregateOutputType | null
  }

  export type SkillAvgAggregateOutputType = {
    sortOrder: number | null
  }

  export type SkillSumAggregateOutputType = {
    sortOrder: number | null
  }

  export type SkillMinAggregateOutputType = {
    id: string | null
    profileId: string | null
    name: string | null
    categoryId: string | null
    proficiency: $Enums.Proficiency | null
    sortOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SkillMaxAggregateOutputType = {
    id: string | null
    profileId: string | null
    name: string | null
    categoryId: string | null
    proficiency: $Enums.Proficiency | null
    sortOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SkillCountAggregateOutputType = {
    id: number
    profileId: number
    name: number
    categoryId: number
    proficiency: number
    sortOrder: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SkillAvgAggregateInputType = {
    sortOrder?: true
  }

  export type SkillSumAggregateInputType = {
    sortOrder?: true
  }

  export type SkillMinAggregateInputType = {
    id?: true
    profileId?: true
    name?: true
    categoryId?: true
    proficiency?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SkillMaxAggregateInputType = {
    id?: true
    profileId?: true
    name?: true
    categoryId?: true
    proficiency?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SkillCountAggregateInputType = {
    id?: true
    profileId?: true
    name?: true
    categoryId?: true
    proficiency?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SkillAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Skill to aggregate.
     */
    where?: SkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Skills to fetch.
     */
    orderBy?: SkillOrderByWithRelationInput | SkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Skills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Skills.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Skills
    **/
    _count?: true | SkillCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SkillAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SkillSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SkillMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SkillMaxAggregateInputType
  }

  export type GetSkillAggregateType<T extends SkillAggregateArgs> = {
        [P in keyof T & keyof AggregateSkill]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSkill[P]>
      : GetScalarType<T[P], AggregateSkill[P]>
  }




  export type SkillGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SkillWhereInput
    orderBy?: SkillOrderByWithAggregationInput | SkillOrderByWithAggregationInput[]
    by: SkillScalarFieldEnum[] | SkillScalarFieldEnum
    having?: SkillScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SkillCountAggregateInputType | true
    _avg?: SkillAvgAggregateInputType
    _sum?: SkillSumAggregateInputType
    _min?: SkillMinAggregateInputType
    _max?: SkillMaxAggregateInputType
  }

  export type SkillGroupByOutputType = {
    id: string
    profileId: string
    name: string
    categoryId: string | null
    proficiency: $Enums.Proficiency
    sortOrder: number
    createdAt: Date
    updatedAt: Date
    _count: SkillCountAggregateOutputType | null
    _avg: SkillAvgAggregateOutputType | null
    _sum: SkillSumAggregateOutputType | null
    _min: SkillMinAggregateOutputType | null
    _max: SkillMaxAggregateOutputType | null
  }

  type GetSkillGroupByPayload<T extends SkillGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SkillGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SkillGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SkillGroupByOutputType[P]>
            : GetScalarType<T[P], SkillGroupByOutputType[P]>
        }
      >
    >


  export type SkillSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    name?: boolean
    categoryId?: boolean
    proficiency?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
    category?: boolean | Skill$categoryArgs<ExtArgs>
  }, ExtArgs["result"]["skill"]>

  export type SkillSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    name?: boolean
    categoryId?: boolean
    proficiency?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
    category?: boolean | Skill$categoryArgs<ExtArgs>
  }, ExtArgs["result"]["skill"]>

  export type SkillSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    name?: boolean
    categoryId?: boolean
    proficiency?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
    category?: boolean | Skill$categoryArgs<ExtArgs>
  }, ExtArgs["result"]["skill"]>

  export type SkillSelectScalar = {
    id?: boolean
    profileId?: boolean
    name?: boolean
    categoryId?: boolean
    proficiency?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SkillOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "profileId" | "name" | "categoryId" | "proficiency" | "sortOrder" | "createdAt" | "updatedAt", ExtArgs["result"]["skill"]>
  export type SkillInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
    category?: boolean | Skill$categoryArgs<ExtArgs>
  }
  export type SkillIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
    category?: boolean | Skill$categoryArgs<ExtArgs>
  }
  export type SkillIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
    category?: boolean | Skill$categoryArgs<ExtArgs>
  }

  export type $SkillPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Skill"
    objects: {
      profile: Prisma.$ProfilePayload<ExtArgs>
      category: Prisma.$SkillCategoryPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      profileId: string
      name: string
      categoryId: string | null
      proficiency: $Enums.Proficiency
      sortOrder: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["skill"]>
    composites: {}
  }

  type SkillGetPayload<S extends boolean | null | undefined | SkillDefaultArgs> = $Result.GetResult<Prisma.$SkillPayload, S>

  type SkillCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SkillFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SkillCountAggregateInputType | true
    }

  export interface SkillDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Skill'], meta: { name: 'Skill' } }
    /**
     * Find zero or one Skill that matches the filter.
     * @param {SkillFindUniqueArgs} args - Arguments to find a Skill
     * @example
     * // Get one Skill
     * const skill = await prisma.skill.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SkillFindUniqueArgs>(args: SelectSubset<T, SkillFindUniqueArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Skill that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SkillFindUniqueOrThrowArgs} args - Arguments to find a Skill
     * @example
     * // Get one Skill
     * const skill = await prisma.skill.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SkillFindUniqueOrThrowArgs>(args: SelectSubset<T, SkillFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Skill that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillFindFirstArgs} args - Arguments to find a Skill
     * @example
     * // Get one Skill
     * const skill = await prisma.skill.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SkillFindFirstArgs>(args?: SelectSubset<T, SkillFindFirstArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Skill that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillFindFirstOrThrowArgs} args - Arguments to find a Skill
     * @example
     * // Get one Skill
     * const skill = await prisma.skill.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SkillFindFirstOrThrowArgs>(args?: SelectSubset<T, SkillFindFirstOrThrowArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Skills that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Skills
     * const skills = await prisma.skill.findMany()
     * 
     * // Get first 10 Skills
     * const skills = await prisma.skill.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const skillWithIdOnly = await prisma.skill.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SkillFindManyArgs>(args?: SelectSubset<T, SkillFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Skill.
     * @param {SkillCreateArgs} args - Arguments to create a Skill.
     * @example
     * // Create one Skill
     * const Skill = await prisma.skill.create({
     *   data: {
     *     // ... data to create a Skill
     *   }
     * })
     * 
     */
    create<T extends SkillCreateArgs>(args: SelectSubset<T, SkillCreateArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Skills.
     * @param {SkillCreateManyArgs} args - Arguments to create many Skills.
     * @example
     * // Create many Skills
     * const skill = await prisma.skill.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SkillCreateManyArgs>(args?: SelectSubset<T, SkillCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Skills and returns the data saved in the database.
     * @param {SkillCreateManyAndReturnArgs} args - Arguments to create many Skills.
     * @example
     * // Create many Skills
     * const skill = await prisma.skill.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Skills and only return the `id`
     * const skillWithIdOnly = await prisma.skill.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SkillCreateManyAndReturnArgs>(args?: SelectSubset<T, SkillCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Skill.
     * @param {SkillDeleteArgs} args - Arguments to delete one Skill.
     * @example
     * // Delete one Skill
     * const Skill = await prisma.skill.delete({
     *   where: {
     *     // ... filter to delete one Skill
     *   }
     * })
     * 
     */
    delete<T extends SkillDeleteArgs>(args: SelectSubset<T, SkillDeleteArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Skill.
     * @param {SkillUpdateArgs} args - Arguments to update one Skill.
     * @example
     * // Update one Skill
     * const skill = await prisma.skill.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SkillUpdateArgs>(args: SelectSubset<T, SkillUpdateArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Skills.
     * @param {SkillDeleteManyArgs} args - Arguments to filter Skills to delete.
     * @example
     * // Delete a few Skills
     * const { count } = await prisma.skill.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SkillDeleteManyArgs>(args?: SelectSubset<T, SkillDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Skills.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Skills
     * const skill = await prisma.skill.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SkillUpdateManyArgs>(args: SelectSubset<T, SkillUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Skills and returns the data updated in the database.
     * @param {SkillUpdateManyAndReturnArgs} args - Arguments to update many Skills.
     * @example
     * // Update many Skills
     * const skill = await prisma.skill.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Skills and only return the `id`
     * const skillWithIdOnly = await prisma.skill.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SkillUpdateManyAndReturnArgs>(args: SelectSubset<T, SkillUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Skill.
     * @param {SkillUpsertArgs} args - Arguments to update or create a Skill.
     * @example
     * // Update or create a Skill
     * const skill = await prisma.skill.upsert({
     *   create: {
     *     // ... data to create a Skill
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Skill we want to update
     *   }
     * })
     */
    upsert<T extends SkillUpsertArgs>(args: SelectSubset<T, SkillUpsertArgs<ExtArgs>>): Prisma__SkillClient<$Result.GetResult<Prisma.$SkillPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Skills.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillCountArgs} args - Arguments to filter Skills to count.
     * @example
     * // Count the number of Skills
     * const count = await prisma.skill.count({
     *   where: {
     *     // ... the filter for the Skills we want to count
     *   }
     * })
    **/
    count<T extends SkillCountArgs>(
      args?: Subset<T, SkillCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SkillCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Skill.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SkillAggregateArgs>(args: Subset<T, SkillAggregateArgs>): Prisma.PrismaPromise<GetSkillAggregateType<T>>

    /**
     * Group by Skill.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SkillGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SkillGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SkillGroupByArgs['orderBy'] }
        : { orderBy?: SkillGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SkillGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSkillGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Skill model
   */
  readonly fields: SkillFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Skill.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SkillClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    profile<T extends ProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProfileDefaultArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    category<T extends Skill$categoryArgs<ExtArgs> = {}>(args?: Subset<T, Skill$categoryArgs<ExtArgs>>): Prisma__SkillCategoryClient<$Result.GetResult<Prisma.$SkillCategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Skill model
   */
  interface SkillFieldRefs {
    readonly id: FieldRef<"Skill", 'String'>
    readonly profileId: FieldRef<"Skill", 'String'>
    readonly name: FieldRef<"Skill", 'String'>
    readonly categoryId: FieldRef<"Skill", 'String'>
    readonly proficiency: FieldRef<"Skill", 'Proficiency'>
    readonly sortOrder: FieldRef<"Skill", 'Int'>
    readonly createdAt: FieldRef<"Skill", 'DateTime'>
    readonly updatedAt: FieldRef<"Skill", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Skill findUnique
   */
  export type SkillFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * Filter, which Skill to fetch.
     */
    where: SkillWhereUniqueInput
  }

  /**
   * Skill findUniqueOrThrow
   */
  export type SkillFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * Filter, which Skill to fetch.
     */
    where: SkillWhereUniqueInput
  }

  /**
   * Skill findFirst
   */
  export type SkillFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * Filter, which Skill to fetch.
     */
    where?: SkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Skills to fetch.
     */
    orderBy?: SkillOrderByWithRelationInput | SkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Skills.
     */
    cursor?: SkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Skills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Skills.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Skills.
     */
    distinct?: SkillScalarFieldEnum | SkillScalarFieldEnum[]
  }

  /**
   * Skill findFirstOrThrow
   */
  export type SkillFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * Filter, which Skill to fetch.
     */
    where?: SkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Skills to fetch.
     */
    orderBy?: SkillOrderByWithRelationInput | SkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Skills.
     */
    cursor?: SkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Skills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Skills.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Skills.
     */
    distinct?: SkillScalarFieldEnum | SkillScalarFieldEnum[]
  }

  /**
   * Skill findMany
   */
  export type SkillFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * Filter, which Skills to fetch.
     */
    where?: SkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Skills to fetch.
     */
    orderBy?: SkillOrderByWithRelationInput | SkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Skills.
     */
    cursor?: SkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Skills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Skills.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Skills.
     */
    distinct?: SkillScalarFieldEnum | SkillScalarFieldEnum[]
  }

  /**
   * Skill create
   */
  export type SkillCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * The data needed to create a Skill.
     */
    data: XOR<SkillCreateInput, SkillUncheckedCreateInput>
  }

  /**
   * Skill createMany
   */
  export type SkillCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Skills.
     */
    data: SkillCreateManyInput | SkillCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Skill createManyAndReturn
   */
  export type SkillCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * The data used to create many Skills.
     */
    data: SkillCreateManyInput | SkillCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Skill update
   */
  export type SkillUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * The data needed to update a Skill.
     */
    data: XOR<SkillUpdateInput, SkillUncheckedUpdateInput>
    /**
     * Choose, which Skill to update.
     */
    where: SkillWhereUniqueInput
  }

  /**
   * Skill updateMany
   */
  export type SkillUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Skills.
     */
    data: XOR<SkillUpdateManyMutationInput, SkillUncheckedUpdateManyInput>
    /**
     * Filter which Skills to update
     */
    where?: SkillWhereInput
    /**
     * Limit how many Skills to update.
     */
    limit?: number
  }

  /**
   * Skill updateManyAndReturn
   */
  export type SkillUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * The data used to update Skills.
     */
    data: XOR<SkillUpdateManyMutationInput, SkillUncheckedUpdateManyInput>
    /**
     * Filter which Skills to update
     */
    where?: SkillWhereInput
    /**
     * Limit how many Skills to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Skill upsert
   */
  export type SkillUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * The filter to search for the Skill to update in case it exists.
     */
    where: SkillWhereUniqueInput
    /**
     * In case the Skill found by the `where` argument doesn't exist, create a new Skill with this data.
     */
    create: XOR<SkillCreateInput, SkillUncheckedCreateInput>
    /**
     * In case the Skill was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SkillUpdateInput, SkillUncheckedUpdateInput>
  }

  /**
   * Skill delete
   */
  export type SkillDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
    /**
     * Filter which Skill to delete.
     */
    where: SkillWhereUniqueInput
  }

  /**
   * Skill deleteMany
   */
  export type SkillDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Skills to delete
     */
    where?: SkillWhereInput
    /**
     * Limit how many Skills to delete.
     */
    limit?: number
  }

  /**
   * Skill.category
   */
  export type Skill$categoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SkillCategory
     */
    select?: SkillCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the SkillCategory
     */
    omit?: SkillCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillCategoryInclude<ExtArgs> | null
    where?: SkillCategoryWhereInput
  }

  /**
   * Skill without action
   */
  export type SkillDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Skill
     */
    select?: SkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Skill
     */
    omit?: SkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SkillInclude<ExtArgs> | null
  }


  /**
   * Model Experience
   */

  export type AggregateExperience = {
    _count: ExperienceCountAggregateOutputType | null
    _avg: ExperienceAvgAggregateOutputType | null
    _sum: ExperienceSumAggregateOutputType | null
    _min: ExperienceMinAggregateOutputType | null
    _max: ExperienceMaxAggregateOutputType | null
  }

  export type ExperienceAvgAggregateOutputType = {
    sortOrder: number | null
  }

  export type ExperienceSumAggregateOutputType = {
    sortOrder: number | null
  }

  export type ExperienceMinAggregateOutputType = {
    id: string | null
    profileId: string | null
    company: string | null
    role: string | null
    startDate: Date | null
    endDate: Date | null
    sortOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ExperienceMaxAggregateOutputType = {
    id: string | null
    profileId: string | null
    company: string | null
    role: string | null
    startDate: Date | null
    endDate: Date | null
    sortOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ExperienceCountAggregateOutputType = {
    id: number
    profileId: number
    company: number
    role: number
    description: number
    startDate: number
    endDate: number
    sortOrder: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ExperienceAvgAggregateInputType = {
    sortOrder?: true
  }

  export type ExperienceSumAggregateInputType = {
    sortOrder?: true
  }

  export type ExperienceMinAggregateInputType = {
    id?: true
    profileId?: true
    company?: true
    role?: true
    startDate?: true
    endDate?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ExperienceMaxAggregateInputType = {
    id?: true
    profileId?: true
    company?: true
    role?: true
    startDate?: true
    endDate?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ExperienceCountAggregateInputType = {
    id?: true
    profileId?: true
    company?: true
    role?: true
    description?: true
    startDate?: true
    endDate?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ExperienceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Experience to aggregate.
     */
    where?: ExperienceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Experiences to fetch.
     */
    orderBy?: ExperienceOrderByWithRelationInput | ExperienceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExperienceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Experiences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Experiences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Experiences
    **/
    _count?: true | ExperienceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExperienceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExperienceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExperienceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExperienceMaxAggregateInputType
  }

  export type GetExperienceAggregateType<T extends ExperienceAggregateArgs> = {
        [P in keyof T & keyof AggregateExperience]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExperience[P]>
      : GetScalarType<T[P], AggregateExperience[P]>
  }




  export type ExperienceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExperienceWhereInput
    orderBy?: ExperienceOrderByWithAggregationInput | ExperienceOrderByWithAggregationInput[]
    by: ExperienceScalarFieldEnum[] | ExperienceScalarFieldEnum
    having?: ExperienceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExperienceCountAggregateInputType | true
    _avg?: ExperienceAvgAggregateInputType
    _sum?: ExperienceSumAggregateInputType
    _min?: ExperienceMinAggregateInputType
    _max?: ExperienceMaxAggregateInputType
  }

  export type ExperienceGroupByOutputType = {
    id: string
    profileId: string
    company: string
    role: string
    description: string[]
    startDate: Date
    endDate: Date | null
    sortOrder: number
    createdAt: Date
    updatedAt: Date
    _count: ExperienceCountAggregateOutputType | null
    _avg: ExperienceAvgAggregateOutputType | null
    _sum: ExperienceSumAggregateOutputType | null
    _min: ExperienceMinAggregateOutputType | null
    _max: ExperienceMaxAggregateOutputType | null
  }

  type GetExperienceGroupByPayload<T extends ExperienceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExperienceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExperienceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExperienceGroupByOutputType[P]>
            : GetScalarType<T[P], ExperienceGroupByOutputType[P]>
        }
      >
    >


  export type ExperienceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    company?: boolean
    role?: boolean
    description?: boolean
    startDate?: boolean
    endDate?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["experience"]>

  export type ExperienceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    company?: boolean
    role?: boolean
    description?: boolean
    startDate?: boolean
    endDate?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["experience"]>

  export type ExperienceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    company?: boolean
    role?: boolean
    description?: boolean
    startDate?: boolean
    endDate?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["experience"]>

  export type ExperienceSelectScalar = {
    id?: boolean
    profileId?: boolean
    company?: boolean
    role?: boolean
    description?: boolean
    startDate?: boolean
    endDate?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ExperienceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "profileId" | "company" | "role" | "description" | "startDate" | "endDate" | "sortOrder" | "createdAt" | "updatedAt", ExtArgs["result"]["experience"]>
  export type ExperienceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type ExperienceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type ExperienceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }

  export type $ExperiencePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Experience"
    objects: {
      profile: Prisma.$ProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      profileId: string
      company: string
      role: string
      description: string[]
      startDate: Date
      endDate: Date | null
      sortOrder: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["experience"]>
    composites: {}
  }

  type ExperienceGetPayload<S extends boolean | null | undefined | ExperienceDefaultArgs> = $Result.GetResult<Prisma.$ExperiencePayload, S>

  type ExperienceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExperienceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExperienceCountAggregateInputType | true
    }

  export interface ExperienceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Experience'], meta: { name: 'Experience' } }
    /**
     * Find zero or one Experience that matches the filter.
     * @param {ExperienceFindUniqueArgs} args - Arguments to find a Experience
     * @example
     * // Get one Experience
     * const experience = await prisma.experience.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExperienceFindUniqueArgs>(args: SelectSubset<T, ExperienceFindUniqueArgs<ExtArgs>>): Prisma__ExperienceClient<$Result.GetResult<Prisma.$ExperiencePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Experience that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExperienceFindUniqueOrThrowArgs} args - Arguments to find a Experience
     * @example
     * // Get one Experience
     * const experience = await prisma.experience.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExperienceFindUniqueOrThrowArgs>(args: SelectSubset<T, ExperienceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExperienceClient<$Result.GetResult<Prisma.$ExperiencePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Experience that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExperienceFindFirstArgs} args - Arguments to find a Experience
     * @example
     * // Get one Experience
     * const experience = await prisma.experience.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExperienceFindFirstArgs>(args?: SelectSubset<T, ExperienceFindFirstArgs<ExtArgs>>): Prisma__ExperienceClient<$Result.GetResult<Prisma.$ExperiencePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Experience that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExperienceFindFirstOrThrowArgs} args - Arguments to find a Experience
     * @example
     * // Get one Experience
     * const experience = await prisma.experience.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExperienceFindFirstOrThrowArgs>(args?: SelectSubset<T, ExperienceFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExperienceClient<$Result.GetResult<Prisma.$ExperiencePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Experiences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExperienceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Experiences
     * const experiences = await prisma.experience.findMany()
     * 
     * // Get first 10 Experiences
     * const experiences = await prisma.experience.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const experienceWithIdOnly = await prisma.experience.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExperienceFindManyArgs>(args?: SelectSubset<T, ExperienceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExperiencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Experience.
     * @param {ExperienceCreateArgs} args - Arguments to create a Experience.
     * @example
     * // Create one Experience
     * const Experience = await prisma.experience.create({
     *   data: {
     *     // ... data to create a Experience
     *   }
     * })
     * 
     */
    create<T extends ExperienceCreateArgs>(args: SelectSubset<T, ExperienceCreateArgs<ExtArgs>>): Prisma__ExperienceClient<$Result.GetResult<Prisma.$ExperiencePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Experiences.
     * @param {ExperienceCreateManyArgs} args - Arguments to create many Experiences.
     * @example
     * // Create many Experiences
     * const experience = await prisma.experience.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExperienceCreateManyArgs>(args?: SelectSubset<T, ExperienceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Experiences and returns the data saved in the database.
     * @param {ExperienceCreateManyAndReturnArgs} args - Arguments to create many Experiences.
     * @example
     * // Create many Experiences
     * const experience = await prisma.experience.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Experiences and only return the `id`
     * const experienceWithIdOnly = await prisma.experience.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExperienceCreateManyAndReturnArgs>(args?: SelectSubset<T, ExperienceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExperiencePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Experience.
     * @param {ExperienceDeleteArgs} args - Arguments to delete one Experience.
     * @example
     * // Delete one Experience
     * const Experience = await prisma.experience.delete({
     *   where: {
     *     // ... filter to delete one Experience
     *   }
     * })
     * 
     */
    delete<T extends ExperienceDeleteArgs>(args: SelectSubset<T, ExperienceDeleteArgs<ExtArgs>>): Prisma__ExperienceClient<$Result.GetResult<Prisma.$ExperiencePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Experience.
     * @param {ExperienceUpdateArgs} args - Arguments to update one Experience.
     * @example
     * // Update one Experience
     * const experience = await prisma.experience.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExperienceUpdateArgs>(args: SelectSubset<T, ExperienceUpdateArgs<ExtArgs>>): Prisma__ExperienceClient<$Result.GetResult<Prisma.$ExperiencePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Experiences.
     * @param {ExperienceDeleteManyArgs} args - Arguments to filter Experiences to delete.
     * @example
     * // Delete a few Experiences
     * const { count } = await prisma.experience.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExperienceDeleteManyArgs>(args?: SelectSubset<T, ExperienceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Experiences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExperienceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Experiences
     * const experience = await prisma.experience.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExperienceUpdateManyArgs>(args: SelectSubset<T, ExperienceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Experiences and returns the data updated in the database.
     * @param {ExperienceUpdateManyAndReturnArgs} args - Arguments to update many Experiences.
     * @example
     * // Update many Experiences
     * const experience = await prisma.experience.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Experiences and only return the `id`
     * const experienceWithIdOnly = await prisma.experience.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ExperienceUpdateManyAndReturnArgs>(args: SelectSubset<T, ExperienceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExperiencePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Experience.
     * @param {ExperienceUpsertArgs} args - Arguments to update or create a Experience.
     * @example
     * // Update or create a Experience
     * const experience = await prisma.experience.upsert({
     *   create: {
     *     // ... data to create a Experience
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Experience we want to update
     *   }
     * })
     */
    upsert<T extends ExperienceUpsertArgs>(args: SelectSubset<T, ExperienceUpsertArgs<ExtArgs>>): Prisma__ExperienceClient<$Result.GetResult<Prisma.$ExperiencePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Experiences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExperienceCountArgs} args - Arguments to filter Experiences to count.
     * @example
     * // Count the number of Experiences
     * const count = await prisma.experience.count({
     *   where: {
     *     // ... the filter for the Experiences we want to count
     *   }
     * })
    **/
    count<T extends ExperienceCountArgs>(
      args?: Subset<T, ExperienceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExperienceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Experience.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExperienceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExperienceAggregateArgs>(args: Subset<T, ExperienceAggregateArgs>): Prisma.PrismaPromise<GetExperienceAggregateType<T>>

    /**
     * Group by Experience.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExperienceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExperienceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExperienceGroupByArgs['orderBy'] }
        : { orderBy?: ExperienceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExperienceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExperienceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Experience model
   */
  readonly fields: ExperienceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Experience.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExperienceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    profile<T extends ProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProfileDefaultArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Experience model
   */
  interface ExperienceFieldRefs {
    readonly id: FieldRef<"Experience", 'String'>
    readonly profileId: FieldRef<"Experience", 'String'>
    readonly company: FieldRef<"Experience", 'String'>
    readonly role: FieldRef<"Experience", 'String'>
    readonly description: FieldRef<"Experience", 'String[]'>
    readonly startDate: FieldRef<"Experience", 'DateTime'>
    readonly endDate: FieldRef<"Experience", 'DateTime'>
    readonly sortOrder: FieldRef<"Experience", 'Int'>
    readonly createdAt: FieldRef<"Experience", 'DateTime'>
    readonly updatedAt: FieldRef<"Experience", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Experience findUnique
   */
  export type ExperienceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Experience
     */
    select?: ExperienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Experience
     */
    omit?: ExperienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExperienceInclude<ExtArgs> | null
    /**
     * Filter, which Experience to fetch.
     */
    where: ExperienceWhereUniqueInput
  }

  /**
   * Experience findUniqueOrThrow
   */
  export type ExperienceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Experience
     */
    select?: ExperienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Experience
     */
    omit?: ExperienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExperienceInclude<ExtArgs> | null
    /**
     * Filter, which Experience to fetch.
     */
    where: ExperienceWhereUniqueInput
  }

  /**
   * Experience findFirst
   */
  export type ExperienceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Experience
     */
    select?: ExperienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Experience
     */
    omit?: ExperienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExperienceInclude<ExtArgs> | null
    /**
     * Filter, which Experience to fetch.
     */
    where?: ExperienceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Experiences to fetch.
     */
    orderBy?: ExperienceOrderByWithRelationInput | ExperienceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Experiences.
     */
    cursor?: ExperienceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Experiences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Experiences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Experiences.
     */
    distinct?: ExperienceScalarFieldEnum | ExperienceScalarFieldEnum[]
  }

  /**
   * Experience findFirstOrThrow
   */
  export type ExperienceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Experience
     */
    select?: ExperienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Experience
     */
    omit?: ExperienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExperienceInclude<ExtArgs> | null
    /**
     * Filter, which Experience to fetch.
     */
    where?: ExperienceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Experiences to fetch.
     */
    orderBy?: ExperienceOrderByWithRelationInput | ExperienceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Experiences.
     */
    cursor?: ExperienceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Experiences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Experiences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Experiences.
     */
    distinct?: ExperienceScalarFieldEnum | ExperienceScalarFieldEnum[]
  }

  /**
   * Experience findMany
   */
  export type ExperienceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Experience
     */
    select?: ExperienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Experience
     */
    omit?: ExperienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExperienceInclude<ExtArgs> | null
    /**
     * Filter, which Experiences to fetch.
     */
    where?: ExperienceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Experiences to fetch.
     */
    orderBy?: ExperienceOrderByWithRelationInput | ExperienceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Experiences.
     */
    cursor?: ExperienceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Experiences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Experiences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Experiences.
     */
    distinct?: ExperienceScalarFieldEnum | ExperienceScalarFieldEnum[]
  }

  /**
   * Experience create
   */
  export type ExperienceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Experience
     */
    select?: ExperienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Experience
     */
    omit?: ExperienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExperienceInclude<ExtArgs> | null
    /**
     * The data needed to create a Experience.
     */
    data: XOR<ExperienceCreateInput, ExperienceUncheckedCreateInput>
  }

  /**
   * Experience createMany
   */
  export type ExperienceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Experiences.
     */
    data: ExperienceCreateManyInput | ExperienceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Experience createManyAndReturn
   */
  export type ExperienceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Experience
     */
    select?: ExperienceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Experience
     */
    omit?: ExperienceOmit<ExtArgs> | null
    /**
     * The data used to create many Experiences.
     */
    data: ExperienceCreateManyInput | ExperienceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExperienceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Experience update
   */
  export type ExperienceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Experience
     */
    select?: ExperienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Experience
     */
    omit?: ExperienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExperienceInclude<ExtArgs> | null
    /**
     * The data needed to update a Experience.
     */
    data: XOR<ExperienceUpdateInput, ExperienceUncheckedUpdateInput>
    /**
     * Choose, which Experience to update.
     */
    where: ExperienceWhereUniqueInput
  }

  /**
   * Experience updateMany
   */
  export type ExperienceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Experiences.
     */
    data: XOR<ExperienceUpdateManyMutationInput, ExperienceUncheckedUpdateManyInput>
    /**
     * Filter which Experiences to update
     */
    where?: ExperienceWhereInput
    /**
     * Limit how many Experiences to update.
     */
    limit?: number
  }

  /**
   * Experience updateManyAndReturn
   */
  export type ExperienceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Experience
     */
    select?: ExperienceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Experience
     */
    omit?: ExperienceOmit<ExtArgs> | null
    /**
     * The data used to update Experiences.
     */
    data: XOR<ExperienceUpdateManyMutationInput, ExperienceUncheckedUpdateManyInput>
    /**
     * Filter which Experiences to update
     */
    where?: ExperienceWhereInput
    /**
     * Limit how many Experiences to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExperienceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Experience upsert
   */
  export type ExperienceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Experience
     */
    select?: ExperienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Experience
     */
    omit?: ExperienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExperienceInclude<ExtArgs> | null
    /**
     * The filter to search for the Experience to update in case it exists.
     */
    where: ExperienceWhereUniqueInput
    /**
     * In case the Experience found by the `where` argument doesn't exist, create a new Experience with this data.
     */
    create: XOR<ExperienceCreateInput, ExperienceUncheckedCreateInput>
    /**
     * In case the Experience was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExperienceUpdateInput, ExperienceUncheckedUpdateInput>
  }

  /**
   * Experience delete
   */
  export type ExperienceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Experience
     */
    select?: ExperienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Experience
     */
    omit?: ExperienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExperienceInclude<ExtArgs> | null
    /**
     * Filter which Experience to delete.
     */
    where: ExperienceWhereUniqueInput
  }

  /**
   * Experience deleteMany
   */
  export type ExperienceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Experiences to delete
     */
    where?: ExperienceWhereInput
    /**
     * Limit how many Experiences to delete.
     */
    limit?: number
  }

  /**
   * Experience without action
   */
  export type ExperienceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Experience
     */
    select?: ExperienceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Experience
     */
    omit?: ExperienceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExperienceInclude<ExtArgs> | null
  }


  /**
   * Model Education
   */

  export type AggregateEducation = {
    _count: EducationCountAggregateOutputType | null
    _avg: EducationAvgAggregateOutputType | null
    _sum: EducationSumAggregateOutputType | null
    _min: EducationMinAggregateOutputType | null
    _max: EducationMaxAggregateOutputType | null
  }

  export type EducationAvgAggregateOutputType = {
    sortOrder: number | null
  }

  export type EducationSumAggregateOutputType = {
    sortOrder: number | null
  }

  export type EducationMinAggregateOutputType = {
    id: string | null
    profileId: string | null
    school: string | null
    degree: string | null
    field: string | null
    startDate: Date | null
    endDate: Date | null
    sortOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EducationMaxAggregateOutputType = {
    id: string | null
    profileId: string | null
    school: string | null
    degree: string | null
    field: string | null
    startDate: Date | null
    endDate: Date | null
    sortOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type EducationCountAggregateOutputType = {
    id: number
    profileId: number
    school: number
    degree: number
    field: number
    startDate: number
    endDate: number
    description: number
    sortOrder: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type EducationAvgAggregateInputType = {
    sortOrder?: true
  }

  export type EducationSumAggregateInputType = {
    sortOrder?: true
  }

  export type EducationMinAggregateInputType = {
    id?: true
    profileId?: true
    school?: true
    degree?: true
    field?: true
    startDate?: true
    endDate?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EducationMaxAggregateInputType = {
    id?: true
    profileId?: true
    school?: true
    degree?: true
    field?: true
    startDate?: true
    endDate?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type EducationCountAggregateInputType = {
    id?: true
    profileId?: true
    school?: true
    degree?: true
    field?: true
    startDate?: true
    endDate?: true
    description?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type EducationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Education to aggregate.
     */
    where?: EducationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Educations to fetch.
     */
    orderBy?: EducationOrderByWithRelationInput | EducationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EducationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Educations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Educations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Educations
    **/
    _count?: true | EducationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EducationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EducationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EducationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EducationMaxAggregateInputType
  }

  export type GetEducationAggregateType<T extends EducationAggregateArgs> = {
        [P in keyof T & keyof AggregateEducation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEducation[P]>
      : GetScalarType<T[P], AggregateEducation[P]>
  }




  export type EducationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EducationWhereInput
    orderBy?: EducationOrderByWithAggregationInput | EducationOrderByWithAggregationInput[]
    by: EducationScalarFieldEnum[] | EducationScalarFieldEnum
    having?: EducationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EducationCountAggregateInputType | true
    _avg?: EducationAvgAggregateInputType
    _sum?: EducationSumAggregateInputType
    _min?: EducationMinAggregateInputType
    _max?: EducationMaxAggregateInputType
  }

  export type EducationGroupByOutputType = {
    id: string
    profileId: string
    school: string
    degree: string | null
    field: string | null
    startDate: Date
    endDate: Date | null
    description: string[]
    sortOrder: number
    createdAt: Date
    updatedAt: Date
    _count: EducationCountAggregateOutputType | null
    _avg: EducationAvgAggregateOutputType | null
    _sum: EducationSumAggregateOutputType | null
    _min: EducationMinAggregateOutputType | null
    _max: EducationMaxAggregateOutputType | null
  }

  type GetEducationGroupByPayload<T extends EducationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EducationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EducationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EducationGroupByOutputType[P]>
            : GetScalarType<T[P], EducationGroupByOutputType[P]>
        }
      >
    >


  export type EducationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    school?: boolean
    degree?: boolean
    field?: boolean
    startDate?: boolean
    endDate?: boolean
    description?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["education"]>

  export type EducationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    school?: boolean
    degree?: boolean
    field?: boolean
    startDate?: boolean
    endDate?: boolean
    description?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["education"]>

  export type EducationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    school?: boolean
    degree?: boolean
    field?: boolean
    startDate?: boolean
    endDate?: boolean
    description?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["education"]>

  export type EducationSelectScalar = {
    id?: boolean
    profileId?: boolean
    school?: boolean
    degree?: boolean
    field?: boolean
    startDate?: boolean
    endDate?: boolean
    description?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type EducationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "profileId" | "school" | "degree" | "field" | "startDate" | "endDate" | "description" | "sortOrder" | "createdAt" | "updatedAt", ExtArgs["result"]["education"]>
  export type EducationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type EducationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type EducationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }

  export type $EducationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Education"
    objects: {
      profile: Prisma.$ProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      profileId: string
      school: string
      degree: string | null
      field: string | null
      startDate: Date
      endDate: Date | null
      description: string[]
      sortOrder: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["education"]>
    composites: {}
  }

  type EducationGetPayload<S extends boolean | null | undefined | EducationDefaultArgs> = $Result.GetResult<Prisma.$EducationPayload, S>

  type EducationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EducationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EducationCountAggregateInputType | true
    }

  export interface EducationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Education'], meta: { name: 'Education' } }
    /**
     * Find zero or one Education that matches the filter.
     * @param {EducationFindUniqueArgs} args - Arguments to find a Education
     * @example
     * // Get one Education
     * const education = await prisma.education.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EducationFindUniqueArgs>(args: SelectSubset<T, EducationFindUniqueArgs<ExtArgs>>): Prisma__EducationClient<$Result.GetResult<Prisma.$EducationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Education that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EducationFindUniqueOrThrowArgs} args - Arguments to find a Education
     * @example
     * // Get one Education
     * const education = await prisma.education.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EducationFindUniqueOrThrowArgs>(args: SelectSubset<T, EducationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EducationClient<$Result.GetResult<Prisma.$EducationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Education that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EducationFindFirstArgs} args - Arguments to find a Education
     * @example
     * // Get one Education
     * const education = await prisma.education.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EducationFindFirstArgs>(args?: SelectSubset<T, EducationFindFirstArgs<ExtArgs>>): Prisma__EducationClient<$Result.GetResult<Prisma.$EducationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Education that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EducationFindFirstOrThrowArgs} args - Arguments to find a Education
     * @example
     * // Get one Education
     * const education = await prisma.education.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EducationFindFirstOrThrowArgs>(args?: SelectSubset<T, EducationFindFirstOrThrowArgs<ExtArgs>>): Prisma__EducationClient<$Result.GetResult<Prisma.$EducationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Educations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EducationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Educations
     * const educations = await prisma.education.findMany()
     * 
     * // Get first 10 Educations
     * const educations = await prisma.education.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const educationWithIdOnly = await prisma.education.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EducationFindManyArgs>(args?: SelectSubset<T, EducationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EducationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Education.
     * @param {EducationCreateArgs} args - Arguments to create a Education.
     * @example
     * // Create one Education
     * const Education = await prisma.education.create({
     *   data: {
     *     // ... data to create a Education
     *   }
     * })
     * 
     */
    create<T extends EducationCreateArgs>(args: SelectSubset<T, EducationCreateArgs<ExtArgs>>): Prisma__EducationClient<$Result.GetResult<Prisma.$EducationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Educations.
     * @param {EducationCreateManyArgs} args - Arguments to create many Educations.
     * @example
     * // Create many Educations
     * const education = await prisma.education.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EducationCreateManyArgs>(args?: SelectSubset<T, EducationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Educations and returns the data saved in the database.
     * @param {EducationCreateManyAndReturnArgs} args - Arguments to create many Educations.
     * @example
     * // Create many Educations
     * const education = await prisma.education.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Educations and only return the `id`
     * const educationWithIdOnly = await prisma.education.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EducationCreateManyAndReturnArgs>(args?: SelectSubset<T, EducationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EducationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Education.
     * @param {EducationDeleteArgs} args - Arguments to delete one Education.
     * @example
     * // Delete one Education
     * const Education = await prisma.education.delete({
     *   where: {
     *     // ... filter to delete one Education
     *   }
     * })
     * 
     */
    delete<T extends EducationDeleteArgs>(args: SelectSubset<T, EducationDeleteArgs<ExtArgs>>): Prisma__EducationClient<$Result.GetResult<Prisma.$EducationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Education.
     * @param {EducationUpdateArgs} args - Arguments to update one Education.
     * @example
     * // Update one Education
     * const education = await prisma.education.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EducationUpdateArgs>(args: SelectSubset<T, EducationUpdateArgs<ExtArgs>>): Prisma__EducationClient<$Result.GetResult<Prisma.$EducationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Educations.
     * @param {EducationDeleteManyArgs} args - Arguments to filter Educations to delete.
     * @example
     * // Delete a few Educations
     * const { count } = await prisma.education.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EducationDeleteManyArgs>(args?: SelectSubset<T, EducationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Educations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EducationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Educations
     * const education = await prisma.education.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EducationUpdateManyArgs>(args: SelectSubset<T, EducationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Educations and returns the data updated in the database.
     * @param {EducationUpdateManyAndReturnArgs} args - Arguments to update many Educations.
     * @example
     * // Update many Educations
     * const education = await prisma.education.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Educations and only return the `id`
     * const educationWithIdOnly = await prisma.education.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EducationUpdateManyAndReturnArgs>(args: SelectSubset<T, EducationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EducationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Education.
     * @param {EducationUpsertArgs} args - Arguments to update or create a Education.
     * @example
     * // Update or create a Education
     * const education = await prisma.education.upsert({
     *   create: {
     *     // ... data to create a Education
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Education we want to update
     *   }
     * })
     */
    upsert<T extends EducationUpsertArgs>(args: SelectSubset<T, EducationUpsertArgs<ExtArgs>>): Prisma__EducationClient<$Result.GetResult<Prisma.$EducationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Educations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EducationCountArgs} args - Arguments to filter Educations to count.
     * @example
     * // Count the number of Educations
     * const count = await prisma.education.count({
     *   where: {
     *     // ... the filter for the Educations we want to count
     *   }
     * })
    **/
    count<T extends EducationCountArgs>(
      args?: Subset<T, EducationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EducationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Education.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EducationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EducationAggregateArgs>(args: Subset<T, EducationAggregateArgs>): Prisma.PrismaPromise<GetEducationAggregateType<T>>

    /**
     * Group by Education.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EducationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EducationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EducationGroupByArgs['orderBy'] }
        : { orderBy?: EducationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EducationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEducationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Education model
   */
  readonly fields: EducationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Education.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EducationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    profile<T extends ProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProfileDefaultArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Education model
   */
  interface EducationFieldRefs {
    readonly id: FieldRef<"Education", 'String'>
    readonly profileId: FieldRef<"Education", 'String'>
    readonly school: FieldRef<"Education", 'String'>
    readonly degree: FieldRef<"Education", 'String'>
    readonly field: FieldRef<"Education", 'String'>
    readonly startDate: FieldRef<"Education", 'DateTime'>
    readonly endDate: FieldRef<"Education", 'DateTime'>
    readonly description: FieldRef<"Education", 'String[]'>
    readonly sortOrder: FieldRef<"Education", 'Int'>
    readonly createdAt: FieldRef<"Education", 'DateTime'>
    readonly updatedAt: FieldRef<"Education", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Education findUnique
   */
  export type EducationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Education
     */
    select?: EducationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Education
     */
    omit?: EducationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationInclude<ExtArgs> | null
    /**
     * Filter, which Education to fetch.
     */
    where: EducationWhereUniqueInput
  }

  /**
   * Education findUniqueOrThrow
   */
  export type EducationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Education
     */
    select?: EducationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Education
     */
    omit?: EducationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationInclude<ExtArgs> | null
    /**
     * Filter, which Education to fetch.
     */
    where: EducationWhereUniqueInput
  }

  /**
   * Education findFirst
   */
  export type EducationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Education
     */
    select?: EducationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Education
     */
    omit?: EducationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationInclude<ExtArgs> | null
    /**
     * Filter, which Education to fetch.
     */
    where?: EducationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Educations to fetch.
     */
    orderBy?: EducationOrderByWithRelationInput | EducationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Educations.
     */
    cursor?: EducationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Educations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Educations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Educations.
     */
    distinct?: EducationScalarFieldEnum | EducationScalarFieldEnum[]
  }

  /**
   * Education findFirstOrThrow
   */
  export type EducationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Education
     */
    select?: EducationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Education
     */
    omit?: EducationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationInclude<ExtArgs> | null
    /**
     * Filter, which Education to fetch.
     */
    where?: EducationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Educations to fetch.
     */
    orderBy?: EducationOrderByWithRelationInput | EducationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Educations.
     */
    cursor?: EducationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Educations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Educations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Educations.
     */
    distinct?: EducationScalarFieldEnum | EducationScalarFieldEnum[]
  }

  /**
   * Education findMany
   */
  export type EducationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Education
     */
    select?: EducationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Education
     */
    omit?: EducationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationInclude<ExtArgs> | null
    /**
     * Filter, which Educations to fetch.
     */
    where?: EducationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Educations to fetch.
     */
    orderBy?: EducationOrderByWithRelationInput | EducationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Educations.
     */
    cursor?: EducationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Educations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Educations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Educations.
     */
    distinct?: EducationScalarFieldEnum | EducationScalarFieldEnum[]
  }

  /**
   * Education create
   */
  export type EducationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Education
     */
    select?: EducationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Education
     */
    omit?: EducationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationInclude<ExtArgs> | null
    /**
     * The data needed to create a Education.
     */
    data: XOR<EducationCreateInput, EducationUncheckedCreateInput>
  }

  /**
   * Education createMany
   */
  export type EducationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Educations.
     */
    data: EducationCreateManyInput | EducationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Education createManyAndReturn
   */
  export type EducationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Education
     */
    select?: EducationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Education
     */
    omit?: EducationOmit<ExtArgs> | null
    /**
     * The data used to create many Educations.
     */
    data: EducationCreateManyInput | EducationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Education update
   */
  export type EducationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Education
     */
    select?: EducationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Education
     */
    omit?: EducationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationInclude<ExtArgs> | null
    /**
     * The data needed to update a Education.
     */
    data: XOR<EducationUpdateInput, EducationUncheckedUpdateInput>
    /**
     * Choose, which Education to update.
     */
    where: EducationWhereUniqueInput
  }

  /**
   * Education updateMany
   */
  export type EducationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Educations.
     */
    data: XOR<EducationUpdateManyMutationInput, EducationUncheckedUpdateManyInput>
    /**
     * Filter which Educations to update
     */
    where?: EducationWhereInput
    /**
     * Limit how many Educations to update.
     */
    limit?: number
  }

  /**
   * Education updateManyAndReturn
   */
  export type EducationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Education
     */
    select?: EducationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Education
     */
    omit?: EducationOmit<ExtArgs> | null
    /**
     * The data used to update Educations.
     */
    data: XOR<EducationUpdateManyMutationInput, EducationUncheckedUpdateManyInput>
    /**
     * Filter which Educations to update
     */
    where?: EducationWhereInput
    /**
     * Limit how many Educations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Education upsert
   */
  export type EducationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Education
     */
    select?: EducationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Education
     */
    omit?: EducationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationInclude<ExtArgs> | null
    /**
     * The filter to search for the Education to update in case it exists.
     */
    where: EducationWhereUniqueInput
    /**
     * In case the Education found by the `where` argument doesn't exist, create a new Education with this data.
     */
    create: XOR<EducationCreateInput, EducationUncheckedCreateInput>
    /**
     * In case the Education was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EducationUpdateInput, EducationUncheckedUpdateInput>
  }

  /**
   * Education delete
   */
  export type EducationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Education
     */
    select?: EducationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Education
     */
    omit?: EducationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationInclude<ExtArgs> | null
    /**
     * Filter which Education to delete.
     */
    where: EducationWhereUniqueInput
  }

  /**
   * Education deleteMany
   */
  export type EducationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Educations to delete
     */
    where?: EducationWhereInput
    /**
     * Limit how many Educations to delete.
     */
    limit?: number
  }

  /**
   * Education without action
   */
  export type EducationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Education
     */
    select?: EducationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Education
     */
    omit?: EducationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationInclude<ExtArgs> | null
  }


  /**
   * Model Certification
   */

  export type AggregateCertification = {
    _count: CertificationCountAggregateOutputType | null
    _avg: CertificationAvgAggregateOutputType | null
    _sum: CertificationSumAggregateOutputType | null
    _min: CertificationMinAggregateOutputType | null
    _max: CertificationMaxAggregateOutputType | null
  }

  export type CertificationAvgAggregateOutputType = {
    sortOrder: number | null
  }

  export type CertificationSumAggregateOutputType = {
    sortOrder: number | null
  }

  export type CertificationMinAggregateOutputType = {
    id: string | null
    profileId: string | null
    name: string | null
    issuer: string | null
    issueDate: Date | null
    expiryDate: Date | null
    url: string | null
    sortOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CertificationMaxAggregateOutputType = {
    id: string | null
    profileId: string | null
    name: string | null
    issuer: string | null
    issueDate: Date | null
    expiryDate: Date | null
    url: string | null
    sortOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CertificationCountAggregateOutputType = {
    id: number
    profileId: number
    name: number
    issuer: number
    issueDate: number
    expiryDate: number
    url: number
    sortOrder: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CertificationAvgAggregateInputType = {
    sortOrder?: true
  }

  export type CertificationSumAggregateInputType = {
    sortOrder?: true
  }

  export type CertificationMinAggregateInputType = {
    id?: true
    profileId?: true
    name?: true
    issuer?: true
    issueDate?: true
    expiryDate?: true
    url?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CertificationMaxAggregateInputType = {
    id?: true
    profileId?: true
    name?: true
    issuer?: true
    issueDate?: true
    expiryDate?: true
    url?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CertificationCountAggregateInputType = {
    id?: true
    profileId?: true
    name?: true
    issuer?: true
    issueDate?: true
    expiryDate?: true
    url?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CertificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Certification to aggregate.
     */
    where?: CertificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Certifications to fetch.
     */
    orderBy?: CertificationOrderByWithRelationInput | CertificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CertificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Certifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Certifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Certifications
    **/
    _count?: true | CertificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CertificationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CertificationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CertificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CertificationMaxAggregateInputType
  }

  export type GetCertificationAggregateType<T extends CertificationAggregateArgs> = {
        [P in keyof T & keyof AggregateCertification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCertification[P]>
      : GetScalarType<T[P], AggregateCertification[P]>
  }




  export type CertificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CertificationWhereInput
    orderBy?: CertificationOrderByWithAggregationInput | CertificationOrderByWithAggregationInput[]
    by: CertificationScalarFieldEnum[] | CertificationScalarFieldEnum
    having?: CertificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CertificationCountAggregateInputType | true
    _avg?: CertificationAvgAggregateInputType
    _sum?: CertificationSumAggregateInputType
    _min?: CertificationMinAggregateInputType
    _max?: CertificationMaxAggregateInputType
  }

  export type CertificationGroupByOutputType = {
    id: string
    profileId: string
    name: string
    issuer: string
    issueDate: Date | null
    expiryDate: Date | null
    url: string | null
    sortOrder: number
    createdAt: Date
    updatedAt: Date
    _count: CertificationCountAggregateOutputType | null
    _avg: CertificationAvgAggregateOutputType | null
    _sum: CertificationSumAggregateOutputType | null
    _min: CertificationMinAggregateOutputType | null
    _max: CertificationMaxAggregateOutputType | null
  }

  type GetCertificationGroupByPayload<T extends CertificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CertificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CertificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CertificationGroupByOutputType[P]>
            : GetScalarType<T[P], CertificationGroupByOutputType[P]>
        }
      >
    >


  export type CertificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    name?: boolean
    issuer?: boolean
    issueDate?: boolean
    expiryDate?: boolean
    url?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["certification"]>

  export type CertificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    name?: boolean
    issuer?: boolean
    issueDate?: boolean
    expiryDate?: boolean
    url?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["certification"]>

  export type CertificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    name?: boolean
    issuer?: boolean
    issueDate?: boolean
    expiryDate?: boolean
    url?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["certification"]>

  export type CertificationSelectScalar = {
    id?: boolean
    profileId?: boolean
    name?: boolean
    issuer?: boolean
    issueDate?: boolean
    expiryDate?: boolean
    url?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CertificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "profileId" | "name" | "issuer" | "issueDate" | "expiryDate" | "url" | "sortOrder" | "createdAt" | "updatedAt", ExtArgs["result"]["certification"]>
  export type CertificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type CertificationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type CertificationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }

  export type $CertificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Certification"
    objects: {
      profile: Prisma.$ProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      profileId: string
      name: string
      issuer: string
      issueDate: Date | null
      expiryDate: Date | null
      url: string | null
      sortOrder: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["certification"]>
    composites: {}
  }

  type CertificationGetPayload<S extends boolean | null | undefined | CertificationDefaultArgs> = $Result.GetResult<Prisma.$CertificationPayload, S>

  type CertificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CertificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CertificationCountAggregateInputType | true
    }

  export interface CertificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Certification'], meta: { name: 'Certification' } }
    /**
     * Find zero or one Certification that matches the filter.
     * @param {CertificationFindUniqueArgs} args - Arguments to find a Certification
     * @example
     * // Get one Certification
     * const certification = await prisma.certification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CertificationFindUniqueArgs>(args: SelectSubset<T, CertificationFindUniqueArgs<ExtArgs>>): Prisma__CertificationClient<$Result.GetResult<Prisma.$CertificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Certification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CertificationFindUniqueOrThrowArgs} args - Arguments to find a Certification
     * @example
     * // Get one Certification
     * const certification = await prisma.certification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CertificationFindUniqueOrThrowArgs>(args: SelectSubset<T, CertificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CertificationClient<$Result.GetResult<Prisma.$CertificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Certification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CertificationFindFirstArgs} args - Arguments to find a Certification
     * @example
     * // Get one Certification
     * const certification = await prisma.certification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CertificationFindFirstArgs>(args?: SelectSubset<T, CertificationFindFirstArgs<ExtArgs>>): Prisma__CertificationClient<$Result.GetResult<Prisma.$CertificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Certification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CertificationFindFirstOrThrowArgs} args - Arguments to find a Certification
     * @example
     * // Get one Certification
     * const certification = await prisma.certification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CertificationFindFirstOrThrowArgs>(args?: SelectSubset<T, CertificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__CertificationClient<$Result.GetResult<Prisma.$CertificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Certifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CertificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Certifications
     * const certifications = await prisma.certification.findMany()
     * 
     * // Get first 10 Certifications
     * const certifications = await prisma.certification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const certificationWithIdOnly = await prisma.certification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CertificationFindManyArgs>(args?: SelectSubset<T, CertificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CertificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Certification.
     * @param {CertificationCreateArgs} args - Arguments to create a Certification.
     * @example
     * // Create one Certification
     * const Certification = await prisma.certification.create({
     *   data: {
     *     // ... data to create a Certification
     *   }
     * })
     * 
     */
    create<T extends CertificationCreateArgs>(args: SelectSubset<T, CertificationCreateArgs<ExtArgs>>): Prisma__CertificationClient<$Result.GetResult<Prisma.$CertificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Certifications.
     * @param {CertificationCreateManyArgs} args - Arguments to create many Certifications.
     * @example
     * // Create many Certifications
     * const certification = await prisma.certification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CertificationCreateManyArgs>(args?: SelectSubset<T, CertificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Certifications and returns the data saved in the database.
     * @param {CertificationCreateManyAndReturnArgs} args - Arguments to create many Certifications.
     * @example
     * // Create many Certifications
     * const certification = await prisma.certification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Certifications and only return the `id`
     * const certificationWithIdOnly = await prisma.certification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CertificationCreateManyAndReturnArgs>(args?: SelectSubset<T, CertificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CertificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Certification.
     * @param {CertificationDeleteArgs} args - Arguments to delete one Certification.
     * @example
     * // Delete one Certification
     * const Certification = await prisma.certification.delete({
     *   where: {
     *     // ... filter to delete one Certification
     *   }
     * })
     * 
     */
    delete<T extends CertificationDeleteArgs>(args: SelectSubset<T, CertificationDeleteArgs<ExtArgs>>): Prisma__CertificationClient<$Result.GetResult<Prisma.$CertificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Certification.
     * @param {CertificationUpdateArgs} args - Arguments to update one Certification.
     * @example
     * // Update one Certification
     * const certification = await prisma.certification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CertificationUpdateArgs>(args: SelectSubset<T, CertificationUpdateArgs<ExtArgs>>): Prisma__CertificationClient<$Result.GetResult<Prisma.$CertificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Certifications.
     * @param {CertificationDeleteManyArgs} args - Arguments to filter Certifications to delete.
     * @example
     * // Delete a few Certifications
     * const { count } = await prisma.certification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CertificationDeleteManyArgs>(args?: SelectSubset<T, CertificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Certifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CertificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Certifications
     * const certification = await prisma.certification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CertificationUpdateManyArgs>(args: SelectSubset<T, CertificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Certifications and returns the data updated in the database.
     * @param {CertificationUpdateManyAndReturnArgs} args - Arguments to update many Certifications.
     * @example
     * // Update many Certifications
     * const certification = await prisma.certification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Certifications and only return the `id`
     * const certificationWithIdOnly = await prisma.certification.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CertificationUpdateManyAndReturnArgs>(args: SelectSubset<T, CertificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CertificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Certification.
     * @param {CertificationUpsertArgs} args - Arguments to update or create a Certification.
     * @example
     * // Update or create a Certification
     * const certification = await prisma.certification.upsert({
     *   create: {
     *     // ... data to create a Certification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Certification we want to update
     *   }
     * })
     */
    upsert<T extends CertificationUpsertArgs>(args: SelectSubset<T, CertificationUpsertArgs<ExtArgs>>): Prisma__CertificationClient<$Result.GetResult<Prisma.$CertificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Certifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CertificationCountArgs} args - Arguments to filter Certifications to count.
     * @example
     * // Count the number of Certifications
     * const count = await prisma.certification.count({
     *   where: {
     *     // ... the filter for the Certifications we want to count
     *   }
     * })
    **/
    count<T extends CertificationCountArgs>(
      args?: Subset<T, CertificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CertificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Certification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CertificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CertificationAggregateArgs>(args: Subset<T, CertificationAggregateArgs>): Prisma.PrismaPromise<GetCertificationAggregateType<T>>

    /**
     * Group by Certification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CertificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CertificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CertificationGroupByArgs['orderBy'] }
        : { orderBy?: CertificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CertificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCertificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Certification model
   */
  readonly fields: CertificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Certification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CertificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    profile<T extends ProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProfileDefaultArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Certification model
   */
  interface CertificationFieldRefs {
    readonly id: FieldRef<"Certification", 'String'>
    readonly profileId: FieldRef<"Certification", 'String'>
    readonly name: FieldRef<"Certification", 'String'>
    readonly issuer: FieldRef<"Certification", 'String'>
    readonly issueDate: FieldRef<"Certification", 'DateTime'>
    readonly expiryDate: FieldRef<"Certification", 'DateTime'>
    readonly url: FieldRef<"Certification", 'String'>
    readonly sortOrder: FieldRef<"Certification", 'Int'>
    readonly createdAt: FieldRef<"Certification", 'DateTime'>
    readonly updatedAt: FieldRef<"Certification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Certification findUnique
   */
  export type CertificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certification
     */
    select?: CertificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certification
     */
    omit?: CertificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CertificationInclude<ExtArgs> | null
    /**
     * Filter, which Certification to fetch.
     */
    where: CertificationWhereUniqueInput
  }

  /**
   * Certification findUniqueOrThrow
   */
  export type CertificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certification
     */
    select?: CertificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certification
     */
    omit?: CertificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CertificationInclude<ExtArgs> | null
    /**
     * Filter, which Certification to fetch.
     */
    where: CertificationWhereUniqueInput
  }

  /**
   * Certification findFirst
   */
  export type CertificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certification
     */
    select?: CertificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certification
     */
    omit?: CertificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CertificationInclude<ExtArgs> | null
    /**
     * Filter, which Certification to fetch.
     */
    where?: CertificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Certifications to fetch.
     */
    orderBy?: CertificationOrderByWithRelationInput | CertificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Certifications.
     */
    cursor?: CertificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Certifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Certifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Certifications.
     */
    distinct?: CertificationScalarFieldEnum | CertificationScalarFieldEnum[]
  }

  /**
   * Certification findFirstOrThrow
   */
  export type CertificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certification
     */
    select?: CertificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certification
     */
    omit?: CertificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CertificationInclude<ExtArgs> | null
    /**
     * Filter, which Certification to fetch.
     */
    where?: CertificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Certifications to fetch.
     */
    orderBy?: CertificationOrderByWithRelationInput | CertificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Certifications.
     */
    cursor?: CertificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Certifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Certifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Certifications.
     */
    distinct?: CertificationScalarFieldEnum | CertificationScalarFieldEnum[]
  }

  /**
   * Certification findMany
   */
  export type CertificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certification
     */
    select?: CertificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certification
     */
    omit?: CertificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CertificationInclude<ExtArgs> | null
    /**
     * Filter, which Certifications to fetch.
     */
    where?: CertificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Certifications to fetch.
     */
    orderBy?: CertificationOrderByWithRelationInput | CertificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Certifications.
     */
    cursor?: CertificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Certifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Certifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Certifications.
     */
    distinct?: CertificationScalarFieldEnum | CertificationScalarFieldEnum[]
  }

  /**
   * Certification create
   */
  export type CertificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certification
     */
    select?: CertificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certification
     */
    omit?: CertificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CertificationInclude<ExtArgs> | null
    /**
     * The data needed to create a Certification.
     */
    data: XOR<CertificationCreateInput, CertificationUncheckedCreateInput>
  }

  /**
   * Certification createMany
   */
  export type CertificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Certifications.
     */
    data: CertificationCreateManyInput | CertificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Certification createManyAndReturn
   */
  export type CertificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certification
     */
    select?: CertificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Certification
     */
    omit?: CertificationOmit<ExtArgs> | null
    /**
     * The data used to create many Certifications.
     */
    data: CertificationCreateManyInput | CertificationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CertificationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Certification update
   */
  export type CertificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certification
     */
    select?: CertificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certification
     */
    omit?: CertificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CertificationInclude<ExtArgs> | null
    /**
     * The data needed to update a Certification.
     */
    data: XOR<CertificationUpdateInput, CertificationUncheckedUpdateInput>
    /**
     * Choose, which Certification to update.
     */
    where: CertificationWhereUniqueInput
  }

  /**
   * Certification updateMany
   */
  export type CertificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Certifications.
     */
    data: XOR<CertificationUpdateManyMutationInput, CertificationUncheckedUpdateManyInput>
    /**
     * Filter which Certifications to update
     */
    where?: CertificationWhereInput
    /**
     * Limit how many Certifications to update.
     */
    limit?: number
  }

  /**
   * Certification updateManyAndReturn
   */
  export type CertificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certification
     */
    select?: CertificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Certification
     */
    omit?: CertificationOmit<ExtArgs> | null
    /**
     * The data used to update Certifications.
     */
    data: XOR<CertificationUpdateManyMutationInput, CertificationUncheckedUpdateManyInput>
    /**
     * Filter which Certifications to update
     */
    where?: CertificationWhereInput
    /**
     * Limit how many Certifications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CertificationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Certification upsert
   */
  export type CertificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certification
     */
    select?: CertificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certification
     */
    omit?: CertificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CertificationInclude<ExtArgs> | null
    /**
     * The filter to search for the Certification to update in case it exists.
     */
    where: CertificationWhereUniqueInput
    /**
     * In case the Certification found by the `where` argument doesn't exist, create a new Certification with this data.
     */
    create: XOR<CertificationCreateInput, CertificationUncheckedCreateInput>
    /**
     * In case the Certification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CertificationUpdateInput, CertificationUncheckedUpdateInput>
  }

  /**
   * Certification delete
   */
  export type CertificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certification
     */
    select?: CertificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certification
     */
    omit?: CertificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CertificationInclude<ExtArgs> | null
    /**
     * Filter which Certification to delete.
     */
    where: CertificationWhereUniqueInput
  }

  /**
   * Certification deleteMany
   */
  export type CertificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Certifications to delete
     */
    where?: CertificationWhereInput
    /**
     * Limit how many Certifications to delete.
     */
    limit?: number
  }

  /**
   * Certification without action
   */
  export type CertificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Certification
     */
    select?: CertificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Certification
     */
    omit?: CertificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CertificationInclude<ExtArgs> | null
  }


  /**
   * Model Language
   */

  export type AggregateLanguage = {
    _count: LanguageCountAggregateOutputType | null
    _avg: LanguageAvgAggregateOutputType | null
    _sum: LanguageSumAggregateOutputType | null
    _min: LanguageMinAggregateOutputType | null
    _max: LanguageMaxAggregateOutputType | null
  }

  export type LanguageAvgAggregateOutputType = {
    sortOrder: number | null
  }

  export type LanguageSumAggregateOutputType = {
    sortOrder: number | null
  }

  export type LanguageMinAggregateOutputType = {
    id: string | null
    profileId: string | null
    name: string | null
    proficiency: string | null
    sortOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LanguageMaxAggregateOutputType = {
    id: string | null
    profileId: string | null
    name: string | null
    proficiency: string | null
    sortOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LanguageCountAggregateOutputType = {
    id: number
    profileId: number
    name: number
    proficiency: number
    sortOrder: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LanguageAvgAggregateInputType = {
    sortOrder?: true
  }

  export type LanguageSumAggregateInputType = {
    sortOrder?: true
  }

  export type LanguageMinAggregateInputType = {
    id?: true
    profileId?: true
    name?: true
    proficiency?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LanguageMaxAggregateInputType = {
    id?: true
    profileId?: true
    name?: true
    proficiency?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LanguageCountAggregateInputType = {
    id?: true
    profileId?: true
    name?: true
    proficiency?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LanguageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Language to aggregate.
     */
    where?: LanguageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Languages to fetch.
     */
    orderBy?: LanguageOrderByWithRelationInput | LanguageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LanguageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Languages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Languages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Languages
    **/
    _count?: true | LanguageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LanguageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LanguageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LanguageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LanguageMaxAggregateInputType
  }

  export type GetLanguageAggregateType<T extends LanguageAggregateArgs> = {
        [P in keyof T & keyof AggregateLanguage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLanguage[P]>
      : GetScalarType<T[P], AggregateLanguage[P]>
  }




  export type LanguageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LanguageWhereInput
    orderBy?: LanguageOrderByWithAggregationInput | LanguageOrderByWithAggregationInput[]
    by: LanguageScalarFieldEnum[] | LanguageScalarFieldEnum
    having?: LanguageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LanguageCountAggregateInputType | true
    _avg?: LanguageAvgAggregateInputType
    _sum?: LanguageSumAggregateInputType
    _min?: LanguageMinAggregateInputType
    _max?: LanguageMaxAggregateInputType
  }

  export type LanguageGroupByOutputType = {
    id: string
    profileId: string
    name: string
    proficiency: string
    sortOrder: number
    createdAt: Date
    updatedAt: Date
    _count: LanguageCountAggregateOutputType | null
    _avg: LanguageAvgAggregateOutputType | null
    _sum: LanguageSumAggregateOutputType | null
    _min: LanguageMinAggregateOutputType | null
    _max: LanguageMaxAggregateOutputType | null
  }

  type GetLanguageGroupByPayload<T extends LanguageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LanguageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LanguageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LanguageGroupByOutputType[P]>
            : GetScalarType<T[P], LanguageGroupByOutputType[P]>
        }
      >
    >


  export type LanguageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    name?: boolean
    proficiency?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["language"]>

  export type LanguageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    name?: boolean
    proficiency?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["language"]>

  export type LanguageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    name?: boolean
    proficiency?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["language"]>

  export type LanguageSelectScalar = {
    id?: boolean
    profileId?: boolean
    name?: boolean
    proficiency?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LanguageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "profileId" | "name" | "proficiency" | "sortOrder" | "createdAt" | "updatedAt", ExtArgs["result"]["language"]>
  export type LanguageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type LanguageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type LanguageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }

  export type $LanguagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Language"
    objects: {
      profile: Prisma.$ProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      profileId: string
      name: string
      proficiency: string
      sortOrder: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["language"]>
    composites: {}
  }

  type LanguageGetPayload<S extends boolean | null | undefined | LanguageDefaultArgs> = $Result.GetResult<Prisma.$LanguagePayload, S>

  type LanguageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LanguageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LanguageCountAggregateInputType | true
    }

  export interface LanguageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Language'], meta: { name: 'Language' } }
    /**
     * Find zero or one Language that matches the filter.
     * @param {LanguageFindUniqueArgs} args - Arguments to find a Language
     * @example
     * // Get one Language
     * const language = await prisma.language.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LanguageFindUniqueArgs>(args: SelectSubset<T, LanguageFindUniqueArgs<ExtArgs>>): Prisma__LanguageClient<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Language that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LanguageFindUniqueOrThrowArgs} args - Arguments to find a Language
     * @example
     * // Get one Language
     * const language = await prisma.language.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LanguageFindUniqueOrThrowArgs>(args: SelectSubset<T, LanguageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LanguageClient<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Language that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LanguageFindFirstArgs} args - Arguments to find a Language
     * @example
     * // Get one Language
     * const language = await prisma.language.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LanguageFindFirstArgs>(args?: SelectSubset<T, LanguageFindFirstArgs<ExtArgs>>): Prisma__LanguageClient<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Language that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LanguageFindFirstOrThrowArgs} args - Arguments to find a Language
     * @example
     * // Get one Language
     * const language = await prisma.language.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LanguageFindFirstOrThrowArgs>(args?: SelectSubset<T, LanguageFindFirstOrThrowArgs<ExtArgs>>): Prisma__LanguageClient<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Languages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LanguageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Languages
     * const languages = await prisma.language.findMany()
     * 
     * // Get first 10 Languages
     * const languages = await prisma.language.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const languageWithIdOnly = await prisma.language.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LanguageFindManyArgs>(args?: SelectSubset<T, LanguageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Language.
     * @param {LanguageCreateArgs} args - Arguments to create a Language.
     * @example
     * // Create one Language
     * const Language = await prisma.language.create({
     *   data: {
     *     // ... data to create a Language
     *   }
     * })
     * 
     */
    create<T extends LanguageCreateArgs>(args: SelectSubset<T, LanguageCreateArgs<ExtArgs>>): Prisma__LanguageClient<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Languages.
     * @param {LanguageCreateManyArgs} args - Arguments to create many Languages.
     * @example
     * // Create many Languages
     * const language = await prisma.language.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LanguageCreateManyArgs>(args?: SelectSubset<T, LanguageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Languages and returns the data saved in the database.
     * @param {LanguageCreateManyAndReturnArgs} args - Arguments to create many Languages.
     * @example
     * // Create many Languages
     * const language = await prisma.language.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Languages and only return the `id`
     * const languageWithIdOnly = await prisma.language.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LanguageCreateManyAndReturnArgs>(args?: SelectSubset<T, LanguageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Language.
     * @param {LanguageDeleteArgs} args - Arguments to delete one Language.
     * @example
     * // Delete one Language
     * const Language = await prisma.language.delete({
     *   where: {
     *     // ... filter to delete one Language
     *   }
     * })
     * 
     */
    delete<T extends LanguageDeleteArgs>(args: SelectSubset<T, LanguageDeleteArgs<ExtArgs>>): Prisma__LanguageClient<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Language.
     * @param {LanguageUpdateArgs} args - Arguments to update one Language.
     * @example
     * // Update one Language
     * const language = await prisma.language.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LanguageUpdateArgs>(args: SelectSubset<T, LanguageUpdateArgs<ExtArgs>>): Prisma__LanguageClient<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Languages.
     * @param {LanguageDeleteManyArgs} args - Arguments to filter Languages to delete.
     * @example
     * // Delete a few Languages
     * const { count } = await prisma.language.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LanguageDeleteManyArgs>(args?: SelectSubset<T, LanguageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Languages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LanguageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Languages
     * const language = await prisma.language.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LanguageUpdateManyArgs>(args: SelectSubset<T, LanguageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Languages and returns the data updated in the database.
     * @param {LanguageUpdateManyAndReturnArgs} args - Arguments to update many Languages.
     * @example
     * // Update many Languages
     * const language = await prisma.language.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Languages and only return the `id`
     * const languageWithIdOnly = await prisma.language.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LanguageUpdateManyAndReturnArgs>(args: SelectSubset<T, LanguageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Language.
     * @param {LanguageUpsertArgs} args - Arguments to update or create a Language.
     * @example
     * // Update or create a Language
     * const language = await prisma.language.upsert({
     *   create: {
     *     // ... data to create a Language
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Language we want to update
     *   }
     * })
     */
    upsert<T extends LanguageUpsertArgs>(args: SelectSubset<T, LanguageUpsertArgs<ExtArgs>>): Prisma__LanguageClient<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Languages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LanguageCountArgs} args - Arguments to filter Languages to count.
     * @example
     * // Count the number of Languages
     * const count = await prisma.language.count({
     *   where: {
     *     // ... the filter for the Languages we want to count
     *   }
     * })
    **/
    count<T extends LanguageCountArgs>(
      args?: Subset<T, LanguageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LanguageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Language.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LanguageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LanguageAggregateArgs>(args: Subset<T, LanguageAggregateArgs>): Prisma.PrismaPromise<GetLanguageAggregateType<T>>

    /**
     * Group by Language.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LanguageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LanguageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LanguageGroupByArgs['orderBy'] }
        : { orderBy?: LanguageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LanguageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLanguageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Language model
   */
  readonly fields: LanguageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Language.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LanguageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    profile<T extends ProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProfileDefaultArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Language model
   */
  interface LanguageFieldRefs {
    readonly id: FieldRef<"Language", 'String'>
    readonly profileId: FieldRef<"Language", 'String'>
    readonly name: FieldRef<"Language", 'String'>
    readonly proficiency: FieldRef<"Language", 'String'>
    readonly sortOrder: FieldRef<"Language", 'Int'>
    readonly createdAt: FieldRef<"Language", 'DateTime'>
    readonly updatedAt: FieldRef<"Language", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Language findUnique
   */
  export type LanguageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Language
     */
    omit?: LanguageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageInclude<ExtArgs> | null
    /**
     * Filter, which Language to fetch.
     */
    where: LanguageWhereUniqueInput
  }

  /**
   * Language findUniqueOrThrow
   */
  export type LanguageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Language
     */
    omit?: LanguageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageInclude<ExtArgs> | null
    /**
     * Filter, which Language to fetch.
     */
    where: LanguageWhereUniqueInput
  }

  /**
   * Language findFirst
   */
  export type LanguageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Language
     */
    omit?: LanguageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageInclude<ExtArgs> | null
    /**
     * Filter, which Language to fetch.
     */
    where?: LanguageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Languages to fetch.
     */
    orderBy?: LanguageOrderByWithRelationInput | LanguageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Languages.
     */
    cursor?: LanguageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Languages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Languages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Languages.
     */
    distinct?: LanguageScalarFieldEnum | LanguageScalarFieldEnum[]
  }

  /**
   * Language findFirstOrThrow
   */
  export type LanguageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Language
     */
    omit?: LanguageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageInclude<ExtArgs> | null
    /**
     * Filter, which Language to fetch.
     */
    where?: LanguageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Languages to fetch.
     */
    orderBy?: LanguageOrderByWithRelationInput | LanguageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Languages.
     */
    cursor?: LanguageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Languages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Languages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Languages.
     */
    distinct?: LanguageScalarFieldEnum | LanguageScalarFieldEnum[]
  }

  /**
   * Language findMany
   */
  export type LanguageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Language
     */
    omit?: LanguageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageInclude<ExtArgs> | null
    /**
     * Filter, which Languages to fetch.
     */
    where?: LanguageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Languages to fetch.
     */
    orderBy?: LanguageOrderByWithRelationInput | LanguageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Languages.
     */
    cursor?: LanguageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Languages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Languages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Languages.
     */
    distinct?: LanguageScalarFieldEnum | LanguageScalarFieldEnum[]
  }

  /**
   * Language create
   */
  export type LanguageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Language
     */
    omit?: LanguageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageInclude<ExtArgs> | null
    /**
     * The data needed to create a Language.
     */
    data: XOR<LanguageCreateInput, LanguageUncheckedCreateInput>
  }

  /**
   * Language createMany
   */
  export type LanguageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Languages.
     */
    data: LanguageCreateManyInput | LanguageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Language createManyAndReturn
   */
  export type LanguageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Language
     */
    omit?: LanguageOmit<ExtArgs> | null
    /**
     * The data used to create many Languages.
     */
    data: LanguageCreateManyInput | LanguageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Language update
   */
  export type LanguageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Language
     */
    omit?: LanguageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageInclude<ExtArgs> | null
    /**
     * The data needed to update a Language.
     */
    data: XOR<LanguageUpdateInput, LanguageUncheckedUpdateInput>
    /**
     * Choose, which Language to update.
     */
    where: LanguageWhereUniqueInput
  }

  /**
   * Language updateMany
   */
  export type LanguageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Languages.
     */
    data: XOR<LanguageUpdateManyMutationInput, LanguageUncheckedUpdateManyInput>
    /**
     * Filter which Languages to update
     */
    where?: LanguageWhereInput
    /**
     * Limit how many Languages to update.
     */
    limit?: number
  }

  /**
   * Language updateManyAndReturn
   */
  export type LanguageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Language
     */
    omit?: LanguageOmit<ExtArgs> | null
    /**
     * The data used to update Languages.
     */
    data: XOR<LanguageUpdateManyMutationInput, LanguageUncheckedUpdateManyInput>
    /**
     * Filter which Languages to update
     */
    where?: LanguageWhereInput
    /**
     * Limit how many Languages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Language upsert
   */
  export type LanguageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Language
     */
    omit?: LanguageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageInclude<ExtArgs> | null
    /**
     * The filter to search for the Language to update in case it exists.
     */
    where: LanguageWhereUniqueInput
    /**
     * In case the Language found by the `where` argument doesn't exist, create a new Language with this data.
     */
    create: XOR<LanguageCreateInput, LanguageUncheckedCreateInput>
    /**
     * In case the Language was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LanguageUpdateInput, LanguageUncheckedUpdateInput>
  }

  /**
   * Language delete
   */
  export type LanguageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Language
     */
    omit?: LanguageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageInclude<ExtArgs> | null
    /**
     * Filter which Language to delete.
     */
    where: LanguageWhereUniqueInput
  }

  /**
   * Language deleteMany
   */
  export type LanguageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Languages to delete
     */
    where?: LanguageWhereInput
    /**
     * Limit how many Languages to delete.
     */
    limit?: number
  }

  /**
   * Language without action
   */
  export type LanguageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Language
     */
    omit?: LanguageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageInclude<ExtArgs> | null
  }


  /**
   * Model Award
   */

  export type AggregateAward = {
    _count: AwardCountAggregateOutputType | null
    _avg: AwardAvgAggregateOutputType | null
    _sum: AwardSumAggregateOutputType | null
    _min: AwardMinAggregateOutputType | null
    _max: AwardMaxAggregateOutputType | null
  }

  export type AwardAvgAggregateOutputType = {
    sortOrder: number | null
  }

  export type AwardSumAggregateOutputType = {
    sortOrder: number | null
  }

  export type AwardMinAggregateOutputType = {
    id: string | null
    profileId: string | null
    title: string | null
    issuer: string | null
    date: Date | null
    description: string | null
    sortOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AwardMaxAggregateOutputType = {
    id: string | null
    profileId: string | null
    title: string | null
    issuer: string | null
    date: Date | null
    description: string | null
    sortOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AwardCountAggregateOutputType = {
    id: number
    profileId: number
    title: number
    issuer: number
    date: number
    description: number
    sortOrder: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AwardAvgAggregateInputType = {
    sortOrder?: true
  }

  export type AwardSumAggregateInputType = {
    sortOrder?: true
  }

  export type AwardMinAggregateInputType = {
    id?: true
    profileId?: true
    title?: true
    issuer?: true
    date?: true
    description?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AwardMaxAggregateInputType = {
    id?: true
    profileId?: true
    title?: true
    issuer?: true
    date?: true
    description?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AwardCountAggregateInputType = {
    id?: true
    profileId?: true
    title?: true
    issuer?: true
    date?: true
    description?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AwardAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Award to aggregate.
     */
    where?: AwardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Awards to fetch.
     */
    orderBy?: AwardOrderByWithRelationInput | AwardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AwardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Awards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Awards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Awards
    **/
    _count?: true | AwardCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AwardAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AwardSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AwardMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AwardMaxAggregateInputType
  }

  export type GetAwardAggregateType<T extends AwardAggregateArgs> = {
        [P in keyof T & keyof AggregateAward]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAward[P]>
      : GetScalarType<T[P], AggregateAward[P]>
  }




  export type AwardGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AwardWhereInput
    orderBy?: AwardOrderByWithAggregationInput | AwardOrderByWithAggregationInput[]
    by: AwardScalarFieldEnum[] | AwardScalarFieldEnum
    having?: AwardScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AwardCountAggregateInputType | true
    _avg?: AwardAvgAggregateInputType
    _sum?: AwardSumAggregateInputType
    _min?: AwardMinAggregateInputType
    _max?: AwardMaxAggregateInputType
  }

  export type AwardGroupByOutputType = {
    id: string
    profileId: string
    title: string
    issuer: string | null
    date: Date | null
    description: string | null
    sortOrder: number
    createdAt: Date
    updatedAt: Date
    _count: AwardCountAggregateOutputType | null
    _avg: AwardAvgAggregateOutputType | null
    _sum: AwardSumAggregateOutputType | null
    _min: AwardMinAggregateOutputType | null
    _max: AwardMaxAggregateOutputType | null
  }

  type GetAwardGroupByPayload<T extends AwardGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AwardGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AwardGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AwardGroupByOutputType[P]>
            : GetScalarType<T[P], AwardGroupByOutputType[P]>
        }
      >
    >


  export type AwardSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    title?: boolean
    issuer?: boolean
    date?: boolean
    description?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["award"]>

  export type AwardSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    title?: boolean
    issuer?: boolean
    date?: boolean
    description?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["award"]>

  export type AwardSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    title?: boolean
    issuer?: boolean
    date?: boolean
    description?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["award"]>

  export type AwardSelectScalar = {
    id?: boolean
    profileId?: boolean
    title?: boolean
    issuer?: boolean
    date?: boolean
    description?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AwardOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "profileId" | "title" | "issuer" | "date" | "description" | "sortOrder" | "createdAt" | "updatedAt", ExtArgs["result"]["award"]>
  export type AwardInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type AwardIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type AwardIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }

  export type $AwardPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Award"
    objects: {
      profile: Prisma.$ProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      profileId: string
      title: string
      issuer: string | null
      date: Date | null
      description: string | null
      sortOrder: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["award"]>
    composites: {}
  }

  type AwardGetPayload<S extends boolean | null | undefined | AwardDefaultArgs> = $Result.GetResult<Prisma.$AwardPayload, S>

  type AwardCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AwardFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AwardCountAggregateInputType | true
    }

  export interface AwardDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Award'], meta: { name: 'Award' } }
    /**
     * Find zero or one Award that matches the filter.
     * @param {AwardFindUniqueArgs} args - Arguments to find a Award
     * @example
     * // Get one Award
     * const award = await prisma.award.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AwardFindUniqueArgs>(args: SelectSubset<T, AwardFindUniqueArgs<ExtArgs>>): Prisma__AwardClient<$Result.GetResult<Prisma.$AwardPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Award that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AwardFindUniqueOrThrowArgs} args - Arguments to find a Award
     * @example
     * // Get one Award
     * const award = await prisma.award.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AwardFindUniqueOrThrowArgs>(args: SelectSubset<T, AwardFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AwardClient<$Result.GetResult<Prisma.$AwardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Award that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AwardFindFirstArgs} args - Arguments to find a Award
     * @example
     * // Get one Award
     * const award = await prisma.award.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AwardFindFirstArgs>(args?: SelectSubset<T, AwardFindFirstArgs<ExtArgs>>): Prisma__AwardClient<$Result.GetResult<Prisma.$AwardPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Award that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AwardFindFirstOrThrowArgs} args - Arguments to find a Award
     * @example
     * // Get one Award
     * const award = await prisma.award.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AwardFindFirstOrThrowArgs>(args?: SelectSubset<T, AwardFindFirstOrThrowArgs<ExtArgs>>): Prisma__AwardClient<$Result.GetResult<Prisma.$AwardPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Awards that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AwardFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Awards
     * const awards = await prisma.award.findMany()
     * 
     * // Get first 10 Awards
     * const awards = await prisma.award.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const awardWithIdOnly = await prisma.award.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AwardFindManyArgs>(args?: SelectSubset<T, AwardFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AwardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Award.
     * @param {AwardCreateArgs} args - Arguments to create a Award.
     * @example
     * // Create one Award
     * const Award = await prisma.award.create({
     *   data: {
     *     // ... data to create a Award
     *   }
     * })
     * 
     */
    create<T extends AwardCreateArgs>(args: SelectSubset<T, AwardCreateArgs<ExtArgs>>): Prisma__AwardClient<$Result.GetResult<Prisma.$AwardPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Awards.
     * @param {AwardCreateManyArgs} args - Arguments to create many Awards.
     * @example
     * // Create many Awards
     * const award = await prisma.award.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AwardCreateManyArgs>(args?: SelectSubset<T, AwardCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Awards and returns the data saved in the database.
     * @param {AwardCreateManyAndReturnArgs} args - Arguments to create many Awards.
     * @example
     * // Create many Awards
     * const award = await prisma.award.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Awards and only return the `id`
     * const awardWithIdOnly = await prisma.award.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AwardCreateManyAndReturnArgs>(args?: SelectSubset<T, AwardCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AwardPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Award.
     * @param {AwardDeleteArgs} args - Arguments to delete one Award.
     * @example
     * // Delete one Award
     * const Award = await prisma.award.delete({
     *   where: {
     *     // ... filter to delete one Award
     *   }
     * })
     * 
     */
    delete<T extends AwardDeleteArgs>(args: SelectSubset<T, AwardDeleteArgs<ExtArgs>>): Prisma__AwardClient<$Result.GetResult<Prisma.$AwardPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Award.
     * @param {AwardUpdateArgs} args - Arguments to update one Award.
     * @example
     * // Update one Award
     * const award = await prisma.award.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AwardUpdateArgs>(args: SelectSubset<T, AwardUpdateArgs<ExtArgs>>): Prisma__AwardClient<$Result.GetResult<Prisma.$AwardPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Awards.
     * @param {AwardDeleteManyArgs} args - Arguments to filter Awards to delete.
     * @example
     * // Delete a few Awards
     * const { count } = await prisma.award.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AwardDeleteManyArgs>(args?: SelectSubset<T, AwardDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Awards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AwardUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Awards
     * const award = await prisma.award.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AwardUpdateManyArgs>(args: SelectSubset<T, AwardUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Awards and returns the data updated in the database.
     * @param {AwardUpdateManyAndReturnArgs} args - Arguments to update many Awards.
     * @example
     * // Update many Awards
     * const award = await prisma.award.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Awards and only return the `id`
     * const awardWithIdOnly = await prisma.award.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AwardUpdateManyAndReturnArgs>(args: SelectSubset<T, AwardUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AwardPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Award.
     * @param {AwardUpsertArgs} args - Arguments to update or create a Award.
     * @example
     * // Update or create a Award
     * const award = await prisma.award.upsert({
     *   create: {
     *     // ... data to create a Award
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Award we want to update
     *   }
     * })
     */
    upsert<T extends AwardUpsertArgs>(args: SelectSubset<T, AwardUpsertArgs<ExtArgs>>): Prisma__AwardClient<$Result.GetResult<Prisma.$AwardPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Awards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AwardCountArgs} args - Arguments to filter Awards to count.
     * @example
     * // Count the number of Awards
     * const count = await prisma.award.count({
     *   where: {
     *     // ... the filter for the Awards we want to count
     *   }
     * })
    **/
    count<T extends AwardCountArgs>(
      args?: Subset<T, AwardCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AwardCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Award.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AwardAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AwardAggregateArgs>(args: Subset<T, AwardAggregateArgs>): Prisma.PrismaPromise<GetAwardAggregateType<T>>

    /**
     * Group by Award.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AwardGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AwardGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AwardGroupByArgs['orderBy'] }
        : { orderBy?: AwardGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AwardGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAwardGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Award model
   */
  readonly fields: AwardFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Award.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AwardClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    profile<T extends ProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProfileDefaultArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Award model
   */
  interface AwardFieldRefs {
    readonly id: FieldRef<"Award", 'String'>
    readonly profileId: FieldRef<"Award", 'String'>
    readonly title: FieldRef<"Award", 'String'>
    readonly issuer: FieldRef<"Award", 'String'>
    readonly date: FieldRef<"Award", 'DateTime'>
    readonly description: FieldRef<"Award", 'String'>
    readonly sortOrder: FieldRef<"Award", 'Int'>
    readonly createdAt: FieldRef<"Award", 'DateTime'>
    readonly updatedAt: FieldRef<"Award", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Award findUnique
   */
  export type AwardFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Award
     */
    select?: AwardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Award
     */
    omit?: AwardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwardInclude<ExtArgs> | null
    /**
     * Filter, which Award to fetch.
     */
    where: AwardWhereUniqueInput
  }

  /**
   * Award findUniqueOrThrow
   */
  export type AwardFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Award
     */
    select?: AwardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Award
     */
    omit?: AwardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwardInclude<ExtArgs> | null
    /**
     * Filter, which Award to fetch.
     */
    where: AwardWhereUniqueInput
  }

  /**
   * Award findFirst
   */
  export type AwardFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Award
     */
    select?: AwardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Award
     */
    omit?: AwardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwardInclude<ExtArgs> | null
    /**
     * Filter, which Award to fetch.
     */
    where?: AwardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Awards to fetch.
     */
    orderBy?: AwardOrderByWithRelationInput | AwardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Awards.
     */
    cursor?: AwardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Awards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Awards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Awards.
     */
    distinct?: AwardScalarFieldEnum | AwardScalarFieldEnum[]
  }

  /**
   * Award findFirstOrThrow
   */
  export type AwardFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Award
     */
    select?: AwardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Award
     */
    omit?: AwardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwardInclude<ExtArgs> | null
    /**
     * Filter, which Award to fetch.
     */
    where?: AwardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Awards to fetch.
     */
    orderBy?: AwardOrderByWithRelationInput | AwardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Awards.
     */
    cursor?: AwardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Awards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Awards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Awards.
     */
    distinct?: AwardScalarFieldEnum | AwardScalarFieldEnum[]
  }

  /**
   * Award findMany
   */
  export type AwardFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Award
     */
    select?: AwardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Award
     */
    omit?: AwardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwardInclude<ExtArgs> | null
    /**
     * Filter, which Awards to fetch.
     */
    where?: AwardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Awards to fetch.
     */
    orderBy?: AwardOrderByWithRelationInput | AwardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Awards.
     */
    cursor?: AwardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Awards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Awards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Awards.
     */
    distinct?: AwardScalarFieldEnum | AwardScalarFieldEnum[]
  }

  /**
   * Award create
   */
  export type AwardCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Award
     */
    select?: AwardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Award
     */
    omit?: AwardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwardInclude<ExtArgs> | null
    /**
     * The data needed to create a Award.
     */
    data: XOR<AwardCreateInput, AwardUncheckedCreateInput>
  }

  /**
   * Award createMany
   */
  export type AwardCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Awards.
     */
    data: AwardCreateManyInput | AwardCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Award createManyAndReturn
   */
  export type AwardCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Award
     */
    select?: AwardSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Award
     */
    omit?: AwardOmit<ExtArgs> | null
    /**
     * The data used to create many Awards.
     */
    data: AwardCreateManyInput | AwardCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwardIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Award update
   */
  export type AwardUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Award
     */
    select?: AwardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Award
     */
    omit?: AwardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwardInclude<ExtArgs> | null
    /**
     * The data needed to update a Award.
     */
    data: XOR<AwardUpdateInput, AwardUncheckedUpdateInput>
    /**
     * Choose, which Award to update.
     */
    where: AwardWhereUniqueInput
  }

  /**
   * Award updateMany
   */
  export type AwardUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Awards.
     */
    data: XOR<AwardUpdateManyMutationInput, AwardUncheckedUpdateManyInput>
    /**
     * Filter which Awards to update
     */
    where?: AwardWhereInput
    /**
     * Limit how many Awards to update.
     */
    limit?: number
  }

  /**
   * Award updateManyAndReturn
   */
  export type AwardUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Award
     */
    select?: AwardSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Award
     */
    omit?: AwardOmit<ExtArgs> | null
    /**
     * The data used to update Awards.
     */
    data: XOR<AwardUpdateManyMutationInput, AwardUncheckedUpdateManyInput>
    /**
     * Filter which Awards to update
     */
    where?: AwardWhereInput
    /**
     * Limit how many Awards to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwardIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Award upsert
   */
  export type AwardUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Award
     */
    select?: AwardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Award
     */
    omit?: AwardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwardInclude<ExtArgs> | null
    /**
     * The filter to search for the Award to update in case it exists.
     */
    where: AwardWhereUniqueInput
    /**
     * In case the Award found by the `where` argument doesn't exist, create a new Award with this data.
     */
    create: XOR<AwardCreateInput, AwardUncheckedCreateInput>
    /**
     * In case the Award was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AwardUpdateInput, AwardUncheckedUpdateInput>
  }

  /**
   * Award delete
   */
  export type AwardDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Award
     */
    select?: AwardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Award
     */
    omit?: AwardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwardInclude<ExtArgs> | null
    /**
     * Filter which Award to delete.
     */
    where: AwardWhereUniqueInput
  }

  /**
   * Award deleteMany
   */
  export type AwardDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Awards to delete
     */
    where?: AwardWhereInput
    /**
     * Limit how many Awards to delete.
     */
    limit?: number
  }

  /**
   * Award without action
   */
  export type AwardDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Award
     */
    select?: AwardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Award
     */
    omit?: AwardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AwardInclude<ExtArgs> | null
  }


  /**
   * Model Hobby
   */

  export type AggregateHobby = {
    _count: HobbyCountAggregateOutputType | null
    _avg: HobbyAvgAggregateOutputType | null
    _sum: HobbySumAggregateOutputType | null
    _min: HobbyMinAggregateOutputType | null
    _max: HobbyMaxAggregateOutputType | null
  }

  export type HobbyAvgAggregateOutputType = {
    sortOrder: number | null
  }

  export type HobbySumAggregateOutputType = {
    sortOrder: number | null
  }

  export type HobbyMinAggregateOutputType = {
    id: string | null
    profileId: string | null
    name: string | null
    description: string | null
    sortOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type HobbyMaxAggregateOutputType = {
    id: string | null
    profileId: string | null
    name: string | null
    description: string | null
    sortOrder: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type HobbyCountAggregateOutputType = {
    id: number
    profileId: number
    name: number
    description: number
    sortOrder: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type HobbyAvgAggregateInputType = {
    sortOrder?: true
  }

  export type HobbySumAggregateInputType = {
    sortOrder?: true
  }

  export type HobbyMinAggregateInputType = {
    id?: true
    profileId?: true
    name?: true
    description?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type HobbyMaxAggregateInputType = {
    id?: true
    profileId?: true
    name?: true
    description?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
  }

  export type HobbyCountAggregateInputType = {
    id?: true
    profileId?: true
    name?: true
    description?: true
    sortOrder?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type HobbyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Hobby to aggregate.
     */
    where?: HobbyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Hobbies to fetch.
     */
    orderBy?: HobbyOrderByWithRelationInput | HobbyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: HobbyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Hobbies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Hobbies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Hobbies
    **/
    _count?: true | HobbyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: HobbyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: HobbySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: HobbyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: HobbyMaxAggregateInputType
  }

  export type GetHobbyAggregateType<T extends HobbyAggregateArgs> = {
        [P in keyof T & keyof AggregateHobby]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateHobby[P]>
      : GetScalarType<T[P], AggregateHobby[P]>
  }




  export type HobbyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HobbyWhereInput
    orderBy?: HobbyOrderByWithAggregationInput | HobbyOrderByWithAggregationInput[]
    by: HobbyScalarFieldEnum[] | HobbyScalarFieldEnum
    having?: HobbyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: HobbyCountAggregateInputType | true
    _avg?: HobbyAvgAggregateInputType
    _sum?: HobbySumAggregateInputType
    _min?: HobbyMinAggregateInputType
    _max?: HobbyMaxAggregateInputType
  }

  export type HobbyGroupByOutputType = {
    id: string
    profileId: string
    name: string
    description: string | null
    sortOrder: number
    createdAt: Date
    updatedAt: Date
    _count: HobbyCountAggregateOutputType | null
    _avg: HobbyAvgAggregateOutputType | null
    _sum: HobbySumAggregateOutputType | null
    _min: HobbyMinAggregateOutputType | null
    _max: HobbyMaxAggregateOutputType | null
  }

  type GetHobbyGroupByPayload<T extends HobbyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<HobbyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof HobbyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], HobbyGroupByOutputType[P]>
            : GetScalarType<T[P], HobbyGroupByOutputType[P]>
        }
      >
    >


  export type HobbySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    name?: boolean
    description?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["hobby"]>

  export type HobbySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    name?: boolean
    description?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["hobby"]>

  export type HobbySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    profileId?: boolean
    name?: boolean
    description?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["hobby"]>

  export type HobbySelectScalar = {
    id?: boolean
    profileId?: boolean
    name?: boolean
    description?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type HobbyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "profileId" | "name" | "description" | "sortOrder" | "createdAt" | "updatedAt", ExtArgs["result"]["hobby"]>
  export type HobbyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type HobbyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }
  export type HobbyIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | ProfileDefaultArgs<ExtArgs>
  }

  export type $HobbyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Hobby"
    objects: {
      profile: Prisma.$ProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      profileId: string
      name: string
      description: string | null
      sortOrder: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["hobby"]>
    composites: {}
  }

  type HobbyGetPayload<S extends boolean | null | undefined | HobbyDefaultArgs> = $Result.GetResult<Prisma.$HobbyPayload, S>

  type HobbyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<HobbyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: HobbyCountAggregateInputType | true
    }

  export interface HobbyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Hobby'], meta: { name: 'Hobby' } }
    /**
     * Find zero or one Hobby that matches the filter.
     * @param {HobbyFindUniqueArgs} args - Arguments to find a Hobby
     * @example
     * // Get one Hobby
     * const hobby = await prisma.hobby.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends HobbyFindUniqueArgs>(args: SelectSubset<T, HobbyFindUniqueArgs<ExtArgs>>): Prisma__HobbyClient<$Result.GetResult<Prisma.$HobbyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Hobby that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {HobbyFindUniqueOrThrowArgs} args - Arguments to find a Hobby
     * @example
     * // Get one Hobby
     * const hobby = await prisma.hobby.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends HobbyFindUniqueOrThrowArgs>(args: SelectSubset<T, HobbyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__HobbyClient<$Result.GetResult<Prisma.$HobbyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Hobby that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HobbyFindFirstArgs} args - Arguments to find a Hobby
     * @example
     * // Get one Hobby
     * const hobby = await prisma.hobby.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends HobbyFindFirstArgs>(args?: SelectSubset<T, HobbyFindFirstArgs<ExtArgs>>): Prisma__HobbyClient<$Result.GetResult<Prisma.$HobbyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Hobby that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HobbyFindFirstOrThrowArgs} args - Arguments to find a Hobby
     * @example
     * // Get one Hobby
     * const hobby = await prisma.hobby.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends HobbyFindFirstOrThrowArgs>(args?: SelectSubset<T, HobbyFindFirstOrThrowArgs<ExtArgs>>): Prisma__HobbyClient<$Result.GetResult<Prisma.$HobbyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Hobbies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HobbyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Hobbies
     * const hobbies = await prisma.hobby.findMany()
     * 
     * // Get first 10 Hobbies
     * const hobbies = await prisma.hobby.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const hobbyWithIdOnly = await prisma.hobby.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends HobbyFindManyArgs>(args?: SelectSubset<T, HobbyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HobbyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Hobby.
     * @param {HobbyCreateArgs} args - Arguments to create a Hobby.
     * @example
     * // Create one Hobby
     * const Hobby = await prisma.hobby.create({
     *   data: {
     *     // ... data to create a Hobby
     *   }
     * })
     * 
     */
    create<T extends HobbyCreateArgs>(args: SelectSubset<T, HobbyCreateArgs<ExtArgs>>): Prisma__HobbyClient<$Result.GetResult<Prisma.$HobbyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Hobbies.
     * @param {HobbyCreateManyArgs} args - Arguments to create many Hobbies.
     * @example
     * // Create many Hobbies
     * const hobby = await prisma.hobby.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends HobbyCreateManyArgs>(args?: SelectSubset<T, HobbyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Hobbies and returns the data saved in the database.
     * @param {HobbyCreateManyAndReturnArgs} args - Arguments to create many Hobbies.
     * @example
     * // Create many Hobbies
     * const hobby = await prisma.hobby.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Hobbies and only return the `id`
     * const hobbyWithIdOnly = await prisma.hobby.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends HobbyCreateManyAndReturnArgs>(args?: SelectSubset<T, HobbyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HobbyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Hobby.
     * @param {HobbyDeleteArgs} args - Arguments to delete one Hobby.
     * @example
     * // Delete one Hobby
     * const Hobby = await prisma.hobby.delete({
     *   where: {
     *     // ... filter to delete one Hobby
     *   }
     * })
     * 
     */
    delete<T extends HobbyDeleteArgs>(args: SelectSubset<T, HobbyDeleteArgs<ExtArgs>>): Prisma__HobbyClient<$Result.GetResult<Prisma.$HobbyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Hobby.
     * @param {HobbyUpdateArgs} args - Arguments to update one Hobby.
     * @example
     * // Update one Hobby
     * const hobby = await prisma.hobby.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends HobbyUpdateArgs>(args: SelectSubset<T, HobbyUpdateArgs<ExtArgs>>): Prisma__HobbyClient<$Result.GetResult<Prisma.$HobbyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Hobbies.
     * @param {HobbyDeleteManyArgs} args - Arguments to filter Hobbies to delete.
     * @example
     * // Delete a few Hobbies
     * const { count } = await prisma.hobby.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends HobbyDeleteManyArgs>(args?: SelectSubset<T, HobbyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Hobbies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HobbyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Hobbies
     * const hobby = await prisma.hobby.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends HobbyUpdateManyArgs>(args: SelectSubset<T, HobbyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Hobbies and returns the data updated in the database.
     * @param {HobbyUpdateManyAndReturnArgs} args - Arguments to update many Hobbies.
     * @example
     * // Update many Hobbies
     * const hobby = await prisma.hobby.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Hobbies and only return the `id`
     * const hobbyWithIdOnly = await prisma.hobby.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends HobbyUpdateManyAndReturnArgs>(args: SelectSubset<T, HobbyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HobbyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Hobby.
     * @param {HobbyUpsertArgs} args - Arguments to update or create a Hobby.
     * @example
     * // Update or create a Hobby
     * const hobby = await prisma.hobby.upsert({
     *   create: {
     *     // ... data to create a Hobby
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Hobby we want to update
     *   }
     * })
     */
    upsert<T extends HobbyUpsertArgs>(args: SelectSubset<T, HobbyUpsertArgs<ExtArgs>>): Prisma__HobbyClient<$Result.GetResult<Prisma.$HobbyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Hobbies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HobbyCountArgs} args - Arguments to filter Hobbies to count.
     * @example
     * // Count the number of Hobbies
     * const count = await prisma.hobby.count({
     *   where: {
     *     // ... the filter for the Hobbies we want to count
     *   }
     * })
    **/
    count<T extends HobbyCountArgs>(
      args?: Subset<T, HobbyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], HobbyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Hobby.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HobbyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends HobbyAggregateArgs>(args: Subset<T, HobbyAggregateArgs>): Prisma.PrismaPromise<GetHobbyAggregateType<T>>

    /**
     * Group by Hobby.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HobbyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends HobbyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: HobbyGroupByArgs['orderBy'] }
        : { orderBy?: HobbyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, HobbyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHobbyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Hobby model
   */
  readonly fields: HobbyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Hobby.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__HobbyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    profile<T extends ProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProfileDefaultArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Hobby model
   */
  interface HobbyFieldRefs {
    readonly id: FieldRef<"Hobby", 'String'>
    readonly profileId: FieldRef<"Hobby", 'String'>
    readonly name: FieldRef<"Hobby", 'String'>
    readonly description: FieldRef<"Hobby", 'String'>
    readonly sortOrder: FieldRef<"Hobby", 'Int'>
    readonly createdAt: FieldRef<"Hobby", 'DateTime'>
    readonly updatedAt: FieldRef<"Hobby", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Hobby findUnique
   */
  export type HobbyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hobby
     */
    select?: HobbySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hobby
     */
    omit?: HobbyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HobbyInclude<ExtArgs> | null
    /**
     * Filter, which Hobby to fetch.
     */
    where: HobbyWhereUniqueInput
  }

  /**
   * Hobby findUniqueOrThrow
   */
  export type HobbyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hobby
     */
    select?: HobbySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hobby
     */
    omit?: HobbyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HobbyInclude<ExtArgs> | null
    /**
     * Filter, which Hobby to fetch.
     */
    where: HobbyWhereUniqueInput
  }

  /**
   * Hobby findFirst
   */
  export type HobbyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hobby
     */
    select?: HobbySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hobby
     */
    omit?: HobbyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HobbyInclude<ExtArgs> | null
    /**
     * Filter, which Hobby to fetch.
     */
    where?: HobbyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Hobbies to fetch.
     */
    orderBy?: HobbyOrderByWithRelationInput | HobbyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Hobbies.
     */
    cursor?: HobbyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Hobbies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Hobbies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Hobbies.
     */
    distinct?: HobbyScalarFieldEnum | HobbyScalarFieldEnum[]
  }

  /**
   * Hobby findFirstOrThrow
   */
  export type HobbyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hobby
     */
    select?: HobbySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hobby
     */
    omit?: HobbyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HobbyInclude<ExtArgs> | null
    /**
     * Filter, which Hobby to fetch.
     */
    where?: HobbyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Hobbies to fetch.
     */
    orderBy?: HobbyOrderByWithRelationInput | HobbyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Hobbies.
     */
    cursor?: HobbyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Hobbies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Hobbies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Hobbies.
     */
    distinct?: HobbyScalarFieldEnum | HobbyScalarFieldEnum[]
  }

  /**
   * Hobby findMany
   */
  export type HobbyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hobby
     */
    select?: HobbySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hobby
     */
    omit?: HobbyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HobbyInclude<ExtArgs> | null
    /**
     * Filter, which Hobbies to fetch.
     */
    where?: HobbyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Hobbies to fetch.
     */
    orderBy?: HobbyOrderByWithRelationInput | HobbyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Hobbies.
     */
    cursor?: HobbyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Hobbies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Hobbies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Hobbies.
     */
    distinct?: HobbyScalarFieldEnum | HobbyScalarFieldEnum[]
  }

  /**
   * Hobby create
   */
  export type HobbyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hobby
     */
    select?: HobbySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hobby
     */
    omit?: HobbyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HobbyInclude<ExtArgs> | null
    /**
     * The data needed to create a Hobby.
     */
    data: XOR<HobbyCreateInput, HobbyUncheckedCreateInput>
  }

  /**
   * Hobby createMany
   */
  export type HobbyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Hobbies.
     */
    data: HobbyCreateManyInput | HobbyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Hobby createManyAndReturn
   */
  export type HobbyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hobby
     */
    select?: HobbySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Hobby
     */
    omit?: HobbyOmit<ExtArgs> | null
    /**
     * The data used to create many Hobbies.
     */
    data: HobbyCreateManyInput | HobbyCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HobbyIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Hobby update
   */
  export type HobbyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hobby
     */
    select?: HobbySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hobby
     */
    omit?: HobbyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HobbyInclude<ExtArgs> | null
    /**
     * The data needed to update a Hobby.
     */
    data: XOR<HobbyUpdateInput, HobbyUncheckedUpdateInput>
    /**
     * Choose, which Hobby to update.
     */
    where: HobbyWhereUniqueInput
  }

  /**
   * Hobby updateMany
   */
  export type HobbyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Hobbies.
     */
    data: XOR<HobbyUpdateManyMutationInput, HobbyUncheckedUpdateManyInput>
    /**
     * Filter which Hobbies to update
     */
    where?: HobbyWhereInput
    /**
     * Limit how many Hobbies to update.
     */
    limit?: number
  }

  /**
   * Hobby updateManyAndReturn
   */
  export type HobbyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hobby
     */
    select?: HobbySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Hobby
     */
    omit?: HobbyOmit<ExtArgs> | null
    /**
     * The data used to update Hobbies.
     */
    data: XOR<HobbyUpdateManyMutationInput, HobbyUncheckedUpdateManyInput>
    /**
     * Filter which Hobbies to update
     */
    where?: HobbyWhereInput
    /**
     * Limit how many Hobbies to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HobbyIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Hobby upsert
   */
  export type HobbyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hobby
     */
    select?: HobbySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hobby
     */
    omit?: HobbyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HobbyInclude<ExtArgs> | null
    /**
     * The filter to search for the Hobby to update in case it exists.
     */
    where: HobbyWhereUniqueInput
    /**
     * In case the Hobby found by the `where` argument doesn't exist, create a new Hobby with this data.
     */
    create: XOR<HobbyCreateInput, HobbyUncheckedCreateInput>
    /**
     * In case the Hobby was found with the provided `where` argument, update it with this data.
     */
    update: XOR<HobbyUpdateInput, HobbyUncheckedUpdateInput>
  }

  /**
   * Hobby delete
   */
  export type HobbyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hobby
     */
    select?: HobbySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hobby
     */
    omit?: HobbyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HobbyInclude<ExtArgs> | null
    /**
     * Filter which Hobby to delete.
     */
    where: HobbyWhereUniqueInput
  }

  /**
   * Hobby deleteMany
   */
  export type HobbyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Hobbies to delete
     */
    where?: HobbyWhereInput
    /**
     * Limit how many Hobbies to delete.
     */
    limit?: number
  }

  /**
   * Hobby without action
   */
  export type HobbyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hobby
     */
    select?: HobbySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hobby
     */
    omit?: HobbyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HobbyInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ProfileScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    email: 'email',
    firstName: 'firstName',
    lastName: 'lastName',
    avatarUrl: 'avatarUrl',
    bio: 'bio',
    headline: 'headline',
    location: 'location',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProfileScalarFieldEnum = (typeof ProfileScalarFieldEnum)[keyof typeof ProfileScalarFieldEnum]


  export const SocialLinkScalarFieldEnum: {
    id: 'id',
    profileId: 'profileId',
    platform: 'platform',
    url: 'url',
    label: 'label',
    sortOrder: 'sortOrder',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SocialLinkScalarFieldEnum = (typeof SocialLinkScalarFieldEnum)[keyof typeof SocialLinkScalarFieldEnum]


  export const SkillCategoryScalarFieldEnum: {
    id: 'id',
    profileId: 'profileId',
    name: 'name',
    sortOrder: 'sortOrder',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SkillCategoryScalarFieldEnum = (typeof SkillCategoryScalarFieldEnum)[keyof typeof SkillCategoryScalarFieldEnum]


  export const ProjectScalarFieldEnum: {
    id: 'id',
    profileId: 'profileId',
    title: 'title',
    description: 'description',
    images: 'images',
    liveUrl: 'liveUrl',
    repoUrl: 'repoUrl',
    tags: 'tags',
    sortOrder: 'sortOrder',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProjectScalarFieldEnum = (typeof ProjectScalarFieldEnum)[keyof typeof ProjectScalarFieldEnum]


  export const SkillScalarFieldEnum: {
    id: 'id',
    profileId: 'profileId',
    name: 'name',
    categoryId: 'categoryId',
    proficiency: 'proficiency',
    sortOrder: 'sortOrder',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SkillScalarFieldEnum = (typeof SkillScalarFieldEnum)[keyof typeof SkillScalarFieldEnum]


  export const ExperienceScalarFieldEnum: {
    id: 'id',
    profileId: 'profileId',
    company: 'company',
    role: 'role',
    description: 'description',
    startDate: 'startDate',
    endDate: 'endDate',
    sortOrder: 'sortOrder',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ExperienceScalarFieldEnum = (typeof ExperienceScalarFieldEnum)[keyof typeof ExperienceScalarFieldEnum]


  export const EducationScalarFieldEnum: {
    id: 'id',
    profileId: 'profileId',
    school: 'school',
    degree: 'degree',
    field: 'field',
    startDate: 'startDate',
    endDate: 'endDate',
    description: 'description',
    sortOrder: 'sortOrder',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type EducationScalarFieldEnum = (typeof EducationScalarFieldEnum)[keyof typeof EducationScalarFieldEnum]


  export const CertificationScalarFieldEnum: {
    id: 'id',
    profileId: 'profileId',
    name: 'name',
    issuer: 'issuer',
    issueDate: 'issueDate',
    expiryDate: 'expiryDate',
    url: 'url',
    sortOrder: 'sortOrder',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CertificationScalarFieldEnum = (typeof CertificationScalarFieldEnum)[keyof typeof CertificationScalarFieldEnum]


  export const LanguageScalarFieldEnum: {
    id: 'id',
    profileId: 'profileId',
    name: 'name',
    proficiency: 'proficiency',
    sortOrder: 'sortOrder',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LanguageScalarFieldEnum = (typeof LanguageScalarFieldEnum)[keyof typeof LanguageScalarFieldEnum]


  export const AwardScalarFieldEnum: {
    id: 'id',
    profileId: 'profileId',
    title: 'title',
    issuer: 'issuer',
    date: 'date',
    description: 'description',
    sortOrder: 'sortOrder',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AwardScalarFieldEnum = (typeof AwardScalarFieldEnum)[keyof typeof AwardScalarFieldEnum]


  export const HobbyScalarFieldEnum: {
    id: 'id',
    profileId: 'profileId',
    name: 'name',
    description: 'description',
    sortOrder: 'sortOrder',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type HobbyScalarFieldEnum = (typeof HobbyScalarFieldEnum)[keyof typeof HobbyScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Proficiency'
   */
  export type EnumProficiencyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Proficiency'>
    


  /**
   * Reference to a field of type 'Proficiency[]'
   */
  export type ListEnumProficiencyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Proficiency[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type ProfileWhereInput = {
    AND?: ProfileWhereInput | ProfileWhereInput[]
    OR?: ProfileWhereInput[]
    NOT?: ProfileWhereInput | ProfileWhereInput[]
    id?: StringFilter<"Profile"> | string
    userId?: StringFilter<"Profile"> | string
    email?: StringFilter<"Profile"> | string
    firstName?: StringNullableFilter<"Profile"> | string | null
    lastName?: StringNullableFilter<"Profile"> | string | null
    avatarUrl?: StringNullableFilter<"Profile"> | string | null
    bio?: StringNullableFilter<"Profile"> | string | null
    headline?: StringNullableFilter<"Profile"> | string | null
    location?: StringNullableFilter<"Profile"> | string | null
    createdAt?: DateTimeFilter<"Profile"> | Date | string
    updatedAt?: DateTimeFilter<"Profile"> | Date | string
    projects?: ProjectListRelationFilter
    skills?: SkillListRelationFilter
    experiences?: ExperienceListRelationFilter
    socialLinks?: SocialLinkListRelationFilter
    skillCategories?: SkillCategoryListRelationFilter
    education?: EducationListRelationFilter
    certifications?: CertificationListRelationFilter
    languages?: LanguageListRelationFilter
    awards?: AwardListRelationFilter
    hobbies?: HobbyListRelationFilter
  }

  export type ProfileOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    email?: SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    headline?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    projects?: ProjectOrderByRelationAggregateInput
    skills?: SkillOrderByRelationAggregateInput
    experiences?: ExperienceOrderByRelationAggregateInput
    socialLinks?: SocialLinkOrderByRelationAggregateInput
    skillCategories?: SkillCategoryOrderByRelationAggregateInput
    education?: EducationOrderByRelationAggregateInput
    certifications?: CertificationOrderByRelationAggregateInput
    languages?: LanguageOrderByRelationAggregateInput
    awards?: AwardOrderByRelationAggregateInput
    hobbies?: HobbyOrderByRelationAggregateInput
  }

  export type ProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: ProfileWhereInput | ProfileWhereInput[]
    OR?: ProfileWhereInput[]
    NOT?: ProfileWhereInput | ProfileWhereInput[]
    email?: StringFilter<"Profile"> | string
    firstName?: StringNullableFilter<"Profile"> | string | null
    lastName?: StringNullableFilter<"Profile"> | string | null
    avatarUrl?: StringNullableFilter<"Profile"> | string | null
    bio?: StringNullableFilter<"Profile"> | string | null
    headline?: StringNullableFilter<"Profile"> | string | null
    location?: StringNullableFilter<"Profile"> | string | null
    createdAt?: DateTimeFilter<"Profile"> | Date | string
    updatedAt?: DateTimeFilter<"Profile"> | Date | string
    projects?: ProjectListRelationFilter
    skills?: SkillListRelationFilter
    experiences?: ExperienceListRelationFilter
    socialLinks?: SocialLinkListRelationFilter
    skillCategories?: SkillCategoryListRelationFilter
    education?: EducationListRelationFilter
    certifications?: CertificationListRelationFilter
    languages?: LanguageListRelationFilter
    awards?: AwardListRelationFilter
    hobbies?: HobbyListRelationFilter
  }, "id" | "userId">

  export type ProfileOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    email?: SortOrder
    firstName?: SortOrderInput | SortOrder
    lastName?: SortOrderInput | SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    headline?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProfileCountOrderByAggregateInput
    _max?: ProfileMaxOrderByAggregateInput
    _min?: ProfileMinOrderByAggregateInput
  }

  export type ProfileScalarWhereWithAggregatesInput = {
    AND?: ProfileScalarWhereWithAggregatesInput | ProfileScalarWhereWithAggregatesInput[]
    OR?: ProfileScalarWhereWithAggregatesInput[]
    NOT?: ProfileScalarWhereWithAggregatesInput | ProfileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Profile"> | string
    userId?: StringWithAggregatesFilter<"Profile"> | string
    email?: StringWithAggregatesFilter<"Profile"> | string
    firstName?: StringNullableWithAggregatesFilter<"Profile"> | string | null
    lastName?: StringNullableWithAggregatesFilter<"Profile"> | string | null
    avatarUrl?: StringNullableWithAggregatesFilter<"Profile"> | string | null
    bio?: StringNullableWithAggregatesFilter<"Profile"> | string | null
    headline?: StringNullableWithAggregatesFilter<"Profile"> | string | null
    location?: StringNullableWithAggregatesFilter<"Profile"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Profile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Profile"> | Date | string
  }

  export type SocialLinkWhereInput = {
    AND?: SocialLinkWhereInput | SocialLinkWhereInput[]
    OR?: SocialLinkWhereInput[]
    NOT?: SocialLinkWhereInput | SocialLinkWhereInput[]
    id?: StringFilter<"SocialLink"> | string
    profileId?: StringFilter<"SocialLink"> | string
    platform?: StringFilter<"SocialLink"> | string
    url?: StringFilter<"SocialLink"> | string
    label?: StringNullableFilter<"SocialLink"> | string | null
    sortOrder?: IntFilter<"SocialLink"> | number
    createdAt?: DateTimeFilter<"SocialLink"> | Date | string
    updatedAt?: DateTimeFilter<"SocialLink"> | Date | string
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
  }

  export type SocialLinkOrderByWithRelationInput = {
    id?: SortOrder
    profileId?: SortOrder
    platform?: SortOrder
    url?: SortOrder
    label?: SortOrderInput | SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    profile?: ProfileOrderByWithRelationInput
  }

  export type SocialLinkWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SocialLinkWhereInput | SocialLinkWhereInput[]
    OR?: SocialLinkWhereInput[]
    NOT?: SocialLinkWhereInput | SocialLinkWhereInput[]
    profileId?: StringFilter<"SocialLink"> | string
    platform?: StringFilter<"SocialLink"> | string
    url?: StringFilter<"SocialLink"> | string
    label?: StringNullableFilter<"SocialLink"> | string | null
    sortOrder?: IntFilter<"SocialLink"> | number
    createdAt?: DateTimeFilter<"SocialLink"> | Date | string
    updatedAt?: DateTimeFilter<"SocialLink"> | Date | string
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
  }, "id">

  export type SocialLinkOrderByWithAggregationInput = {
    id?: SortOrder
    profileId?: SortOrder
    platform?: SortOrder
    url?: SortOrder
    label?: SortOrderInput | SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SocialLinkCountOrderByAggregateInput
    _avg?: SocialLinkAvgOrderByAggregateInput
    _max?: SocialLinkMaxOrderByAggregateInput
    _min?: SocialLinkMinOrderByAggregateInput
    _sum?: SocialLinkSumOrderByAggregateInput
  }

  export type SocialLinkScalarWhereWithAggregatesInput = {
    AND?: SocialLinkScalarWhereWithAggregatesInput | SocialLinkScalarWhereWithAggregatesInput[]
    OR?: SocialLinkScalarWhereWithAggregatesInput[]
    NOT?: SocialLinkScalarWhereWithAggregatesInput | SocialLinkScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SocialLink"> | string
    profileId?: StringWithAggregatesFilter<"SocialLink"> | string
    platform?: StringWithAggregatesFilter<"SocialLink"> | string
    url?: StringWithAggregatesFilter<"SocialLink"> | string
    label?: StringNullableWithAggregatesFilter<"SocialLink"> | string | null
    sortOrder?: IntWithAggregatesFilter<"SocialLink"> | number
    createdAt?: DateTimeWithAggregatesFilter<"SocialLink"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SocialLink"> | Date | string
  }

  export type SkillCategoryWhereInput = {
    AND?: SkillCategoryWhereInput | SkillCategoryWhereInput[]
    OR?: SkillCategoryWhereInput[]
    NOT?: SkillCategoryWhereInput | SkillCategoryWhereInput[]
    id?: StringFilter<"SkillCategory"> | string
    profileId?: StringFilter<"SkillCategory"> | string
    name?: StringFilter<"SkillCategory"> | string
    sortOrder?: IntFilter<"SkillCategory"> | number
    createdAt?: DateTimeFilter<"SkillCategory"> | Date | string
    updatedAt?: DateTimeFilter<"SkillCategory"> | Date | string
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
    skills?: SkillListRelationFilter
  }

  export type SkillCategoryOrderByWithRelationInput = {
    id?: SortOrder
    profileId?: SortOrder
    name?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    profile?: ProfileOrderByWithRelationInput
    skills?: SkillOrderByRelationAggregateInput
  }

  export type SkillCategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    profileId_name?: SkillCategoryProfileIdNameCompoundUniqueInput
    AND?: SkillCategoryWhereInput | SkillCategoryWhereInput[]
    OR?: SkillCategoryWhereInput[]
    NOT?: SkillCategoryWhereInput | SkillCategoryWhereInput[]
    profileId?: StringFilter<"SkillCategory"> | string
    name?: StringFilter<"SkillCategory"> | string
    sortOrder?: IntFilter<"SkillCategory"> | number
    createdAt?: DateTimeFilter<"SkillCategory"> | Date | string
    updatedAt?: DateTimeFilter<"SkillCategory"> | Date | string
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
    skills?: SkillListRelationFilter
  }, "id" | "profileId_name">

  export type SkillCategoryOrderByWithAggregationInput = {
    id?: SortOrder
    profileId?: SortOrder
    name?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SkillCategoryCountOrderByAggregateInput
    _avg?: SkillCategoryAvgOrderByAggregateInput
    _max?: SkillCategoryMaxOrderByAggregateInput
    _min?: SkillCategoryMinOrderByAggregateInput
    _sum?: SkillCategorySumOrderByAggregateInput
  }

  export type SkillCategoryScalarWhereWithAggregatesInput = {
    AND?: SkillCategoryScalarWhereWithAggregatesInput | SkillCategoryScalarWhereWithAggregatesInput[]
    OR?: SkillCategoryScalarWhereWithAggregatesInput[]
    NOT?: SkillCategoryScalarWhereWithAggregatesInput | SkillCategoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SkillCategory"> | string
    profileId?: StringWithAggregatesFilter<"SkillCategory"> | string
    name?: StringWithAggregatesFilter<"SkillCategory"> | string
    sortOrder?: IntWithAggregatesFilter<"SkillCategory"> | number
    createdAt?: DateTimeWithAggregatesFilter<"SkillCategory"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SkillCategory"> | Date | string
  }

  export type ProjectWhereInput = {
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    id?: StringFilter<"Project"> | string
    profileId?: StringFilter<"Project"> | string
    title?: StringFilter<"Project"> | string
    description?: StringNullableFilter<"Project"> | string | null
    images?: StringNullableListFilter<"Project">
    liveUrl?: StringNullableFilter<"Project"> | string | null
    repoUrl?: StringNullableFilter<"Project"> | string | null
    tags?: StringNullableListFilter<"Project">
    sortOrder?: IntFilter<"Project"> | number
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
  }

  export type ProjectOrderByWithRelationInput = {
    id?: SortOrder
    profileId?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    images?: SortOrder
    liveUrl?: SortOrderInput | SortOrder
    repoUrl?: SortOrderInput | SortOrder
    tags?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    profile?: ProfileOrderByWithRelationInput
  }

  export type ProjectWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    profileId?: StringFilter<"Project"> | string
    title?: StringFilter<"Project"> | string
    description?: StringNullableFilter<"Project"> | string | null
    images?: StringNullableListFilter<"Project">
    liveUrl?: StringNullableFilter<"Project"> | string | null
    repoUrl?: StringNullableFilter<"Project"> | string | null
    tags?: StringNullableListFilter<"Project">
    sortOrder?: IntFilter<"Project"> | number
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
  }, "id">

  export type ProjectOrderByWithAggregationInput = {
    id?: SortOrder
    profileId?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    images?: SortOrder
    liveUrl?: SortOrderInput | SortOrder
    repoUrl?: SortOrderInput | SortOrder
    tags?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProjectCountOrderByAggregateInput
    _avg?: ProjectAvgOrderByAggregateInput
    _max?: ProjectMaxOrderByAggregateInput
    _min?: ProjectMinOrderByAggregateInput
    _sum?: ProjectSumOrderByAggregateInput
  }

  export type ProjectScalarWhereWithAggregatesInput = {
    AND?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    OR?: ProjectScalarWhereWithAggregatesInput[]
    NOT?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Project"> | string
    profileId?: StringWithAggregatesFilter<"Project"> | string
    title?: StringWithAggregatesFilter<"Project"> | string
    description?: StringNullableWithAggregatesFilter<"Project"> | string | null
    images?: StringNullableListFilter<"Project">
    liveUrl?: StringNullableWithAggregatesFilter<"Project"> | string | null
    repoUrl?: StringNullableWithAggregatesFilter<"Project"> | string | null
    tags?: StringNullableListFilter<"Project">
    sortOrder?: IntWithAggregatesFilter<"Project"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
  }

  export type SkillWhereInput = {
    AND?: SkillWhereInput | SkillWhereInput[]
    OR?: SkillWhereInput[]
    NOT?: SkillWhereInput | SkillWhereInput[]
    id?: StringFilter<"Skill"> | string
    profileId?: StringFilter<"Skill"> | string
    name?: StringFilter<"Skill"> | string
    categoryId?: StringNullableFilter<"Skill"> | string | null
    proficiency?: EnumProficiencyFilter<"Skill"> | $Enums.Proficiency
    sortOrder?: IntFilter<"Skill"> | number
    createdAt?: DateTimeFilter<"Skill"> | Date | string
    updatedAt?: DateTimeFilter<"Skill"> | Date | string
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
    category?: XOR<SkillCategoryNullableScalarRelationFilter, SkillCategoryWhereInput> | null
  }

  export type SkillOrderByWithRelationInput = {
    id?: SortOrder
    profileId?: SortOrder
    name?: SortOrder
    categoryId?: SortOrderInput | SortOrder
    proficiency?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    profile?: ProfileOrderByWithRelationInput
    category?: SkillCategoryOrderByWithRelationInput
  }

  export type SkillWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SkillWhereInput | SkillWhereInput[]
    OR?: SkillWhereInput[]
    NOT?: SkillWhereInput | SkillWhereInput[]
    profileId?: StringFilter<"Skill"> | string
    name?: StringFilter<"Skill"> | string
    categoryId?: StringNullableFilter<"Skill"> | string | null
    proficiency?: EnumProficiencyFilter<"Skill"> | $Enums.Proficiency
    sortOrder?: IntFilter<"Skill"> | number
    createdAt?: DateTimeFilter<"Skill"> | Date | string
    updatedAt?: DateTimeFilter<"Skill"> | Date | string
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
    category?: XOR<SkillCategoryNullableScalarRelationFilter, SkillCategoryWhereInput> | null
  }, "id">

  export type SkillOrderByWithAggregationInput = {
    id?: SortOrder
    profileId?: SortOrder
    name?: SortOrder
    categoryId?: SortOrderInput | SortOrder
    proficiency?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SkillCountOrderByAggregateInput
    _avg?: SkillAvgOrderByAggregateInput
    _max?: SkillMaxOrderByAggregateInput
    _min?: SkillMinOrderByAggregateInput
    _sum?: SkillSumOrderByAggregateInput
  }

  export type SkillScalarWhereWithAggregatesInput = {
    AND?: SkillScalarWhereWithAggregatesInput | SkillScalarWhereWithAggregatesInput[]
    OR?: SkillScalarWhereWithAggregatesInput[]
    NOT?: SkillScalarWhereWithAggregatesInput | SkillScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Skill"> | string
    profileId?: StringWithAggregatesFilter<"Skill"> | string
    name?: StringWithAggregatesFilter<"Skill"> | string
    categoryId?: StringNullableWithAggregatesFilter<"Skill"> | string | null
    proficiency?: EnumProficiencyWithAggregatesFilter<"Skill"> | $Enums.Proficiency
    sortOrder?: IntWithAggregatesFilter<"Skill"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Skill"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Skill"> | Date | string
  }

  export type ExperienceWhereInput = {
    AND?: ExperienceWhereInput | ExperienceWhereInput[]
    OR?: ExperienceWhereInput[]
    NOT?: ExperienceWhereInput | ExperienceWhereInput[]
    id?: StringFilter<"Experience"> | string
    profileId?: StringFilter<"Experience"> | string
    company?: StringFilter<"Experience"> | string
    role?: StringFilter<"Experience"> | string
    description?: StringNullableListFilter<"Experience">
    startDate?: DateTimeFilter<"Experience"> | Date | string
    endDate?: DateTimeNullableFilter<"Experience"> | Date | string | null
    sortOrder?: IntFilter<"Experience"> | number
    createdAt?: DateTimeFilter<"Experience"> | Date | string
    updatedAt?: DateTimeFilter<"Experience"> | Date | string
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
  }

  export type ExperienceOrderByWithRelationInput = {
    id?: SortOrder
    profileId?: SortOrder
    company?: SortOrder
    role?: SortOrder
    description?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrderInput | SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    profile?: ProfileOrderByWithRelationInput
  }

  export type ExperienceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ExperienceWhereInput | ExperienceWhereInput[]
    OR?: ExperienceWhereInput[]
    NOT?: ExperienceWhereInput | ExperienceWhereInput[]
    profileId?: StringFilter<"Experience"> | string
    company?: StringFilter<"Experience"> | string
    role?: StringFilter<"Experience"> | string
    description?: StringNullableListFilter<"Experience">
    startDate?: DateTimeFilter<"Experience"> | Date | string
    endDate?: DateTimeNullableFilter<"Experience"> | Date | string | null
    sortOrder?: IntFilter<"Experience"> | number
    createdAt?: DateTimeFilter<"Experience"> | Date | string
    updatedAt?: DateTimeFilter<"Experience"> | Date | string
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
  }, "id">

  export type ExperienceOrderByWithAggregationInput = {
    id?: SortOrder
    profileId?: SortOrder
    company?: SortOrder
    role?: SortOrder
    description?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrderInput | SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ExperienceCountOrderByAggregateInput
    _avg?: ExperienceAvgOrderByAggregateInput
    _max?: ExperienceMaxOrderByAggregateInput
    _min?: ExperienceMinOrderByAggregateInput
    _sum?: ExperienceSumOrderByAggregateInput
  }

  export type ExperienceScalarWhereWithAggregatesInput = {
    AND?: ExperienceScalarWhereWithAggregatesInput | ExperienceScalarWhereWithAggregatesInput[]
    OR?: ExperienceScalarWhereWithAggregatesInput[]
    NOT?: ExperienceScalarWhereWithAggregatesInput | ExperienceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Experience"> | string
    profileId?: StringWithAggregatesFilter<"Experience"> | string
    company?: StringWithAggregatesFilter<"Experience"> | string
    role?: StringWithAggregatesFilter<"Experience"> | string
    description?: StringNullableListFilter<"Experience">
    startDate?: DateTimeWithAggregatesFilter<"Experience"> | Date | string
    endDate?: DateTimeNullableWithAggregatesFilter<"Experience"> | Date | string | null
    sortOrder?: IntWithAggregatesFilter<"Experience"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Experience"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Experience"> | Date | string
  }

  export type EducationWhereInput = {
    AND?: EducationWhereInput | EducationWhereInput[]
    OR?: EducationWhereInput[]
    NOT?: EducationWhereInput | EducationWhereInput[]
    id?: StringFilter<"Education"> | string
    profileId?: StringFilter<"Education"> | string
    school?: StringFilter<"Education"> | string
    degree?: StringNullableFilter<"Education"> | string | null
    field?: StringNullableFilter<"Education"> | string | null
    startDate?: DateTimeFilter<"Education"> | Date | string
    endDate?: DateTimeNullableFilter<"Education"> | Date | string | null
    description?: StringNullableListFilter<"Education">
    sortOrder?: IntFilter<"Education"> | number
    createdAt?: DateTimeFilter<"Education"> | Date | string
    updatedAt?: DateTimeFilter<"Education"> | Date | string
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
  }

  export type EducationOrderByWithRelationInput = {
    id?: SortOrder
    profileId?: SortOrder
    school?: SortOrder
    degree?: SortOrderInput | SortOrder
    field?: SortOrderInput | SortOrder
    startDate?: SortOrder
    endDate?: SortOrderInput | SortOrder
    description?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    profile?: ProfileOrderByWithRelationInput
  }

  export type EducationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EducationWhereInput | EducationWhereInput[]
    OR?: EducationWhereInput[]
    NOT?: EducationWhereInput | EducationWhereInput[]
    profileId?: StringFilter<"Education"> | string
    school?: StringFilter<"Education"> | string
    degree?: StringNullableFilter<"Education"> | string | null
    field?: StringNullableFilter<"Education"> | string | null
    startDate?: DateTimeFilter<"Education"> | Date | string
    endDate?: DateTimeNullableFilter<"Education"> | Date | string | null
    description?: StringNullableListFilter<"Education">
    sortOrder?: IntFilter<"Education"> | number
    createdAt?: DateTimeFilter<"Education"> | Date | string
    updatedAt?: DateTimeFilter<"Education"> | Date | string
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
  }, "id">

  export type EducationOrderByWithAggregationInput = {
    id?: SortOrder
    profileId?: SortOrder
    school?: SortOrder
    degree?: SortOrderInput | SortOrder
    field?: SortOrderInput | SortOrder
    startDate?: SortOrder
    endDate?: SortOrderInput | SortOrder
    description?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: EducationCountOrderByAggregateInput
    _avg?: EducationAvgOrderByAggregateInput
    _max?: EducationMaxOrderByAggregateInput
    _min?: EducationMinOrderByAggregateInput
    _sum?: EducationSumOrderByAggregateInput
  }

  export type EducationScalarWhereWithAggregatesInput = {
    AND?: EducationScalarWhereWithAggregatesInput | EducationScalarWhereWithAggregatesInput[]
    OR?: EducationScalarWhereWithAggregatesInput[]
    NOT?: EducationScalarWhereWithAggregatesInput | EducationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Education"> | string
    profileId?: StringWithAggregatesFilter<"Education"> | string
    school?: StringWithAggregatesFilter<"Education"> | string
    degree?: StringNullableWithAggregatesFilter<"Education"> | string | null
    field?: StringNullableWithAggregatesFilter<"Education"> | string | null
    startDate?: DateTimeWithAggregatesFilter<"Education"> | Date | string
    endDate?: DateTimeNullableWithAggregatesFilter<"Education"> | Date | string | null
    description?: StringNullableListFilter<"Education">
    sortOrder?: IntWithAggregatesFilter<"Education"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Education"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Education"> | Date | string
  }

  export type CertificationWhereInput = {
    AND?: CertificationWhereInput | CertificationWhereInput[]
    OR?: CertificationWhereInput[]
    NOT?: CertificationWhereInput | CertificationWhereInput[]
    id?: StringFilter<"Certification"> | string
    profileId?: StringFilter<"Certification"> | string
    name?: StringFilter<"Certification"> | string
    issuer?: StringFilter<"Certification"> | string
    issueDate?: DateTimeNullableFilter<"Certification"> | Date | string | null
    expiryDate?: DateTimeNullableFilter<"Certification"> | Date | string | null
    url?: StringNullableFilter<"Certification"> | string | null
    sortOrder?: IntFilter<"Certification"> | number
    createdAt?: DateTimeFilter<"Certification"> | Date | string
    updatedAt?: DateTimeFilter<"Certification"> | Date | string
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
  }

  export type CertificationOrderByWithRelationInput = {
    id?: SortOrder
    profileId?: SortOrder
    name?: SortOrder
    issuer?: SortOrder
    issueDate?: SortOrderInput | SortOrder
    expiryDate?: SortOrderInput | SortOrder
    url?: SortOrderInput | SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    profile?: ProfileOrderByWithRelationInput
  }

  export type CertificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CertificationWhereInput | CertificationWhereInput[]
    OR?: CertificationWhereInput[]
    NOT?: CertificationWhereInput | CertificationWhereInput[]
    profileId?: StringFilter<"Certification"> | string
    name?: StringFilter<"Certification"> | string
    issuer?: StringFilter<"Certification"> | string
    issueDate?: DateTimeNullableFilter<"Certification"> | Date | string | null
    expiryDate?: DateTimeNullableFilter<"Certification"> | Date | string | null
    url?: StringNullableFilter<"Certification"> | string | null
    sortOrder?: IntFilter<"Certification"> | number
    createdAt?: DateTimeFilter<"Certification"> | Date | string
    updatedAt?: DateTimeFilter<"Certification"> | Date | string
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
  }, "id">

  export type CertificationOrderByWithAggregationInput = {
    id?: SortOrder
    profileId?: SortOrder
    name?: SortOrder
    issuer?: SortOrder
    issueDate?: SortOrderInput | SortOrder
    expiryDate?: SortOrderInput | SortOrder
    url?: SortOrderInput | SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CertificationCountOrderByAggregateInput
    _avg?: CertificationAvgOrderByAggregateInput
    _max?: CertificationMaxOrderByAggregateInput
    _min?: CertificationMinOrderByAggregateInput
    _sum?: CertificationSumOrderByAggregateInput
  }

  export type CertificationScalarWhereWithAggregatesInput = {
    AND?: CertificationScalarWhereWithAggregatesInput | CertificationScalarWhereWithAggregatesInput[]
    OR?: CertificationScalarWhereWithAggregatesInput[]
    NOT?: CertificationScalarWhereWithAggregatesInput | CertificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Certification"> | string
    profileId?: StringWithAggregatesFilter<"Certification"> | string
    name?: StringWithAggregatesFilter<"Certification"> | string
    issuer?: StringWithAggregatesFilter<"Certification"> | string
    issueDate?: DateTimeNullableWithAggregatesFilter<"Certification"> | Date | string | null
    expiryDate?: DateTimeNullableWithAggregatesFilter<"Certification"> | Date | string | null
    url?: StringNullableWithAggregatesFilter<"Certification"> | string | null
    sortOrder?: IntWithAggregatesFilter<"Certification"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Certification"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Certification"> | Date | string
  }

  export type LanguageWhereInput = {
    AND?: LanguageWhereInput | LanguageWhereInput[]
    OR?: LanguageWhereInput[]
    NOT?: LanguageWhereInput | LanguageWhereInput[]
    id?: StringFilter<"Language"> | string
    profileId?: StringFilter<"Language"> | string
    name?: StringFilter<"Language"> | string
    proficiency?: StringFilter<"Language"> | string
    sortOrder?: IntFilter<"Language"> | number
    createdAt?: DateTimeFilter<"Language"> | Date | string
    updatedAt?: DateTimeFilter<"Language"> | Date | string
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
  }

  export type LanguageOrderByWithRelationInput = {
    id?: SortOrder
    profileId?: SortOrder
    name?: SortOrder
    proficiency?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    profile?: ProfileOrderByWithRelationInput
  }

  export type LanguageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LanguageWhereInput | LanguageWhereInput[]
    OR?: LanguageWhereInput[]
    NOT?: LanguageWhereInput | LanguageWhereInput[]
    profileId?: StringFilter<"Language"> | string
    name?: StringFilter<"Language"> | string
    proficiency?: StringFilter<"Language"> | string
    sortOrder?: IntFilter<"Language"> | number
    createdAt?: DateTimeFilter<"Language"> | Date | string
    updatedAt?: DateTimeFilter<"Language"> | Date | string
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
  }, "id">

  export type LanguageOrderByWithAggregationInput = {
    id?: SortOrder
    profileId?: SortOrder
    name?: SortOrder
    proficiency?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LanguageCountOrderByAggregateInput
    _avg?: LanguageAvgOrderByAggregateInput
    _max?: LanguageMaxOrderByAggregateInput
    _min?: LanguageMinOrderByAggregateInput
    _sum?: LanguageSumOrderByAggregateInput
  }

  export type LanguageScalarWhereWithAggregatesInput = {
    AND?: LanguageScalarWhereWithAggregatesInput | LanguageScalarWhereWithAggregatesInput[]
    OR?: LanguageScalarWhereWithAggregatesInput[]
    NOT?: LanguageScalarWhereWithAggregatesInput | LanguageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Language"> | string
    profileId?: StringWithAggregatesFilter<"Language"> | string
    name?: StringWithAggregatesFilter<"Language"> | string
    proficiency?: StringWithAggregatesFilter<"Language"> | string
    sortOrder?: IntWithAggregatesFilter<"Language"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Language"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Language"> | Date | string
  }

  export type AwardWhereInput = {
    AND?: AwardWhereInput | AwardWhereInput[]
    OR?: AwardWhereInput[]
    NOT?: AwardWhereInput | AwardWhereInput[]
    id?: StringFilter<"Award"> | string
    profileId?: StringFilter<"Award"> | string
    title?: StringFilter<"Award"> | string
    issuer?: StringNullableFilter<"Award"> | string | null
    date?: DateTimeNullableFilter<"Award"> | Date | string | null
    description?: StringNullableFilter<"Award"> | string | null
    sortOrder?: IntFilter<"Award"> | number
    createdAt?: DateTimeFilter<"Award"> | Date | string
    updatedAt?: DateTimeFilter<"Award"> | Date | string
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
  }

  export type AwardOrderByWithRelationInput = {
    id?: SortOrder
    profileId?: SortOrder
    title?: SortOrder
    issuer?: SortOrderInput | SortOrder
    date?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    profile?: ProfileOrderByWithRelationInput
  }

  export type AwardWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AwardWhereInput | AwardWhereInput[]
    OR?: AwardWhereInput[]
    NOT?: AwardWhereInput | AwardWhereInput[]
    profileId?: StringFilter<"Award"> | string
    title?: StringFilter<"Award"> | string
    issuer?: StringNullableFilter<"Award"> | string | null
    date?: DateTimeNullableFilter<"Award"> | Date | string | null
    description?: StringNullableFilter<"Award"> | string | null
    sortOrder?: IntFilter<"Award"> | number
    createdAt?: DateTimeFilter<"Award"> | Date | string
    updatedAt?: DateTimeFilter<"Award"> | Date | string
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
  }, "id">

  export type AwardOrderByWithAggregationInput = {
    id?: SortOrder
    profileId?: SortOrder
    title?: SortOrder
    issuer?: SortOrderInput | SortOrder
    date?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AwardCountOrderByAggregateInput
    _avg?: AwardAvgOrderByAggregateInput
    _max?: AwardMaxOrderByAggregateInput
    _min?: AwardMinOrderByAggregateInput
    _sum?: AwardSumOrderByAggregateInput
  }

  export type AwardScalarWhereWithAggregatesInput = {
    AND?: AwardScalarWhereWithAggregatesInput | AwardScalarWhereWithAggregatesInput[]
    OR?: AwardScalarWhereWithAggregatesInput[]
    NOT?: AwardScalarWhereWithAggregatesInput | AwardScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Award"> | string
    profileId?: StringWithAggregatesFilter<"Award"> | string
    title?: StringWithAggregatesFilter<"Award"> | string
    issuer?: StringNullableWithAggregatesFilter<"Award"> | string | null
    date?: DateTimeNullableWithAggregatesFilter<"Award"> | Date | string | null
    description?: StringNullableWithAggregatesFilter<"Award"> | string | null
    sortOrder?: IntWithAggregatesFilter<"Award"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Award"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Award"> | Date | string
  }

  export type HobbyWhereInput = {
    AND?: HobbyWhereInput | HobbyWhereInput[]
    OR?: HobbyWhereInput[]
    NOT?: HobbyWhereInput | HobbyWhereInput[]
    id?: StringFilter<"Hobby"> | string
    profileId?: StringFilter<"Hobby"> | string
    name?: StringFilter<"Hobby"> | string
    description?: StringNullableFilter<"Hobby"> | string | null
    sortOrder?: IntFilter<"Hobby"> | number
    createdAt?: DateTimeFilter<"Hobby"> | Date | string
    updatedAt?: DateTimeFilter<"Hobby"> | Date | string
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
  }

  export type HobbyOrderByWithRelationInput = {
    id?: SortOrder
    profileId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    profile?: ProfileOrderByWithRelationInput
  }

  export type HobbyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: HobbyWhereInput | HobbyWhereInput[]
    OR?: HobbyWhereInput[]
    NOT?: HobbyWhereInput | HobbyWhereInput[]
    profileId?: StringFilter<"Hobby"> | string
    name?: StringFilter<"Hobby"> | string
    description?: StringNullableFilter<"Hobby"> | string | null
    sortOrder?: IntFilter<"Hobby"> | number
    createdAt?: DateTimeFilter<"Hobby"> | Date | string
    updatedAt?: DateTimeFilter<"Hobby"> | Date | string
    profile?: XOR<ProfileScalarRelationFilter, ProfileWhereInput>
  }, "id">

  export type HobbyOrderByWithAggregationInput = {
    id?: SortOrder
    profileId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: HobbyCountOrderByAggregateInput
    _avg?: HobbyAvgOrderByAggregateInput
    _max?: HobbyMaxOrderByAggregateInput
    _min?: HobbyMinOrderByAggregateInput
    _sum?: HobbySumOrderByAggregateInput
  }

  export type HobbyScalarWhereWithAggregatesInput = {
    AND?: HobbyScalarWhereWithAggregatesInput | HobbyScalarWhereWithAggregatesInput[]
    OR?: HobbyScalarWhereWithAggregatesInput[]
    NOT?: HobbyScalarWhereWithAggregatesInput | HobbyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Hobby"> | string
    profileId?: StringWithAggregatesFilter<"Hobby"> | string
    name?: StringWithAggregatesFilter<"Hobby"> | string
    description?: StringNullableWithAggregatesFilter<"Hobby"> | string | null
    sortOrder?: IntWithAggregatesFilter<"Hobby"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Hobby"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Hobby"> | Date | string
  }

  export type ProfileCreateInput = {
    id?: string
    userId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    avatarUrl?: string | null
    bio?: string | null
    headline?: string | null
    location?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutProfileInput
    skills?: SkillCreateNestedManyWithoutProfileInput
    experiences?: ExperienceCreateNestedManyWithoutProfileInput
    socialLinks?: SocialLinkCreateNestedManyWithoutProfileInput
    skillCategories?: SkillCategoryCreateNestedManyWithoutProfileInput
    education?: EducationCreateNestedManyWithoutProfileInput
    certifications?: CertificationCreateNestedManyWithoutProfileInput
    languages?: LanguageCreateNestedManyWithoutProfileInput
    awards?: AwardCreateNestedManyWithoutProfileInput
    hobbies?: HobbyCreateNestedManyWithoutProfileInput
  }

  export type ProfileUncheckedCreateInput = {
    id?: string
    userId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    avatarUrl?: string | null
    bio?: string | null
    headline?: string | null
    location?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutProfileInput
    skills?: SkillUncheckedCreateNestedManyWithoutProfileInput
    experiences?: ExperienceUncheckedCreateNestedManyWithoutProfileInput
    socialLinks?: SocialLinkUncheckedCreateNestedManyWithoutProfileInput
    skillCategories?: SkillCategoryUncheckedCreateNestedManyWithoutProfileInput
    education?: EducationUncheckedCreateNestedManyWithoutProfileInput
    certifications?: CertificationUncheckedCreateNestedManyWithoutProfileInput
    languages?: LanguageUncheckedCreateNestedManyWithoutProfileInput
    awards?: AwardUncheckedCreateNestedManyWithoutProfileInput
    hobbies?: HobbyUncheckedCreateNestedManyWithoutProfileInput
  }

  export type ProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutProfileNestedInput
    skills?: SkillUpdateManyWithoutProfileNestedInput
    experiences?: ExperienceUpdateManyWithoutProfileNestedInput
    socialLinks?: SocialLinkUpdateManyWithoutProfileNestedInput
    skillCategories?: SkillCategoryUpdateManyWithoutProfileNestedInput
    education?: EducationUpdateManyWithoutProfileNestedInput
    certifications?: CertificationUpdateManyWithoutProfileNestedInput
    languages?: LanguageUpdateManyWithoutProfileNestedInput
    awards?: AwardUpdateManyWithoutProfileNestedInput
    hobbies?: HobbyUpdateManyWithoutProfileNestedInput
  }

  export type ProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutProfileNestedInput
    skills?: SkillUncheckedUpdateManyWithoutProfileNestedInput
    experiences?: ExperienceUncheckedUpdateManyWithoutProfileNestedInput
    socialLinks?: SocialLinkUncheckedUpdateManyWithoutProfileNestedInput
    skillCategories?: SkillCategoryUncheckedUpdateManyWithoutProfileNestedInput
    education?: EducationUncheckedUpdateManyWithoutProfileNestedInput
    certifications?: CertificationUncheckedUpdateManyWithoutProfileNestedInput
    languages?: LanguageUncheckedUpdateManyWithoutProfileNestedInput
    awards?: AwardUncheckedUpdateManyWithoutProfileNestedInput
    hobbies?: HobbyUncheckedUpdateManyWithoutProfileNestedInput
  }

  export type ProfileCreateManyInput = {
    id?: string
    userId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    avatarUrl?: string | null
    bio?: string | null
    headline?: string | null
    location?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SocialLinkCreateInput = {
    id?: string
    platform: string
    url: string
    label?: string | null
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    profile: ProfileCreateNestedOneWithoutSocialLinksInput
  }

  export type SocialLinkUncheckedCreateInput = {
    id?: string
    profileId: string
    platform: string
    url: string
    label?: string | null
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SocialLinkUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneRequiredWithoutSocialLinksNestedInput
  }

  export type SocialLinkUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SocialLinkCreateManyInput = {
    id?: string
    profileId: string
    platform: string
    url: string
    label?: string | null
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SocialLinkUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SocialLinkUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SkillCategoryCreateInput = {
    id?: string
    name: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    profile: ProfileCreateNestedOneWithoutSkillCategoriesInput
    skills?: SkillCreateNestedManyWithoutCategoryInput
  }

  export type SkillCategoryUncheckedCreateInput = {
    id?: string
    profileId: string
    name: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    skills?: SkillUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type SkillCategoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneRequiredWithoutSkillCategoriesNestedInput
    skills?: SkillUpdateManyWithoutCategoryNestedInput
  }

  export type SkillCategoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    skills?: SkillUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type SkillCategoryCreateManyInput = {
    id?: string
    profileId: string
    name: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SkillCategoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SkillCategoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCreateInput = {
    id?: string
    title: string
    description?: string | null
    images?: ProjectCreateimagesInput | string[]
    liveUrl?: string | null
    repoUrl?: string | null
    tags?: ProjectCreatetagsInput | string[]
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    profile: ProfileCreateNestedOneWithoutProjectsInput
  }

  export type ProjectUncheckedCreateInput = {
    id?: string
    profileId: string
    title: string
    description?: string | null
    images?: ProjectCreateimagesInput | string[]
    liveUrl?: string | null
    repoUrl?: string | null
    tags?: ProjectCreatetagsInput | string[]
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    images?: ProjectUpdateimagesInput | string[]
    liveUrl?: NullableStringFieldUpdateOperationsInput | string | null
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ProjectUpdatetagsInput | string[]
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneRequiredWithoutProjectsNestedInput
  }

  export type ProjectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    images?: ProjectUpdateimagesInput | string[]
    liveUrl?: NullableStringFieldUpdateOperationsInput | string | null
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ProjectUpdatetagsInput | string[]
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCreateManyInput = {
    id?: string
    profileId: string
    title: string
    description?: string | null
    images?: ProjectCreateimagesInput | string[]
    liveUrl?: string | null
    repoUrl?: string | null
    tags?: ProjectCreatetagsInput | string[]
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    images?: ProjectUpdateimagesInput | string[]
    liveUrl?: NullableStringFieldUpdateOperationsInput | string | null
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ProjectUpdatetagsInput | string[]
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    images?: ProjectUpdateimagesInput | string[]
    liveUrl?: NullableStringFieldUpdateOperationsInput | string | null
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ProjectUpdatetagsInput | string[]
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SkillCreateInput = {
    id?: string
    name: string
    proficiency?: $Enums.Proficiency
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    profile: ProfileCreateNestedOneWithoutSkillsInput
    category?: SkillCategoryCreateNestedOneWithoutSkillsInput
  }

  export type SkillUncheckedCreateInput = {
    id?: string
    profileId: string
    name: string
    categoryId?: string | null
    proficiency?: $Enums.Proficiency
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SkillUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    proficiency?: EnumProficiencyFieldUpdateOperationsInput | $Enums.Proficiency
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneRequiredWithoutSkillsNestedInput
    category?: SkillCategoryUpdateOneWithoutSkillsNestedInput
  }

  export type SkillUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    proficiency?: EnumProficiencyFieldUpdateOperationsInput | $Enums.Proficiency
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SkillCreateManyInput = {
    id?: string
    profileId: string
    name: string
    categoryId?: string | null
    proficiency?: $Enums.Proficiency
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SkillUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    proficiency?: EnumProficiencyFieldUpdateOperationsInput | $Enums.Proficiency
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SkillUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    proficiency?: EnumProficiencyFieldUpdateOperationsInput | $Enums.Proficiency
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExperienceCreateInput = {
    id?: string
    company: string
    role: string
    description?: ExperienceCreatedescriptionInput | string[]
    startDate: Date | string
    endDate?: Date | string | null
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    profile: ProfileCreateNestedOneWithoutExperiencesInput
  }

  export type ExperienceUncheckedCreateInput = {
    id?: string
    profileId: string
    company: string
    role: string
    description?: ExperienceCreatedescriptionInput | string[]
    startDate: Date | string
    endDate?: Date | string | null
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExperienceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    description?: ExperienceUpdatedescriptionInput | string[]
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneRequiredWithoutExperiencesNestedInput
  }

  export type ExperienceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    description?: ExperienceUpdatedescriptionInput | string[]
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExperienceCreateManyInput = {
    id?: string
    profileId: string
    company: string
    role: string
    description?: ExperienceCreatedescriptionInput | string[]
    startDate: Date | string
    endDate?: Date | string | null
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExperienceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    description?: ExperienceUpdatedescriptionInput | string[]
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExperienceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    description?: ExperienceUpdatedescriptionInput | string[]
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EducationCreateInput = {
    id?: string
    school: string
    degree?: string | null
    field?: string | null
    startDate: Date | string
    endDate?: Date | string | null
    description?: EducationCreatedescriptionInput | string[]
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    profile: ProfileCreateNestedOneWithoutEducationInput
  }

  export type EducationUncheckedCreateInput = {
    id?: string
    profileId: string
    school: string
    degree?: string | null
    field?: string | null
    startDate: Date | string
    endDate?: Date | string | null
    description?: EducationCreatedescriptionInput | string[]
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EducationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    school?: StringFieldUpdateOperationsInput | string
    degree?: NullableStringFieldUpdateOperationsInput | string | null
    field?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    description?: EducationUpdatedescriptionInput | string[]
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneRequiredWithoutEducationNestedInput
  }

  export type EducationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    school?: StringFieldUpdateOperationsInput | string
    degree?: NullableStringFieldUpdateOperationsInput | string | null
    field?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    description?: EducationUpdatedescriptionInput | string[]
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EducationCreateManyInput = {
    id?: string
    profileId: string
    school: string
    degree?: string | null
    field?: string | null
    startDate: Date | string
    endDate?: Date | string | null
    description?: EducationCreatedescriptionInput | string[]
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EducationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    school?: StringFieldUpdateOperationsInput | string
    degree?: NullableStringFieldUpdateOperationsInput | string | null
    field?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    description?: EducationUpdatedescriptionInput | string[]
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EducationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    school?: StringFieldUpdateOperationsInput | string
    degree?: NullableStringFieldUpdateOperationsInput | string | null
    field?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    description?: EducationUpdatedescriptionInput | string[]
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CertificationCreateInput = {
    id?: string
    name: string
    issuer: string
    issueDate?: Date | string | null
    expiryDate?: Date | string | null
    url?: string | null
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    profile: ProfileCreateNestedOneWithoutCertificationsInput
  }

  export type CertificationUncheckedCreateInput = {
    id?: string
    profileId: string
    name: string
    issuer: string
    issueDate?: Date | string | null
    expiryDate?: Date | string | null
    url?: string | null
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CertificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    issuer?: StringFieldUpdateOperationsInput | string
    issueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneRequiredWithoutCertificationsNestedInput
  }

  export type CertificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    issuer?: StringFieldUpdateOperationsInput | string
    issueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CertificationCreateManyInput = {
    id?: string
    profileId: string
    name: string
    issuer: string
    issueDate?: Date | string | null
    expiryDate?: Date | string | null
    url?: string | null
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CertificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    issuer?: StringFieldUpdateOperationsInput | string
    issueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CertificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    issuer?: StringFieldUpdateOperationsInput | string
    issueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LanguageCreateInput = {
    id?: string
    name: string
    proficiency?: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    profile: ProfileCreateNestedOneWithoutLanguagesInput
  }

  export type LanguageUncheckedCreateInput = {
    id?: string
    profileId: string
    name: string
    proficiency?: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LanguageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    proficiency?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneRequiredWithoutLanguagesNestedInput
  }

  export type LanguageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    proficiency?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LanguageCreateManyInput = {
    id?: string
    profileId: string
    name: string
    proficiency?: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LanguageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    proficiency?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LanguageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    proficiency?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AwardCreateInput = {
    id?: string
    title: string
    issuer?: string | null
    date?: Date | string | null
    description?: string | null
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    profile: ProfileCreateNestedOneWithoutAwardsInput
  }

  export type AwardUncheckedCreateInput = {
    id?: string
    profileId: string
    title: string
    issuer?: string | null
    date?: Date | string | null
    description?: string | null
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AwardUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    issuer?: NullableStringFieldUpdateOperationsInput | string | null
    date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneRequiredWithoutAwardsNestedInput
  }

  export type AwardUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    issuer?: NullableStringFieldUpdateOperationsInput | string | null
    date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AwardCreateManyInput = {
    id?: string
    profileId: string
    title: string
    issuer?: string | null
    date?: Date | string | null
    description?: string | null
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AwardUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    issuer?: NullableStringFieldUpdateOperationsInput | string | null
    date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AwardUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    issuer?: NullableStringFieldUpdateOperationsInput | string | null
    date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HobbyCreateInput = {
    id?: string
    name: string
    description?: string | null
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    profile: ProfileCreateNestedOneWithoutHobbiesInput
  }

  export type HobbyUncheckedCreateInput = {
    id?: string
    profileId: string
    name: string
    description?: string | null
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type HobbyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneRequiredWithoutHobbiesNestedInput
  }

  export type HobbyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HobbyCreateManyInput = {
    id?: string
    profileId: string
    name: string
    description?: string | null
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type HobbyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HobbyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ProjectListRelationFilter = {
    every?: ProjectWhereInput
    some?: ProjectWhereInput
    none?: ProjectWhereInput
  }

  export type SkillListRelationFilter = {
    every?: SkillWhereInput
    some?: SkillWhereInput
    none?: SkillWhereInput
  }

  export type ExperienceListRelationFilter = {
    every?: ExperienceWhereInput
    some?: ExperienceWhereInput
    none?: ExperienceWhereInput
  }

  export type SocialLinkListRelationFilter = {
    every?: SocialLinkWhereInput
    some?: SocialLinkWhereInput
    none?: SocialLinkWhereInput
  }

  export type SkillCategoryListRelationFilter = {
    every?: SkillCategoryWhereInput
    some?: SkillCategoryWhereInput
    none?: SkillCategoryWhereInput
  }

  export type EducationListRelationFilter = {
    every?: EducationWhereInput
    some?: EducationWhereInput
    none?: EducationWhereInput
  }

  export type CertificationListRelationFilter = {
    every?: CertificationWhereInput
    some?: CertificationWhereInput
    none?: CertificationWhereInput
  }

  export type LanguageListRelationFilter = {
    every?: LanguageWhereInput
    some?: LanguageWhereInput
    none?: LanguageWhereInput
  }

  export type AwardListRelationFilter = {
    every?: AwardWhereInput
    some?: AwardWhereInput
    none?: AwardWhereInput
  }

  export type HobbyListRelationFilter = {
    every?: HobbyWhereInput
    some?: HobbyWhereInput
    none?: HobbyWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ProjectOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SkillOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ExperienceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SocialLinkOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SkillCategoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EducationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CertificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LanguageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AwardOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type HobbyOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProfileCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    email?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    avatarUrl?: SortOrder
    bio?: SortOrder
    headline?: SortOrder
    location?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    email?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    avatarUrl?: SortOrder
    bio?: SortOrder
    headline?: SortOrder
    location?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProfileMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    email?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    avatarUrl?: SortOrder
    bio?: SortOrder
    headline?: SortOrder
    location?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type ProfileScalarRelationFilter = {
    is?: ProfileWhereInput
    isNot?: ProfileWhereInput
  }

  export type SocialLinkCountOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    platform?: SortOrder
    url?: SortOrder
    label?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SocialLinkAvgOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type SocialLinkMaxOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    platform?: SortOrder
    url?: SortOrder
    label?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SocialLinkMinOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    platform?: SortOrder
    url?: SortOrder
    label?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SocialLinkSumOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type SkillCategoryProfileIdNameCompoundUniqueInput = {
    profileId: string
    name: string
  }

  export type SkillCategoryCountOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    name?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SkillCategoryAvgOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type SkillCategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    name?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SkillCategoryMinOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    name?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SkillCategorySumOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type ProjectCountOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    images?: SortOrder
    liveUrl?: SortOrder
    repoUrl?: SortOrder
    tags?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectAvgOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type ProjectMaxOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    liveUrl?: SortOrder
    repoUrl?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectMinOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    liveUrl?: SortOrder
    repoUrl?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectSumOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type EnumProficiencyFilter<$PrismaModel = never> = {
    equals?: $Enums.Proficiency | EnumProficiencyFieldRefInput<$PrismaModel>
    in?: $Enums.Proficiency[] | ListEnumProficiencyFieldRefInput<$PrismaModel>
    notIn?: $Enums.Proficiency[] | ListEnumProficiencyFieldRefInput<$PrismaModel>
    not?: NestedEnumProficiencyFilter<$PrismaModel> | $Enums.Proficiency
  }

  export type SkillCategoryNullableScalarRelationFilter = {
    is?: SkillCategoryWhereInput | null
    isNot?: SkillCategoryWhereInput | null
  }

  export type SkillCountOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    name?: SortOrder
    categoryId?: SortOrder
    proficiency?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SkillAvgOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type SkillMaxOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    name?: SortOrder
    categoryId?: SortOrder
    proficiency?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SkillMinOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    name?: SortOrder
    categoryId?: SortOrder
    proficiency?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SkillSumOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type EnumProficiencyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Proficiency | EnumProficiencyFieldRefInput<$PrismaModel>
    in?: $Enums.Proficiency[] | ListEnumProficiencyFieldRefInput<$PrismaModel>
    notIn?: $Enums.Proficiency[] | ListEnumProficiencyFieldRefInput<$PrismaModel>
    not?: NestedEnumProficiencyWithAggregatesFilter<$PrismaModel> | $Enums.Proficiency
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProficiencyFilter<$PrismaModel>
    _max?: NestedEnumProficiencyFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type ExperienceCountOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    company?: SortOrder
    role?: SortOrder
    description?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExperienceAvgOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type ExperienceMaxOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    company?: SortOrder
    role?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExperienceMinOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    company?: SortOrder
    role?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExperienceSumOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EducationCountOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    school?: SortOrder
    degree?: SortOrder
    field?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    description?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EducationAvgOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type EducationMaxOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    school?: SortOrder
    degree?: SortOrder
    field?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EducationMinOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    school?: SortOrder
    degree?: SortOrder
    field?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EducationSumOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type CertificationCountOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    name?: SortOrder
    issuer?: SortOrder
    issueDate?: SortOrder
    expiryDate?: SortOrder
    url?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CertificationAvgOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type CertificationMaxOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    name?: SortOrder
    issuer?: SortOrder
    issueDate?: SortOrder
    expiryDate?: SortOrder
    url?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CertificationMinOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    name?: SortOrder
    issuer?: SortOrder
    issueDate?: SortOrder
    expiryDate?: SortOrder
    url?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CertificationSumOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type LanguageCountOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    name?: SortOrder
    proficiency?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LanguageAvgOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type LanguageMaxOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    name?: SortOrder
    proficiency?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LanguageMinOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    name?: SortOrder
    proficiency?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LanguageSumOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type AwardCountOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    title?: SortOrder
    issuer?: SortOrder
    date?: SortOrder
    description?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AwardAvgOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type AwardMaxOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    title?: SortOrder
    issuer?: SortOrder
    date?: SortOrder
    description?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AwardMinOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    title?: SortOrder
    issuer?: SortOrder
    date?: SortOrder
    description?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AwardSumOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type HobbyCountOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type HobbyAvgOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type HobbyMaxOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type HobbyMinOrderByAggregateInput = {
    id?: SortOrder
    profileId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type HobbySumOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type ProjectCreateNestedManyWithoutProfileInput = {
    create?: XOR<ProjectCreateWithoutProfileInput, ProjectUncheckedCreateWithoutProfileInput> | ProjectCreateWithoutProfileInput[] | ProjectUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutProfileInput | ProjectCreateOrConnectWithoutProfileInput[]
    createMany?: ProjectCreateManyProfileInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type SkillCreateNestedManyWithoutProfileInput = {
    create?: XOR<SkillCreateWithoutProfileInput, SkillUncheckedCreateWithoutProfileInput> | SkillCreateWithoutProfileInput[] | SkillUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: SkillCreateOrConnectWithoutProfileInput | SkillCreateOrConnectWithoutProfileInput[]
    createMany?: SkillCreateManyProfileInputEnvelope
    connect?: SkillWhereUniqueInput | SkillWhereUniqueInput[]
  }

  export type ExperienceCreateNestedManyWithoutProfileInput = {
    create?: XOR<ExperienceCreateWithoutProfileInput, ExperienceUncheckedCreateWithoutProfileInput> | ExperienceCreateWithoutProfileInput[] | ExperienceUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ExperienceCreateOrConnectWithoutProfileInput | ExperienceCreateOrConnectWithoutProfileInput[]
    createMany?: ExperienceCreateManyProfileInputEnvelope
    connect?: ExperienceWhereUniqueInput | ExperienceWhereUniqueInput[]
  }

  export type SocialLinkCreateNestedManyWithoutProfileInput = {
    create?: XOR<SocialLinkCreateWithoutProfileInput, SocialLinkUncheckedCreateWithoutProfileInput> | SocialLinkCreateWithoutProfileInput[] | SocialLinkUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: SocialLinkCreateOrConnectWithoutProfileInput | SocialLinkCreateOrConnectWithoutProfileInput[]
    createMany?: SocialLinkCreateManyProfileInputEnvelope
    connect?: SocialLinkWhereUniqueInput | SocialLinkWhereUniqueInput[]
  }

  export type SkillCategoryCreateNestedManyWithoutProfileInput = {
    create?: XOR<SkillCategoryCreateWithoutProfileInput, SkillCategoryUncheckedCreateWithoutProfileInput> | SkillCategoryCreateWithoutProfileInput[] | SkillCategoryUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: SkillCategoryCreateOrConnectWithoutProfileInput | SkillCategoryCreateOrConnectWithoutProfileInput[]
    createMany?: SkillCategoryCreateManyProfileInputEnvelope
    connect?: SkillCategoryWhereUniqueInput | SkillCategoryWhereUniqueInput[]
  }

  export type EducationCreateNestedManyWithoutProfileInput = {
    create?: XOR<EducationCreateWithoutProfileInput, EducationUncheckedCreateWithoutProfileInput> | EducationCreateWithoutProfileInput[] | EducationUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: EducationCreateOrConnectWithoutProfileInput | EducationCreateOrConnectWithoutProfileInput[]
    createMany?: EducationCreateManyProfileInputEnvelope
    connect?: EducationWhereUniqueInput | EducationWhereUniqueInput[]
  }

  export type CertificationCreateNestedManyWithoutProfileInput = {
    create?: XOR<CertificationCreateWithoutProfileInput, CertificationUncheckedCreateWithoutProfileInput> | CertificationCreateWithoutProfileInput[] | CertificationUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: CertificationCreateOrConnectWithoutProfileInput | CertificationCreateOrConnectWithoutProfileInput[]
    createMany?: CertificationCreateManyProfileInputEnvelope
    connect?: CertificationWhereUniqueInput | CertificationWhereUniqueInput[]
  }

  export type LanguageCreateNestedManyWithoutProfileInput = {
    create?: XOR<LanguageCreateWithoutProfileInput, LanguageUncheckedCreateWithoutProfileInput> | LanguageCreateWithoutProfileInput[] | LanguageUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: LanguageCreateOrConnectWithoutProfileInput | LanguageCreateOrConnectWithoutProfileInput[]
    createMany?: LanguageCreateManyProfileInputEnvelope
    connect?: LanguageWhereUniqueInput | LanguageWhereUniqueInput[]
  }

  export type AwardCreateNestedManyWithoutProfileInput = {
    create?: XOR<AwardCreateWithoutProfileInput, AwardUncheckedCreateWithoutProfileInput> | AwardCreateWithoutProfileInput[] | AwardUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: AwardCreateOrConnectWithoutProfileInput | AwardCreateOrConnectWithoutProfileInput[]
    createMany?: AwardCreateManyProfileInputEnvelope
    connect?: AwardWhereUniqueInput | AwardWhereUniqueInput[]
  }

  export type HobbyCreateNestedManyWithoutProfileInput = {
    create?: XOR<HobbyCreateWithoutProfileInput, HobbyUncheckedCreateWithoutProfileInput> | HobbyCreateWithoutProfileInput[] | HobbyUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: HobbyCreateOrConnectWithoutProfileInput | HobbyCreateOrConnectWithoutProfileInput[]
    createMany?: HobbyCreateManyProfileInputEnvelope
    connect?: HobbyWhereUniqueInput | HobbyWhereUniqueInput[]
  }

  export type ProjectUncheckedCreateNestedManyWithoutProfileInput = {
    create?: XOR<ProjectCreateWithoutProfileInput, ProjectUncheckedCreateWithoutProfileInput> | ProjectCreateWithoutProfileInput[] | ProjectUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutProfileInput | ProjectCreateOrConnectWithoutProfileInput[]
    createMany?: ProjectCreateManyProfileInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type SkillUncheckedCreateNestedManyWithoutProfileInput = {
    create?: XOR<SkillCreateWithoutProfileInput, SkillUncheckedCreateWithoutProfileInput> | SkillCreateWithoutProfileInput[] | SkillUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: SkillCreateOrConnectWithoutProfileInput | SkillCreateOrConnectWithoutProfileInput[]
    createMany?: SkillCreateManyProfileInputEnvelope
    connect?: SkillWhereUniqueInput | SkillWhereUniqueInput[]
  }

  export type ExperienceUncheckedCreateNestedManyWithoutProfileInput = {
    create?: XOR<ExperienceCreateWithoutProfileInput, ExperienceUncheckedCreateWithoutProfileInput> | ExperienceCreateWithoutProfileInput[] | ExperienceUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ExperienceCreateOrConnectWithoutProfileInput | ExperienceCreateOrConnectWithoutProfileInput[]
    createMany?: ExperienceCreateManyProfileInputEnvelope
    connect?: ExperienceWhereUniqueInput | ExperienceWhereUniqueInput[]
  }

  export type SocialLinkUncheckedCreateNestedManyWithoutProfileInput = {
    create?: XOR<SocialLinkCreateWithoutProfileInput, SocialLinkUncheckedCreateWithoutProfileInput> | SocialLinkCreateWithoutProfileInput[] | SocialLinkUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: SocialLinkCreateOrConnectWithoutProfileInput | SocialLinkCreateOrConnectWithoutProfileInput[]
    createMany?: SocialLinkCreateManyProfileInputEnvelope
    connect?: SocialLinkWhereUniqueInput | SocialLinkWhereUniqueInput[]
  }

  export type SkillCategoryUncheckedCreateNestedManyWithoutProfileInput = {
    create?: XOR<SkillCategoryCreateWithoutProfileInput, SkillCategoryUncheckedCreateWithoutProfileInput> | SkillCategoryCreateWithoutProfileInput[] | SkillCategoryUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: SkillCategoryCreateOrConnectWithoutProfileInput | SkillCategoryCreateOrConnectWithoutProfileInput[]
    createMany?: SkillCategoryCreateManyProfileInputEnvelope
    connect?: SkillCategoryWhereUniqueInput | SkillCategoryWhereUniqueInput[]
  }

  export type EducationUncheckedCreateNestedManyWithoutProfileInput = {
    create?: XOR<EducationCreateWithoutProfileInput, EducationUncheckedCreateWithoutProfileInput> | EducationCreateWithoutProfileInput[] | EducationUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: EducationCreateOrConnectWithoutProfileInput | EducationCreateOrConnectWithoutProfileInput[]
    createMany?: EducationCreateManyProfileInputEnvelope
    connect?: EducationWhereUniqueInput | EducationWhereUniqueInput[]
  }

  export type CertificationUncheckedCreateNestedManyWithoutProfileInput = {
    create?: XOR<CertificationCreateWithoutProfileInput, CertificationUncheckedCreateWithoutProfileInput> | CertificationCreateWithoutProfileInput[] | CertificationUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: CertificationCreateOrConnectWithoutProfileInput | CertificationCreateOrConnectWithoutProfileInput[]
    createMany?: CertificationCreateManyProfileInputEnvelope
    connect?: CertificationWhereUniqueInput | CertificationWhereUniqueInput[]
  }

  export type LanguageUncheckedCreateNestedManyWithoutProfileInput = {
    create?: XOR<LanguageCreateWithoutProfileInput, LanguageUncheckedCreateWithoutProfileInput> | LanguageCreateWithoutProfileInput[] | LanguageUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: LanguageCreateOrConnectWithoutProfileInput | LanguageCreateOrConnectWithoutProfileInput[]
    createMany?: LanguageCreateManyProfileInputEnvelope
    connect?: LanguageWhereUniqueInput | LanguageWhereUniqueInput[]
  }

  export type AwardUncheckedCreateNestedManyWithoutProfileInput = {
    create?: XOR<AwardCreateWithoutProfileInput, AwardUncheckedCreateWithoutProfileInput> | AwardCreateWithoutProfileInput[] | AwardUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: AwardCreateOrConnectWithoutProfileInput | AwardCreateOrConnectWithoutProfileInput[]
    createMany?: AwardCreateManyProfileInputEnvelope
    connect?: AwardWhereUniqueInput | AwardWhereUniqueInput[]
  }

  export type HobbyUncheckedCreateNestedManyWithoutProfileInput = {
    create?: XOR<HobbyCreateWithoutProfileInput, HobbyUncheckedCreateWithoutProfileInput> | HobbyCreateWithoutProfileInput[] | HobbyUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: HobbyCreateOrConnectWithoutProfileInput | HobbyCreateOrConnectWithoutProfileInput[]
    createMany?: HobbyCreateManyProfileInputEnvelope
    connect?: HobbyWhereUniqueInput | HobbyWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ProjectUpdateManyWithoutProfileNestedInput = {
    create?: XOR<ProjectCreateWithoutProfileInput, ProjectUncheckedCreateWithoutProfileInput> | ProjectCreateWithoutProfileInput[] | ProjectUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutProfileInput | ProjectCreateOrConnectWithoutProfileInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutProfileInput | ProjectUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: ProjectCreateManyProfileInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutProfileInput | ProjectUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutProfileInput | ProjectUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type SkillUpdateManyWithoutProfileNestedInput = {
    create?: XOR<SkillCreateWithoutProfileInput, SkillUncheckedCreateWithoutProfileInput> | SkillCreateWithoutProfileInput[] | SkillUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: SkillCreateOrConnectWithoutProfileInput | SkillCreateOrConnectWithoutProfileInput[]
    upsert?: SkillUpsertWithWhereUniqueWithoutProfileInput | SkillUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: SkillCreateManyProfileInputEnvelope
    set?: SkillWhereUniqueInput | SkillWhereUniqueInput[]
    disconnect?: SkillWhereUniqueInput | SkillWhereUniqueInput[]
    delete?: SkillWhereUniqueInput | SkillWhereUniqueInput[]
    connect?: SkillWhereUniqueInput | SkillWhereUniqueInput[]
    update?: SkillUpdateWithWhereUniqueWithoutProfileInput | SkillUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: SkillUpdateManyWithWhereWithoutProfileInput | SkillUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: SkillScalarWhereInput | SkillScalarWhereInput[]
  }

  export type ExperienceUpdateManyWithoutProfileNestedInput = {
    create?: XOR<ExperienceCreateWithoutProfileInput, ExperienceUncheckedCreateWithoutProfileInput> | ExperienceCreateWithoutProfileInput[] | ExperienceUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ExperienceCreateOrConnectWithoutProfileInput | ExperienceCreateOrConnectWithoutProfileInput[]
    upsert?: ExperienceUpsertWithWhereUniqueWithoutProfileInput | ExperienceUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: ExperienceCreateManyProfileInputEnvelope
    set?: ExperienceWhereUniqueInput | ExperienceWhereUniqueInput[]
    disconnect?: ExperienceWhereUniqueInput | ExperienceWhereUniqueInput[]
    delete?: ExperienceWhereUniqueInput | ExperienceWhereUniqueInput[]
    connect?: ExperienceWhereUniqueInput | ExperienceWhereUniqueInput[]
    update?: ExperienceUpdateWithWhereUniqueWithoutProfileInput | ExperienceUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: ExperienceUpdateManyWithWhereWithoutProfileInput | ExperienceUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: ExperienceScalarWhereInput | ExperienceScalarWhereInput[]
  }

  export type SocialLinkUpdateManyWithoutProfileNestedInput = {
    create?: XOR<SocialLinkCreateWithoutProfileInput, SocialLinkUncheckedCreateWithoutProfileInput> | SocialLinkCreateWithoutProfileInput[] | SocialLinkUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: SocialLinkCreateOrConnectWithoutProfileInput | SocialLinkCreateOrConnectWithoutProfileInput[]
    upsert?: SocialLinkUpsertWithWhereUniqueWithoutProfileInput | SocialLinkUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: SocialLinkCreateManyProfileInputEnvelope
    set?: SocialLinkWhereUniqueInput | SocialLinkWhereUniqueInput[]
    disconnect?: SocialLinkWhereUniqueInput | SocialLinkWhereUniqueInput[]
    delete?: SocialLinkWhereUniqueInput | SocialLinkWhereUniqueInput[]
    connect?: SocialLinkWhereUniqueInput | SocialLinkWhereUniqueInput[]
    update?: SocialLinkUpdateWithWhereUniqueWithoutProfileInput | SocialLinkUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: SocialLinkUpdateManyWithWhereWithoutProfileInput | SocialLinkUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: SocialLinkScalarWhereInput | SocialLinkScalarWhereInput[]
  }

  export type SkillCategoryUpdateManyWithoutProfileNestedInput = {
    create?: XOR<SkillCategoryCreateWithoutProfileInput, SkillCategoryUncheckedCreateWithoutProfileInput> | SkillCategoryCreateWithoutProfileInput[] | SkillCategoryUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: SkillCategoryCreateOrConnectWithoutProfileInput | SkillCategoryCreateOrConnectWithoutProfileInput[]
    upsert?: SkillCategoryUpsertWithWhereUniqueWithoutProfileInput | SkillCategoryUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: SkillCategoryCreateManyProfileInputEnvelope
    set?: SkillCategoryWhereUniqueInput | SkillCategoryWhereUniqueInput[]
    disconnect?: SkillCategoryWhereUniqueInput | SkillCategoryWhereUniqueInput[]
    delete?: SkillCategoryWhereUniqueInput | SkillCategoryWhereUniqueInput[]
    connect?: SkillCategoryWhereUniqueInput | SkillCategoryWhereUniqueInput[]
    update?: SkillCategoryUpdateWithWhereUniqueWithoutProfileInput | SkillCategoryUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: SkillCategoryUpdateManyWithWhereWithoutProfileInput | SkillCategoryUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: SkillCategoryScalarWhereInput | SkillCategoryScalarWhereInput[]
  }

  export type EducationUpdateManyWithoutProfileNestedInput = {
    create?: XOR<EducationCreateWithoutProfileInput, EducationUncheckedCreateWithoutProfileInput> | EducationCreateWithoutProfileInput[] | EducationUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: EducationCreateOrConnectWithoutProfileInput | EducationCreateOrConnectWithoutProfileInput[]
    upsert?: EducationUpsertWithWhereUniqueWithoutProfileInput | EducationUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: EducationCreateManyProfileInputEnvelope
    set?: EducationWhereUniqueInput | EducationWhereUniqueInput[]
    disconnect?: EducationWhereUniqueInput | EducationWhereUniqueInput[]
    delete?: EducationWhereUniqueInput | EducationWhereUniqueInput[]
    connect?: EducationWhereUniqueInput | EducationWhereUniqueInput[]
    update?: EducationUpdateWithWhereUniqueWithoutProfileInput | EducationUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: EducationUpdateManyWithWhereWithoutProfileInput | EducationUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: EducationScalarWhereInput | EducationScalarWhereInput[]
  }

  export type CertificationUpdateManyWithoutProfileNestedInput = {
    create?: XOR<CertificationCreateWithoutProfileInput, CertificationUncheckedCreateWithoutProfileInput> | CertificationCreateWithoutProfileInput[] | CertificationUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: CertificationCreateOrConnectWithoutProfileInput | CertificationCreateOrConnectWithoutProfileInput[]
    upsert?: CertificationUpsertWithWhereUniqueWithoutProfileInput | CertificationUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: CertificationCreateManyProfileInputEnvelope
    set?: CertificationWhereUniqueInput | CertificationWhereUniqueInput[]
    disconnect?: CertificationWhereUniqueInput | CertificationWhereUniqueInput[]
    delete?: CertificationWhereUniqueInput | CertificationWhereUniqueInput[]
    connect?: CertificationWhereUniqueInput | CertificationWhereUniqueInput[]
    update?: CertificationUpdateWithWhereUniqueWithoutProfileInput | CertificationUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: CertificationUpdateManyWithWhereWithoutProfileInput | CertificationUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: CertificationScalarWhereInput | CertificationScalarWhereInput[]
  }

  export type LanguageUpdateManyWithoutProfileNestedInput = {
    create?: XOR<LanguageCreateWithoutProfileInput, LanguageUncheckedCreateWithoutProfileInput> | LanguageCreateWithoutProfileInput[] | LanguageUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: LanguageCreateOrConnectWithoutProfileInput | LanguageCreateOrConnectWithoutProfileInput[]
    upsert?: LanguageUpsertWithWhereUniqueWithoutProfileInput | LanguageUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: LanguageCreateManyProfileInputEnvelope
    set?: LanguageWhereUniqueInput | LanguageWhereUniqueInput[]
    disconnect?: LanguageWhereUniqueInput | LanguageWhereUniqueInput[]
    delete?: LanguageWhereUniqueInput | LanguageWhereUniqueInput[]
    connect?: LanguageWhereUniqueInput | LanguageWhereUniqueInput[]
    update?: LanguageUpdateWithWhereUniqueWithoutProfileInput | LanguageUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: LanguageUpdateManyWithWhereWithoutProfileInput | LanguageUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: LanguageScalarWhereInput | LanguageScalarWhereInput[]
  }

  export type AwardUpdateManyWithoutProfileNestedInput = {
    create?: XOR<AwardCreateWithoutProfileInput, AwardUncheckedCreateWithoutProfileInput> | AwardCreateWithoutProfileInput[] | AwardUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: AwardCreateOrConnectWithoutProfileInput | AwardCreateOrConnectWithoutProfileInput[]
    upsert?: AwardUpsertWithWhereUniqueWithoutProfileInput | AwardUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: AwardCreateManyProfileInputEnvelope
    set?: AwardWhereUniqueInput | AwardWhereUniqueInput[]
    disconnect?: AwardWhereUniqueInput | AwardWhereUniqueInput[]
    delete?: AwardWhereUniqueInput | AwardWhereUniqueInput[]
    connect?: AwardWhereUniqueInput | AwardWhereUniqueInput[]
    update?: AwardUpdateWithWhereUniqueWithoutProfileInput | AwardUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: AwardUpdateManyWithWhereWithoutProfileInput | AwardUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: AwardScalarWhereInput | AwardScalarWhereInput[]
  }

  export type HobbyUpdateManyWithoutProfileNestedInput = {
    create?: XOR<HobbyCreateWithoutProfileInput, HobbyUncheckedCreateWithoutProfileInput> | HobbyCreateWithoutProfileInput[] | HobbyUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: HobbyCreateOrConnectWithoutProfileInput | HobbyCreateOrConnectWithoutProfileInput[]
    upsert?: HobbyUpsertWithWhereUniqueWithoutProfileInput | HobbyUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: HobbyCreateManyProfileInputEnvelope
    set?: HobbyWhereUniqueInput | HobbyWhereUniqueInput[]
    disconnect?: HobbyWhereUniqueInput | HobbyWhereUniqueInput[]
    delete?: HobbyWhereUniqueInput | HobbyWhereUniqueInput[]
    connect?: HobbyWhereUniqueInput | HobbyWhereUniqueInput[]
    update?: HobbyUpdateWithWhereUniqueWithoutProfileInput | HobbyUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: HobbyUpdateManyWithWhereWithoutProfileInput | HobbyUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: HobbyScalarWhereInput | HobbyScalarWhereInput[]
  }

  export type ProjectUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: XOR<ProjectCreateWithoutProfileInput, ProjectUncheckedCreateWithoutProfileInput> | ProjectCreateWithoutProfileInput[] | ProjectUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutProfileInput | ProjectCreateOrConnectWithoutProfileInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutProfileInput | ProjectUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: ProjectCreateManyProfileInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutProfileInput | ProjectUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutProfileInput | ProjectUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type SkillUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: XOR<SkillCreateWithoutProfileInput, SkillUncheckedCreateWithoutProfileInput> | SkillCreateWithoutProfileInput[] | SkillUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: SkillCreateOrConnectWithoutProfileInput | SkillCreateOrConnectWithoutProfileInput[]
    upsert?: SkillUpsertWithWhereUniqueWithoutProfileInput | SkillUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: SkillCreateManyProfileInputEnvelope
    set?: SkillWhereUniqueInput | SkillWhereUniqueInput[]
    disconnect?: SkillWhereUniqueInput | SkillWhereUniqueInput[]
    delete?: SkillWhereUniqueInput | SkillWhereUniqueInput[]
    connect?: SkillWhereUniqueInput | SkillWhereUniqueInput[]
    update?: SkillUpdateWithWhereUniqueWithoutProfileInput | SkillUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: SkillUpdateManyWithWhereWithoutProfileInput | SkillUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: SkillScalarWhereInput | SkillScalarWhereInput[]
  }

  export type ExperienceUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: XOR<ExperienceCreateWithoutProfileInput, ExperienceUncheckedCreateWithoutProfileInput> | ExperienceCreateWithoutProfileInput[] | ExperienceUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: ExperienceCreateOrConnectWithoutProfileInput | ExperienceCreateOrConnectWithoutProfileInput[]
    upsert?: ExperienceUpsertWithWhereUniqueWithoutProfileInput | ExperienceUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: ExperienceCreateManyProfileInputEnvelope
    set?: ExperienceWhereUniqueInput | ExperienceWhereUniqueInput[]
    disconnect?: ExperienceWhereUniqueInput | ExperienceWhereUniqueInput[]
    delete?: ExperienceWhereUniqueInput | ExperienceWhereUniqueInput[]
    connect?: ExperienceWhereUniqueInput | ExperienceWhereUniqueInput[]
    update?: ExperienceUpdateWithWhereUniqueWithoutProfileInput | ExperienceUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: ExperienceUpdateManyWithWhereWithoutProfileInput | ExperienceUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: ExperienceScalarWhereInput | ExperienceScalarWhereInput[]
  }

  export type SocialLinkUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: XOR<SocialLinkCreateWithoutProfileInput, SocialLinkUncheckedCreateWithoutProfileInput> | SocialLinkCreateWithoutProfileInput[] | SocialLinkUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: SocialLinkCreateOrConnectWithoutProfileInput | SocialLinkCreateOrConnectWithoutProfileInput[]
    upsert?: SocialLinkUpsertWithWhereUniqueWithoutProfileInput | SocialLinkUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: SocialLinkCreateManyProfileInputEnvelope
    set?: SocialLinkWhereUniqueInput | SocialLinkWhereUniqueInput[]
    disconnect?: SocialLinkWhereUniqueInput | SocialLinkWhereUniqueInput[]
    delete?: SocialLinkWhereUniqueInput | SocialLinkWhereUniqueInput[]
    connect?: SocialLinkWhereUniqueInput | SocialLinkWhereUniqueInput[]
    update?: SocialLinkUpdateWithWhereUniqueWithoutProfileInput | SocialLinkUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: SocialLinkUpdateManyWithWhereWithoutProfileInput | SocialLinkUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: SocialLinkScalarWhereInput | SocialLinkScalarWhereInput[]
  }

  export type SkillCategoryUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: XOR<SkillCategoryCreateWithoutProfileInput, SkillCategoryUncheckedCreateWithoutProfileInput> | SkillCategoryCreateWithoutProfileInput[] | SkillCategoryUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: SkillCategoryCreateOrConnectWithoutProfileInput | SkillCategoryCreateOrConnectWithoutProfileInput[]
    upsert?: SkillCategoryUpsertWithWhereUniqueWithoutProfileInput | SkillCategoryUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: SkillCategoryCreateManyProfileInputEnvelope
    set?: SkillCategoryWhereUniqueInput | SkillCategoryWhereUniqueInput[]
    disconnect?: SkillCategoryWhereUniqueInput | SkillCategoryWhereUniqueInput[]
    delete?: SkillCategoryWhereUniqueInput | SkillCategoryWhereUniqueInput[]
    connect?: SkillCategoryWhereUniqueInput | SkillCategoryWhereUniqueInput[]
    update?: SkillCategoryUpdateWithWhereUniqueWithoutProfileInput | SkillCategoryUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: SkillCategoryUpdateManyWithWhereWithoutProfileInput | SkillCategoryUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: SkillCategoryScalarWhereInput | SkillCategoryScalarWhereInput[]
  }

  export type EducationUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: XOR<EducationCreateWithoutProfileInput, EducationUncheckedCreateWithoutProfileInput> | EducationCreateWithoutProfileInput[] | EducationUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: EducationCreateOrConnectWithoutProfileInput | EducationCreateOrConnectWithoutProfileInput[]
    upsert?: EducationUpsertWithWhereUniqueWithoutProfileInput | EducationUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: EducationCreateManyProfileInputEnvelope
    set?: EducationWhereUniqueInput | EducationWhereUniqueInput[]
    disconnect?: EducationWhereUniqueInput | EducationWhereUniqueInput[]
    delete?: EducationWhereUniqueInput | EducationWhereUniqueInput[]
    connect?: EducationWhereUniqueInput | EducationWhereUniqueInput[]
    update?: EducationUpdateWithWhereUniqueWithoutProfileInput | EducationUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: EducationUpdateManyWithWhereWithoutProfileInput | EducationUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: EducationScalarWhereInput | EducationScalarWhereInput[]
  }

  export type CertificationUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: XOR<CertificationCreateWithoutProfileInput, CertificationUncheckedCreateWithoutProfileInput> | CertificationCreateWithoutProfileInput[] | CertificationUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: CertificationCreateOrConnectWithoutProfileInput | CertificationCreateOrConnectWithoutProfileInput[]
    upsert?: CertificationUpsertWithWhereUniqueWithoutProfileInput | CertificationUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: CertificationCreateManyProfileInputEnvelope
    set?: CertificationWhereUniqueInput | CertificationWhereUniqueInput[]
    disconnect?: CertificationWhereUniqueInput | CertificationWhereUniqueInput[]
    delete?: CertificationWhereUniqueInput | CertificationWhereUniqueInput[]
    connect?: CertificationWhereUniqueInput | CertificationWhereUniqueInput[]
    update?: CertificationUpdateWithWhereUniqueWithoutProfileInput | CertificationUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: CertificationUpdateManyWithWhereWithoutProfileInput | CertificationUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: CertificationScalarWhereInput | CertificationScalarWhereInput[]
  }

  export type LanguageUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: XOR<LanguageCreateWithoutProfileInput, LanguageUncheckedCreateWithoutProfileInput> | LanguageCreateWithoutProfileInput[] | LanguageUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: LanguageCreateOrConnectWithoutProfileInput | LanguageCreateOrConnectWithoutProfileInput[]
    upsert?: LanguageUpsertWithWhereUniqueWithoutProfileInput | LanguageUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: LanguageCreateManyProfileInputEnvelope
    set?: LanguageWhereUniqueInput | LanguageWhereUniqueInput[]
    disconnect?: LanguageWhereUniqueInput | LanguageWhereUniqueInput[]
    delete?: LanguageWhereUniqueInput | LanguageWhereUniqueInput[]
    connect?: LanguageWhereUniqueInput | LanguageWhereUniqueInput[]
    update?: LanguageUpdateWithWhereUniqueWithoutProfileInput | LanguageUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: LanguageUpdateManyWithWhereWithoutProfileInput | LanguageUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: LanguageScalarWhereInput | LanguageScalarWhereInput[]
  }

  export type AwardUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: XOR<AwardCreateWithoutProfileInput, AwardUncheckedCreateWithoutProfileInput> | AwardCreateWithoutProfileInput[] | AwardUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: AwardCreateOrConnectWithoutProfileInput | AwardCreateOrConnectWithoutProfileInput[]
    upsert?: AwardUpsertWithWhereUniqueWithoutProfileInput | AwardUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: AwardCreateManyProfileInputEnvelope
    set?: AwardWhereUniqueInput | AwardWhereUniqueInput[]
    disconnect?: AwardWhereUniqueInput | AwardWhereUniqueInput[]
    delete?: AwardWhereUniqueInput | AwardWhereUniqueInput[]
    connect?: AwardWhereUniqueInput | AwardWhereUniqueInput[]
    update?: AwardUpdateWithWhereUniqueWithoutProfileInput | AwardUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: AwardUpdateManyWithWhereWithoutProfileInput | AwardUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: AwardScalarWhereInput | AwardScalarWhereInput[]
  }

  export type HobbyUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: XOR<HobbyCreateWithoutProfileInput, HobbyUncheckedCreateWithoutProfileInput> | HobbyCreateWithoutProfileInput[] | HobbyUncheckedCreateWithoutProfileInput[]
    connectOrCreate?: HobbyCreateOrConnectWithoutProfileInput | HobbyCreateOrConnectWithoutProfileInput[]
    upsert?: HobbyUpsertWithWhereUniqueWithoutProfileInput | HobbyUpsertWithWhereUniqueWithoutProfileInput[]
    createMany?: HobbyCreateManyProfileInputEnvelope
    set?: HobbyWhereUniqueInput | HobbyWhereUniqueInput[]
    disconnect?: HobbyWhereUniqueInput | HobbyWhereUniqueInput[]
    delete?: HobbyWhereUniqueInput | HobbyWhereUniqueInput[]
    connect?: HobbyWhereUniqueInput | HobbyWhereUniqueInput[]
    update?: HobbyUpdateWithWhereUniqueWithoutProfileInput | HobbyUpdateWithWhereUniqueWithoutProfileInput[]
    updateMany?: HobbyUpdateManyWithWhereWithoutProfileInput | HobbyUpdateManyWithWhereWithoutProfileInput[]
    deleteMany?: HobbyScalarWhereInput | HobbyScalarWhereInput[]
  }

  export type ProfileCreateNestedOneWithoutSocialLinksInput = {
    create?: XOR<ProfileCreateWithoutSocialLinksInput, ProfileUncheckedCreateWithoutSocialLinksInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutSocialLinksInput
    connect?: ProfileWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ProfileUpdateOneRequiredWithoutSocialLinksNestedInput = {
    create?: XOR<ProfileCreateWithoutSocialLinksInput, ProfileUncheckedCreateWithoutSocialLinksInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutSocialLinksInput
    upsert?: ProfileUpsertWithoutSocialLinksInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutSocialLinksInput, ProfileUpdateWithoutSocialLinksInput>, ProfileUncheckedUpdateWithoutSocialLinksInput>
  }

  export type ProfileCreateNestedOneWithoutSkillCategoriesInput = {
    create?: XOR<ProfileCreateWithoutSkillCategoriesInput, ProfileUncheckedCreateWithoutSkillCategoriesInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutSkillCategoriesInput
    connect?: ProfileWhereUniqueInput
  }

  export type SkillCreateNestedManyWithoutCategoryInput = {
    create?: XOR<SkillCreateWithoutCategoryInput, SkillUncheckedCreateWithoutCategoryInput> | SkillCreateWithoutCategoryInput[] | SkillUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: SkillCreateOrConnectWithoutCategoryInput | SkillCreateOrConnectWithoutCategoryInput[]
    createMany?: SkillCreateManyCategoryInputEnvelope
    connect?: SkillWhereUniqueInput | SkillWhereUniqueInput[]
  }

  export type SkillUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: XOR<SkillCreateWithoutCategoryInput, SkillUncheckedCreateWithoutCategoryInput> | SkillCreateWithoutCategoryInput[] | SkillUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: SkillCreateOrConnectWithoutCategoryInput | SkillCreateOrConnectWithoutCategoryInput[]
    createMany?: SkillCreateManyCategoryInputEnvelope
    connect?: SkillWhereUniqueInput | SkillWhereUniqueInput[]
  }

  export type ProfileUpdateOneRequiredWithoutSkillCategoriesNestedInput = {
    create?: XOR<ProfileCreateWithoutSkillCategoriesInput, ProfileUncheckedCreateWithoutSkillCategoriesInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutSkillCategoriesInput
    upsert?: ProfileUpsertWithoutSkillCategoriesInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutSkillCategoriesInput, ProfileUpdateWithoutSkillCategoriesInput>, ProfileUncheckedUpdateWithoutSkillCategoriesInput>
  }

  export type SkillUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<SkillCreateWithoutCategoryInput, SkillUncheckedCreateWithoutCategoryInput> | SkillCreateWithoutCategoryInput[] | SkillUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: SkillCreateOrConnectWithoutCategoryInput | SkillCreateOrConnectWithoutCategoryInput[]
    upsert?: SkillUpsertWithWhereUniqueWithoutCategoryInput | SkillUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: SkillCreateManyCategoryInputEnvelope
    set?: SkillWhereUniqueInput | SkillWhereUniqueInput[]
    disconnect?: SkillWhereUniqueInput | SkillWhereUniqueInput[]
    delete?: SkillWhereUniqueInput | SkillWhereUniqueInput[]
    connect?: SkillWhereUniqueInput | SkillWhereUniqueInput[]
    update?: SkillUpdateWithWhereUniqueWithoutCategoryInput | SkillUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: SkillUpdateManyWithWhereWithoutCategoryInput | SkillUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: SkillScalarWhereInput | SkillScalarWhereInput[]
  }

  export type SkillUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<SkillCreateWithoutCategoryInput, SkillUncheckedCreateWithoutCategoryInput> | SkillCreateWithoutCategoryInput[] | SkillUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: SkillCreateOrConnectWithoutCategoryInput | SkillCreateOrConnectWithoutCategoryInput[]
    upsert?: SkillUpsertWithWhereUniqueWithoutCategoryInput | SkillUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: SkillCreateManyCategoryInputEnvelope
    set?: SkillWhereUniqueInput | SkillWhereUniqueInput[]
    disconnect?: SkillWhereUniqueInput | SkillWhereUniqueInput[]
    delete?: SkillWhereUniqueInput | SkillWhereUniqueInput[]
    connect?: SkillWhereUniqueInput | SkillWhereUniqueInput[]
    update?: SkillUpdateWithWhereUniqueWithoutCategoryInput | SkillUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: SkillUpdateManyWithWhereWithoutCategoryInput | SkillUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: SkillScalarWhereInput | SkillScalarWhereInput[]
  }

  export type ProjectCreateimagesInput = {
    set: string[]
  }

  export type ProjectCreatetagsInput = {
    set: string[]
  }

  export type ProfileCreateNestedOneWithoutProjectsInput = {
    create?: XOR<ProfileCreateWithoutProjectsInput, ProfileUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutProjectsInput
    connect?: ProfileWhereUniqueInput
  }

  export type ProjectUpdateimagesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ProjectUpdatetagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ProfileUpdateOneRequiredWithoutProjectsNestedInput = {
    create?: XOR<ProfileCreateWithoutProjectsInput, ProfileUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutProjectsInput
    upsert?: ProfileUpsertWithoutProjectsInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutProjectsInput, ProfileUpdateWithoutProjectsInput>, ProfileUncheckedUpdateWithoutProjectsInput>
  }

  export type ProfileCreateNestedOneWithoutSkillsInput = {
    create?: XOR<ProfileCreateWithoutSkillsInput, ProfileUncheckedCreateWithoutSkillsInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutSkillsInput
    connect?: ProfileWhereUniqueInput
  }

  export type SkillCategoryCreateNestedOneWithoutSkillsInput = {
    create?: XOR<SkillCategoryCreateWithoutSkillsInput, SkillCategoryUncheckedCreateWithoutSkillsInput>
    connectOrCreate?: SkillCategoryCreateOrConnectWithoutSkillsInput
    connect?: SkillCategoryWhereUniqueInput
  }

  export type EnumProficiencyFieldUpdateOperationsInput = {
    set?: $Enums.Proficiency
  }

  export type ProfileUpdateOneRequiredWithoutSkillsNestedInput = {
    create?: XOR<ProfileCreateWithoutSkillsInput, ProfileUncheckedCreateWithoutSkillsInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutSkillsInput
    upsert?: ProfileUpsertWithoutSkillsInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutSkillsInput, ProfileUpdateWithoutSkillsInput>, ProfileUncheckedUpdateWithoutSkillsInput>
  }

  export type SkillCategoryUpdateOneWithoutSkillsNestedInput = {
    create?: XOR<SkillCategoryCreateWithoutSkillsInput, SkillCategoryUncheckedCreateWithoutSkillsInput>
    connectOrCreate?: SkillCategoryCreateOrConnectWithoutSkillsInput
    upsert?: SkillCategoryUpsertWithoutSkillsInput
    disconnect?: SkillCategoryWhereInput | boolean
    delete?: SkillCategoryWhereInput | boolean
    connect?: SkillCategoryWhereUniqueInput
    update?: XOR<XOR<SkillCategoryUpdateToOneWithWhereWithoutSkillsInput, SkillCategoryUpdateWithoutSkillsInput>, SkillCategoryUncheckedUpdateWithoutSkillsInput>
  }

  export type ExperienceCreatedescriptionInput = {
    set: string[]
  }

  export type ProfileCreateNestedOneWithoutExperiencesInput = {
    create?: XOR<ProfileCreateWithoutExperiencesInput, ProfileUncheckedCreateWithoutExperiencesInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutExperiencesInput
    connect?: ProfileWhereUniqueInput
  }

  export type ExperienceUpdatedescriptionInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type ProfileUpdateOneRequiredWithoutExperiencesNestedInput = {
    create?: XOR<ProfileCreateWithoutExperiencesInput, ProfileUncheckedCreateWithoutExperiencesInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutExperiencesInput
    upsert?: ProfileUpsertWithoutExperiencesInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutExperiencesInput, ProfileUpdateWithoutExperiencesInput>, ProfileUncheckedUpdateWithoutExperiencesInput>
  }

  export type EducationCreatedescriptionInput = {
    set: string[]
  }

  export type ProfileCreateNestedOneWithoutEducationInput = {
    create?: XOR<ProfileCreateWithoutEducationInput, ProfileUncheckedCreateWithoutEducationInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutEducationInput
    connect?: ProfileWhereUniqueInput
  }

  export type EducationUpdatedescriptionInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ProfileUpdateOneRequiredWithoutEducationNestedInput = {
    create?: XOR<ProfileCreateWithoutEducationInput, ProfileUncheckedCreateWithoutEducationInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutEducationInput
    upsert?: ProfileUpsertWithoutEducationInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutEducationInput, ProfileUpdateWithoutEducationInput>, ProfileUncheckedUpdateWithoutEducationInput>
  }

  export type ProfileCreateNestedOneWithoutCertificationsInput = {
    create?: XOR<ProfileCreateWithoutCertificationsInput, ProfileUncheckedCreateWithoutCertificationsInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutCertificationsInput
    connect?: ProfileWhereUniqueInput
  }

  export type ProfileUpdateOneRequiredWithoutCertificationsNestedInput = {
    create?: XOR<ProfileCreateWithoutCertificationsInput, ProfileUncheckedCreateWithoutCertificationsInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutCertificationsInput
    upsert?: ProfileUpsertWithoutCertificationsInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutCertificationsInput, ProfileUpdateWithoutCertificationsInput>, ProfileUncheckedUpdateWithoutCertificationsInput>
  }

  export type ProfileCreateNestedOneWithoutLanguagesInput = {
    create?: XOR<ProfileCreateWithoutLanguagesInput, ProfileUncheckedCreateWithoutLanguagesInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutLanguagesInput
    connect?: ProfileWhereUniqueInput
  }

  export type ProfileUpdateOneRequiredWithoutLanguagesNestedInput = {
    create?: XOR<ProfileCreateWithoutLanguagesInput, ProfileUncheckedCreateWithoutLanguagesInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutLanguagesInput
    upsert?: ProfileUpsertWithoutLanguagesInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutLanguagesInput, ProfileUpdateWithoutLanguagesInput>, ProfileUncheckedUpdateWithoutLanguagesInput>
  }

  export type ProfileCreateNestedOneWithoutAwardsInput = {
    create?: XOR<ProfileCreateWithoutAwardsInput, ProfileUncheckedCreateWithoutAwardsInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutAwardsInput
    connect?: ProfileWhereUniqueInput
  }

  export type ProfileUpdateOneRequiredWithoutAwardsNestedInput = {
    create?: XOR<ProfileCreateWithoutAwardsInput, ProfileUncheckedCreateWithoutAwardsInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutAwardsInput
    upsert?: ProfileUpsertWithoutAwardsInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutAwardsInput, ProfileUpdateWithoutAwardsInput>, ProfileUncheckedUpdateWithoutAwardsInput>
  }

  export type ProfileCreateNestedOneWithoutHobbiesInput = {
    create?: XOR<ProfileCreateWithoutHobbiesInput, ProfileUncheckedCreateWithoutHobbiesInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutHobbiesInput
    connect?: ProfileWhereUniqueInput
  }

  export type ProfileUpdateOneRequiredWithoutHobbiesNestedInput = {
    create?: XOR<ProfileCreateWithoutHobbiesInput, ProfileUncheckedCreateWithoutHobbiesInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutHobbiesInput
    upsert?: ProfileUpsertWithoutHobbiesInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutHobbiesInput, ProfileUpdateWithoutHobbiesInput>, ProfileUncheckedUpdateWithoutHobbiesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumProficiencyFilter<$PrismaModel = never> = {
    equals?: $Enums.Proficiency | EnumProficiencyFieldRefInput<$PrismaModel>
    in?: $Enums.Proficiency[] | ListEnumProficiencyFieldRefInput<$PrismaModel>
    notIn?: $Enums.Proficiency[] | ListEnumProficiencyFieldRefInput<$PrismaModel>
    not?: NestedEnumProficiencyFilter<$PrismaModel> | $Enums.Proficiency
  }

  export type NestedEnumProficiencyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Proficiency | EnumProficiencyFieldRefInput<$PrismaModel>
    in?: $Enums.Proficiency[] | ListEnumProficiencyFieldRefInput<$PrismaModel>
    notIn?: $Enums.Proficiency[] | ListEnumProficiencyFieldRefInput<$PrismaModel>
    not?: NestedEnumProficiencyWithAggregatesFilter<$PrismaModel> | $Enums.Proficiency
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProficiencyFilter<$PrismaModel>
    _max?: NestedEnumProficiencyFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type ProjectCreateWithoutProfileInput = {
    id?: string
    title: string
    description?: string | null
    images?: ProjectCreateimagesInput | string[]
    liveUrl?: string | null
    repoUrl?: string | null
    tags?: ProjectCreatetagsInput | string[]
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectUncheckedCreateWithoutProfileInput = {
    id?: string
    title: string
    description?: string | null
    images?: ProjectCreateimagesInput | string[]
    liveUrl?: string | null
    repoUrl?: string | null
    tags?: ProjectCreatetagsInput | string[]
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectCreateOrConnectWithoutProfileInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutProfileInput, ProjectUncheckedCreateWithoutProfileInput>
  }

  export type ProjectCreateManyProfileInputEnvelope = {
    data: ProjectCreateManyProfileInput | ProjectCreateManyProfileInput[]
    skipDuplicates?: boolean
  }

  export type SkillCreateWithoutProfileInput = {
    id?: string
    name: string
    proficiency?: $Enums.Proficiency
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    category?: SkillCategoryCreateNestedOneWithoutSkillsInput
  }

  export type SkillUncheckedCreateWithoutProfileInput = {
    id?: string
    name: string
    categoryId?: string | null
    proficiency?: $Enums.Proficiency
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SkillCreateOrConnectWithoutProfileInput = {
    where: SkillWhereUniqueInput
    create: XOR<SkillCreateWithoutProfileInput, SkillUncheckedCreateWithoutProfileInput>
  }

  export type SkillCreateManyProfileInputEnvelope = {
    data: SkillCreateManyProfileInput | SkillCreateManyProfileInput[]
    skipDuplicates?: boolean
  }

  export type ExperienceCreateWithoutProfileInput = {
    id?: string
    company: string
    role: string
    description?: ExperienceCreatedescriptionInput | string[]
    startDate: Date | string
    endDate?: Date | string | null
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExperienceUncheckedCreateWithoutProfileInput = {
    id?: string
    company: string
    role: string
    description?: ExperienceCreatedescriptionInput | string[]
    startDate: Date | string
    endDate?: Date | string | null
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExperienceCreateOrConnectWithoutProfileInput = {
    where: ExperienceWhereUniqueInput
    create: XOR<ExperienceCreateWithoutProfileInput, ExperienceUncheckedCreateWithoutProfileInput>
  }

  export type ExperienceCreateManyProfileInputEnvelope = {
    data: ExperienceCreateManyProfileInput | ExperienceCreateManyProfileInput[]
    skipDuplicates?: boolean
  }

  export type SocialLinkCreateWithoutProfileInput = {
    id?: string
    platform: string
    url: string
    label?: string | null
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SocialLinkUncheckedCreateWithoutProfileInput = {
    id?: string
    platform: string
    url: string
    label?: string | null
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SocialLinkCreateOrConnectWithoutProfileInput = {
    where: SocialLinkWhereUniqueInput
    create: XOR<SocialLinkCreateWithoutProfileInput, SocialLinkUncheckedCreateWithoutProfileInput>
  }

  export type SocialLinkCreateManyProfileInputEnvelope = {
    data: SocialLinkCreateManyProfileInput | SocialLinkCreateManyProfileInput[]
    skipDuplicates?: boolean
  }

  export type SkillCategoryCreateWithoutProfileInput = {
    id?: string
    name: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    skills?: SkillCreateNestedManyWithoutCategoryInput
  }

  export type SkillCategoryUncheckedCreateWithoutProfileInput = {
    id?: string
    name: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    skills?: SkillUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type SkillCategoryCreateOrConnectWithoutProfileInput = {
    where: SkillCategoryWhereUniqueInput
    create: XOR<SkillCategoryCreateWithoutProfileInput, SkillCategoryUncheckedCreateWithoutProfileInput>
  }

  export type SkillCategoryCreateManyProfileInputEnvelope = {
    data: SkillCategoryCreateManyProfileInput | SkillCategoryCreateManyProfileInput[]
    skipDuplicates?: boolean
  }

  export type EducationCreateWithoutProfileInput = {
    id?: string
    school: string
    degree?: string | null
    field?: string | null
    startDate: Date | string
    endDate?: Date | string | null
    description?: EducationCreatedescriptionInput | string[]
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EducationUncheckedCreateWithoutProfileInput = {
    id?: string
    school: string
    degree?: string | null
    field?: string | null
    startDate: Date | string
    endDate?: Date | string | null
    description?: EducationCreatedescriptionInput | string[]
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EducationCreateOrConnectWithoutProfileInput = {
    where: EducationWhereUniqueInput
    create: XOR<EducationCreateWithoutProfileInput, EducationUncheckedCreateWithoutProfileInput>
  }

  export type EducationCreateManyProfileInputEnvelope = {
    data: EducationCreateManyProfileInput | EducationCreateManyProfileInput[]
    skipDuplicates?: boolean
  }

  export type CertificationCreateWithoutProfileInput = {
    id?: string
    name: string
    issuer: string
    issueDate?: Date | string | null
    expiryDate?: Date | string | null
    url?: string | null
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CertificationUncheckedCreateWithoutProfileInput = {
    id?: string
    name: string
    issuer: string
    issueDate?: Date | string | null
    expiryDate?: Date | string | null
    url?: string | null
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CertificationCreateOrConnectWithoutProfileInput = {
    where: CertificationWhereUniqueInput
    create: XOR<CertificationCreateWithoutProfileInput, CertificationUncheckedCreateWithoutProfileInput>
  }

  export type CertificationCreateManyProfileInputEnvelope = {
    data: CertificationCreateManyProfileInput | CertificationCreateManyProfileInput[]
    skipDuplicates?: boolean
  }

  export type LanguageCreateWithoutProfileInput = {
    id?: string
    name: string
    proficiency?: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LanguageUncheckedCreateWithoutProfileInput = {
    id?: string
    name: string
    proficiency?: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LanguageCreateOrConnectWithoutProfileInput = {
    where: LanguageWhereUniqueInput
    create: XOR<LanguageCreateWithoutProfileInput, LanguageUncheckedCreateWithoutProfileInput>
  }

  export type LanguageCreateManyProfileInputEnvelope = {
    data: LanguageCreateManyProfileInput | LanguageCreateManyProfileInput[]
    skipDuplicates?: boolean
  }

  export type AwardCreateWithoutProfileInput = {
    id?: string
    title: string
    issuer?: string | null
    date?: Date | string | null
    description?: string | null
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AwardUncheckedCreateWithoutProfileInput = {
    id?: string
    title: string
    issuer?: string | null
    date?: Date | string | null
    description?: string | null
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AwardCreateOrConnectWithoutProfileInput = {
    where: AwardWhereUniqueInput
    create: XOR<AwardCreateWithoutProfileInput, AwardUncheckedCreateWithoutProfileInput>
  }

  export type AwardCreateManyProfileInputEnvelope = {
    data: AwardCreateManyProfileInput | AwardCreateManyProfileInput[]
    skipDuplicates?: boolean
  }

  export type HobbyCreateWithoutProfileInput = {
    id?: string
    name: string
    description?: string | null
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type HobbyUncheckedCreateWithoutProfileInput = {
    id?: string
    name: string
    description?: string | null
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type HobbyCreateOrConnectWithoutProfileInput = {
    where: HobbyWhereUniqueInput
    create: XOR<HobbyCreateWithoutProfileInput, HobbyUncheckedCreateWithoutProfileInput>
  }

  export type HobbyCreateManyProfileInputEnvelope = {
    data: HobbyCreateManyProfileInput | HobbyCreateManyProfileInput[]
    skipDuplicates?: boolean
  }

  export type ProjectUpsertWithWhereUniqueWithoutProfileInput = {
    where: ProjectWhereUniqueInput
    update: XOR<ProjectUpdateWithoutProfileInput, ProjectUncheckedUpdateWithoutProfileInput>
    create: XOR<ProjectCreateWithoutProfileInput, ProjectUncheckedCreateWithoutProfileInput>
  }

  export type ProjectUpdateWithWhereUniqueWithoutProfileInput = {
    where: ProjectWhereUniqueInput
    data: XOR<ProjectUpdateWithoutProfileInput, ProjectUncheckedUpdateWithoutProfileInput>
  }

  export type ProjectUpdateManyWithWhereWithoutProfileInput = {
    where: ProjectScalarWhereInput
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyWithoutProfileInput>
  }

  export type ProjectScalarWhereInput = {
    AND?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    OR?: ProjectScalarWhereInput[]
    NOT?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    id?: StringFilter<"Project"> | string
    profileId?: StringFilter<"Project"> | string
    title?: StringFilter<"Project"> | string
    description?: StringNullableFilter<"Project"> | string | null
    images?: StringNullableListFilter<"Project">
    liveUrl?: StringNullableFilter<"Project"> | string | null
    repoUrl?: StringNullableFilter<"Project"> | string | null
    tags?: StringNullableListFilter<"Project">
    sortOrder?: IntFilter<"Project"> | number
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
  }

  export type SkillUpsertWithWhereUniqueWithoutProfileInput = {
    where: SkillWhereUniqueInput
    update: XOR<SkillUpdateWithoutProfileInput, SkillUncheckedUpdateWithoutProfileInput>
    create: XOR<SkillCreateWithoutProfileInput, SkillUncheckedCreateWithoutProfileInput>
  }

  export type SkillUpdateWithWhereUniqueWithoutProfileInput = {
    where: SkillWhereUniqueInput
    data: XOR<SkillUpdateWithoutProfileInput, SkillUncheckedUpdateWithoutProfileInput>
  }

  export type SkillUpdateManyWithWhereWithoutProfileInput = {
    where: SkillScalarWhereInput
    data: XOR<SkillUpdateManyMutationInput, SkillUncheckedUpdateManyWithoutProfileInput>
  }

  export type SkillScalarWhereInput = {
    AND?: SkillScalarWhereInput | SkillScalarWhereInput[]
    OR?: SkillScalarWhereInput[]
    NOT?: SkillScalarWhereInput | SkillScalarWhereInput[]
    id?: StringFilter<"Skill"> | string
    profileId?: StringFilter<"Skill"> | string
    name?: StringFilter<"Skill"> | string
    categoryId?: StringNullableFilter<"Skill"> | string | null
    proficiency?: EnumProficiencyFilter<"Skill"> | $Enums.Proficiency
    sortOrder?: IntFilter<"Skill"> | number
    createdAt?: DateTimeFilter<"Skill"> | Date | string
    updatedAt?: DateTimeFilter<"Skill"> | Date | string
  }

  export type ExperienceUpsertWithWhereUniqueWithoutProfileInput = {
    where: ExperienceWhereUniqueInput
    update: XOR<ExperienceUpdateWithoutProfileInput, ExperienceUncheckedUpdateWithoutProfileInput>
    create: XOR<ExperienceCreateWithoutProfileInput, ExperienceUncheckedCreateWithoutProfileInput>
  }

  export type ExperienceUpdateWithWhereUniqueWithoutProfileInput = {
    where: ExperienceWhereUniqueInput
    data: XOR<ExperienceUpdateWithoutProfileInput, ExperienceUncheckedUpdateWithoutProfileInput>
  }

  export type ExperienceUpdateManyWithWhereWithoutProfileInput = {
    where: ExperienceScalarWhereInput
    data: XOR<ExperienceUpdateManyMutationInput, ExperienceUncheckedUpdateManyWithoutProfileInput>
  }

  export type ExperienceScalarWhereInput = {
    AND?: ExperienceScalarWhereInput | ExperienceScalarWhereInput[]
    OR?: ExperienceScalarWhereInput[]
    NOT?: ExperienceScalarWhereInput | ExperienceScalarWhereInput[]
    id?: StringFilter<"Experience"> | string
    profileId?: StringFilter<"Experience"> | string
    company?: StringFilter<"Experience"> | string
    role?: StringFilter<"Experience"> | string
    description?: StringNullableListFilter<"Experience">
    startDate?: DateTimeFilter<"Experience"> | Date | string
    endDate?: DateTimeNullableFilter<"Experience"> | Date | string | null
    sortOrder?: IntFilter<"Experience"> | number
    createdAt?: DateTimeFilter<"Experience"> | Date | string
    updatedAt?: DateTimeFilter<"Experience"> | Date | string
  }

  export type SocialLinkUpsertWithWhereUniqueWithoutProfileInput = {
    where: SocialLinkWhereUniqueInput
    update: XOR<SocialLinkUpdateWithoutProfileInput, SocialLinkUncheckedUpdateWithoutProfileInput>
    create: XOR<SocialLinkCreateWithoutProfileInput, SocialLinkUncheckedCreateWithoutProfileInput>
  }

  export type SocialLinkUpdateWithWhereUniqueWithoutProfileInput = {
    where: SocialLinkWhereUniqueInput
    data: XOR<SocialLinkUpdateWithoutProfileInput, SocialLinkUncheckedUpdateWithoutProfileInput>
  }

  export type SocialLinkUpdateManyWithWhereWithoutProfileInput = {
    where: SocialLinkScalarWhereInput
    data: XOR<SocialLinkUpdateManyMutationInput, SocialLinkUncheckedUpdateManyWithoutProfileInput>
  }

  export type SocialLinkScalarWhereInput = {
    AND?: SocialLinkScalarWhereInput | SocialLinkScalarWhereInput[]
    OR?: SocialLinkScalarWhereInput[]
    NOT?: SocialLinkScalarWhereInput | SocialLinkScalarWhereInput[]
    id?: StringFilter<"SocialLink"> | string
    profileId?: StringFilter<"SocialLink"> | string
    platform?: StringFilter<"SocialLink"> | string
    url?: StringFilter<"SocialLink"> | string
    label?: StringNullableFilter<"SocialLink"> | string | null
    sortOrder?: IntFilter<"SocialLink"> | number
    createdAt?: DateTimeFilter<"SocialLink"> | Date | string
    updatedAt?: DateTimeFilter<"SocialLink"> | Date | string
  }

  export type SkillCategoryUpsertWithWhereUniqueWithoutProfileInput = {
    where: SkillCategoryWhereUniqueInput
    update: XOR<SkillCategoryUpdateWithoutProfileInput, SkillCategoryUncheckedUpdateWithoutProfileInput>
    create: XOR<SkillCategoryCreateWithoutProfileInput, SkillCategoryUncheckedCreateWithoutProfileInput>
  }

  export type SkillCategoryUpdateWithWhereUniqueWithoutProfileInput = {
    where: SkillCategoryWhereUniqueInput
    data: XOR<SkillCategoryUpdateWithoutProfileInput, SkillCategoryUncheckedUpdateWithoutProfileInput>
  }

  export type SkillCategoryUpdateManyWithWhereWithoutProfileInput = {
    where: SkillCategoryScalarWhereInput
    data: XOR<SkillCategoryUpdateManyMutationInput, SkillCategoryUncheckedUpdateManyWithoutProfileInput>
  }

  export type SkillCategoryScalarWhereInput = {
    AND?: SkillCategoryScalarWhereInput | SkillCategoryScalarWhereInput[]
    OR?: SkillCategoryScalarWhereInput[]
    NOT?: SkillCategoryScalarWhereInput | SkillCategoryScalarWhereInput[]
    id?: StringFilter<"SkillCategory"> | string
    profileId?: StringFilter<"SkillCategory"> | string
    name?: StringFilter<"SkillCategory"> | string
    sortOrder?: IntFilter<"SkillCategory"> | number
    createdAt?: DateTimeFilter<"SkillCategory"> | Date | string
    updatedAt?: DateTimeFilter<"SkillCategory"> | Date | string
  }

  export type EducationUpsertWithWhereUniqueWithoutProfileInput = {
    where: EducationWhereUniqueInput
    update: XOR<EducationUpdateWithoutProfileInput, EducationUncheckedUpdateWithoutProfileInput>
    create: XOR<EducationCreateWithoutProfileInput, EducationUncheckedCreateWithoutProfileInput>
  }

  export type EducationUpdateWithWhereUniqueWithoutProfileInput = {
    where: EducationWhereUniqueInput
    data: XOR<EducationUpdateWithoutProfileInput, EducationUncheckedUpdateWithoutProfileInput>
  }

  export type EducationUpdateManyWithWhereWithoutProfileInput = {
    where: EducationScalarWhereInput
    data: XOR<EducationUpdateManyMutationInput, EducationUncheckedUpdateManyWithoutProfileInput>
  }

  export type EducationScalarWhereInput = {
    AND?: EducationScalarWhereInput | EducationScalarWhereInput[]
    OR?: EducationScalarWhereInput[]
    NOT?: EducationScalarWhereInput | EducationScalarWhereInput[]
    id?: StringFilter<"Education"> | string
    profileId?: StringFilter<"Education"> | string
    school?: StringFilter<"Education"> | string
    degree?: StringNullableFilter<"Education"> | string | null
    field?: StringNullableFilter<"Education"> | string | null
    startDate?: DateTimeFilter<"Education"> | Date | string
    endDate?: DateTimeNullableFilter<"Education"> | Date | string | null
    description?: StringNullableListFilter<"Education">
    sortOrder?: IntFilter<"Education"> | number
    createdAt?: DateTimeFilter<"Education"> | Date | string
    updatedAt?: DateTimeFilter<"Education"> | Date | string
  }

  export type CertificationUpsertWithWhereUniqueWithoutProfileInput = {
    where: CertificationWhereUniqueInput
    update: XOR<CertificationUpdateWithoutProfileInput, CertificationUncheckedUpdateWithoutProfileInput>
    create: XOR<CertificationCreateWithoutProfileInput, CertificationUncheckedCreateWithoutProfileInput>
  }

  export type CertificationUpdateWithWhereUniqueWithoutProfileInput = {
    where: CertificationWhereUniqueInput
    data: XOR<CertificationUpdateWithoutProfileInput, CertificationUncheckedUpdateWithoutProfileInput>
  }

  export type CertificationUpdateManyWithWhereWithoutProfileInput = {
    where: CertificationScalarWhereInput
    data: XOR<CertificationUpdateManyMutationInput, CertificationUncheckedUpdateManyWithoutProfileInput>
  }

  export type CertificationScalarWhereInput = {
    AND?: CertificationScalarWhereInput | CertificationScalarWhereInput[]
    OR?: CertificationScalarWhereInput[]
    NOT?: CertificationScalarWhereInput | CertificationScalarWhereInput[]
    id?: StringFilter<"Certification"> | string
    profileId?: StringFilter<"Certification"> | string
    name?: StringFilter<"Certification"> | string
    issuer?: StringFilter<"Certification"> | string
    issueDate?: DateTimeNullableFilter<"Certification"> | Date | string | null
    expiryDate?: DateTimeNullableFilter<"Certification"> | Date | string | null
    url?: StringNullableFilter<"Certification"> | string | null
    sortOrder?: IntFilter<"Certification"> | number
    createdAt?: DateTimeFilter<"Certification"> | Date | string
    updatedAt?: DateTimeFilter<"Certification"> | Date | string
  }

  export type LanguageUpsertWithWhereUniqueWithoutProfileInput = {
    where: LanguageWhereUniqueInput
    update: XOR<LanguageUpdateWithoutProfileInput, LanguageUncheckedUpdateWithoutProfileInput>
    create: XOR<LanguageCreateWithoutProfileInput, LanguageUncheckedCreateWithoutProfileInput>
  }

  export type LanguageUpdateWithWhereUniqueWithoutProfileInput = {
    where: LanguageWhereUniqueInput
    data: XOR<LanguageUpdateWithoutProfileInput, LanguageUncheckedUpdateWithoutProfileInput>
  }

  export type LanguageUpdateManyWithWhereWithoutProfileInput = {
    where: LanguageScalarWhereInput
    data: XOR<LanguageUpdateManyMutationInput, LanguageUncheckedUpdateManyWithoutProfileInput>
  }

  export type LanguageScalarWhereInput = {
    AND?: LanguageScalarWhereInput | LanguageScalarWhereInput[]
    OR?: LanguageScalarWhereInput[]
    NOT?: LanguageScalarWhereInput | LanguageScalarWhereInput[]
    id?: StringFilter<"Language"> | string
    profileId?: StringFilter<"Language"> | string
    name?: StringFilter<"Language"> | string
    proficiency?: StringFilter<"Language"> | string
    sortOrder?: IntFilter<"Language"> | number
    createdAt?: DateTimeFilter<"Language"> | Date | string
    updatedAt?: DateTimeFilter<"Language"> | Date | string
  }

  export type AwardUpsertWithWhereUniqueWithoutProfileInput = {
    where: AwardWhereUniqueInput
    update: XOR<AwardUpdateWithoutProfileInput, AwardUncheckedUpdateWithoutProfileInput>
    create: XOR<AwardCreateWithoutProfileInput, AwardUncheckedCreateWithoutProfileInput>
  }

  export type AwardUpdateWithWhereUniqueWithoutProfileInput = {
    where: AwardWhereUniqueInput
    data: XOR<AwardUpdateWithoutProfileInput, AwardUncheckedUpdateWithoutProfileInput>
  }

  export type AwardUpdateManyWithWhereWithoutProfileInput = {
    where: AwardScalarWhereInput
    data: XOR<AwardUpdateManyMutationInput, AwardUncheckedUpdateManyWithoutProfileInput>
  }

  export type AwardScalarWhereInput = {
    AND?: AwardScalarWhereInput | AwardScalarWhereInput[]
    OR?: AwardScalarWhereInput[]
    NOT?: AwardScalarWhereInput | AwardScalarWhereInput[]
    id?: StringFilter<"Award"> | string
    profileId?: StringFilter<"Award"> | string
    title?: StringFilter<"Award"> | string
    issuer?: StringNullableFilter<"Award"> | string | null
    date?: DateTimeNullableFilter<"Award"> | Date | string | null
    description?: StringNullableFilter<"Award"> | string | null
    sortOrder?: IntFilter<"Award"> | number
    createdAt?: DateTimeFilter<"Award"> | Date | string
    updatedAt?: DateTimeFilter<"Award"> | Date | string
  }

  export type HobbyUpsertWithWhereUniqueWithoutProfileInput = {
    where: HobbyWhereUniqueInput
    update: XOR<HobbyUpdateWithoutProfileInput, HobbyUncheckedUpdateWithoutProfileInput>
    create: XOR<HobbyCreateWithoutProfileInput, HobbyUncheckedCreateWithoutProfileInput>
  }

  export type HobbyUpdateWithWhereUniqueWithoutProfileInput = {
    where: HobbyWhereUniqueInput
    data: XOR<HobbyUpdateWithoutProfileInput, HobbyUncheckedUpdateWithoutProfileInput>
  }

  export type HobbyUpdateManyWithWhereWithoutProfileInput = {
    where: HobbyScalarWhereInput
    data: XOR<HobbyUpdateManyMutationInput, HobbyUncheckedUpdateManyWithoutProfileInput>
  }

  export type HobbyScalarWhereInput = {
    AND?: HobbyScalarWhereInput | HobbyScalarWhereInput[]
    OR?: HobbyScalarWhereInput[]
    NOT?: HobbyScalarWhereInput | HobbyScalarWhereInput[]
    id?: StringFilter<"Hobby"> | string
    profileId?: StringFilter<"Hobby"> | string
    name?: StringFilter<"Hobby"> | string
    description?: StringNullableFilter<"Hobby"> | string | null
    sortOrder?: IntFilter<"Hobby"> | number
    createdAt?: DateTimeFilter<"Hobby"> | Date | string
    updatedAt?: DateTimeFilter<"Hobby"> | Date | string
  }

  export type ProfileCreateWithoutSocialLinksInput = {
    id?: string
    userId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    avatarUrl?: string | null
    bio?: string | null
    headline?: string | null
    location?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutProfileInput
    skills?: SkillCreateNestedManyWithoutProfileInput
    experiences?: ExperienceCreateNestedManyWithoutProfileInput
    skillCategories?: SkillCategoryCreateNestedManyWithoutProfileInput
    education?: EducationCreateNestedManyWithoutProfileInput
    certifications?: CertificationCreateNestedManyWithoutProfileInput
    languages?: LanguageCreateNestedManyWithoutProfileInput
    awards?: AwardCreateNestedManyWithoutProfileInput
    hobbies?: HobbyCreateNestedManyWithoutProfileInput
  }

  export type ProfileUncheckedCreateWithoutSocialLinksInput = {
    id?: string
    userId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    avatarUrl?: string | null
    bio?: string | null
    headline?: string | null
    location?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutProfileInput
    skills?: SkillUncheckedCreateNestedManyWithoutProfileInput
    experiences?: ExperienceUncheckedCreateNestedManyWithoutProfileInput
    skillCategories?: SkillCategoryUncheckedCreateNestedManyWithoutProfileInput
    education?: EducationUncheckedCreateNestedManyWithoutProfileInput
    certifications?: CertificationUncheckedCreateNestedManyWithoutProfileInput
    languages?: LanguageUncheckedCreateNestedManyWithoutProfileInput
    awards?: AwardUncheckedCreateNestedManyWithoutProfileInput
    hobbies?: HobbyUncheckedCreateNestedManyWithoutProfileInput
  }

  export type ProfileCreateOrConnectWithoutSocialLinksInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutSocialLinksInput, ProfileUncheckedCreateWithoutSocialLinksInput>
  }

  export type ProfileUpsertWithoutSocialLinksInput = {
    update: XOR<ProfileUpdateWithoutSocialLinksInput, ProfileUncheckedUpdateWithoutSocialLinksInput>
    create: XOR<ProfileCreateWithoutSocialLinksInput, ProfileUncheckedCreateWithoutSocialLinksInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutSocialLinksInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutSocialLinksInput, ProfileUncheckedUpdateWithoutSocialLinksInput>
  }

  export type ProfileUpdateWithoutSocialLinksInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutProfileNestedInput
    skills?: SkillUpdateManyWithoutProfileNestedInput
    experiences?: ExperienceUpdateManyWithoutProfileNestedInput
    skillCategories?: SkillCategoryUpdateManyWithoutProfileNestedInput
    education?: EducationUpdateManyWithoutProfileNestedInput
    certifications?: CertificationUpdateManyWithoutProfileNestedInput
    languages?: LanguageUpdateManyWithoutProfileNestedInput
    awards?: AwardUpdateManyWithoutProfileNestedInput
    hobbies?: HobbyUpdateManyWithoutProfileNestedInput
  }

  export type ProfileUncheckedUpdateWithoutSocialLinksInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutProfileNestedInput
    skills?: SkillUncheckedUpdateManyWithoutProfileNestedInput
    experiences?: ExperienceUncheckedUpdateManyWithoutProfileNestedInput
    skillCategories?: SkillCategoryUncheckedUpdateManyWithoutProfileNestedInput
    education?: EducationUncheckedUpdateManyWithoutProfileNestedInput
    certifications?: CertificationUncheckedUpdateManyWithoutProfileNestedInput
    languages?: LanguageUncheckedUpdateManyWithoutProfileNestedInput
    awards?: AwardUncheckedUpdateManyWithoutProfileNestedInput
    hobbies?: HobbyUncheckedUpdateManyWithoutProfileNestedInput
  }

  export type ProfileCreateWithoutSkillCategoriesInput = {
    id?: string
    userId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    avatarUrl?: string | null
    bio?: string | null
    headline?: string | null
    location?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutProfileInput
    skills?: SkillCreateNestedManyWithoutProfileInput
    experiences?: ExperienceCreateNestedManyWithoutProfileInput
    socialLinks?: SocialLinkCreateNestedManyWithoutProfileInput
    education?: EducationCreateNestedManyWithoutProfileInput
    certifications?: CertificationCreateNestedManyWithoutProfileInput
    languages?: LanguageCreateNestedManyWithoutProfileInput
    awards?: AwardCreateNestedManyWithoutProfileInput
    hobbies?: HobbyCreateNestedManyWithoutProfileInput
  }

  export type ProfileUncheckedCreateWithoutSkillCategoriesInput = {
    id?: string
    userId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    avatarUrl?: string | null
    bio?: string | null
    headline?: string | null
    location?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutProfileInput
    skills?: SkillUncheckedCreateNestedManyWithoutProfileInput
    experiences?: ExperienceUncheckedCreateNestedManyWithoutProfileInput
    socialLinks?: SocialLinkUncheckedCreateNestedManyWithoutProfileInput
    education?: EducationUncheckedCreateNestedManyWithoutProfileInput
    certifications?: CertificationUncheckedCreateNestedManyWithoutProfileInput
    languages?: LanguageUncheckedCreateNestedManyWithoutProfileInput
    awards?: AwardUncheckedCreateNestedManyWithoutProfileInput
    hobbies?: HobbyUncheckedCreateNestedManyWithoutProfileInput
  }

  export type ProfileCreateOrConnectWithoutSkillCategoriesInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutSkillCategoriesInput, ProfileUncheckedCreateWithoutSkillCategoriesInput>
  }

  export type SkillCreateWithoutCategoryInput = {
    id?: string
    name: string
    proficiency?: $Enums.Proficiency
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    profile: ProfileCreateNestedOneWithoutSkillsInput
  }

  export type SkillUncheckedCreateWithoutCategoryInput = {
    id?: string
    profileId: string
    name: string
    proficiency?: $Enums.Proficiency
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SkillCreateOrConnectWithoutCategoryInput = {
    where: SkillWhereUniqueInput
    create: XOR<SkillCreateWithoutCategoryInput, SkillUncheckedCreateWithoutCategoryInput>
  }

  export type SkillCreateManyCategoryInputEnvelope = {
    data: SkillCreateManyCategoryInput | SkillCreateManyCategoryInput[]
    skipDuplicates?: boolean
  }

  export type ProfileUpsertWithoutSkillCategoriesInput = {
    update: XOR<ProfileUpdateWithoutSkillCategoriesInput, ProfileUncheckedUpdateWithoutSkillCategoriesInput>
    create: XOR<ProfileCreateWithoutSkillCategoriesInput, ProfileUncheckedCreateWithoutSkillCategoriesInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutSkillCategoriesInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutSkillCategoriesInput, ProfileUncheckedUpdateWithoutSkillCategoriesInput>
  }

  export type ProfileUpdateWithoutSkillCategoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutProfileNestedInput
    skills?: SkillUpdateManyWithoutProfileNestedInput
    experiences?: ExperienceUpdateManyWithoutProfileNestedInput
    socialLinks?: SocialLinkUpdateManyWithoutProfileNestedInput
    education?: EducationUpdateManyWithoutProfileNestedInput
    certifications?: CertificationUpdateManyWithoutProfileNestedInput
    languages?: LanguageUpdateManyWithoutProfileNestedInput
    awards?: AwardUpdateManyWithoutProfileNestedInput
    hobbies?: HobbyUpdateManyWithoutProfileNestedInput
  }

  export type ProfileUncheckedUpdateWithoutSkillCategoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutProfileNestedInput
    skills?: SkillUncheckedUpdateManyWithoutProfileNestedInput
    experiences?: ExperienceUncheckedUpdateManyWithoutProfileNestedInput
    socialLinks?: SocialLinkUncheckedUpdateManyWithoutProfileNestedInput
    education?: EducationUncheckedUpdateManyWithoutProfileNestedInput
    certifications?: CertificationUncheckedUpdateManyWithoutProfileNestedInput
    languages?: LanguageUncheckedUpdateManyWithoutProfileNestedInput
    awards?: AwardUncheckedUpdateManyWithoutProfileNestedInput
    hobbies?: HobbyUncheckedUpdateManyWithoutProfileNestedInput
  }

  export type SkillUpsertWithWhereUniqueWithoutCategoryInput = {
    where: SkillWhereUniqueInput
    update: XOR<SkillUpdateWithoutCategoryInput, SkillUncheckedUpdateWithoutCategoryInput>
    create: XOR<SkillCreateWithoutCategoryInput, SkillUncheckedCreateWithoutCategoryInput>
  }

  export type SkillUpdateWithWhereUniqueWithoutCategoryInput = {
    where: SkillWhereUniqueInput
    data: XOR<SkillUpdateWithoutCategoryInput, SkillUncheckedUpdateWithoutCategoryInput>
  }

  export type SkillUpdateManyWithWhereWithoutCategoryInput = {
    where: SkillScalarWhereInput
    data: XOR<SkillUpdateManyMutationInput, SkillUncheckedUpdateManyWithoutCategoryInput>
  }

  export type ProfileCreateWithoutProjectsInput = {
    id?: string
    userId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    avatarUrl?: string | null
    bio?: string | null
    headline?: string | null
    location?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    skills?: SkillCreateNestedManyWithoutProfileInput
    experiences?: ExperienceCreateNestedManyWithoutProfileInput
    socialLinks?: SocialLinkCreateNestedManyWithoutProfileInput
    skillCategories?: SkillCategoryCreateNestedManyWithoutProfileInput
    education?: EducationCreateNestedManyWithoutProfileInput
    certifications?: CertificationCreateNestedManyWithoutProfileInput
    languages?: LanguageCreateNestedManyWithoutProfileInput
    awards?: AwardCreateNestedManyWithoutProfileInput
    hobbies?: HobbyCreateNestedManyWithoutProfileInput
  }

  export type ProfileUncheckedCreateWithoutProjectsInput = {
    id?: string
    userId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    avatarUrl?: string | null
    bio?: string | null
    headline?: string | null
    location?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    skills?: SkillUncheckedCreateNestedManyWithoutProfileInput
    experiences?: ExperienceUncheckedCreateNestedManyWithoutProfileInput
    socialLinks?: SocialLinkUncheckedCreateNestedManyWithoutProfileInput
    skillCategories?: SkillCategoryUncheckedCreateNestedManyWithoutProfileInput
    education?: EducationUncheckedCreateNestedManyWithoutProfileInput
    certifications?: CertificationUncheckedCreateNestedManyWithoutProfileInput
    languages?: LanguageUncheckedCreateNestedManyWithoutProfileInput
    awards?: AwardUncheckedCreateNestedManyWithoutProfileInput
    hobbies?: HobbyUncheckedCreateNestedManyWithoutProfileInput
  }

  export type ProfileCreateOrConnectWithoutProjectsInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutProjectsInput, ProfileUncheckedCreateWithoutProjectsInput>
  }

  export type ProfileUpsertWithoutProjectsInput = {
    update: XOR<ProfileUpdateWithoutProjectsInput, ProfileUncheckedUpdateWithoutProjectsInput>
    create: XOR<ProfileCreateWithoutProjectsInput, ProfileUncheckedCreateWithoutProjectsInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutProjectsInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutProjectsInput, ProfileUncheckedUpdateWithoutProjectsInput>
  }

  export type ProfileUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    skills?: SkillUpdateManyWithoutProfileNestedInput
    experiences?: ExperienceUpdateManyWithoutProfileNestedInput
    socialLinks?: SocialLinkUpdateManyWithoutProfileNestedInput
    skillCategories?: SkillCategoryUpdateManyWithoutProfileNestedInput
    education?: EducationUpdateManyWithoutProfileNestedInput
    certifications?: CertificationUpdateManyWithoutProfileNestedInput
    languages?: LanguageUpdateManyWithoutProfileNestedInput
    awards?: AwardUpdateManyWithoutProfileNestedInput
    hobbies?: HobbyUpdateManyWithoutProfileNestedInput
  }

  export type ProfileUncheckedUpdateWithoutProjectsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    skills?: SkillUncheckedUpdateManyWithoutProfileNestedInput
    experiences?: ExperienceUncheckedUpdateManyWithoutProfileNestedInput
    socialLinks?: SocialLinkUncheckedUpdateManyWithoutProfileNestedInput
    skillCategories?: SkillCategoryUncheckedUpdateManyWithoutProfileNestedInput
    education?: EducationUncheckedUpdateManyWithoutProfileNestedInput
    certifications?: CertificationUncheckedUpdateManyWithoutProfileNestedInput
    languages?: LanguageUncheckedUpdateManyWithoutProfileNestedInput
    awards?: AwardUncheckedUpdateManyWithoutProfileNestedInput
    hobbies?: HobbyUncheckedUpdateManyWithoutProfileNestedInput
  }

  export type ProfileCreateWithoutSkillsInput = {
    id?: string
    userId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    avatarUrl?: string | null
    bio?: string | null
    headline?: string | null
    location?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutProfileInput
    experiences?: ExperienceCreateNestedManyWithoutProfileInput
    socialLinks?: SocialLinkCreateNestedManyWithoutProfileInput
    skillCategories?: SkillCategoryCreateNestedManyWithoutProfileInput
    education?: EducationCreateNestedManyWithoutProfileInput
    certifications?: CertificationCreateNestedManyWithoutProfileInput
    languages?: LanguageCreateNestedManyWithoutProfileInput
    awards?: AwardCreateNestedManyWithoutProfileInput
    hobbies?: HobbyCreateNestedManyWithoutProfileInput
  }

  export type ProfileUncheckedCreateWithoutSkillsInput = {
    id?: string
    userId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    avatarUrl?: string | null
    bio?: string | null
    headline?: string | null
    location?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutProfileInput
    experiences?: ExperienceUncheckedCreateNestedManyWithoutProfileInput
    socialLinks?: SocialLinkUncheckedCreateNestedManyWithoutProfileInput
    skillCategories?: SkillCategoryUncheckedCreateNestedManyWithoutProfileInput
    education?: EducationUncheckedCreateNestedManyWithoutProfileInput
    certifications?: CertificationUncheckedCreateNestedManyWithoutProfileInput
    languages?: LanguageUncheckedCreateNestedManyWithoutProfileInput
    awards?: AwardUncheckedCreateNestedManyWithoutProfileInput
    hobbies?: HobbyUncheckedCreateNestedManyWithoutProfileInput
  }

  export type ProfileCreateOrConnectWithoutSkillsInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutSkillsInput, ProfileUncheckedCreateWithoutSkillsInput>
  }

  export type SkillCategoryCreateWithoutSkillsInput = {
    id?: string
    name: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    profile: ProfileCreateNestedOneWithoutSkillCategoriesInput
  }

  export type SkillCategoryUncheckedCreateWithoutSkillsInput = {
    id?: string
    profileId: string
    name: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SkillCategoryCreateOrConnectWithoutSkillsInput = {
    where: SkillCategoryWhereUniqueInput
    create: XOR<SkillCategoryCreateWithoutSkillsInput, SkillCategoryUncheckedCreateWithoutSkillsInput>
  }

  export type ProfileUpsertWithoutSkillsInput = {
    update: XOR<ProfileUpdateWithoutSkillsInput, ProfileUncheckedUpdateWithoutSkillsInput>
    create: XOR<ProfileCreateWithoutSkillsInput, ProfileUncheckedCreateWithoutSkillsInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutSkillsInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutSkillsInput, ProfileUncheckedUpdateWithoutSkillsInput>
  }

  export type ProfileUpdateWithoutSkillsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutProfileNestedInput
    experiences?: ExperienceUpdateManyWithoutProfileNestedInput
    socialLinks?: SocialLinkUpdateManyWithoutProfileNestedInput
    skillCategories?: SkillCategoryUpdateManyWithoutProfileNestedInput
    education?: EducationUpdateManyWithoutProfileNestedInput
    certifications?: CertificationUpdateManyWithoutProfileNestedInput
    languages?: LanguageUpdateManyWithoutProfileNestedInput
    awards?: AwardUpdateManyWithoutProfileNestedInput
    hobbies?: HobbyUpdateManyWithoutProfileNestedInput
  }

  export type ProfileUncheckedUpdateWithoutSkillsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutProfileNestedInput
    experiences?: ExperienceUncheckedUpdateManyWithoutProfileNestedInput
    socialLinks?: SocialLinkUncheckedUpdateManyWithoutProfileNestedInput
    skillCategories?: SkillCategoryUncheckedUpdateManyWithoutProfileNestedInput
    education?: EducationUncheckedUpdateManyWithoutProfileNestedInput
    certifications?: CertificationUncheckedUpdateManyWithoutProfileNestedInput
    languages?: LanguageUncheckedUpdateManyWithoutProfileNestedInput
    awards?: AwardUncheckedUpdateManyWithoutProfileNestedInput
    hobbies?: HobbyUncheckedUpdateManyWithoutProfileNestedInput
  }

  export type SkillCategoryUpsertWithoutSkillsInput = {
    update: XOR<SkillCategoryUpdateWithoutSkillsInput, SkillCategoryUncheckedUpdateWithoutSkillsInput>
    create: XOR<SkillCategoryCreateWithoutSkillsInput, SkillCategoryUncheckedCreateWithoutSkillsInput>
    where?: SkillCategoryWhereInput
  }

  export type SkillCategoryUpdateToOneWithWhereWithoutSkillsInput = {
    where?: SkillCategoryWhereInput
    data: XOR<SkillCategoryUpdateWithoutSkillsInput, SkillCategoryUncheckedUpdateWithoutSkillsInput>
  }

  export type SkillCategoryUpdateWithoutSkillsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneRequiredWithoutSkillCategoriesNestedInput
  }

  export type SkillCategoryUncheckedUpdateWithoutSkillsInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileCreateWithoutExperiencesInput = {
    id?: string
    userId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    avatarUrl?: string | null
    bio?: string | null
    headline?: string | null
    location?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutProfileInput
    skills?: SkillCreateNestedManyWithoutProfileInput
    socialLinks?: SocialLinkCreateNestedManyWithoutProfileInput
    skillCategories?: SkillCategoryCreateNestedManyWithoutProfileInput
    education?: EducationCreateNestedManyWithoutProfileInput
    certifications?: CertificationCreateNestedManyWithoutProfileInput
    languages?: LanguageCreateNestedManyWithoutProfileInput
    awards?: AwardCreateNestedManyWithoutProfileInput
    hobbies?: HobbyCreateNestedManyWithoutProfileInput
  }

  export type ProfileUncheckedCreateWithoutExperiencesInput = {
    id?: string
    userId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    avatarUrl?: string | null
    bio?: string | null
    headline?: string | null
    location?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutProfileInput
    skills?: SkillUncheckedCreateNestedManyWithoutProfileInput
    socialLinks?: SocialLinkUncheckedCreateNestedManyWithoutProfileInput
    skillCategories?: SkillCategoryUncheckedCreateNestedManyWithoutProfileInput
    education?: EducationUncheckedCreateNestedManyWithoutProfileInput
    certifications?: CertificationUncheckedCreateNestedManyWithoutProfileInput
    languages?: LanguageUncheckedCreateNestedManyWithoutProfileInput
    awards?: AwardUncheckedCreateNestedManyWithoutProfileInput
    hobbies?: HobbyUncheckedCreateNestedManyWithoutProfileInput
  }

  export type ProfileCreateOrConnectWithoutExperiencesInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutExperiencesInput, ProfileUncheckedCreateWithoutExperiencesInput>
  }

  export type ProfileUpsertWithoutExperiencesInput = {
    update: XOR<ProfileUpdateWithoutExperiencesInput, ProfileUncheckedUpdateWithoutExperiencesInput>
    create: XOR<ProfileCreateWithoutExperiencesInput, ProfileUncheckedCreateWithoutExperiencesInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutExperiencesInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutExperiencesInput, ProfileUncheckedUpdateWithoutExperiencesInput>
  }

  export type ProfileUpdateWithoutExperiencesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutProfileNestedInput
    skills?: SkillUpdateManyWithoutProfileNestedInput
    socialLinks?: SocialLinkUpdateManyWithoutProfileNestedInput
    skillCategories?: SkillCategoryUpdateManyWithoutProfileNestedInput
    education?: EducationUpdateManyWithoutProfileNestedInput
    certifications?: CertificationUpdateManyWithoutProfileNestedInput
    languages?: LanguageUpdateManyWithoutProfileNestedInput
    awards?: AwardUpdateManyWithoutProfileNestedInput
    hobbies?: HobbyUpdateManyWithoutProfileNestedInput
  }

  export type ProfileUncheckedUpdateWithoutExperiencesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutProfileNestedInput
    skills?: SkillUncheckedUpdateManyWithoutProfileNestedInput
    socialLinks?: SocialLinkUncheckedUpdateManyWithoutProfileNestedInput
    skillCategories?: SkillCategoryUncheckedUpdateManyWithoutProfileNestedInput
    education?: EducationUncheckedUpdateManyWithoutProfileNestedInput
    certifications?: CertificationUncheckedUpdateManyWithoutProfileNestedInput
    languages?: LanguageUncheckedUpdateManyWithoutProfileNestedInput
    awards?: AwardUncheckedUpdateManyWithoutProfileNestedInput
    hobbies?: HobbyUncheckedUpdateManyWithoutProfileNestedInput
  }

  export type ProfileCreateWithoutEducationInput = {
    id?: string
    userId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    avatarUrl?: string | null
    bio?: string | null
    headline?: string | null
    location?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutProfileInput
    skills?: SkillCreateNestedManyWithoutProfileInput
    experiences?: ExperienceCreateNestedManyWithoutProfileInput
    socialLinks?: SocialLinkCreateNestedManyWithoutProfileInput
    skillCategories?: SkillCategoryCreateNestedManyWithoutProfileInput
    certifications?: CertificationCreateNestedManyWithoutProfileInput
    languages?: LanguageCreateNestedManyWithoutProfileInput
    awards?: AwardCreateNestedManyWithoutProfileInput
    hobbies?: HobbyCreateNestedManyWithoutProfileInput
  }

  export type ProfileUncheckedCreateWithoutEducationInput = {
    id?: string
    userId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    avatarUrl?: string | null
    bio?: string | null
    headline?: string | null
    location?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutProfileInput
    skills?: SkillUncheckedCreateNestedManyWithoutProfileInput
    experiences?: ExperienceUncheckedCreateNestedManyWithoutProfileInput
    socialLinks?: SocialLinkUncheckedCreateNestedManyWithoutProfileInput
    skillCategories?: SkillCategoryUncheckedCreateNestedManyWithoutProfileInput
    certifications?: CertificationUncheckedCreateNestedManyWithoutProfileInput
    languages?: LanguageUncheckedCreateNestedManyWithoutProfileInput
    awards?: AwardUncheckedCreateNestedManyWithoutProfileInput
    hobbies?: HobbyUncheckedCreateNestedManyWithoutProfileInput
  }

  export type ProfileCreateOrConnectWithoutEducationInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutEducationInput, ProfileUncheckedCreateWithoutEducationInput>
  }

  export type ProfileUpsertWithoutEducationInput = {
    update: XOR<ProfileUpdateWithoutEducationInput, ProfileUncheckedUpdateWithoutEducationInput>
    create: XOR<ProfileCreateWithoutEducationInput, ProfileUncheckedCreateWithoutEducationInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutEducationInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutEducationInput, ProfileUncheckedUpdateWithoutEducationInput>
  }

  export type ProfileUpdateWithoutEducationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutProfileNestedInput
    skills?: SkillUpdateManyWithoutProfileNestedInput
    experiences?: ExperienceUpdateManyWithoutProfileNestedInput
    socialLinks?: SocialLinkUpdateManyWithoutProfileNestedInput
    skillCategories?: SkillCategoryUpdateManyWithoutProfileNestedInput
    certifications?: CertificationUpdateManyWithoutProfileNestedInput
    languages?: LanguageUpdateManyWithoutProfileNestedInput
    awards?: AwardUpdateManyWithoutProfileNestedInput
    hobbies?: HobbyUpdateManyWithoutProfileNestedInput
  }

  export type ProfileUncheckedUpdateWithoutEducationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutProfileNestedInput
    skills?: SkillUncheckedUpdateManyWithoutProfileNestedInput
    experiences?: ExperienceUncheckedUpdateManyWithoutProfileNestedInput
    socialLinks?: SocialLinkUncheckedUpdateManyWithoutProfileNestedInput
    skillCategories?: SkillCategoryUncheckedUpdateManyWithoutProfileNestedInput
    certifications?: CertificationUncheckedUpdateManyWithoutProfileNestedInput
    languages?: LanguageUncheckedUpdateManyWithoutProfileNestedInput
    awards?: AwardUncheckedUpdateManyWithoutProfileNestedInput
    hobbies?: HobbyUncheckedUpdateManyWithoutProfileNestedInput
  }

  export type ProfileCreateWithoutCertificationsInput = {
    id?: string
    userId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    avatarUrl?: string | null
    bio?: string | null
    headline?: string | null
    location?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutProfileInput
    skills?: SkillCreateNestedManyWithoutProfileInput
    experiences?: ExperienceCreateNestedManyWithoutProfileInput
    socialLinks?: SocialLinkCreateNestedManyWithoutProfileInput
    skillCategories?: SkillCategoryCreateNestedManyWithoutProfileInput
    education?: EducationCreateNestedManyWithoutProfileInput
    languages?: LanguageCreateNestedManyWithoutProfileInput
    awards?: AwardCreateNestedManyWithoutProfileInput
    hobbies?: HobbyCreateNestedManyWithoutProfileInput
  }

  export type ProfileUncheckedCreateWithoutCertificationsInput = {
    id?: string
    userId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    avatarUrl?: string | null
    bio?: string | null
    headline?: string | null
    location?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutProfileInput
    skills?: SkillUncheckedCreateNestedManyWithoutProfileInput
    experiences?: ExperienceUncheckedCreateNestedManyWithoutProfileInput
    socialLinks?: SocialLinkUncheckedCreateNestedManyWithoutProfileInput
    skillCategories?: SkillCategoryUncheckedCreateNestedManyWithoutProfileInput
    education?: EducationUncheckedCreateNestedManyWithoutProfileInput
    languages?: LanguageUncheckedCreateNestedManyWithoutProfileInput
    awards?: AwardUncheckedCreateNestedManyWithoutProfileInput
    hobbies?: HobbyUncheckedCreateNestedManyWithoutProfileInput
  }

  export type ProfileCreateOrConnectWithoutCertificationsInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutCertificationsInput, ProfileUncheckedCreateWithoutCertificationsInput>
  }

  export type ProfileUpsertWithoutCertificationsInput = {
    update: XOR<ProfileUpdateWithoutCertificationsInput, ProfileUncheckedUpdateWithoutCertificationsInput>
    create: XOR<ProfileCreateWithoutCertificationsInput, ProfileUncheckedCreateWithoutCertificationsInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutCertificationsInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutCertificationsInput, ProfileUncheckedUpdateWithoutCertificationsInput>
  }

  export type ProfileUpdateWithoutCertificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutProfileNestedInput
    skills?: SkillUpdateManyWithoutProfileNestedInput
    experiences?: ExperienceUpdateManyWithoutProfileNestedInput
    socialLinks?: SocialLinkUpdateManyWithoutProfileNestedInput
    skillCategories?: SkillCategoryUpdateManyWithoutProfileNestedInput
    education?: EducationUpdateManyWithoutProfileNestedInput
    languages?: LanguageUpdateManyWithoutProfileNestedInput
    awards?: AwardUpdateManyWithoutProfileNestedInput
    hobbies?: HobbyUpdateManyWithoutProfileNestedInput
  }

  export type ProfileUncheckedUpdateWithoutCertificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutProfileNestedInput
    skills?: SkillUncheckedUpdateManyWithoutProfileNestedInput
    experiences?: ExperienceUncheckedUpdateManyWithoutProfileNestedInput
    socialLinks?: SocialLinkUncheckedUpdateManyWithoutProfileNestedInput
    skillCategories?: SkillCategoryUncheckedUpdateManyWithoutProfileNestedInput
    education?: EducationUncheckedUpdateManyWithoutProfileNestedInput
    languages?: LanguageUncheckedUpdateManyWithoutProfileNestedInput
    awards?: AwardUncheckedUpdateManyWithoutProfileNestedInput
    hobbies?: HobbyUncheckedUpdateManyWithoutProfileNestedInput
  }

  export type ProfileCreateWithoutLanguagesInput = {
    id?: string
    userId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    avatarUrl?: string | null
    bio?: string | null
    headline?: string | null
    location?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutProfileInput
    skills?: SkillCreateNestedManyWithoutProfileInput
    experiences?: ExperienceCreateNestedManyWithoutProfileInput
    socialLinks?: SocialLinkCreateNestedManyWithoutProfileInput
    skillCategories?: SkillCategoryCreateNestedManyWithoutProfileInput
    education?: EducationCreateNestedManyWithoutProfileInput
    certifications?: CertificationCreateNestedManyWithoutProfileInput
    awards?: AwardCreateNestedManyWithoutProfileInput
    hobbies?: HobbyCreateNestedManyWithoutProfileInput
  }

  export type ProfileUncheckedCreateWithoutLanguagesInput = {
    id?: string
    userId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    avatarUrl?: string | null
    bio?: string | null
    headline?: string | null
    location?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutProfileInput
    skills?: SkillUncheckedCreateNestedManyWithoutProfileInput
    experiences?: ExperienceUncheckedCreateNestedManyWithoutProfileInput
    socialLinks?: SocialLinkUncheckedCreateNestedManyWithoutProfileInput
    skillCategories?: SkillCategoryUncheckedCreateNestedManyWithoutProfileInput
    education?: EducationUncheckedCreateNestedManyWithoutProfileInput
    certifications?: CertificationUncheckedCreateNestedManyWithoutProfileInput
    awards?: AwardUncheckedCreateNestedManyWithoutProfileInput
    hobbies?: HobbyUncheckedCreateNestedManyWithoutProfileInput
  }

  export type ProfileCreateOrConnectWithoutLanguagesInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutLanguagesInput, ProfileUncheckedCreateWithoutLanguagesInput>
  }

  export type ProfileUpsertWithoutLanguagesInput = {
    update: XOR<ProfileUpdateWithoutLanguagesInput, ProfileUncheckedUpdateWithoutLanguagesInput>
    create: XOR<ProfileCreateWithoutLanguagesInput, ProfileUncheckedCreateWithoutLanguagesInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutLanguagesInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutLanguagesInput, ProfileUncheckedUpdateWithoutLanguagesInput>
  }

  export type ProfileUpdateWithoutLanguagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutProfileNestedInput
    skills?: SkillUpdateManyWithoutProfileNestedInput
    experiences?: ExperienceUpdateManyWithoutProfileNestedInput
    socialLinks?: SocialLinkUpdateManyWithoutProfileNestedInput
    skillCategories?: SkillCategoryUpdateManyWithoutProfileNestedInput
    education?: EducationUpdateManyWithoutProfileNestedInput
    certifications?: CertificationUpdateManyWithoutProfileNestedInput
    awards?: AwardUpdateManyWithoutProfileNestedInput
    hobbies?: HobbyUpdateManyWithoutProfileNestedInput
  }

  export type ProfileUncheckedUpdateWithoutLanguagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutProfileNestedInput
    skills?: SkillUncheckedUpdateManyWithoutProfileNestedInput
    experiences?: ExperienceUncheckedUpdateManyWithoutProfileNestedInput
    socialLinks?: SocialLinkUncheckedUpdateManyWithoutProfileNestedInput
    skillCategories?: SkillCategoryUncheckedUpdateManyWithoutProfileNestedInput
    education?: EducationUncheckedUpdateManyWithoutProfileNestedInput
    certifications?: CertificationUncheckedUpdateManyWithoutProfileNestedInput
    awards?: AwardUncheckedUpdateManyWithoutProfileNestedInput
    hobbies?: HobbyUncheckedUpdateManyWithoutProfileNestedInput
  }

  export type ProfileCreateWithoutAwardsInput = {
    id?: string
    userId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    avatarUrl?: string | null
    bio?: string | null
    headline?: string | null
    location?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutProfileInput
    skills?: SkillCreateNestedManyWithoutProfileInput
    experiences?: ExperienceCreateNestedManyWithoutProfileInput
    socialLinks?: SocialLinkCreateNestedManyWithoutProfileInput
    skillCategories?: SkillCategoryCreateNestedManyWithoutProfileInput
    education?: EducationCreateNestedManyWithoutProfileInput
    certifications?: CertificationCreateNestedManyWithoutProfileInput
    languages?: LanguageCreateNestedManyWithoutProfileInput
    hobbies?: HobbyCreateNestedManyWithoutProfileInput
  }

  export type ProfileUncheckedCreateWithoutAwardsInput = {
    id?: string
    userId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    avatarUrl?: string | null
    bio?: string | null
    headline?: string | null
    location?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutProfileInput
    skills?: SkillUncheckedCreateNestedManyWithoutProfileInput
    experiences?: ExperienceUncheckedCreateNestedManyWithoutProfileInput
    socialLinks?: SocialLinkUncheckedCreateNestedManyWithoutProfileInput
    skillCategories?: SkillCategoryUncheckedCreateNestedManyWithoutProfileInput
    education?: EducationUncheckedCreateNestedManyWithoutProfileInput
    certifications?: CertificationUncheckedCreateNestedManyWithoutProfileInput
    languages?: LanguageUncheckedCreateNestedManyWithoutProfileInput
    hobbies?: HobbyUncheckedCreateNestedManyWithoutProfileInput
  }

  export type ProfileCreateOrConnectWithoutAwardsInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutAwardsInput, ProfileUncheckedCreateWithoutAwardsInput>
  }

  export type ProfileUpsertWithoutAwardsInput = {
    update: XOR<ProfileUpdateWithoutAwardsInput, ProfileUncheckedUpdateWithoutAwardsInput>
    create: XOR<ProfileCreateWithoutAwardsInput, ProfileUncheckedCreateWithoutAwardsInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutAwardsInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutAwardsInput, ProfileUncheckedUpdateWithoutAwardsInput>
  }

  export type ProfileUpdateWithoutAwardsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutProfileNestedInput
    skills?: SkillUpdateManyWithoutProfileNestedInput
    experiences?: ExperienceUpdateManyWithoutProfileNestedInput
    socialLinks?: SocialLinkUpdateManyWithoutProfileNestedInput
    skillCategories?: SkillCategoryUpdateManyWithoutProfileNestedInput
    education?: EducationUpdateManyWithoutProfileNestedInput
    certifications?: CertificationUpdateManyWithoutProfileNestedInput
    languages?: LanguageUpdateManyWithoutProfileNestedInput
    hobbies?: HobbyUpdateManyWithoutProfileNestedInput
  }

  export type ProfileUncheckedUpdateWithoutAwardsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutProfileNestedInput
    skills?: SkillUncheckedUpdateManyWithoutProfileNestedInput
    experiences?: ExperienceUncheckedUpdateManyWithoutProfileNestedInput
    socialLinks?: SocialLinkUncheckedUpdateManyWithoutProfileNestedInput
    skillCategories?: SkillCategoryUncheckedUpdateManyWithoutProfileNestedInput
    education?: EducationUncheckedUpdateManyWithoutProfileNestedInput
    certifications?: CertificationUncheckedUpdateManyWithoutProfileNestedInput
    languages?: LanguageUncheckedUpdateManyWithoutProfileNestedInput
    hobbies?: HobbyUncheckedUpdateManyWithoutProfileNestedInput
  }

  export type ProfileCreateWithoutHobbiesInput = {
    id?: string
    userId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    avatarUrl?: string | null
    bio?: string | null
    headline?: string | null
    location?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutProfileInput
    skills?: SkillCreateNestedManyWithoutProfileInput
    experiences?: ExperienceCreateNestedManyWithoutProfileInput
    socialLinks?: SocialLinkCreateNestedManyWithoutProfileInput
    skillCategories?: SkillCategoryCreateNestedManyWithoutProfileInput
    education?: EducationCreateNestedManyWithoutProfileInput
    certifications?: CertificationCreateNestedManyWithoutProfileInput
    languages?: LanguageCreateNestedManyWithoutProfileInput
    awards?: AwardCreateNestedManyWithoutProfileInput
  }

  export type ProfileUncheckedCreateWithoutHobbiesInput = {
    id?: string
    userId: string
    email: string
    firstName?: string | null
    lastName?: string | null
    avatarUrl?: string | null
    bio?: string | null
    headline?: string | null
    location?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutProfileInput
    skills?: SkillUncheckedCreateNestedManyWithoutProfileInput
    experiences?: ExperienceUncheckedCreateNestedManyWithoutProfileInput
    socialLinks?: SocialLinkUncheckedCreateNestedManyWithoutProfileInput
    skillCategories?: SkillCategoryUncheckedCreateNestedManyWithoutProfileInput
    education?: EducationUncheckedCreateNestedManyWithoutProfileInput
    certifications?: CertificationUncheckedCreateNestedManyWithoutProfileInput
    languages?: LanguageUncheckedCreateNestedManyWithoutProfileInput
    awards?: AwardUncheckedCreateNestedManyWithoutProfileInput
  }

  export type ProfileCreateOrConnectWithoutHobbiesInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutHobbiesInput, ProfileUncheckedCreateWithoutHobbiesInput>
  }

  export type ProfileUpsertWithoutHobbiesInput = {
    update: XOR<ProfileUpdateWithoutHobbiesInput, ProfileUncheckedUpdateWithoutHobbiesInput>
    create: XOR<ProfileCreateWithoutHobbiesInput, ProfileUncheckedCreateWithoutHobbiesInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutHobbiesInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutHobbiesInput, ProfileUncheckedUpdateWithoutHobbiesInput>
  }

  export type ProfileUpdateWithoutHobbiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutProfileNestedInput
    skills?: SkillUpdateManyWithoutProfileNestedInput
    experiences?: ExperienceUpdateManyWithoutProfileNestedInput
    socialLinks?: SocialLinkUpdateManyWithoutProfileNestedInput
    skillCategories?: SkillCategoryUpdateManyWithoutProfileNestedInput
    education?: EducationUpdateManyWithoutProfileNestedInput
    certifications?: CertificationUpdateManyWithoutProfileNestedInput
    languages?: LanguageUpdateManyWithoutProfileNestedInput
    awards?: AwardUpdateManyWithoutProfileNestedInput
  }

  export type ProfileUncheckedUpdateWithoutHobbiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    firstName?: NullableStringFieldUpdateOperationsInput | string | null
    lastName?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    headline?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutProfileNestedInput
    skills?: SkillUncheckedUpdateManyWithoutProfileNestedInput
    experiences?: ExperienceUncheckedUpdateManyWithoutProfileNestedInput
    socialLinks?: SocialLinkUncheckedUpdateManyWithoutProfileNestedInput
    skillCategories?: SkillCategoryUncheckedUpdateManyWithoutProfileNestedInput
    education?: EducationUncheckedUpdateManyWithoutProfileNestedInput
    certifications?: CertificationUncheckedUpdateManyWithoutProfileNestedInput
    languages?: LanguageUncheckedUpdateManyWithoutProfileNestedInput
    awards?: AwardUncheckedUpdateManyWithoutProfileNestedInput
  }

  export type ProjectCreateManyProfileInput = {
    id?: string
    title: string
    description?: string | null
    images?: ProjectCreateimagesInput | string[]
    liveUrl?: string | null
    repoUrl?: string | null
    tags?: ProjectCreatetagsInput | string[]
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SkillCreateManyProfileInput = {
    id?: string
    name: string
    categoryId?: string | null
    proficiency?: $Enums.Proficiency
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExperienceCreateManyProfileInput = {
    id?: string
    company: string
    role: string
    description?: ExperienceCreatedescriptionInput | string[]
    startDate: Date | string
    endDate?: Date | string | null
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SocialLinkCreateManyProfileInput = {
    id?: string
    platform: string
    url: string
    label?: string | null
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SkillCategoryCreateManyProfileInput = {
    id?: string
    name: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EducationCreateManyProfileInput = {
    id?: string
    school: string
    degree?: string | null
    field?: string | null
    startDate: Date | string
    endDate?: Date | string | null
    description?: EducationCreatedescriptionInput | string[]
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CertificationCreateManyProfileInput = {
    id?: string
    name: string
    issuer: string
    issueDate?: Date | string | null
    expiryDate?: Date | string | null
    url?: string | null
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LanguageCreateManyProfileInput = {
    id?: string
    name: string
    proficiency?: string
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AwardCreateManyProfileInput = {
    id?: string
    title: string
    issuer?: string | null
    date?: Date | string | null
    description?: string | null
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type HobbyCreateManyProfileInput = {
    id?: string
    name: string
    description?: string | null
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    images?: ProjectUpdateimagesInput | string[]
    liveUrl?: NullableStringFieldUpdateOperationsInput | string | null
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ProjectUpdatetagsInput | string[]
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    images?: ProjectUpdateimagesInput | string[]
    liveUrl?: NullableStringFieldUpdateOperationsInput | string | null
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ProjectUpdatetagsInput | string[]
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectUncheckedUpdateManyWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    images?: ProjectUpdateimagesInput | string[]
    liveUrl?: NullableStringFieldUpdateOperationsInput | string | null
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: ProjectUpdatetagsInput | string[]
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SkillUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    proficiency?: EnumProficiencyFieldUpdateOperationsInput | $Enums.Proficiency
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: SkillCategoryUpdateOneWithoutSkillsNestedInput
  }

  export type SkillUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    proficiency?: EnumProficiencyFieldUpdateOperationsInput | $Enums.Proficiency
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SkillUncheckedUpdateManyWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    categoryId?: NullableStringFieldUpdateOperationsInput | string | null
    proficiency?: EnumProficiencyFieldUpdateOperationsInput | $Enums.Proficiency
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExperienceUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    description?: ExperienceUpdatedescriptionInput | string[]
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExperienceUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    description?: ExperienceUpdatedescriptionInput | string[]
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExperienceUncheckedUpdateManyWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    description?: ExperienceUpdatedescriptionInput | string[]
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SocialLinkUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SocialLinkUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SocialLinkUncheckedUpdateManyWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    platform?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    label?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SkillCategoryUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    skills?: SkillUpdateManyWithoutCategoryNestedInput
  }

  export type SkillCategoryUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    skills?: SkillUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type SkillCategoryUncheckedUpdateManyWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EducationUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    school?: StringFieldUpdateOperationsInput | string
    degree?: NullableStringFieldUpdateOperationsInput | string | null
    field?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    description?: EducationUpdatedescriptionInput | string[]
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EducationUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    school?: StringFieldUpdateOperationsInput | string
    degree?: NullableStringFieldUpdateOperationsInput | string | null
    field?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    description?: EducationUpdatedescriptionInput | string[]
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EducationUncheckedUpdateManyWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    school?: StringFieldUpdateOperationsInput | string
    degree?: NullableStringFieldUpdateOperationsInput | string | null
    field?: NullableStringFieldUpdateOperationsInput | string | null
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    description?: EducationUpdatedescriptionInput | string[]
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CertificationUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    issuer?: StringFieldUpdateOperationsInput | string
    issueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CertificationUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    issuer?: StringFieldUpdateOperationsInput | string
    issueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CertificationUncheckedUpdateManyWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    issuer?: StringFieldUpdateOperationsInput | string
    issueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LanguageUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    proficiency?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LanguageUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    proficiency?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LanguageUncheckedUpdateManyWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    proficiency?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AwardUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    issuer?: NullableStringFieldUpdateOperationsInput | string | null
    date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AwardUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    issuer?: NullableStringFieldUpdateOperationsInput | string | null
    date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AwardUncheckedUpdateManyWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    issuer?: NullableStringFieldUpdateOperationsInput | string | null
    date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HobbyUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HobbyUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HobbyUncheckedUpdateManyWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SkillCreateManyCategoryInput = {
    id?: string
    profileId: string
    name: string
    proficiency?: $Enums.Proficiency
    sortOrder?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SkillUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    proficiency?: EnumProficiencyFieldUpdateOperationsInput | $Enums.Proficiency
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneRequiredWithoutSkillsNestedInput
  }

  export type SkillUncheckedUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    proficiency?: EnumProficiencyFieldUpdateOperationsInput | $Enums.Proficiency
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SkillUncheckedUpdateManyWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    profileId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    proficiency?: EnumProficiencyFieldUpdateOperationsInput | $Enums.Proficiency
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}