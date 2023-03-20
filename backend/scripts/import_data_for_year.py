import pandas as pd
import psycopg

from typing import Dict

def get_spreadsheet_id(is_primary : bool):
    if primary:
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


def insert_data_from_spreadsheet(curs, year: int, primary: bool):
    spreadsheet_id = get_spreadsheet_id(primary)
    sheet_name = get_sheet_name(year)
    csv_link = f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}/gviz/tq?tqx=out:csv&sheet={sheet_name}"
    try:
        csv_file = pd.read_csv(csv_link)
        for index, row in csv_file.iterrows():
            handle_star(int(row[0]), row[1:], curs, primary)
    except URLError:
        print(f"URL NOT FOUND {csvLink}")
    except ParserError:
        print(f"ParserError, probably the sheet isn't shared with anyone with the link")


def handleStar(star, date_and_flux_row, curs, primary):
    star_table = get_star_table(primary, star)
    for date in date_and_flux_row.index:
        flux = date_and_flux_row[date]
        curs.execute(f'''INSERT INTO {star_table} (flux, date) VALUES(%s, %s)
        ON CONFLICT (date) DO UPDATE SET (flux, date) = (EXCLUDED.flux, EXCLUDED.date);''', (flux, date))


def main(year: int, primary=False):

    with psycopg.connect("postgres://postgres:mysecretpassword@localhost:5433") as conn:
        with conn.cursor() as curs:
            try:
                insert_data_from_spreadsheet(curs, year, primary)
            except Exception as e:
                print("Error", e)

        # Make change to db persistent
        conn.commit()


if __name__ == "__main__":
    main()
