#!/usr/bin/env python
import psycopg2
from helpers.importDataForAYear import importDataForAYear
# import argparse
# from psycopg2.errors import DuplicateTable, DuplicateSchema, DuplicateObject


def dataImport(cursor):

    ### spreadsheet id
    spreadsheetId = "1Vv8_6IX_y6Wg6FuHJpgUVYnhiZ4dBOq8535wMoCXYP4"
    yearFrom = 2008
    yearTo = 2021
    size = "4px"
    cursor.execute("SET search_path TO api")
    for year in range(yearFrom, yearTo + 1):
        sheetName = str(yearTo)
        url = f"https://docs.google.com/spreadsheets/d/{spreadsheetId}/gviz/tq?tqx=out:csv&sheet={sheetName}"
        importDataForAYear(year, url, cursor, size)


def databaseCursor(onSuccess):
    conn = psycopg2.connect("postgres://postgres:mysecretpassword@localhost:5433")
    with conn:
        with conn.cursor() as curs:
            onSuccess(curs)
    conn.close()



def main():
    databaseCursor(dataImport)


if __name__ == "__main__":
    main()
