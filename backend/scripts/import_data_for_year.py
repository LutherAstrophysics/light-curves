import math
import pandas as pd
import psycopg

from pandas.errors import ParserError
from urllib.error import URLError

from typing import Dict

def get_spreadsheet_id(is_primary : bool):
    if is_primary:
        SPREADSHEET_ID = "1Vv8_6IX_y6Wg6FuHJpgUVYnhiZ4dBOq8535wMoCXYP4"
    else:
        SPREADSHEET_ID = "10EA2VOdk0EbbgxER6rFxY3sth-Oy83ngUTbFBxxtoZA"
    return SPREADSHEET_ID

def get_star_table(is_primary : bool, star_no : int):
    if is_primary:
       TABLE_NAME = f"star_{star_no}_4px"
    else:
       TABLE_NAME = f"star_{star_no}_4px_exp"
    return TABLE_NAME


def get_sheet_name(year: int):
    return str(year)


def clean_data_for_year(star, primary, year, curs):
    star_table = get_star_table(primary, star)
    first_night = f"{year}-01-01"
    last_night = f"{year + 1}-01-01"
    curs.execute(f"""DELETE FROM {star_table} where 
                    date >= '{first_night}'::date AND date < '{last_night}'::date""")


def insert_data_from_spreadsheet(curs, year: int, primary: bool):
    spreadsheet_id = get_spreadsheet_id(primary)
    sheet_name = get_sheet_name(year)
    csv_link = f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}/gviz/tq?tqx=out:csv&sheet={sheet_name}"
    try:
        csv_file = pd.read_csv(csv_link)
        for index, row in csv_file.iterrows():
            star_no = int(float(str(row[0]).replace(',', ''))) # Remove commas
            # Clean data for the year
            # Note that it's a necessary step to clean records for a year than
            # just updating them because if accidently we imported data for a
            # night that shouldn't exist, there would be no way to remove that
            # datapoint even if we deleted the datapoint in google sheets
            clean_data_for_year(star_no, primary, year, curs)
            handle_star(star_no, row[1:], curs, primary)
    except URLError:
        print(f"URL NOT FOUND {csvLink}")
    except ParserError:
        print(f"ParserError, probably the sheet isn't shared with anyone with the link")


def handle_star(star, date_and_flux_row, curs, primary):
    star_table = get_star_table(primary, star)
    for date in date_and_flux_row.index:
        flux = date_and_flux_row[date]
        if isinstance(flux, str):
            flux = flux.replace(',', '') # Remove commas in dataset
        elif isinstance(flux, float):
            # Empty cells in google sheets are read as nan values
            # Replace nan values with 0's
            if math.isnan(flux): flux = 0
        curs.execute(f'''INSERT INTO {star_table} (flux, date) VALUES(%s, %s)
        ON CONFLICT (date) DO UPDATE SET (flux, date) = (EXCLUDED.flux, EXCLUDED.date);''', (flux, date))


def main(year: int, primary=False):

    with psycopg.connect("postgres://postgres:mysecretpassword@localhost:5433") as conn:
        with conn.cursor() as curs:
            try:
                curs.execute("SET search_path TO api")
                insert_data_from_spreadsheet(curs, year, primary)
            except Exception as e:
                import traceback
                print(traceback.format_exc())
                print("Error", e)

        # Make change to db persistent
        conn.commit()


if __name__ == "__main__":
    main()

