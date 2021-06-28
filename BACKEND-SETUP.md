# Backend setup

1. Comment `backend` section in `docker-compose.yml` in root folder
1. Run `docker-compose up` in root folder
1. Change `CONFIG_MONGO.URL` to `CONFIG_MONGO.URL_LOCAL` in backend/src/index
1. Run backend with two parallel processes:
   1. `yarn build --watch` to leave TypeScript compiling the files
   1. `yarn start-dev` to leave nodemon watching the TypeScript output
1. Change `getApiCall` in client to use http://localhost:3000
