# TenantEntity: Tenant base entity

This class extends [BaseEntity](/guide/entities/base), and add extra `tenantId` field describe which tenant owns this data.  

## Usage
```typescript
import { TenantEntity } from '@yunology/ts-multi-tenancy';

export class User extends TenantEntity {
  @Column({ type: 'text' })
  name!: string;
}
```
