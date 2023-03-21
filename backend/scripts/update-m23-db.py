#! /usr/bin/python3

from create_or_update_colors import main as color_import
from create_or_update_bad_nights import main as bad_nights_import
from import_data_for_year import main as year_import

def color():
    color_import()

def badnights():
    print('1. Update Primary Data')
    print('2. Update Secondary Data')

    ps_type = input('\nSelect: ')

    if ps_type == '1':
        bad_nights_import(True)
    elif ps_type == '2':
        bad_nights_import(False)
    else:
        print('Invalid choice')

def yearly():

    def select_year():
        year = input('\nYear: ')
        if not year.isdigit():
            print('Invalid year')
            return
        year = int(year)
        return year

    print('1. Update Primary Data')
    print('2. Update Secondary Data')

    ps_type = input('\nSelect: ')

    if ps_type == '1':
        if year := select_year():
            year_import(year, True)
    elif ps_type == '2':
        if year := select_year():
            bad_nights_import(year, False)
    else:
        print('Invalid choice')

def main():
    print('1. Color import')
    print('2. Bad nights import')
    print('3. Year data import')

    imp_type = input('\nChoose import type: ')

    if imp_type == '1':
        color()
    elif imp_type == '2':
        badnights()
    elif imp_type == '3':
        yearly()
    else:
        print('Invalid choice')

if __name__ == "__main__":
    main()
