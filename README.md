[![Blitz.js](https://raw.githubusercontent.com/blitz-js/art/master/github-cover-photo.png)](https://blitzjs.com)

This is a [Blitz.js](https://github.com/blitz-js/blitz) app.

# ****STAPLE****

## Installation 

1) Install `node.js` and `npm`: https://nodejs.org/en/download 

2) Install `blitzjs`: `npm install -g blitz` in a terminal/command window.

3) Ensure that you have a local postgres service running on your computer. To install see: [https://www.prisma.io/dataguide/postgresql/setting-up-a-local-postgresql-database](https://www.prisma.io/dataguide/postgresql/setting-up-a-local-postgresql-database). Be sure to write down the superuser information as you are installing the setup. 

4) Create the databases for STAPLE. Go to terminal and use: https://www.tutorialspoint.com/postgresql/postgresql_environment.htm

```
psql -U postgres #get into postgres
# enter your password for superuser
CREATE DATABASE staple;
CREATE DATABASE staple_test;
```

4) Create a user with appropriate privileges after postgres installation. While in the terminal and postgres, create a new user: https://www.tutorialspoint.com/postgresql/postgresql_privileges.htm. Change out `username` and `password` (be sure to leave the quotes!) for your desired user. 

```
CREATE USER username WITH PASSWORD 'password';

GRANT ALL ON SCHEMA public TO username;
```

5) Copy the `.env` file and rename it `.env.local`. You may need to turn on settings to see these hidden files on your machine. 

6) Ensure the `.env.local` file has required environment variables by adding the following line and changing the <YOUR_DB_USERNAME> to `username:password`. 

```
DATABASE_URL=postgresql://<YOUR_DB_USERNAME>@localhost:5432/staple
```

7) Copy the `.env.test` file and rename `.env.test.local`. 

8) Ensure the `.env.test.local` file has required environment variables in the same way you did above. 

```
DATABASE_URL=postgresql://<YOUR_DB_USERNAME>@localhost:5432/staple_test
```

9) In a terminal window, go to the folder you cloned this repository and type the following to create the databases needed for the application.

```
npm install # to install all packages for staple
blitz prisma migrate dev # to create database 
```

## Starting the App
 
1) Clone or copy this github repository. 

2) In a terminal window, go to the folder you cloned this repository and type:

```
blitz dev
```

3) Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Tests

Runs your tests using Jest.

```
yarn test
```

