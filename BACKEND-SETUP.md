# Backend setup

1. Comment `backend` section in `docker-compose.yml` in root folder
2. Run `docker-compose up` in root folder
3. Change `CONFIG_MONGO.URL` to `CONFIG_MONGO.URL_LOCAL` in backend/index
4. Run backend with `yarn start-dev`.
5. Change `serverIp`in client to localhost:3000
