import pandas as pd
import psycopg

TABLE_NAME = "color"
SPREADSHEET_ID = "1x6y4kq-xX1-9GGzLm4rDG_U56dtrTtrXsF9BftMt9Jg"
SHEET_NAME = "Data"


def insert_data_from_spreadsheet(curs):
    # Insert data from spreadsheet
    csv_link = f"https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet={SHEET_NAME}"
    csv_file = pd.read_csv(csv_link, header=0)
    for row in csv_file.itertuples():
        star_no, color = row.star, row.color
        if pd.isna(color):
            # No color for the star
            curs.execute(f"INSERT INTO {TABLE_NAME} (star) VALUES (%s)", (star_no))
        else:
            # If both star_no and color are present
            if star_no and color:
                curs.execute(
                    f"INSERT INTO {TABLE_NAME} (star, color) VALUES (%s, %s)",
                    (star_no, color),
                )


def main():
    with psycopg.connect("postgres://postgres:mysecretpassword@localhost:5433") as conn:
        with conn.cursor() as curs:
            # Business logic to create table inside proper location
            curs.execute("SET search_path TO api")
            curs.execute(f"DROP TABLE IF EXISTS {TABLE_NAME}")
            curs.execute(f"CREATE TABLE {TABLE_NAME} (star primary key, color real)")

            insert_data_from_spreadsheet(curs)

        # Make change to db persistent
        conn.commit()


if __name__ == "__main__":
    main()
