## Project configuration

1. Copy the `.env.example` file to `.env` in the same root folder:

   `cp .env.example .env`

2. As it is, it should work, but you can change these parameters:

   - `ACCESS_TOKEN_EXPIRATION`: expiration time of the JWT access token
   - `REFRESH_TOKEN_EXPIRATION`: expiration time of the JWT refresh token
   - `JWT_SECRET`: secret key used by JWT to encode access token
   - `JWT_REFRESH_SECRET`: secret key used by JWT to encode refresh token
   - `DATABASE_PORT`: port used by the API

## Database configuration

1. Start the database with docker

```
$ npm run infra:up
```

### Migrations.

To create a migration and implement changes in the db.

//**run migrations**

```
$ npm run migration:run
```

## Running the app

```bash
# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# e2e tests
$ npm run test:e2e

```

## Documentation

localhost:8080/docs
