# Build the environment

## Install TypeScript
```bash
yarn add -D typescript
```

## Init & config tsconfig.json
```bash
npx tsc --init .
```
tsconfig.json
```json
{
  "compilerOptions": {
    // ...
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
    // ...
  }
}
```

## Install dependencies & ts-multi-tenancy
Install typeorm and require driver
```bash
# At here, we use Posrgres, so install pg
yarn add typeorm pg ts-multi-tenancy
```  
For running local migration generating yarn command.
```bash
yarn add -D ts-node
```

### Config ts-multi-tenancy configs
Create a environment variable files with prefix `.env`.  
Fof example: `.env.dev`.  
```.env
## DB_AUTH to PostgreSQL, if docker use, need to be sure.
DB_URL=postgresql://user:1234@127.0.0.1/dev
PLAN_NAME=standard
## true or false when everytime up database
DB_DROP_SCHEMA=false
DB_MIGRATIONS_RUN=false
## boolean | "all" | ("query" | "schema" | "error" | "warn" | "info" | "log" | "migration")
DB_LOGGING=false
```
