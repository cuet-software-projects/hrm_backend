## Build the app

docker compose up --build -d

## Run the app

docker compose up -d

## To stop

docker compose down

# Migration and starting the db

go to the container

### for windows

docker exec -it hrm-app /bin/bash

### for mac/linux

docker exec -it hrm-app bash

# Run all the staff or command in the container

npx prisma db push

### for migrations

npx prisma migrate dev --name <name_of_the_migration>

### for getting the database schema to the schema.prisma

npx prisma db pull
