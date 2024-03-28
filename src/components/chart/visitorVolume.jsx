import {useEffect} from "react";
import {chartInitialize} from "../../utils/charts.js";

export default function VisitorVolume() {
    useEffect(() => {
        const chart = chartInitialize("visitorVolume")

        let base = +new Date(2021, 9, 3);
        let oneDay = 24 * 3600 * 1000;

        let data = [[base, Math.random() * 300]];
        for (let i = 1; i < 365 * 2; i++) {
            let now = new Date((base += oneDay));
            data.push([+now, Math.round((Math.random() - 0.5) * 20 + data[i - 1][1])]);
        }
        /**
         *
         * @type {echarts.EChartsOption|Object}
         */
        const option = {
            // Make gradient line here
            visualMap: [
                {
                    show: false,
                    type: 'continuous',
                    seriesIndex: 0,
                    min: 0,
                    max: 400
                }
            ],
            title: {
                text: '网站访问量',
                subtext: 'Visitor volume',
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'time',
                boundaryGap: false,
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%']
            },
            grid: {
                top: 100,
                left: 50,
                right: 10
            },
            dataZoom: [
                {
                    type: 'inside',
                    start: 0,
                    end: 20
                },
                {
                    start: 0,
                    end: 20
                }
            ],
            series: [
                {
                    name: '当日访问量',
                    type: 'line',
                    showSymbol: false,
                    data: data
                }
            ]
        };
        chart.setOption(option)
        return () => {
            chart.dispose()
        }
    }, [])
    return <div id="visitorVolume"></div>
}
