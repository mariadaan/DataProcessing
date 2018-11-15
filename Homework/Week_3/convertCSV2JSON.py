import pandas as pd
import csv
import json


with open('KNMI_20181114.txt', 'r') as in_file:
    stripped = (line.strip() for line in in_file)
    lines = (line.split(",") for line in stripped if line[0].isdigit())
    with open('output.csv', 'w') as out_file:
        writer = csv.writer(out_file)
        #writer.writerow(['sep=,'])
        writer.writerow(('STN', 'YYYYMMDD', 'TN'))
        writer.writerows(lines)

    df = pd.read_csv('output.csv')

    with open('output.json', 'w') as outfile:
        outfile.write(df.set_index("YYYYMMDD").to_json(orient='index'))
    #.set_index("YYYYMMDD")
