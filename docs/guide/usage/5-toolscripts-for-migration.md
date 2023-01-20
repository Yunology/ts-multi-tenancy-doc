# Tool scripts for migration

## DataSource for TypeORM

::: tip
If you can find anyother ways to generate & run your migration files.
Feel free to write yourself.
:::

This datasource file is for TypeORM to interact the database.  

::: code-group
```typescript [cli_datasource.ts]
// cli_datasource.ts
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { createDataSource, getPlan } from '@yunology/ts-multi-tenancy';

config({ path: `.env.${process.env.ENV_NAME}` });

import { initPlan } from './src/app';

const { env } = process;
const { DB_NAME, PLAN_NAME, DB_URL } = env;

initPlan();
let dataSource: DataSource;
const { entries, migrations} = getPlan(PLAN_NAME!);
dataSource = createDataSource(
  DB_NAME!, PLAN_NAME!, {
    url: DB_URL!,
    entities: entries,
    migrations,
  },
);

export default dataSource;
```
:::

::: info
For more information about DataSource.  
Please reference TypeORM [document](https://typeorm.io/data-source).
:::

## Generating migration files

The command requires `dotenv` & `ts-node` package to be install.  

```bash
env ENV_NAME=dev npx ts-node node_modules/.bin/typeorm migration:generate -d ./cli_datasource.ts <path>
```

### env file
Env file named as `.env.dev` than you should use belows command: `env ENV_NAME=dev`.  
If the name is `.env.something`, than use `env ENV_NAME=something`.  
The `.env` prefix is required.  

::: tip
env file is created @ [[0. build the environment](/guide/usage/0-build-the-environement)].
:::

### cli_datasource.ts
The file path `./cli_datasource.ts` is the file we created [eariler](#datasource-for-typeorm).  

### \<path\>
The file path to store the migration file, including file name.  
For example: `./src/migration/aaaa`, TypeORM will generate a file with timestamp prefix and name as file name.  
So the example input `./src/migration/aaaa` will result a file named `1674223844012-aaaa.ts` at folder path `./src/migration`.  

::: info
For more information about migration commands.
Please reference TypeORM [document](https://typeorm.io/migrations#running-and-reverting-migrations).
:::

## Running `ts-multi-tenancy`'s migration
`ts-multi-tenancy` provides a cli command: `tsmt` or `ts-multi-tenancy` to help you sync system's migrations into your database.  

### yarn tsmt migration:system show
This can check the migration status in current database.  
It should something like below:  
```sh
$ env ENV_NAME=dev yarn tsmt migration:system show
[X] TenantInit1668658417786
[X] BaseEntityIdField1668675504073
Done in 0.87s.
```

### yarn tsmt migration:system run
This will apply migration files into database.  
It should output batch of SQL commands wrote in migration's UP method.  

```bash
$ env ENV_NAME=dev yarn tsmt migration:system run
...
query: ALTER TABLE "tenant" DROP CONSTRAINT "PK_dbd58dde83f10aef57187658aca"
query: ALTER TABLE "tenant" ADD CONSTRAINT "PK_5782563cffee995e1885aba0d57" PRIMARY KEY ("name", "org_name", "id")
query: ALTER TABLE "tenant" ADD "databaseId" uuid
query: ALTER TABLE "tenant" ADD CONSTRAINT "FK_5117dd693d15ab80eb889c6f68b" FOREIGN KEY ("databaseId", "databaseName", "databaseUrl") REFERENCES "database"("id","name","url") ON DELETE NO ACTION ON UPDATE NO ACTION
query: INSERT INTO "public"."migrations"("timestamp", "name") VALUES ($1, $2) -- PARAMETERS: [1668675504073,"BaseEntityIdField1668675504073"]
Migration BaseEntityIdField1668675504073 has been executed successfully.
query: COMMIT
Done in 1.72s.
```

### yarn tsmt migration:system revert
This will revert one migration from database.   
It should output batch of SQL commands wrote in migration's DOWN method.  
```bash
$ env ENV_NAME=dev yarn tsmt migration:system revert
...
query: ALTER TABLE "database" ADD CONSTRAINT "PK_d6f2a8fbd37e49015928687bdc8" PRIMARY KEY ("name", "url")
query: ALTER TABLE "database" DROP COLUMN "id"
query: ALTER TABLE "tenant" ADD CONSTRAINT "FK_5a52e06e03d81166ab1d331fea5" FOREIGN KEY ("databaseName", "databaseUrl") REFERENCES "database"("name","url") ON DELETE NO ACTION ON UPDATE NO ACTION
query: DELETE FROM "public"."migrations" WHERE "timestamp" = $1 AND "name" = $2 -- PARAMETERS: [1668675504073,"BaseEntityIdField1668675504073"]
Migration BaseEntityIdField1668675504073 has been reverted successfully.
query: COMMIT
Done in 0.86s.
```
