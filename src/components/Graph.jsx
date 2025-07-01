import React, { PureComponent, useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Graph(data) {

    console.log(data)

    return <ResponsiveContainer width="100%" height="100%">
            <LineChart width={400} height={400} data={data.data[0].graphData.slice(data.data[0].graphData.length - 7)}>
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
                <XAxis dataKey="daysAgo" stroke="white"/>
                <Tooltip />
            </LineChart>
      </ResponsiveContainer>

}

export default Graph;
