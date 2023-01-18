# Usage

- 0. Build the environment
- 1. Prepare your model
- 2. Write the database infrastructure methods
- 3. Make service with busniess logics
- 4. Write a Plan
- 5. Use it

## 0. Build the environement

## 1. Prepare your model
```typescript
import { TenantEntity } from '@yunology/ts-multi-tenancy';

export class User extends TenantEntity {
  @Column({ type: 'text' })
  name!: string;
}
```

## 2. Write the database infrastructure methods
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
    manager: EntityManager, runtimeTenant: RuntimeTenant, id: string,
  ): Promise<User> {
    return this.get(
      manager,
      { tenantId: runtimeTenant.tenantId, id },
    );
  }
}
```

## 3. Make service with busniess logics
```typescript
import { DataService } from '@yunology/ts-multi-tenancy';

export class UserService extends DataService {
  // some local variables
  precreateRootUser!: User;

  public async init(tenant: RuntimeTenant): Promise<UserService> {
    await super.init(tenant);

    // local variables init at here.
    this.precreateRootUser = await this.someMethodToPreCreateUser(...);
    return this;
  }

  public async login(account: string, password: string): Promise<User> {
    // ... logics for checking 
  }
}
```
