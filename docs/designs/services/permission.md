# Permission
`ts-multi-tenancy` provides a way to describe the service permission & how methods been guards.  
`Permission` and its decorator can only use at child class of `Service`.  
The following code presenting a `AuthService` with permission control, at bottom will shows the whole code.  

## registerPermissionValidateFunction
Describe how you validate a method is pass permission or not.  

You have to determine how is your method looks like with fixed shape.  
For example, all your method want to restrict by decorator for permission check will look like below:  
```typescript
public async method(operator: User, ...rest: any[]): Promise<void>;
```
Following examples will use this shape to define methods.  

After this, you can determine how you verify permissions:  
Since the `User` class is a `TenantEntity`, it has a `tenantId` to know what `Tenant` it belongs, and there is a `groups` fields defines in `User` with permission details.  
We can use these fields to check is a user is allow to use given method with tenant permission.  
```typescript
registerPermissionValidateFunction(async (
  service: Service, permission: Permission, ...args: unknown[]
) => {
  const user = args[0] as User;
  const tenant = getTenantService().getTenantByInfo(user.tenantId);
  const { groups } = user;
  return groups
    .some((each: Group) => each.permissions
      .some((per: number) => tenant!.isPermissionMatched(per, permission)));
});
```
::: tip
`User` is a customize class to store user data which extends `TenantEntity` in order to recognize which tenant owns the data; `groups` field in `User` class is also a customize result here.  
  
You can change to `Employee` or whatever you define, and just extends `TenantEntity` to make sure it is unique in database for use.  
  
Here is another example:  
```typescript
// This is the shape of your methods whom going to restrict permission with decorator.
public async method(employee: Employee, ...rest: any[]): Promise<void>;

// This is your access control class called Employee with a permissions fields holds all permissions.  
@Entity()
export class Employee extends TenantEntity {
  @Column({ type: 'jsonb' })
  permissions!: Array<Permission>;
}

// Then your `registerPermissionValidateFunction` would look like this:
registerPermissionValidateFunction(async (
  service: Service, permission: Permission, ...args: unknown[]
) => {
  // args is the methods parameter shape, at here we put employee: Employee as first argument at above.  
  const employee = args[0] as Employee;
  const tenant = getTenantService().getTenantByInfo(user.tenantId);
  const { permissions } = employee;
  return permissions.some((per: number) => tenant!.isPermissionMatched(per, permission));
});
```
Of course, you can make your own change, this is just an example.  
:::

::: warning
After all, you should put this `registerPermissionValidateFunction` invoke at anywhere before you call `initMultiTenancy` method.  
:::

## PermissionTree
Describe your service's permission tree look like with a interface extends `PermissionTree`.  
Then define the detail about such permissions:  
```typescript
import { Permission, PermissionTree } from '@yunology/ts-multi-tenancy';

/**
 * You can export this permission type to let other service to use it.  
 * We suggest permission interface with a upper-case `I` as prefix,  
 * because later we will defined another const name AuthPermission.
 */
export interface IAuthPermission extends PermissionTree {
  LOGIN: Permission;
  LOGOUT: Permission;
};

export const AuthPermission: IAuthPermission = {
  // number index, permission name, permission description.
  LOGIN: new Permission(0x0001, 'LOGIN', 'allow to login'),
  LOGOUT: new Permission(0x0002, 'LOGOUT', 'allow to logout'),
};
```

This is how you defined the service permission, we recommend define at top of each service with its own permission tree.  

## SetupPermission
Below codes shows how to bind the permission to service class:  
```typescript
@SetupPermission<IAuthPermission>(AuthPermission)
export class AuthService extends Service {}
```

::: details and yes, of course you can define like this: 
```typescript
@SetupPermission<{
  LOGIN: Permission;
  LOGOUT: Permission;
}>({
  LOGIN: new Permission(0x0001, 'LOGIN', 'allow to login'),
  LOGOUT: new Permission(0x0002, 'LOGOUT', 'allow to logout'),
})
export class AuthService extends Service {}
```
:::
But its hard to reuse by other service.  

This way, `ts-multi-tenancy` will write these permission into `AuthService` class.  
If any tenant init with this service will be inject these permissions for later use.  

## PermissionRequire
Here describe how you restrict methods with Permissions.  
```typescript
@SetupPermission<IAuthPermission>(AuthPermission)
export class AuthService extends Service {
  // Remember the method shape should look like (User, ...rest)
  @PermissionRequire(AuthPermission.LOGIN)
  async login(operator: User, account: string, password): Promise<boolean> {
    const getUser = UserInfrastructure.getInstance().someMethodToGet(account, password);
    return getUser !== undefined;
  }
}
```

## Whole Codes
::: code-group
```typescript [src/service/auth.ts]
import { Permission, PermissionTree, Service } from '@yunology/ts-multi-tenancy';

import { User } from 'path/to/user/entry/class';
import { UserInfrastructure } from 'path/to/user/infrastructure/class';

export interface IAuthPermission extends PermissionTree {
  LOGIN: Permission;
  LOGOUT: Permission;
};

export const AuthPermission: IAuthPermission = {
  LOGIN: new Permission(0x0001, 'LOGIN', 'allow to login'),
  LOGOUT: new Permission(0x0002, 'LOGOUT', 'allow to logout'),
};

@SetupPermission<IAuthPermission>(AuthPermission)
export class AuthService extends Service {
  @PermissionRequire(AuthPermission.LOGIN)
  async login(operator: User, account: string, password): Promise<boolean> {
    const getUser = UserInfrastructure.getInstance().someMethodToGet(account, password);
    return getUser !== undefined;
  }
}
```
```typescript [src/app.ts]
const app = express();
// ...
registerPermissionValidateFunction(async (
  service: Service, permission: Permission, ...args: unknown[]
) => {
  const employee = args[0] as Employee;
  const tenant = getTenantService().getTenantByInfo(user.tenantId);
  const { permissions } = employee;
  return permissions.some((per: number) => tenant!.isPermissionMatched(per, permission));
});
// ...
await initMultiTenancy(...);
// ...
app.use(...);
app.get(...);
// ...
app.listen(port);
```
:::

## FAQ
### Q1.
**What if before login success, I can't get method with `operator: User` as first argument but I still want to do permission check inside method?**  
Don't use `@PermissionRequire` at such method.  
Here is an example for `login` method:  
```typescript
// ...
export class AuthService extends Service {
  // ...
  public async login(
    tenant: RuntimeTenant,
    account: string,
    password: string,
    manager?: EntityManager,
  ): Promise<User> {
    const getUser = await UserInfrastructure.getInstance().someMethodToGetUser(account, password);
    if (getUser === undefined) {
      throw new Error('Account or Password is incorrect.');
    }

    const somePermissionGetFromUser = getUser.someField;
    if (!tenant.isPermissionMatched(
      somePermissionGetFromUser,
      AuthPermission.LOGIN,
    )) {
      throw new Error('Given user is not matched to permissions.');
    }
    return user;
  }
  // ...
}
```

### Q2.
**Can I use multiple `PermissionRequire` decorator at same method?**  
Yes, but currently if you use decorator more than once at same method.  
All permission should be satisfied to execute method.  
```typescript
export class AuthService extends Service {
  @PermissionRequire(AuthPermission.LOGIN)
  @PermissionRequire(AuthPermission.ANOTHER_LOGIN)
  async login(operator: User, account: string, password): Promise<boolean> {
    const getUser = UserInfrastructure.getInstance().someMethodToGet(account, password);
    return getUser !== undefined;
  }
}
```
For example:  
To execute method login, user should satisfied with both permission LOGIN & ANOTHER_LOGIN.  
