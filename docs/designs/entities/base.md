# BaseEntity
This class has three fields: `id`, `createdAt`, `updatedAt`.  

## Usage
```typescript
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@yunology/ts-multi-tenancy';

@Entity()
export class SomeEnties extends BaseEntity {}
```
