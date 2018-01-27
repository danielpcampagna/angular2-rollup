## 1.0.3

- Support for building an app for production using Angular Universal. `ngr build prod --universal`.
- Scaffold a new app with Angular Universal support by using the `--universal` flag with `ngr scaffold`. Currently also requires `--rollup` to bundle the production build.
- Added support for i18n localization
- Added `--tsConfig --rollupConfig --template` options to `ngr build`, allows you to test different config with the current build without overwriting a stable config
- Fixed issues when user changes the src directory to another folder, useful when coding Angular Universal project


```
ngr scaffold --universal
ngr build prod --universal --serve

```

The universal build overwrites the dist folder and creates the following file/folder structure for deployment to production.

```
dist/frontend
dist/backend
package.json
server.universal.js
```


## 1.0.2

- Fixed issues with build scripts when certain @angular package versions are in package.json
- Fixed an issue that prevented `lazy.config.json` from being deployed to build folder when using `ngr build dev`
- Fixed an issue that prevented library UMD and ES5 builds from working properly in the browser
- Defaulted new projects to @angular ^5.0.0
- Removed bogus script from `package.json`


## 1.0.1

- Fixed an issue that prevented library from being injected in another app because paths to typings were incorrect

To migrate an existing library, simply change the `baseUrl` property in the tsconfig files to "./src" and move all library files into `path/to/lib/src`, update paths in your `index.ts`.


## 1.0.0

- Version bump
- Update README

## 1.0.0-rc.6

- Updated protractor config to latest
- Fixed issue that caused dev build to double compile on scss changes. Use `--postcss true` if you need to compile dev to test in older browsers.
- Fixed issue in e2e test template when using `ngr generate`
- Fixed typo in README regarding e2e testing
- Fixed issue that could prevent lazy.config.json from being copied correctly in prod build
- Added yarn to install messaging because why not?
- Added Web Animations polyfill to default configuration

## 1.0.0-rc.5

- Deprecated `build.config.js` in favor of namespaced file, new scaffolded apps default to `ngr.config.js`
- Cleaned up default `ngr.config.js` to include the bare minimum
- Removed dependency on npm registry, builds can run free of internet connection
- Removed unnecessary dependencies in package.json that had accumulated over course of development
- Updated README to include correct directions for running unit tests
- Removed selenium webdriver postinstall step from package.json
- Fixed typos in logs and comments in cli build scripts
- Use `postcss-csso` instead of `css-nano` for new scaffolded apps to fix possible bugs with z-index

If you wish you migrate to `ngr.config.js` rename the `build.config.js` file (`mv build.config.js ngr.config.js`) and update references to `build.config.js` in `server.js` and `router.js`. The build scripts will continue to check for build.config.js until we choose to deprecate backwards compatibility in a later release.


## 1.0.0-rc.4

- Add `ngr.config.js` file to root of any existing project to use cli commands. This file can be empty. This feature allows library builds in an existing app.
- Removed `rollup.config.json` from default scaffold, use `ngr scaffold --rollup` flag to get it back
- Added option to scaffold without the Express server, use `ngr scaffold --server false`
- Added option to scaffold a bare bones application, use `ngr scaffold --bare`
- Deprecated `cli.config.js`, builds now reference `ngr.config.js` or `build.config.js`
- Deprecated `jsconfig.json`
- Update README with instructions for `ngr.config.js` and using buildHooks in `build.config.js`


## 1.0.0-rc.3

- Fixed an issue that caused library config to generate with incorrect path
- Updated default paths in library configuration to conform to Package Spec 5.0
- Fixed an issue that could cause modules to not be generated when using `ngr generate module`
- Fixed an issue that could prevent global stylesheet from being generated in dist folder
- Updated README


## 1.0.0-rc.2

- Added method to generate a library package
- Added cli commands to generate unit tests for components and directives
- Added unit test generation to the wizard
- Fixed an issue with `system.config.js` that prevented rxjs from being currently mapped in dev mode
- Fixed an issue that would cause warnings when trying to run `ngr update --lib`. This argument will be deprecated in a future release, Use `ngr generate lib` instead.

Generate the configuration required for library packages with `ngr generate lib` or use `ngr generate wizard`.

`ngr generate lib --name my-lib --dir src/app/shared/lib`

After you have generated some components for the library, use `ngr build lib` to build the library in the `dist` folder.

