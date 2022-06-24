#!/usr/bin/env python
import psycopg2
from psycopg2.errors import DuplicateTable, DuplicateSchema, DuplicateObject
from yaspin import yaspin

def starsTables(sizes=('4px', )):
    allQueries = []
    totalStars = 2510
    for size in sizes:
        for star in range(1, totalStars + 1):
            allQueries.append(
                    f"CREATE TABLE star_{star}_{size}(id serial primary key, flux real DEFAULT 0, date date NOT NULL UNIQUE)"
                    )
    return allQueries


def databaseSetup(curs):
    commands = [
            "create schema api", 
            "set search_path TO api",  
            ]+ \
            starsTables() + \
            [
            "create role web_anon nologin",
            "grant usage on schema api to web_anon",
            "grant select on all tables in schema api to web_anon",
            ### grant select permission to everything present as well as future
            ###   to web_anon
            "alter default privileges in schema api grant select on tables to web_anon",
            "alter default privileges in schema api grant select on sequences to web_anon",
            "create role authenticator noinherit login password 'mysecretpassword'",
            "grant web_anon to authenticator"
        ]

    success = False
    try:
        
        for command in commands:
            curs.execute(command)

    except DuplicateTable:
        print("table creation failed")

    except DuplicateSchema:
        print("schema creation failed")

    except DuplicateObject:
        print("duplicate object")

    else:
        success = True
    
    finally:
        if not success: print("initilization failed | no actions performed")



def main():
    conn = psycopg2.connect("postgres://postgres:mysecretpassword@localhost:5433")
    with conn:
        with conn.cursor() as curs:
            with yaspin(text=f"initializing database") as spinner:
                databaseSetup(curs)
    conn.close()

if __name__ == "__main__":
    main()
