import pandas as pd
import json


df = pd.read_csv('data.csv')

with open('data.json', 'w') as outfile:
    outfile.write(df.to_json(orient='records'))
