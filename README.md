# CSR React + Web Concepts

## Quick Actions

### Install workspace dependencies

```shell
# Only apps and packages folders are added as workspaces
npm install --workspace=packages/ui

npm i lodash -w packages/ui
```

### Dependency updates

```shell
# list updates
npx npm-check-updates

# Update package.json
npx npm-check-updates -u

# Only update minor versions
npx npm-check-updates -u -t minor
```

### Mix
