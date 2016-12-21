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
* Kepp all your frontend source code in res directory
  * js in `res/js`
  * css in `res/css`
  * vue components in `res/js/components`
  * images in `res/img`
  * other assests (eg. fonts etc) in `res/assests`
  * For more info see: https://github.com/smartprix/sm-webpack-config
* Keep all your test cases (with mocha) in test directory
* Compiled code (from babel) will be stored in dist directory
* Keep all your garbage files (temporary testing and all) in garbage directory

#### How To Start:
* Clone this directory
* Update dependencies `ncu -u` and then run `yarn`
* You are ready. Start writing your code in `src/index.js`

#### Commands:
```bash
# Run eslint to check coding conventions
npm run lint

# Run eslint and try to fix linting errors
npm run lint:fix

# Run tests
npm test

# Compile Files
npm run build

# Start dev server (backend)
npm start

# Start dev server (frontend) which supports hot reloading
npm run dev
```
