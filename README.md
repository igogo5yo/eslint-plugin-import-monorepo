# eslint-plugin-import-monorepo
This ESLint plugin enforces the rules for pretty imports inside the monorepo workspaces.

Allows you to have pretty imports inside the monorepo packages.


## Installation and usage

Assuming you already have ESLint installed, run:

```sh
# npm
npm install eslint-plugin-import-monorepo --save-dev

# yarn
yarn add eslint-plugin-import-monorepo --dev
```

Then add it to your ESLint configuration:

```js
{
  "plugins": [
    // ...
    "import-monorepo"
  ],
  "rules": {
    // ...
    "import-monorepo/smart-workspace-import": ["warn", {
      maxUp: 2 // not required
    }],
    "import-monorepo/no-src-or-build": ["warn", {
      onlyFrom: ['./packages'] // not required
    }]
  }
}
```


**Example #1:**
Imports in scope of the same package. (`import-monorepo/smart-workspace-import`)  
This import `import module from '@current/package/long/path/to/moduleName';`  
will be replaced by `import module from '../moduleName';`  
if folders nesting difference will be less or equal to `maxUp` property size. 

**Example #2:** Imports across all packages (`import-monorepo/no-src-or-build`)  
Disallow to use `src` or `build` folders inside the import paths.  
Imports like `import module from '@package/src/moduleName';` or `import module from '@package/build/moduleName';`    
will be replaced by `import module from '@package/moduleName';` 


## License

MIT
