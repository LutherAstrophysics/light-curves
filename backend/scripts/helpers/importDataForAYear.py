import pandas as pd
from urllib.error import URLError
from pandas.errors import ParserError


def importDataForAYear(year, csvLink, dbCursor, size="4px"):
    try:
        csv_file = pd.read_csv(csvLink)
        for index, row in csv_file.iterrows():
            handleStar(int(row[0]), size, row[1:], dbCursor)
    except URLError:
        print(f"URL NOT FOUND {csvLink}")
    except ParserError:
        print(f"ParserError, probably the sheet isn't shared with anyone with the link")

def handleStar(star, size, dateAndFluxRow, dbCursor):
    starTable = f'star_{star}_{size}'
    for date in dateAndFluxRow.index:
        flux = dateAndFluxRow[date]
        dbCursor.execute(f"INSERT INTO {starTable} (flux, date) VALUES(%s, %s)", (flux, date))
