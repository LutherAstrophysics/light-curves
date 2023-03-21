import pandas as pd
from pandas.errors import ParserError
import psycopg
from urllib.error import URLError

from typing import Dict

def get_info(is_primary : bool):
    SHEET_NAME = "Data"
    if is_primary:
        TABLE_NAME = "bad_nights"
        SPREADSHEET_ID = "12JxtFGkQ5VKZORdVcNtsWhbvh2jhjG5fNGQHv8DUr1g"
    else:
        TABLE_NAME = "bad_nights_exp"
        SPREADSHEET_ID = "105MONNkKpdG18wPZL3lIoWaJ1gR3wJYgDS8HAmr1w8A"
    return {'SHEET_NAME': SHEET_NAME, 'TABLE_NAME': TABLE_NAME, 'SPREADSHEET_ID': SPREADSHEET_ID}


def insert_data_from_spreadsheet(curs, info : Dict[str, str]):
    SPREADSHEET_ID = info['SPREADSHEET_ID']
    TABLE_NAME = info['TABLE_NAME']
    SHEET_NAME = info['SHEET_NAME']

    # Insert data from spreadsheet
    csv_link = f"https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet={SHEET_NAME}"
    try:
        csv_file = pd.read_csv(csv_link, header=0)
        for index, row in csv_file.iterrows():
            night_date = row.values[0]
            curs.execute(f"INSERT INTO {TABLE_NAME} (date) VALUES(%s)", (night_date, ))
    except URLError:
        print(f"URL NOT FOUND {csv_link}")
    except ParserError:
        print(f"ParserError, probably the sheet isn't shared with anyone with the link")


def main(primary=False):
    info = get_info(primary)

    TABLE_NAME = info['TABLE_NAME']

    with psycopg.connect("postgres://postgres:mysecretpassword@localhost:5433") as conn:
        with conn.cursor() as curs:
            # Business logic to create table inside proper location
            curs.execute("SET search_path TO api")
            curs.execute(f"DROP TABLE IF EXISTS {TABLE_NAME}")
            curs.execute(f"CREATE TABLE {TABLE_NAME} (id serial PRIMARY KEY, date date NOT NULL)")
            # Allow read permissions
            curs.execute(f"GRANT SELECT on all tables in schema api to web_anon")
            curs.execute(f"GRANT SELECT on all tables in schema api to reader")

            try:
                insert_data_from_spreadsheet(curs, info)
            except Exception as e:
                import traceback
                print(traceback.format_exc())
                print("Error", e)


        # Make change to db persistent
        conn.commit()


if __name__ == "__main__":
    main()
