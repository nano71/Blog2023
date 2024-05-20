import {useEffect} from "react";
import {chartInitialize} from "../../utils/charts.js";
import * as echarts from "echarts";

/**
 *
 * @param {echarts.EChartsOption|Object} option
 * @param {string} id
 * @constructor
 */
export default function Chart({option, id}) {
    useEffect(() => {
        const chart = chartInitialize(id)
        chart.setOption({
            grid: {
                top: 100,
                left: 50,
                right: 10
            },
            ...option
        })
        return () => {
            chart.dispose()
        }
    }, [option])
    return <div id={id}></div>
}


export const chartStyle = {
    itemStyle: {
        color: '#05b45d'
    },
    areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
                offset: 0,
                color: '#8bfac1'
            },
            {
                offset: 1,
                color: '#05b45d'
            }
        ])
    },
}
