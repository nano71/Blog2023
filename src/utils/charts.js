import * as echarts from "echarts";

/**
 *
 * @param {string} elementId
 * @return {echarts.EChartsType}
 */
export function chartInitialize(elementId) {
    console.log("chartInitialize");
    return echarts.init(document.getElementById(elementId))
}
