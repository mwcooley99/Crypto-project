#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Downloads all tweets from a given user.
Uses twitter.Api.GetUserTimeline to retreive the last 3,200 tweets from a user.
Twitter doesn't allow retreiving more tweets than this through the API, so we get
as many as possible.
t.py should contain the imported variables.
"""

from __future__ import print_function

import json
import sys

import twitter
from api_key import ACCESS_TOKEN_KEY, ACCESS_TOKEN_SECRET, CONSUMER_KEY, CONSUMER_SECRET

def clean_tweets(tweet):
    clean_tweet = {"text": tweet.text,
                   "id": tweet.id,
                   "user_id": tweet.user.id,
                   "user_name": tweet.user.screen_name,
                   "date": tweet.created_at}

    return clean_tweet

def get_tweets(api=None, screen_name=None):
    tweets = api.GetUserTimeline(screen_name=screen_name, count=200)
    earliest_tweet = min(tweets, key=lambda x: x.id).id
    print("getting tweets before:", earliest_tweet)

    timeline = [clean_tweets(tweet) for tweet in tweets]

    while True:
        tweets = api.GetUserTimeline(
            screen_name=screen_name, max_id=earliest_tweet, count=200
        )

        new_earliest = min(tweets, key=lambda x: x.id).id

        if not tweets or new_earliest == earliest_tweet:
            break
        else:
            earliest_tweet = new_earliest
            print("getting tweets before:", earliest_tweet)

            timeline += [clean_tweets(tweet) for tweet in tweets]

    return timeline


if __name__ == "__main__":
    api = twitter.Api(
        CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN_KEY, ACCESS_TOKEN_SECRET
    )
    screen_names = ["VitalikButerin", "SatoshiLite", "officialmcafee", "aantonop",
                    "rogerkver", "naval", "ErikVoorhees", "NickSzabo4", "justinsuntron",
                    "brian_armstrong"]

    timeline = []
    for screen_name in screen_names:
        print(screen_name)
        timeline += get_tweets(api=api, screen_name=screen_name)

    with open('twitter_data.json', 'w+') as f:
        json.dump(timeline, f)