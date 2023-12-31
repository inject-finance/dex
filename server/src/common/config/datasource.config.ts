import type { DataSourceOptions } from 'typeorm'

export const getConfig = () =>
  ({
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    migrations: ['src/migrations/*{.js,.ts}'],
    entities: [`${__dirname}/entities.config.ts`]
  }) as DataSourceOptions
