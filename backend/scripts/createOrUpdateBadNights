#!/usr/bin/env python
import psycopg2
from helpers.importDataForAYear import importDataForAYear
from yaspin import yaspin
import pandas as pd
from urllib.error import URLError
from pandas.errors import ParserError

### constants
tableOfBadNights = "bad_nights"

def handleImport(dbCursor):

    ### spreadsheet id
    spreadsheetId = "105MONNkKpdG18wPZL3lIoWaJ1gR3wJYgDS8HAmr1w8A"
    sheetName = "Data"
    csvLink = f"https://docs.google.com/spreadsheets/d/{spreadsheetId}/gviz/tq?tqx=out:csv&sheet={sheetName}"

    try:
        csv_file = pd.read_csv(csvLink, header=None)
        for index, row in csv_file.iterrows():
            handleNight(dbCursor, row.values[0])
    except URLError:
        print(f"URL NOT FOUND {csvLink}")
    except ParserError:
        print(f"ParserError, probably the sheet isn't shared with anyone with the link")

def handleNight(dbCursor, date):
        dbCursor.execute(f"INSERT INTO {tableOfBadNights} (date) VALUES(%s)", (date, ))


def handleDatabase(cursor):

    businessLogicCommands = [
            "SET search_path TO api",
            f"DROP TABLE IF EXISTS {tableOfBadNights}",
            f"CREATE TABLE {tableOfBadNights}(id serial primary key, date date NOT NULL)",
            ]

    [cursor.execute(command) for command in businessLogicCommands]

    handleImport(cursor)


def databaseCursor(onSuccess):
    conn = psycopg2.connect("postgres://postgres:mysecretpassword@localhost:5433")
    with conn:
        with conn.cursor() as curs:
            try:
                with yaspin(text=f"creating/updating bad nights") as spinner:
                    onSuccess(curs)
            except Exception as e:
                print("All imports failed, please restart")
                raise e
    conn.close()


def main():
    databaseCursor(handleDatabase)


if __name__ == "__main__":
    main()
