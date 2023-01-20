# Plan groups services

::: code-group
```typescript [src/app.ts]
// src/app.ts
import { initPlans, TenantPlanInfo } from '@yunology/ts-multi-tenancy';

import { User } from './entity/user.entity';
import { UserService } from './service/user';

export function initPlan(): void {
  initPlans(() => ({
    standard: new TenantPlanInfo(
      'standard',
      [UserService],
      [User],
      [],
    ),
  }));
}
```
:::
