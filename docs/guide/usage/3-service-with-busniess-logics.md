# Service with busniess logics

::: code-group
```typescript [src/service/user.ts]
// src/service/user.ts
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

::: tip TIP: Permission & Config support @ Service
Check [Service page](/designs/services/data-service)
:::
