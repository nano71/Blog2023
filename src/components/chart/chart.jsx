import {useEffect} from "react";
import {chartInitialize} from "../../utils/charts.js";

/**
 *
 * @param {echarts.EChartsOption|Object} option
 * @param {string} id
 * @constructor
 */
export default function Chart({option, id}) {
    useEffect(() => {
        const chart = chartInitialize(id)
        chart.setOption(option)
        return () => {
            chart.dispose()
        }
    }, [option])
    return <div id={id}></div>
}
