import pandas as pd
import json


df = pd.read_csv('data.csv')

with open('data.json', 'w') as outfile:
    outfile.write(df.set_index("Country").to_json(orient='index'))
