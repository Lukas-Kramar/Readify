import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Text } from 'recharts';


const CustomizedAxisTick = props => {
    const { x, y, payload } = props;

    const firstLetters = payload.value.split(" ").map(word => word[0]).join("");

    return (
        <Text x={x} y={y} width={60} textAnchor="end" className='fw-bold' verticalAnchor="middle">
            {firstLetters}
        </Text>
    );
};

const ShoppingListBarChart = (props) => {
    const { shoppingLists = [] } = props;

    const { t } = useTranslation();

    const [data, setData] = useState();

    useEffect(() => {

        setData(shoppingLists.map(list => { return { name: list?.listName, items: list?.productsInList?.length } }))
    }, [shoppingLists]);

    return (
        <ResponsiveContainer width="95%" height={300} >
            <BarChart
                data={data}
                style={{ marginRight: 10 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis height={60} dataKey="name" tick={<CustomizedAxisTick />} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="items" name={t('ShoppingListBarChart.items')} fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default ShoppingListBarChart;
