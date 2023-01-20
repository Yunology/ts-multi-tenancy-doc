# Entity

Entity, known as Entry in ts-multi-tenancy, is a kind of PO(persistent object).  
Whom store everything fetch from database by infrastructure.  

---

There is two kinds of Entity abstract class provide by `ts-multi-tenancy`.  
[BaseEntity](/designs/entities/base) and [TenantEntity](/designs/entities/tenant-base).  

---

::: info
Note that this is a `TypeORM` entity.  
For more informations about different kinds of Entity define.  
Please reference TypeORM [document](https://typeorm.io/entities).  
:::
