import {useEffect} from "react";
import {chartInitialize} from "../../utils/charts.js";

export default function Banned() {
    useEffect(() => {
        const chart = chartInitialize("banned")

        let base = +new Date(1988, 9, 3);
        let oneDay = 24 * 3600 * 1000;
        let data = [[base, Math.random() * 300]];
        for (let i = 1; i < 20000; i++) {
            let now = new Date((base += oneDay));
            data.push([+now, Math.round((Math.random()) * 20 + data[i - 1][1])]);
        }
        /**
         *
         * @type {echarts.EChartsOption|Object}
         */
        let option = {
            tooltip: {
                trigger: 'axis',
                position: function (pt) {
                    return [pt[0], '10%'];
                }
            },
            title: {
                textAlign:"left",
                subtext: 'IP banned',
                text: 'IP封禁'
            },
            xAxis: {
                type: 'category',
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
                    name: '拦截数',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    areaStyle: {},
                    data: data
                }
            ]
        };
        chart.setOption(option)
        return () => {
            chart.dispose()
        }
    }, [])
    return <div id="banned"></div>
}
