# Backend setup

1. Run `docker-compose up` in root folder
1. From [`backend/`](./backend) run in parallel this commands:
   1. `yarn build --watch` to leave TypeScript compiling the files
   1. `yarn start-dev` to leave nodemon watching the TypeScript output