`ngr build lib -c src/app/shared/lib/lib.config.json`

Generate a unit test either use the wizard (`ngr generate wizard`) or use the following examples as a guide.

`ngr generate unit --dir src/app/shared/components/my-component --name my-component`

Optionally, generate a unit test for a directive with the --spec argument.

`ngr generate unit --dir src/app/shared/components/my-component --name my-directive --spec directive`


## 1.0.0-rc.1

- `ngr build lib` now accepts `--config` argument, can point to a JSON configuration for library packages
- Fixed an issue that caused `es2015` code to be bundled with the `umd` library
- Fixed an issue that caused sourcemaps to be emitted with css in components packaged with the library build
- Added sourcemaps for `es5` and `umd` bundles
- Deprecated `copy:package` field in package.json and automated this command
- Fixed syntax highlighting in the CHANGELOG

This release includes a huge upgrade for library builds that allows multiple packages to be deployed from the same application. This change does not effect existing configuration and should be fully backwards compatible.

A new configuration file will be autogenerated when scaffolding a library. The JSON looks like this:

```
{
    "src": "src/app/shared/lib",
    "dist": "dist",
    "filename": "default-lib",
    "es2015": {
      "tsConfig": "tsconfig.lib.json",
      "rollupConfig": "rollup.config.lib.js",
      "outFile": "dist/default-lib.js"
    },
    "es5": {
      "tsConfig": "tsconfig.lib.es5.json",
      "rollupConfig": "rollup.config.lib-es5.js",
      "outFile": "dist/default-lib.es5.js"
    },
    "umd": {
      "tsConfig": "tsconfig.lib.es5.json",
      "rollupConfig": "rollup.config.lib-umd.js",
      "outFile": "dist/bundles/default-lib.umd.js"
    }
}
```

This JSON should be a sibling to the library's `package.json`.

The following files can be migrated to the root folder of a library package.

- `tsconfig.lib.json`
- `tsconfig.lib.es5.json`
- `rollup.config.lib.js`
- `rollup.config.lib-umd.js`
- `rollup.config.lib-es5.js`

The paths in `tsconfig` files will have to be updated to be relative to the root directory. The library build still uses `tmp` and `ngfactory` folders in the root project directory during the build phase.

Here is an example:

```
  "compilerOptions": {
    "baseUrl": ".",
    "rootDir": "../../../../tmp",
    "outDir": "../../../../ngfactory",

    ...

     "files": [
         "../../../../tmp/index.ts"
      ],

```

You can now use the `--config` argument to build a library package like so:

`ngr build lib -c src/app/shared/lib/lib.config.json`

This of course brings the added benefit of developing multiple library packages in the same application. Before, developers were limited to one library package per application since the build was bound to the configuration found in `build.config.js`. The new format allows secondary entry points to be compiled, per the Package Format spec. This older config should still work, but it is recommended to update to this latest format to ensure future compatibility.


## 1.0.0-rc.0

- Version bump
- Update README

## 1.0.0-beta.13

- Use `ngr update --angularVersion 5.0.0` for help updating an existing scaffolded app to Angular 5.0.0

## 1.0.0-beta.12

- Support for Angular 5.0.0
- `ngr scaffold` now defaults to a single bundle, use `--lazy` to bootstrap with lazyloaded routes, `--dynamicRoutes` is the same
- Added EXPERIMENTAL support for Electron. Scaffold a new app with `ngr scaffold --electron` then build with `--electron` argument. electron must be installed with `npm i -g electron`.
- Added `--remote` argument to production build. Allows a client to build from a host closure manifest `main.prod.MF`
- Fixed an issue that prevented files in src/public from properly being copied to build
- Fixed an issue where .gitignore may not be copied when app is scaffolded
- Fixed an issue that prevented livereload when changing a SASS file while using AOT in --watch mode
- Added preCompile and postCompile hooks into prod build
- pre, preCompile, and postCompile functions in `build.config.js` must return a Promise i.e.

```
    buildHooks: {
        jit: {
            pre: () => {
                return new Promise((res, rej) => {
                    // do something like copy files into /src
                    res();
                })
            }
        }
    }
```

For a client to utilize the new `--remote` flag and build a lazyloaded module from a host module, the host must provide a package for the client that includes:

