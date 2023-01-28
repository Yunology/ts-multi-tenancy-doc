# Config
`ts-multi-tenancy` provides a TypeScript type-safe way to preset the default config & access config inside `Service`.  
`Config` and its decorator can only use at child class of `Config`.  
The following code presenting a `AuthService` with config preset, at bottom will shows the whole code.  

## ConfigTree
Describe your service's config tree look like with a interface extends `ConfigTree`.  
```typescript
import { ConfigTree } from '@yunology/ts-multi-tenancy';

// You can export this config type to let other service to use it.  
export interface IAuthConfig extends ConfigTree {
  salt: string;
};
```

## SetupDefaultConfig
This decorator use to setup default config for given config type in service class,  
When a tenant is setup by given service, default value will be preset into tenant incase tenant doesn't setup given field.  
  
::: info
This decorator is not essential, you can still access the config inside any service's method.  
:::
  
Below codes shows how to bind the config to service class:
```typescript
@SetupDefaultConfig<IAuthConfig>({
  salt: 'default salt',
})
export class AuthService extends Service {}
```

::: details and yes, of course you can define like this: 
```typescript
@SetupDefaultConfig<{
  salt: string;
}>({
  salt: 'default salt',
})
export class AuthService extends Service {}
```
:::
But its hard to reuse by other service.  

## config
This method is a built-in function at Service class to access tenant's config type-safely.  
```typescript
export class AuthService extends Service {
  // ...
  public passwordHash(tenant: RuntimeTenant,  plainPassword: string): string {
    const salt = this.config<IAuthConfig>(tenant).salt;
    return someHashMethod(plainPassword, salt);
  }
  // ...
}
```

## Whole codes
```typescript
import {
  ConfigTree,
  SetupDefaultConfig,
  Service,
  RuntimeTenant,
} from '@yunology/ts-multi-tenancy';

export interface IAuthConfig extends ConfigTree {
  salt: string;
};

@SetupDefaultConfig<IAuthConfig>({
  salt: 'default salt',
})
export class AuthService extends Service {
  // ...
  public passwordHash(tenant: RuntimeTenant,  plainPassword: string): string {
    const salt = this.config<IAuthConfig>(tenant).salt;
    return someHashMethod(plainPassword, salt);
  }
  // ...
}
```

## FAQ
### Q1.
**Can I use with out any config decorator?**  
::: details Answer:
Yes, you can simply use `config` inside any service's method, event without any Config define:  
```typescript
export class AuthService extends Service {
  // ...
  public async login(
    operator: User,
    tenant: RuntimeTenant,
    account: string,
    password: string,
  ): Promise<boolean> {
    const pwdDefaultMinLength = this.config<{
      default_password_min_length: number;
    }>(tenant).default_password_min_length;
    if (password.length < pwdDefaultMinLength) {
      throw new Error('Given password is too short.');
    }

    const getUser = UserInfrastructure.getInstance().someMethodToGetUser(account, password);
    return getUser !== undefined;
  }
  // ...
}
```

But without any Config define may let the usage become difficult.  
:::

### Q2.
**Can I use with Permission?**  
::: details Answer:
Yes, you can do something like this:  
```typescript
@SetupPermission<IAuthPermission>(AuthPermission)
@SetupDefaultConfig<IAuthConfig>({
  salt: 'default_salt',
  default_password_min_length: 10,
})
export class AuthService extends Service {
  // ...
  @PermissionRequire(AuthPermission.LOGIN)
  public async login(
    operator: User,
    tenant: RuntimeTenant,
    account: string,
    password: string,
  ): Promise<boolean> {
    const pwdDefaultMinLength = this.config<IAuthConfig>(tenant).default_password_min_length;
    if (password.length < pwdDefaultMinLength) {
      throw new Error('Given password is too short.');
    }

    const getUser = UserInfrastructure.getInstance().someMethodToGetUser(account, password);
    return getUser !== undefined;
  }
  // ...
}
```
:::

### Q3.
**Can I use a service's config from another service?**
::: details Answer:
Yes, you can do something like this:  

```typescript [src/service/a_service.ts]
export interface IAServiceConfig extends ConfigTree {
  foo: number;
};

export class AService extends Service {}
```
  
```typescript [src/service/b_service.ts]
export interface IBServiceConfig extends ConfigTree {
  bar: string;
};

export class BService extends Service {
  // ...
  public async method(tenant: RuntimeTenant): Promise<void> {
    const foo = this.config<IAService>(tenant).foo;
    // ...
  }
  // ...
}
```
:::

### Q4.
**Can I use a service's config to set default value to another service?**  
::: details Answer:
If you mean something like this:  
```typescript
@SetupDefaultConfig<ISomeConfigFromAnotherService>()
export class FooService extends Service {}
```
We don't encourage usage like this.  
<br>
Because the decorator `SetupDefaultConfig` is use to preset default value of given config interface.  
If you `SetupDefaultConfig` with same interface type and certain fields multiple times,  
that would possibly cause unexpected value been preset.  
<br>
We suggest every Config interface with each filed only been use in `SetupDefaultConfig` only once during whole runtime process.  
:::
