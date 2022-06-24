#!/usr/bin/env python
import psycopg2
from helpers.importDataForAYear import importDataForAYear
from yaspin import yaspin
# import argparse
# from psycopg2.errors import DuplicateTable, DuplicateSchema, DuplicateObject


def dataImport(cursor):

    ### spreadsheet id
    spreadsheetId = "1Vv8_6IX_y6Wg6FuHJpgUVYnhiZ4dBOq8535wMoCXYP4"
    yearFrom = 2003
    yearTo = 2003
    size = "4px"
    skips = [2004, 2018] # years to skip
    cursor.execute("SET search_path TO api")
    for year in range(yearFrom, yearTo + 1):
        if year not in skips:
            sheetName = str(year)
            url = f"https://docs.google.com/spreadsheets/d/{spreadsheetId}/gviz/tq?tqx=out:csv&sheet={sheetName}"
            with yaspin(text=f"importing data for {year}") as spinner:
                importDataForAYear(year, url, cursor, size)


def databaseCursor(onSuccess):
    conn = psycopg2.connect("postgres://postgres:mysecretpassword@localhost:5433")
    with conn:
        with conn.cursor() as curs:
            try:
                onSuccess(curs)
            except Exception as e:
                print("All imports failed, please restart")
                raise e
    conn.close()




def main():
    databaseCursor(dataImport)


if __name__ == "__main__":
    main()
