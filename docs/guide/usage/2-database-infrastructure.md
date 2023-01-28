# Database infrastructure
Here is logics, how `ts-multi-tenancy` to interact with Postgres through `TypeORM`.  

::: tip
We recommend **ONLY** writing CRUD logics at here.  
For example, you can focus on how to manage TypeORM's relations fields, maybe some data post-process, data clean before operate db.
:::
::: code-group
```typescript [src/infrastructure/user.ts]
// src/infrastructure/user.ts
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

  // ... methods how you operate your database ...
  public getById(
    manager: EntityManager, { tenantId }: RuntimeTenant, id: string,
  ): Promise<User> {
    return this.get(manager, { tenantId, id });
  }
}
```
:::
