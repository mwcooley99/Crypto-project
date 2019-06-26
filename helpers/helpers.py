import datetime

import plotly
import plotly.graph_objs as go

import json


def myconverter(o):
    if isinstance(o, datetime.datetime):
        return o.__str__()


def create_plot(df):
    data = []

    for group in df['user_name'].unique():
        df_temp = df.loc[df['user_name'] == group]

        trace = go.Bar(
            x=df_temp['date'],
            y=df_temp['text'],
            name=group
        )
        data.append(trace)

    layout = go.Layout(
        barmode='group',
        title="Average Number of Tweets",
        xaxis=dict(tickangle=-45),
        height=700,
        margin=go.layout.Margin(
            l=50,
            r=50,
            b=100,
            t=100,
            pad=4
        )
    )

    graph = {"data": data, "layout": layout}

    return json.dumps(graph, cls=plotly.utils.PlotlyJSONEncoder)
