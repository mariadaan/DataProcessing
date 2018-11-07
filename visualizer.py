#!/usr/bin/env python
# Name: Maria Daan
# Student number: 11243406
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

if __name__ == "__main__":
    import csv

    # Add years and ratings to dictionary
    with open(INPUT_CSV, newline='') as csvfile:
        reader = csv.reader(csvfile)
        count = 0
        for row in reader:

            # Skip first two lines of csv file
            if count > 1:
                rating = row[1]
                year = row[2]
                data_dict[year].append(rating)
            count += 1

    # Create list of average rating of each year
    averagelist = []
    for key in range(START_YEAR, END_YEAR):
        stringlist = data_dict[str(key)]
        floatlist = []

        # Convert to floats
        for value in stringlist:
            value = float(value)
            floatlist.append(value)

        # Calculate average and add to list
        length = float(len(floatlist))
        summed = sum(floatlist)
        averagelist.append(summed / length)

    # Create plot of average rating per year
    plt.xticks(range(START_YEAR, END_YEAR))
    plt.yticks([8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9])
    plt.plot(range(START_YEAR, END_YEAR), averagelist, 'ro')
    plt.axis([START_YEAR - 1, END_YEAR, 8.1, 8.9])
    plt.grid()
    plt.show()
