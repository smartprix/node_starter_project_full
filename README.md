# NodeJS Starter Project
This is an empty project for quickly starting up with nodejs.
This is meant for projects which will have both a backend and a frontend.
If you are writing only backend, use http://github.com/smartprix/nodejs_starter_project

#### Features:
* git & git-hooks
* eslint & default conventions (https://github.com/smartprix/js_conventions)
* babel
* testing with mocha and chai
* production running with pm2
* lodash and sm-utils already installed
* Backend server with Koa
* Frontend using webpack & vuejs
* Auto reload backend using nodemon, and frontend using hot reloading

#### Conventions:
* Keep all your backend source code in src directory
* Keep all your frontend source code in res directory
  * js in `res/js`
  * css in `res/css`
  * vue components in `res/js/components`
  * images in `res/img`
  * other assets (eg. fonts, etc.) in `res/assets`
  * For more info see: https://github.com/smartprix/sm-webpack-config
* Keep all your test cases (with mocha) in test directory
* Compiled code (from babel) will be stored in dist directory
* Keep all your garbage files (temporary testing and all) in garbage directory

#### Setting Up For The First Time
If you've just installed ubuntu, you can run these commands to install
various softwares and packages that will help you run and develop this project.

```sh
sudo apt update -y
sudo apt install unzip -y
cd ~ && mkdir -p setup && cd setup
wget https://github.com/smartprix/node_starter_project_full/archive/master.zip
unzip -o master.zip
cd node_starter_project_full-master/setup
unzip -o ansible.zip -d ansible/
bash setup.sh
sudo bash ansible/dev_machine_setup
```

#### How To Start:
* Clone this repository
* Run `yarn` to install dependencies.
* Create a database named test in your mysql server
* Run `npm run migrate`
* You are ready. Start writing your code in `src/index.js`

#### Commands:
```bash
# Run eslint to check coding conventions
npm run lint

# Run eslint and try to fix linting errors
npm run lint:fix

# Run migration
npm run migrate

# Create a new migration
npm run migrate:create

# Run tests
npm test

# Compile Files
npm run build

# Start dev server (backend)
npm start

# Start dev server (basic frontend)
npm run basic

# Start dev server (admin frontend)
npm run admin
```

#### Managing Config:
We use `sm-utils` `cfg` to manage config.

The configuration options can be written in `config.js` and `private/config.js`. Config options in both these files are merged, and the options present in `private/config.js` are given higher priority over those present in `config.js` (i.e. private config options overwrite the options in general config when merged).

Values from the config can be accessed via `cfg(optionToBeRead)`. You can also provide a default value (such as `cfg(foo, 'bar')`) while accessing any of the options. If the key/option is not found in the config, then the default value will be returned (thus, in case `foo` is not present in the merged config the `'bar'` will be returned).

`cfg` also has functions such as `isDev`, `isProd`, `isTest`, etc. which returns `true/false` on the basis of the current process' (node) environment.

#### Adding a new Model:
We use the [`xorm`](https://github.com/smartprix/xorm) ORM, which is based on [`ObjectionJS`](https://github.com/Vincit/objection.js/ "ObjectionJS GitHub Repo").

`xorm` provides with a `Model` class which is basically a wrapper for the `Model` class from `ObjectionJS` with some added utilities (like *soft delete*, etc). Models can optionally define a `jsonSchema` object that is used for input validation. All your relationships can be defined using the static `relationMappings` property (as done for ObjectionJS models) or in the `$relations` method (provided by `xorm`).

The `src/lib` folder has a `models.js` file which is used to export the models to other places in the project. You can list your model in that file so that you can import models from `src/lib/models`.

You can define `GraphQL` *schemas* and *resolvers* for queries and mutations related to your model in the same module as your model and export them as `schema` and `resolvers` respectively.

The `makeSchemaFromModules` function from [`gqutils`](https://github.com/smartprix/gqutils) creates the schemas on the basis of your schema definitions and associates the resolvers wherever required. This process of creation of schemas is performed in `src/graphql.js` file. So you would want to list your module in that file.

For more information/examples on how you should define the *schemas*, you can go to https://github.com/smartprix/gqutils.
