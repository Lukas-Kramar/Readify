import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const AcomplishedPieChart = (props) => {
    const { products = [] } = props;

    const { t } = useTranslation();


    const accomplishedCount = products.filter((product) => product?.accomplished).length;


    const data = [
        { name: t('AcomplishedPieChart.accomplished'), value: accomplishedCount },
        { name: t('AcomplishedPieChart.unAccomplished'), value: products.length - accomplishedCount },
    ];

    const COLORS = ['#6c757d', '#00C49F'];

    return (
        <div>
            <PieChart width={100} height={100}>
                <Pie
                    data={data}
                    cx={50}
                    cy={50}
                    labelLine={false}
                    outerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {
                        data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                    }
                </Pie>
                <Tooltip />
            </PieChart>
        </div>
    );
};

export default AcomplishedPieChart;