- ngfactory files that were bundled in the host's `bundle.js`, listed in the host's `main.prod.MF`
- `bundle.js` and `bundle.js.map` files to be used in the client's index.html for testing against the production bundle
- `main.prod.MF`

The client must then copy the host's `ngfactory` files into `/ngfactory` during the `postCompile` build step.
The client must also copy the host's `main.prod.MF` into `/closure` during the `postCompile` build step.
The client must copy `bundle.js` and `bundle.js.map` into the `/build` directory in the `post` build step.

Here is an example of doing this with the buildHooks:


```
    buildHooks: {
        prod: {
            preCompile: function (args) {

                let isRemote = false;
                args.forEach((arg) => {
                    if (arg.includes('remote')) {
                        isRemote = arg.split('=')[1].trim() === 'true' ? true : false;
                    }
                });
                return new Promise((res, rej) => {
                    if (isRemote) {
                        mkdir('remote');
                        cp(path.normalize('./path/to/host/files'), path.normalize('./remote'));
                        res();
                    } else {
                        res();
                    }

                });
            },
            postCompile: function (args) {

                let isRemote = false;
                args.forEach((arg) => {
                    if (arg.includes('remote')) {
                        isRemote = arg.split('=')[1].trim() === 'true' ? true : false;
                    }
                });
                return new Promise((res, rej) => {
                    if (isRemote) {
                        cp(path.normalize('./remote/main.prod.MF'), path.normalize('./closure/main.prod.MF'));
                        cp('-R', path.normalize('./remote/ngfactory/*'), path.normalize('./ngfactory/'));
                        res();
                    } else {
                        res();
                    }

                });
            },
            post: function(args) {
                let isRemote = false;
                args.forEach((arg) => {
                    if (arg.includes('remote')) {
                        isRemote = arg.split('=')[1].trim() === 'true' ? true : false;
                    }
                });
                if (isRemote) {
                    cp(path.normalize('./remote/bundle.js'), path.normalize('./build/bundle.remote.js'));
                    cp(path.normalize('./remote/bundle.js.map'), path.normalize('./build/bundle.remote.js.map'));
                }
            }
        }
    }
```


-------------------------------------------------------------------------------------------------------------


## 1.0.0-beta.11

- Added first argument to all buildHooks callbacks in `build.config.js` that allows user to do something based on process.argv
- Fixed issue with scaffolding an app that prevented initial build
- Fixed issue in library build that prevented files from properly being copied
- Fixed logging errors in jit build
- Fixed an issue that prevented the library build from distributing css


-------------------------------------------------------------------------------------------------------------

## 1.0.0-beta.10

This update includes the remaining major new features for 1.0.0. Leading up to 1.0.0 this project will primarily be targeting bugfixes and improvements to support @angular 5.0.0.

This update includes several improvements to scaffolding and updating apps. Both scripts now warn you that files will be overwritten. if you try to scaffold an app over an existing app or update files that already exist. The `ngr update` command includes a helper argument (`--cliVersion`) to track changes necessary in boilerplate files when updating. Also found in this version is a new `--dynamicRoutes` option for scaffolding that allows for a dynamic route configuration on bootstrap. More concise log messages and better error reporting in the terminal are packaged with this release. The largest change to the production build is that closure Compiler is now the default bundler when running `ngr build prod`.

- `--closure` is now the default production build, use `ngr build prod --rollup` to bundle with Rollup instead
- Refactored boilerplate `index.html`, `system.import.js`, and `system.config.prod.js` to support lazyloaded bundles
- New `--dynamicRoutes` option available for scaffold and update, will scaffold app with support for configurable routes prior to bootstrap
- New argument for update `--cliVersion` will attempt to update existing boilerplate, but will not overwrite existing files
- New configuration file `lazy.config.json` provides model for automating Closure Compiler and SystemJS polyfill for lazyloaded bundles
- Prevented overwriting of project files when user repeats `ngr scaffold` or `ngr update`
- Moved the SystemJS polyfill into `system.polyfill.js`. This script requests `lazy.config.json`, uses a polyfill for SystemJS to map lazyloaded bundles. This config file is only necessary for the `--lazy` build.
- Condensed log messages for build scripts. Use `--verbose` to print more verbose messages
- Fixed issue with Closure Compiler that prevented `bundle.js` from being created
- Improved error reporting across the builds by adding new warnings, specific messages to help fix issues
- Third party libraries (externs) that are specific to a lazyloaded bundle can be bundled but not mangled by ADVANCED_OPTIMIZATIONS when configured in `lazy.config.json`
- Fixed issues with `--lazy` build when two or more lazyloaded bundles shared dependencies with the main bundle
- Fixes an issue with `--lazy` build when declaring externs in `closure.externs.js`

