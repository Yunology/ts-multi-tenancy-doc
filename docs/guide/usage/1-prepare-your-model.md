# Prepare your model
Here, we define a `User` entity to interact it.  

::: code-group
```typescript [src/entities/user.entity.ts]
// src/entities/user.entity.ts
import { Entity, Column } from 'typeorm';
import { TenantEntity } from '@yunology/ts-multi-tenancy';

@Entity()
export class User extends TenantEntity {
  @Column({ type: 'text' })
  name!: string;
}
```
:::
