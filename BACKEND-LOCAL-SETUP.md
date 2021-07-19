# Backend setup

1. Run `docker-compose up` in root folder
1. From [`backend/`](./backend) run in parallel this commands:
   1. `yarn build --watch` to leave TypeScript compiling the files
   1. `yarn start-dev` to leave nodemon watching the TypeScript output.

## Debugging

1. In Visual Studio Code, open the "Run and debug" section and start the
   [Node: Nodemon](./.vscode/launch.json) one. There you'll be prompted to choose the proper process to attach
   to. Filter them by by searching for "`node inspect`", and select it.
1. Now you can use breakpoints right in the sourcecode.