To update:

$`npm install -g angular-rollup@latest`

In the project directory:

$`ngr update --angularVersion 4.4.4 --cliVersion 1.0.0-beta.10`
$`npm install`


### ngr update --cliVersion

```
$ ngr update --cliVersion 1.0.0-beta.10
[13:17:07] LOG Review changes to angular-rollup in the CHANGELOG (https://github.com/steveblue/angular2-rollup/blob/master/CHANGELOG.md)
[13:17:07] LOG lazy.config.json copied to /Users/steveb/www/4-test/
[13:17:07] LOG system.polyfill.js copied to /Users/steveb/www/4-test/
[13:17:07] WARN src/public/system.import.js already exists
[13:17:07] WARN src/public/system.config.prod.js already exists
[13:17:07] WARN src/public/index.html already exists
[13:17:07] WARN Please move or delete existing files to prevent overwiting. Use a diff tool to track project specific changes.
```

The update task copies new files, warns about overwriting existing files.

If you have changed boilerplate files, you will need to diff them against the new files.
Copy the files into a temporary directory and run the command again, then diff the existing files to check for project specific changes.

If you do not have changes to the boilerplate files, just remove the files and run the command again.


### lazy.config.json

A new file is required to configure both the production build script and the SystemJS polyfill at runtime.

```
{
    "bundles": {
        "shared/components/lazy/lazy.module.ngfactory.js": {
            "src": "./ngfactory/src/app/shared/components/lazy/lazy.module.ngfactory.js",
            "filename": "lazy.module.bundle.js",
            "className": "LazyModuleNgFactory",
            "path": "http://localhost:4200",
            "externs": []
        }
    }
}
```

^ All properties are required except `externs`

To bundle third party scripts, point to the minified version of the script in the externs Array.

```
"externs": [
                "node_modules/marked/marked.min.js"
           ]
```

If you use `--dynamicRoutes` during update you will be prompted to overwrite existing project. An additional `routes` property is now available in `lazy.config.json`. This flat Array will configure routes for any lazyloaded children of the root Component.


-------------------------------------------------------------------------------------------------------------

## 1.0.0-beta.9

- Fixed issue with update warning

-------------------------------------------------------------------------------------------------------------


## 1.0.0-beta.8

- Cleaned up terminal logs
- Added warning message for when locally installed cli is out of date
- Fixed missing .map file for Reflect.js in --jit mode

-------------------------------------------------------------------------------------------------------------

## 1.0.0-beta.7

- New wizard makes codegen simpler, trigger with `ngr generate wizard`
- Fixed usage of `g` as shorthand for `generate`

Example of output from the wizard:

```
$ ngr generate wizard
$ ngr codegen wizard
$ filename: kabab-case filename i.e. global-header
$ directory: path/to/folder i.e. src/app/shared/components/global-header
$ type: module, component, directive, enum, e2e, guard, interface, pipe, service
$ Follow the prompts after selecting a type
filename:  global-header
directory:  src/app/shared/components/global-header
type:  module
component:  y
directive:  n
routes:  n
unit:  y
e2e:  n
[15:38:18] LOG global-header.component.html copied to global-header
[15:38:18] LOG global-header.component.scss copied to global-header
[15:38:18] LOG global-header.component.ts copied to global-header
[15:38:18] LOG global-header.module.spec.ts copied to global-header
[15:38:18] LOG global-header.module.ts copied to global-header
```

-------------------------------------------------------------------------------------------------------------

## 1.0.0-beta.6

- Use `ngr update --angularVersion` to update your package.json to a specific version of @angular
- New and improved Module generation. `--include` flag can be configured to auto import Component, Directive, Routes into the Module.

EXAMPLE:

```

ngr generate module --include component,route,spec,e2e --dir src/app/shared/components/my-module --name my-module

```

