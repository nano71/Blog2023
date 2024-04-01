import {useEffect, useState} from "react";
import Chart from "./chart.jsx";


export default function RobotDistribution() {
    return <Chart option={{
        title: {
            text: '爬虫源头分布',
            subtext: 'Robot source',
            textAlign: "left",

        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            bottom: '0',
            left: 'center'
        },
        series: [
            {
                type: 'pie',
                radius: ['60%', '110%'],
                startAngle: 180,
                endAngle: 360,
                center: ['50%', '85%'],
                avoidLabelOverlap: false,
                padAngle: 5,
                itemStyle: {
                    borderRadius: 10
                },
                label: {
                    show: true,
                    // position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 14,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: true
                },
                data: [
                    {value: 1048, name: 'BingBot'},
                    {value: 735, name: 'GoogleBot'},
                    {value: 580, name: 'OtherBot'},
                ]
            }
        ]
    }} id={"robotDistribution"}/>
}

