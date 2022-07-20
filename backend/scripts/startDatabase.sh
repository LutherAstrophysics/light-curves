#!/bin/sh
docker restart m23db ||
docker run --name m23db -p 5433:5432\
    -e POSTGRES_PASSWORD=mysecretpassword \
    -d postgres 
postgrest ~/Desktop/light-curves/backend/m23db.conf
