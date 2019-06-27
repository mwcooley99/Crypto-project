import numpy as np

import plotly
import plotly.graph_objs as go

import json


def create_plot(df):
    '''
    Creates the bar graph for the twitter viz page
    :param df: DataFrame of Influencer Twitter data
    :return: json of plotly graph
    '''
    data = []

    for group in np.sort(df['name'].unique()):
        df_temp = df.loc[df['name'] == group]

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
