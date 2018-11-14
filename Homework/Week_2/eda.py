# Name: Maria Daan
# Student number: 11243406
"""
Exploratory Data Analysis
"""


import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import json


INPUT_CSV = "input.csv"
COUNTRY = "Country"
REGION = "Region"
DENSITY = "Pop. Density (per sq. mi.)"
INFANT = "Infant mortality (per 1000 births)"
GDP = "GDP ($ per capita) dollars"


def load_data(input):
    """
    Loads data into a pandas DataFrame
    """
    df = pd.read_csv(input)
    df = df.replace('unknown', np.nan)
    return df


def to_float(DataFrame, column):
    """
    Converts data in column to float values
    """
    df = DataFrame
    first = df[column].iloc[0]

    # Use first value in column to detect stringtype and modify if necessary
    if ',' in first:
        df[column] = df[column].str.replace(',', '.')
    elif 'dollars' in first:
        df[GDP] = df[GDP].str.strip('dollars')
    df[column] = df[column].astype(float)

    return df


def central_tendency(DataFrame, column):
    """
    Computes and prints the Central Tendency of a column
    """
    print(f'{column}\n'
          f'mean: {round(DataFrame[column].mean(), 2)}\n'
          f'median: {DataFrame[column].median()}\n'
          f'mode: {DataFrame[column].mode()}\n')


def five_number(DataFrame, column):
    """
    Computes and prints the Five Number Summary of a column
    - Minimum, First Quartile, Median, Third Quartile and Maximum.
    """
    values = DataFrame[column].describe()[['min', '25%', '50%', '75%', 'max']]
    print(f'{column}\n{values}')


if __name__ == '__main__':
    # Load data into a pandas DataFrame
    df = load_data(INPUT_CSV)

    # Select data from DataFrame
    df = df[[COUNTRY, REGION, DENSITY, INFANT, GDP]]

    # Strip data where necessary
    df[REGION] = df[REGION].str.strip()
    df[COUNTRY] = df[COUNTRY].str.strip()

    # Convert relevant columns to floats
    df = to_float(df, GDP)
    df = to_float(df, INFANT)
    df = to_float(df, DENSITY)

    # Print descriptive statistics
    central_tendency(df, GDP)
    five_number(df, INFANT)

    # Create GDP list and remove missing/outlying value(s)
    GDP_list = []
    GDP_list = df[GDP].tolist()
    GDP_cleanlist = [x for x in GDP_list if str(x) != 'nan']
    GDP_cleanlist.remove(max(GDP_cleanlist))

    # Plot a histogram of the GDPs
    plt.hist(GDP_cleanlist, 50)
    plt.xlabel(GDP)
    plt.ylabel('Countries')
    plt.show()

    # Plot a boxplot of the infant mortality
    df[INFANT].plot.box()
    plt.show()

    # Write data to a json file
    with open('eda.json', 'w') as outfile:
        outfile.write(df.set_index(COUNTRY).to_json(orient='index'))
