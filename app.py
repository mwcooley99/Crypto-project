from flask import Flask, render_template, url_for
from flask_sqlalchemy import SQLAlchemy

from helpers.helpers import myconverter, create_plot

from datetime import datetime

import pandas as pd

import json

import os

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("CLEARDB_DATABASE_URL")

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/comparison")
def comparison():
    return render_template("comparison.html")


@app.route("/data")
def data():
    return render_template("data.html")


@app.route("/influencers")
def influencers():
    return render_template("influencers.html")


@app.route("/members")
def members():
    return render_template("members.html")


@app.route("/trend")
def trend():
    # Make connection
    connection = db.engine.connect()
    # Get the Line graph data
    headers = ['close', 'date', 'name']

    query = connection.execute(
        "SELECT close, DATE_FORMAT(date, '%%Y-%%m-%%d %%T') AS date, name "
        "FROM top_10_coins "
        "WHERE DATE(date) > '2017-01-01'")
    line_data = [dict(zip(headers, row)) for row in query.fetchall()]

    # Get the Bubble Chart data
    headers = ['name', 'close', 'month', 'date', 'volume']

    query = connection.execute(
        "SELECT name, close, Month(date), DATE_FORMAT(date, '%%Y-%%m-%%d %%T') AS date, AVG(volume) "
        "FROM top_10_coins "
        "GROUP BY name, Year(date), Month(date) "
        "HAVING DATE(`date`) > '2017-01-01'")

    bubble_data = [dict(zip(headers, row)) for row in query.fetchall()]

    # Close connection
    connection.close()

    return render_template("trend.html", line_data=line_data,
                           bubble_data=bubble_data)


@app.route("/twitter_viz")
def twitter_viz():
    data = pd.read_pickle('static/Resources/twitter_month.pkl')
    graph = create_plot(data)
    return render_template("twitter_viz.html",
                           graph=graph)


@app.route("/data_string")
def data_string():
    delimter = ","
    end_of_line = "\n"

    connection = db.engine.connect()

    result = connection.execute("SHOW columns FROM top_10_coins")
    headers = [column[0] for column in result.fetchall()]

    connection.close()

    result_string = delimter.join(headers)
    result_string += end_of_line

    connection = db.engine.connect()

    query = connection.execute("SELECT * "
                              "FROM top_10_coins "
                              "WHERE DATE(date) > '2017-01-01'")
    # Format the data into a string
    data = ""
    for row in query.fetchall():
        row = list(row)

        row[2] = datetime.strftime(row[2], "%Y-%m-%d")
        row = [str(i) for i in row]
        data += delimter.join(row)
        data += "\n"

    connection.close()

    result_string += data

    return result_string


@app.route("/twitter_data/<agg_type>")
def twitter_data(agg_type):
    with app.open_resource('static/Resources/twitter_data.json') as f:
        df = pd.read_json(f)

    return ""


if __name__ == '__main__':
    app.run()
