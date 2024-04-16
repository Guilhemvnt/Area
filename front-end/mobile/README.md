# Guide on macOS

## Docker

Just get at the root of the project and run the following command:

```bash
docker-compose up --build
```

From there, you can let the magic do the rest.

## Manual

Some things might be incompatible with your system, so here are the steps to get the project running:

### Node

```bash
brew install nvm

nvm ls-remote

nvm install 18

nvm use 18
```

This will install node18 so it can run azure without conflicts.

### Postgres

```bash
brew install postgresql

brew services start postgresql

pg_isready

createuser -s postgres # from there, the user will be postgres

createdb -U postgres area # create an empty database field called area

cd back-end && psql -U root -d area -f database.sql
```

## Run

### Back-end

```bash
cd back-end && npm install

node app.js
```

### Front-end

```bash
cd front-end/mobile

open -a Simulator

flutter run
```

===

That's it, you're good to go!
