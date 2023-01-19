# Usage

- 0. Build the environment
- 1. Prepare your model
- 2. Write the database infrastructure methods
- 3. Make service with busniess logics
- 4. Write a Plan
- 5. Use it

## 0. Build the environement
::: details Install & Config
#### Install TypeScript
```bash
yarn add -D typescript
```
#### Init & config tsconfig.json
```bash
npx tsc --init .
```
tsconfig.json
```json
{
  "compilerOptions": {
    // ...
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
    // ...
  }
}
```
#### Install dependencies & ts-multi-tenancy
```bash
# Install typeorm and require drive
# At here, we use Posrgres, so instann pg
yarn add typeorm pg ts-multi-tenancy
```
#### Config ts-multi-tenancy configs
```.env
## DB_AUTH to PostgreSQL, if docker use, need to be sure.
DB_URL=postgresql://user:1234@127.0.0.1/dev
PLAN_NAME=standard
## true or false when everytime up database
DB_DROP_SCHEMA=false
DB_MIGRATIONS_RUN=false
## boolean | "all" | ("query" | "schema" | "error" | "warn" | "info" | "log" | "migration")
DB_LOGGING=false
```
:::

::: details Migration script (Optional)

If you can find anyother ways to generate & run your migration files.  
Feel free to write yourself.

#### TypeORM scripts @ package.json
```json
{
  // ...
  "scripts": {
    "typeorm:cli": "npx typeorm -d ./cli_datasource.ts",
    "typeorm:cli:system": "npx typeorm -d ./node_modules/@yunology/ts-multi-tenancy/dist/cli_datasource.js"
  }
  // ...
}
```
#### Write a migration script
This script is use to generate migration files for your models.
```typescript
// TBD
```
#### Execute System Require migrations
```bash
# TBD
```
:::

## 1. Prepare your model
::: details Code
```typescript
import { Entity, Column } from 'typeorm';
import { TenantEntity } from '@yunology/ts-multi-tenancy';

@Entity()
export class User extends TenantEntity {
  @Column({ type: 'text' })
  name!: string;
}
```
:::

## 2. Write the database infrastructure methods
::: details Code
```typescript
import { InfrastructureManyModifiable } from '@yunology/ts-multi-tenancy';

import { User } from 'somewhere/you/define/your/model';

export class UserInfrastructure extends InfrastructureManyModifiable<User> {
  private static INSTANCE: UserInfrastructure;

  public static init(): UserInfrastructure {
    if (this.INSTANCE === undefined) {
      this.INSTANCE = new UserInfrastructure();
    }

    return this.INSTANCE;
  }

  public static getInstance(): UserInfrastructure {
    return this.INSTANCE;
  }

  constructor() {
    super(User);
  }

  // ... methods how you opearte your database ...
  public getById(
    manager: EntityManager, { tenantId }: RuntimeTenant, id: string,
  ): Promise<User> {
    return this.get(manager, { tenantId, id });
  }
}
```
:::

## 3. Make service with busniess logics
::: details Code
```typescript
import { DataService } from '@yunology/ts-multi-tenancy';

import { User } from 'somewhere/you/define/your/model';
import { UserInfrastructure } from 'somewhere/you/define/your/infras';

export class UserService extends DataService {
  // some local variables
  precreateRootUser!: User;

  public async init(tenant: RuntimeTenant): Promise<UserService> {
    await super.init(tenant);

    // local variables init at here.
    this.precreateRootUser = await this.someMethodToPreCreateUser(...);
    return this;
  }

  public async getById(id: string): Promise<User> {
    return UserInfrastructure.getInstance().getById(
      this.tenant.ds.manager,
      this.tenant,
      id,
    );
  }
}
```
:::
