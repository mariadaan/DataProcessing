import pandas
import csv

INPUT_CSV = "input.csv"

if __name__ == "__main__":
    with open(INPUT_CSV, newline='') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            print(row)
            if not row:
                print
