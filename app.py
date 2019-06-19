from flask import Flask, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy

from helpers import myconverter

import json
import jsonify

from sqlalchemy import inspect
from sqlalchemy.ext.automap import automap_base

import os
# from flask_bootstrap import Bootstrap
import mysql.connector

import os

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("SQLALCHEMY_DATABASE_URI")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# cnx = mysql.connector.connect(database='heroku_a406bf74b9befa3',
#                               user=os.getenv('user'),
#                               password=os.getenv('password'),
#                               host=os.getenv('host')
#                               )
#
# cursor = cnx.cursor(buffered=True)
#
# query = ("SHOW columns FROM top_10_coins")
# cursor.execute(query)
# headers = [column[0] for column in cursor.fetchall()]
#
# cursor.close()
# # j = [dict(zip(headers, data) for data in )]
# cursor = cnx.cursor()
# query = ("SELECT * FROM top_10_coins")
# cursor.execute(query)
# j = [dict(zip(headers, row)) for row in cursor.fetchall()]
# print(j[0])

# print(cursor)

db = SQLAlchemy(app)


# print(db.engine.table_names())
# Base = automap_base()
# Base.prepare(db.engine, reflect=True)
#
#
# Crypto = Base.classes.top_10_coins
# print("*************")
# db.session.query(Crypto).first()


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/comparison")
def comparison():
    return render_template("Comparison.html")


@app.route("/data")
def data():
    return render_template("data.html")


@app.route("/influencers")
def influencers():
    return render_template("Influencers.html")


@app.route("/members")
def members():
    return render_template("members.html")


@app.route("/trend")
def trend():
    return render_template("Trend.html")


@app.route("/hello")
def crypto_top_10():
    result = db.engine.execute("SHOW columns FROM top_10_coins")
    headers = [column[0] for column in result.fetchall()]

    query = db.engine.execute("SELECT * FROM top_10_coins LIMIT 10")
    j = [dict(zip(headers, row)) for row in query.fetchall()]

    return json.dumps(j, default=myconverter)


if __name__ == '__main__':
    app.run()
