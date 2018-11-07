#!/usr/bin/env python
# Name: Maria Daan
# Student number: 11243406
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    movies = []
    for movie in dom.find_all('div', {"class": "lister-item-content"}):
        dictmovie = {}

        # Add title of movie to dictionary
        title = movie.h3.a.string
        dictmovie["Title"] = title

        # Add rating of movie to dictionary
        rating = movie.find("strong").string
        dictmovie["Rating"] = rating

        # Add year of movie to dictionary
        years = movie.find("span", \
                {"class": "lister-item-year text-muted unbold"}).string
        year = ""
        for char in years:
            if char.isdigit():
                year += char
        dictmovie["Year"] = year

        # Add star actors of movie to dictionary
        actors = movie.find_all("p", {"class": ""})[1]
        actors = actors.find_all('a')
        actorstring = ""
        for item in actors:
            link = item.get("href")

            # Skip directors and create string of all actors
            if "adv_li_st" in link:
                actorstring += item.string
                actorstring += ", "
        dictmovie["Actors"] = actorstring[:-2]

        # Add runtime of movie to dictionary
        runtime = movie.find("span", {"class": "runtime"}).string
        dictmovie["Runtime"] = int(runtime[:-4])

        # Add dictionary of movie to list of movies
        movies.append(dictmovie)

    return movies


def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(['sep=,'])
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])

    # Write movies to disk
    for movie in movies:
        writer.writerow([movie['Title'], movie['Rating'], movie['Year'],\
                         movie['Actors'], movie['Runtime']])


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # Get HTML content at target URL
    html = simple_get(TARGET_URL)

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # Extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)