Blitz comes with a test setup using [Vitest](https://vitest.dev/) and [react-testing-library](https://testing-library.com/).

## Commands

Blitz comes with a powerful CLI that is designed to make development easy and fast. You can install it with `npm i -g blitz`

```
  blitz [COMMAND]

  dev       Start a development server
  build     Create a production build
  start     Start a production server
  export    Export your Blitz app as a static application
  prisma    Run prisma commands
  generate  Generate new files for your Blitz project
  console   Run the Blitz console REPL
  install   Install a recipe
  help      Display help for blitz
  test      Run project tests
```

You can read more about it on the [CLI Overview](https://blitzjs.com/docs/cli-overview) documentation.

## What's included?

Here is the starting structure of your app.

```
STAPLE
├── src/
│   ├── api/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── mutations/
│   │   │   ├── changePassword.ts
│   │   │   ├── forgotPassword.test.ts
│   │   │   ├── forgotPassword.ts
│   │   │   ├── login.ts
│   │   │   ├── logout.ts
│   │   │   ├── resetPassword.test.ts
│   │   │   ├── resetPassword.ts
│   │   │   └── signup.ts
│   │   ├── pages/
│   │   │   ├── forgot-password.tsx
│   │   │   ├── login.tsx
│   │   │   ├── reset-password.tsx
│   │   │   └── signup.tsx
│   │   └── validations.ts
│   ├── core/
│   │   ├── components/
│   │   │   ├── Form.tsx
│   │   │   └── LabeledTextField.tsx
│   │   └── layouts/
│   │       └── Layout.tsx
│   ├── pages/
│   │   ├── _app.tsx
│   │   ├── _document.tsx
│   │   ├── 404.tsx
│   │   ├── index.test.tsx
│   │   └── index.tsx
│   └── users/
│       ├── hooks/
│       │   └── useCurrentUser.ts
│       └── queries/
│           └── getCurrentUser.ts
├── db/
│   ├── migrations/
│   ├── index.ts
│   ├── schema.prisma
│   └── seeds.ts
├── integrations/
├── mailers/
│   └── forgotPasswordMailer.ts
├── public/
│   ├── favicon.ico
│   └── logo.png
├── test/
│   ├── setup.ts
│   └── utils.tsx
├── .eslintrc.js
├── babel.config.js
├── blitz.config.ts
├── vitest.config.ts
├── package.json
├── README.md
├── tsconfig.json
└── types.ts
```

These files are:

- The `src/` folder is a container for most of your project. This is where you’ll put any pages or API routes.

- `db/` is where your database configuration goes. If you’re writing models or checking migrations, this is where to go.

- `public/` is a folder where you will put any static assets. If you have images, files, or videos which you want to use in your app, this is where to put them.

- `integrations/` is a folder to put all third-party integrations like with Stripe, Sentry, etc.

- `test/` is a folder where you can put test utilities and integration tests.

- `package.json` contains information about your dependencies and devDependencies. If you’re using a tool like `npm` or `yarn`, you won’t have to worry about this much.

- `tsconfig.json` is our recommended setup for TypeScript.

- `.babel.config.js`, `.eslintrc.js`, `.env`, etc. ("dotfiles") are configuration files for various bits of JavaScript tooling.

- `blitz.config.ts` is for advanced custom configuration of Blitz. [Here you can learn how to use it](https://blitzjs.com/docs/blitz-config).

- `vitest.config.ts` contains config for Vitest tests. You can [customize it if needed](https://vitejs.dev/config/).

You can read more about it in the [File Structure](https://blitzjs.com/docs/file-structure) section of the documentation.

### Tools included

Blitz comes with a set of tools that corrects and formats your code, facilitating its future maintenance. You can modify their options and even uninstall them.

- **ESLint**: It lints your code: searches for bad practices and tell you about it. You can customize it via the `.eslintrc.js`, and you can install (or even write) plugins to have it the way you like it. It already comes with the [`blitz`](https://github.com/blitz-js/blitz/tree/canary/packages/eslint-config) config, but you can remove it safely. [Learn More](https://blitzjs.com/docs/eslint-config).
- **Husky**: It adds [githooks](https://git-scm.com/docs/githooks), little pieces of code that get executed when certain Git events are triggerd. For example, `pre-commit` is triggered just before a commit is created. You can see the current hooks inside `.husky/`. If are having problems commiting and pushing, check out ther [troubleshooting](https://typicode.github.io/husky/#/?id=troubleshoot) guide. [Learn More](https://blitzjs.com/docs/husky-config).
- **Prettier**: It formats your code to look the same everywhere. You can configure it via the `.prettierrc` file. The `.prettierignore` contains the files that should be ignored by Prettier; useful when you have large files or when you want to keep a custom formatting. [Learn More](https://blitzjs.com/docs/prettier-config).

## Learn more

Read the [Blitz.js Documentation](https://blitzjs.com/docs/getting-started) to learn more.

The Blitz community is warm, safe, diverse, inclusive, and fun! Feel free to reach out to us in any of our communication channels.

- [Website](https://blitzjs.com)
- [Discord](https://blitzjs.com/discord)
- [Report an issue](https://github.com/blitz-js/blitz/issues/new/choose)
- [Forum discussions](https://github.com/blitz-js/blitz/discussions)
- [How to Contribute](https://blitzjs.com/docs/contributing)
- [Sponsor or donate](https://github.com/blitz-js/blitz#sponsors-and-donations)
