# TenantEntity: Tenant base entity

This class extends [BaseEntity](/designs/entities/base), and add extra `tenantId` field describe which tenant owns this data.  

## Usage
```typescript
import { Entity, Column } from 'typeorm';
import { TenantEntity } from '@yunology/ts-multi-tenancy';

@Entity()
export class User extends TenantEntity {
  @Column({ type: 'text' })
  name!: string;
}
```
