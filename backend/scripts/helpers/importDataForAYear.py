import pandas as pd

def importDataForAYear(year, csvLink, dbCursor, size="4px"):
    csv_file = pd.read_csv(csvLink)
    for index, row in csv_file.iterrows():
        handleStar(int(row[0]), size, row[1:], dbCursor)

def handleStar(star, size, dateAndFluxRow, dbCursor):
    starTable = f'star_{star}_{size}'
    for date in dateAndFluxRow.index:
        flux = dateAndFluxRow[date]
        dbCursor.execute(f"INSERT INTO {starTable} (flux, date) VALUES(%s, %s)", (flux, date))