- Fixed issues at startup by pushing serve command to end of script during build
- Optimized default library files copied at start of build scripts
- Deprecated dependency on angular-srcs
- Bumped default version of scaffolded app to @angular 4.4.2
- Fixed issue with --serve flag when building for dev in --jit mode
- Updated README to latest

COMING SOON FOR 1.0.0-beta

- Reduced configuration of lazyload build
- Wizard for generating modules
- Better user feedback during Closure Compiler bundling


-------------------------------------------------------------------------------------------------------------

## 1.0.0-beta.4

- Hotfix TypeScript compilation onchange when using `ngr build dev --jit`

-------------------------------------------------------------------------------------------------------------

## 1.0.0-beta.3

- Hotfix for global css that would not compile correctly

-------------------------------------------------------------------------------------------------------------

## 1.0.0-beta.2

- Refactored SASS / PostCSS build steps, removed duplicate code
- Added config for the `libsass` compiler
- Added support for multiple global CSS files in the `src/style` directory to be deployed to `/build` or `/dist`
- Deprecated `config.globalCSSFilename` property


The build will default to the following configuration for SASS if you do not provide one:

```
{
    includePaths: ['src/style/'],
    outputStyle: 'expanded',
    sourceComments: false
}
```

Configure SASS in `build.config.js` for each build like in the following example. The configuration takes any options [node-sass](https://github.com/sass/node-sass) can be configured with, except `file` and `outFile` which is handled by the build scripts.

```
style: {
        sass: {
            dev: {
                includePaths: ['src/style/'],
                outputStyle: 'expanded',
                sourceComments: true
            },
            lib: {
                includePaths: ['src/style/'],
                outputStyle: 'expanded',
                sourceComments: false
            },
            prod: {
                includePaths: ['src/style/'],
                outputStyle: 'expanded',
                sourceComments: false
            }
        }
    }

```

-------------------------------------------------------------------------------------------------------------


## 1.0.0-beta.1

- Bypass Rollup and build for production with ClosureCompiler in ADVANCED_OPTIMIZATIONS mode
- EXPERIMENTAL Support for lazyloading routes with ClosureCompiler, requires additional high level API coming soon
- Bugfixes and improvements for existing builds

NOTE: While in BETA this package is EXPERIMENTAL

Closure builds are only available for < 5.0.0 at the moment.

To build for production with ClosureCompiler use the following flags:

`ngr build prod --closure`

To build for production with support for lazyloaded routes:

`ngr build prod --closure --lazy`



-------------------------------------------------------------------------------------------------------------
## 1.0.0-beta.0

- Updated npm package name to `angular-rollup`, `angular2-rollup` is deprecated
- Cross platform support including MacOS, Windows and Linux for the CLI
- Updated CLI to support `@angular` 5.0.0+
- `ngr build dev --watch` will trigger `ngc` in `--watch` mode
- `ngr build jit` triggers JIT build, use for `@angular` 4.0.0 development
- Backwards compatible to 4.0.0 with minor adjustments to config, 2.0.0 by downgrading `@angular` boilerplate

NOTE: While in BETA this package is EXPERIMENTAL

If you want to build an app with this project now it is recommended you use the `angular2-rollup` npm package instead.
Minimal changes will be required to upgrade to `angular-rollup`.

`npm install angular2-rollup@4.4.0-RC.0`

-------------------------------------------------------------------------------------------------------------

## 5.0.0-beta.6

BREAKING CHANGES

- New dev build uses AOT in `--watch` mode, JIT has been deprecated for development environment but is still available with `ngr build jit`
- Migrated `tsconfig.prod.json` to 5.0.0-beta.6.
- Scaffold new projects with a specific `@angular` version using `--angularVersion`

If your project is < 5.0.0 use `ngr build jit` instead of `ngr build dev`.

To update existing projects, migrate `main.prod.ts`, `tsconfig.dev.json` and `tsconfig.prod.json`. The `ngr` CLI by default will now include the configurations for `>5.0.0`. Use the examples below to downgrade to `4.0.0-4.4.0`. Further changes are required to downgrade to `2.0.0` but it is possible.

NOTE: `ngr build lib` is broken in `5.0.0-beta.4-5.0.0-beta.6`. If you want to test this build use `ngr scaffold --angularVersion 5.0.0-beta.3` to scaffold your app.

### Prior to 5.0.0

`main.prod.ts`

```
import { platformBrowser } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';
import { AppModuleNgFactory } from './ngfactory/tmp/app/app.module.ngfactory';
enableProdMode();
platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
```

`tsconfig.prod.json`

```
{
  "compilerOptions": {
    "target": "es2015",
    "module": "es2015",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "noImplicitAny": false,
    "removeComments": true,
    "allowUnreachableCode": false,
    "moduleResolution": "node",
    "typeRoots": [
      "node_modules/@types"
    ],
    "types": [
       "node"
    ]
  },
  "angularCompilerOptions": {
    "genDir": "./ngfactory",
    "annotateForClosureCompiler": true,
    "skipMetadataEmit": false
  },
  "files": [
    "./tmp/app/app.module.ts",
    "main.prod.ts"
  ]
}

```


`tsconfig.dev.json`  / `tsconfig.jit.json`. < 5.0.0 dev and jit builds are the same

```
{
    "compilerOptions": {
        "target": "es5",
        "module": "commonjs",
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        "noImplicitAny": false,
        "removeComments": false,
        "allowUnreachableCode": false,
        "moduleResolution": "node",
        "outDir": "./build",
        "typeRoots": [
            "node_modules/@types"
        ],
        "types": [
            "node",
            "jasmine",
            "karma"
        ],
        "lib": [
            "es2017",
            "dom"
        ]
    },
    "exclude": [
        "build",
        "dist",
        "tmp",
        "node_modules",
        "main.prod.ts"
    ],
    "compileOnSave": false,
    "buildOnSave": false
}
```


### After 5.0.0

`main.prod.ts`

This file is unnecessary.

Prior to 5.0.0 `main.prod.ts` needed to be included for `ngc`. After 5.0.0 `ngc` can use just `app.module.ts` as an entry point. Rollup still uses `main.prod.js` as an entry point.

`tsconfig.dev.json`

```
{
  "compilerOptions": {
    "outDir": "./build",
    "target": "es5",
    "module": "commonjs",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "noImplicitAny": false,
    "removeComments": true,
    "allowUnreachableCode": false,
    "moduleResolution": "node",
    "typeRoots": [
      "node_modules/@types"
    ],
    "types": [
      "node",
      "jasmine",
      "karma"
    ],
    "lib": [
      "es2017",
      "dom"
    ]
  },
  "angularCompilerOptions": {
    "skipMetadataEmit": true
  },
  "files": [
    "./src/app/app.module.ts"
  ]
}

```

`tsconfig.jit.json`

```
{
    "compilerOptions": {
        "target": "es5",
        "module": "commonjs",
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        "noImplicitAny": false,
        "removeComments": false,
        "allowUnreachableCode": false,
        "moduleResolution": "node",
        "outDir": "./build",
        "typeRoots": [
            "node_modules/@types"
        ],
        "types": [
            "node",
            "jasmine",
            "karma"
        ],
        "lib": [
            "es2017",
            "dom"
        ]
    },
    "exclude": [
        "build",
        "dist",
        "tmp",
        "node_modules",
        "main.prod.ts"
    ],
    "compileOnSave": false,
    "buildOnSave": false
}
```


`tsconfig.prod.json`

```
{
  "compilerOptions": {
    "outDir": "./build",
    "target": "es2015",
    "module": "es2015",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "noImplicitAny": false,
    "removeComments": true,
    "allowUnreachableCode": false,
    "moduleResolution": "node",
    "typeRoots": [
      "node_modules/@types"
    ],
    "types": [
       "node"
    ]
  },
  "angularCompilerOptions": {
   "annotateForClosureCompiler": true,
   "skipMetadataEmit": false
  },
  "files": [
    "./src/app/app.module.ts"
  ]
}

```


## 4.4.0-RC.0

MAJOR BREAKING CHANGES in this release. This release is primarily to improve the CLI, make writing custom builds easier. This release decouples the CLI from project code.

- CLI must now be installed globally `npm i -g angular2-rollup`
- Project dependencies are now decoupled from CLI dependencies
- Scaffold a new app with `ngr scaffold`, with `--lib` for library builds
- CLI output has new look and feel in terminal
- Added build hooks so users can insert custom logic into parts of each build
- e2e spec files can now be generated with `ngr --generate e2e`
- Project dependencies are now decoupled from CLI dependencies
- Normalized CLI commands, use build instead of --build or generate instead of --generate


### MIGRATING from 4.3.6 to 4.4.0-RC.0

Install the CLI globally. `npm install -g angular2-rollup`

Remove all build files except `build.config.js` unless you have made changes to the build.

-  build.dev.js
-  build.lib.js
-  build.prod.js
-  build.scaffold.js
-  build.utils.js

If you have changed the builds, it is recommended that you migrate any tasks to the new build hooks included with this update.

If a build has diverged significantly, you can include the build file in your local project and it will override the original. This is not recommended and results may vary.

Remove `cli.js`

Rename `./conf/config.local.js` to `./server.config.dev.js`
Rename `./conf/config.prod.js` to `./server.config.prod.js`

The only file referencing these files is `server.js`. Change the paths in the `require()` lines at the top of the file.

Update `package.json`

The necessary scripts in the `package.json` have been greatly reduced. Below is an example of the package.json shipped with 5.0.0. Remove any deprecated scripts.

```
"scripts": {
      "clean": "rimraf node_modules ngfactory doc build && npm cache clean",
      "clean:install": "npm run clean && npm install",
      "clean:build": "rimraf build",
      "clean:tmp": "rimraf tmp",
      "clean:ngfactory": "rimraf ngfactory && mkdir ngfactory",
      "copy:lib": "rsync -a --exclude=*.js ngfactory/ dist",
      "copy:package": "cp ./src/lib/package.json ./dist/package.json",
      "transpile:prod": "java -jar node_modules/google-closure-compiler/compiler.jar --warning_level=QUIET --language_in=ES6 --language_out=ES5 --js ./build/bundle.es2015.js --js_output_file ./build/bundle.js",
      "webdriver:update": "webdriver-manager update",
      "webdriver:start": "webdriver-manager start",
      "lint": "tslint --force \"src/app/**/*.ts\"",
      "e2e": "protractor protractor.config.js",
      "e2e:live": "protractor protractor.config.js --elementExplorer",
      "pretest": "",
      "test": "karma start karma.conf.js",
      "test:watch": "karma start karma.conf.js --no-single-run --auto-watch",
      "ci": "npm run e2e && npm run test",
      "ci:watch": "npm run e2e && npm run test:watch",
      "start": "ngr --build dev --watch --serve",
      "serve": "node server.js",
      "postinstall": "npm run webdriver:update"
    }
```

Update `@angular` dependencies in `package.json`

```
    "dependencies": {
      "@angular/animations": "4.4.0-RC.0",
      "@angular/common": "4.4.0-RC.0",
      "@angular/core": "4.4.0-RC.0",
      "@angular/forms": "4.4.0-RC.0",
      "@angular/http": "4.4.0-RC.0",
      "@angular/platform-browser": "4.4.0-RC.0",
      "@angular/platform-browser-dynamic": "4.4.0-RC.0",
      "@angular/platform-server": "4.4.0-RC.0",
      "@angular/router": "4.4.0-RC.0",

    "devDependencies": {
      "@angular/compiler": "4.4.0-RC.0",
      "@angular/compiler-cli": "4.4.0-RC.0",
      "@angular/language-service": "4.4.0-RC.0",
```




## 4.3.6

- Updated to Angular 4.3.6
- Fixed issue in library build that prevented global CSS form compiling minified


## 4.3.5

- Updated to Angular 4.3.5
- Deprecated `@types/core-js` and instead configured `compilerOptions.lib` for the dev build


## 4.3.0

- Updated to Angular 4.3.0
- Updated RxJs to ~5.4.2 and TypeScript to ^4.2.0, included TypeScript fix in RxJs
- Fixed an issue that prevented the Express Server from running without LiveReload
- Production builds now include only the specific library files production requires instead of entire library packages
- Fixed an issue copying library files with deep directory structures
- Removed system.js polyfills from index.html because they were deprecated in the package

BREAKING CHANGES


The production build now requires a new Object in build.config.js with the property name `prodLib`.

```
    dep: {
        lib: [
            'angular-srcs/shims_for_IE.js',
            'core-js',
            'reflect-metadata',
            'zone.js',
            'systemjs',
            '@angular',
            'rxjs'
        ],
        prodLib: [
            'angular-srcs/shims_for_IE.js',
            'core-js/client/shim.min.js',
            'core-js/client/shim.min.js.map',
            'systemjs/dist/system.js',
            'zone.js/dist/zone.js'
        ]
```


## 4.3.0-beta.0

- Updated to Angular 4.3.0-beta.0
- Updated packages to latest compatible versions
- Commented and cleaned up build scripts
- PostCSS now defaults `autoprefixer` to `last 20 versions` for better IE support

BREAKING CHANGES

- postcss-cli config files must be migrated from pre 2.6.0 format to post 2.6.0 format

EXAMPLE:

BEFORE:

```
{
    "use": ["autoprefixer"],
    "local-plugins": true,
    "autoprefixer": {
        "browsers": "> 5%"
    }
}

```

AFTER:

```
module.exports = {
  plugins: {
    'autoprefixer': {
        browsers: '> 5%'
    }
  }
}

```

NOTE: Only the Object format is supported currently NOT the Array format. The build tools will parse the Object properties for the `--use` option.

For more information: https://github.com/postcss/postcss-cli/wiki/Migrating-from-v2-to-v3




----------------------------------------------------------------------------------------------------


## 4.2.0

- Updated to Angular 4.2.0
- Fixed issue when updating global SASS, livereload and CSS would not update when editing certain files
- Fixed an issue when users move library build to another location
- Updated library build, ES5 and UMD builds are now correctly transpiled
- Updated support for external libraries, now you can specify single file instead of just folders
- Updated boilerplate to support IE9

----------------------------------------------------------------------------------------------------

## 4.0.3

- Updated to Angular 4.0.3
- New CLI commands, run `npm i -g` to use in your project
- Revised README

```
  $ ngr --help

  Usage: ngr <keywords>

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -b, --build [env]      Build the application by environment
    -w, --watch [bool]     Enable file watchers to detect changes and build
    -g, --generate [type]  Generates new code from templates
    -n, --name [string]    The name of the new code to be generated (kebab-case)
    -f, --force [bool]     Force overwrite during code generate
    -d, --dir [path]       Path the code should be generated in (relative)
    -s, --spec [bool]      Include spec files in code generation
    -r, --route [bool]     Include route files in code generation
    -t, --test [bool]      Run unit tests
    --serve [bool]         Run Express Server

```

----------------------------------------------------------------------------------------------------

## 4.0.2

- Updated to Angular 4.0.2

----------------------------------------------------------------------------------------------------

## 4.0.1


- Updated to Angular 4.0.1
- Added more configuration to `build.config.js`, renamed from `paths.config.js`
- Added new `lib` build for distributing libraries in ES6 and ES5
- Refactored build process to default to `build` folder, `dist` is now the default for library files
- Use `npm run build:dev` instead of `npm start` for development server
- Added `npm run build:prod` for AOT production builds
- Added `npm run build:lib` for building library files
- Use `watch=true` to watch prod and lib builds, disabled by default
- Fixed watcher in dev and prod modes, will now detect css changes properly
- Fixed an issue in prod build that could cause it to fail after libsass and PostCSS
- Added documnetation for running livereload and watcher with `npm run build:prod`
- Updated README
- Created CHANGELOG


To Upgrade `build.config.js`:

1. Move the `dep` Array to `dep.lib` and `src` to `dep.src`, `dist` to `dep.dist`.

BEFORE:

```
module.exports = {
    dep: [
            'core-js',
            'reflect-metadata',
            'zone.js',
            'systemjs',
            '@angular',
            'rxjs'
        ]
    },
    src: './node_modules',
    dist: './dist/lib'
}
```

AFTER:

```
module.exports = {
    dep: {
        lib: [
            'core-js',
            'reflect-metadata',
            'zone.js',
            'systemjs',
            '@angular',
            'rxjs'
        ],
        src: './node_modules',
        dist:  './build/lib'
    }
}
```

2. Add the project `src`, `build`, and `dist` (optional) directories. These properties point to the source directory, the folder the project should be built in, and in the case of a distributing a library, the `dist` that will be used by other projects.

```
module.exports = {
    dep: {
        lib: [
            'core-js',
            'reflect-metadata',
            'zone.js',
            'systemjs',
            '@angular',
            'rxjs'
        ],
        src: './node_modules',
        dist: './build/lib'
    },
    clean:{
      files:[],
      folders:[]
    },
    src: 'src',
    build: 'build',
    dist: 'dist',
    lib: 'src/lib',
    libFilename: 'default-lib'
}

