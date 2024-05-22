import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { get } from 'env-var';
import { config } from 'dotenv';
config();

const commonConf = {
  ENTITIES: [__dirname + '/dal/entities/*.entity{.ts,.js}'],
  MIGRATIONS: [__dirname + '/migrations/**/*{.ts,.js}'],
  MIGRATIONS_RUN: get('DB_MIGRATIONS_RUN').asBool(),
  SYNCHRONIZE: get('DB_SYNCHRONIZE').asBool()
};

const typeOrmConfig: TypeOrmModuleOptions = {
  name: 'default',
  type: 'mysql',
  host: get('DB_HOST').asString(),
  username: get('DB_USERNAME').asString(),
  password: get('DB_PASSWORD').asString(),
  database: get('DB_NAME').asString(),
  port: 3306,
  //extra: { trustServerCertificate: true },
  logging: true,
  entities: commonConf.ENTITIES,
  migrations: commonConf.MIGRATIONS,
  migrationsRun: commonConf.MIGRATIONS_RUN,
  synchronize: commonConf.SYNCHRONIZE
};

if (process.env.NODE_ENV === 'prod') {
  // your production options here
}

if (process.env.NODE_ENV === 'test') {
  // your test options here
}

export { typeOrmConfig };