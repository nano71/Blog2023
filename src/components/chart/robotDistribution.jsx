import {useEffect} from "react";
import {chartInitialize} from "../../utils/charts.js";


export default function RobotDistribution() {
    useEffect(() => {
        const chart = chartInitialize("robotDistribution")

        /**
         *
         * @type {echarts.EChartsOption|Object}
         */
        const option = {
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
        };
        chart.setOption(option);

        return () => {
            chart.dispose();
        };
    }, [])

    return (
        <div id="robotDistribution"></div>
    );
}

