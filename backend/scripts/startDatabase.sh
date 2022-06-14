#!/bin/sh
docker run --name m23db -p 5433:5432\
    -e POSTGRES_PASSWORD=mysecretpassword \
    -d postgres \
