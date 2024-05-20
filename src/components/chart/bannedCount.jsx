import {useEffect, useState} from "react";
import {getDailyBannedCount} from "../../utils/http.js";
import Chart, {chartStyle} from "./chart.jsx";

export default function BannedCount() {
    const [dates, setDates] = useState([])
    const [bannedCounts, setBannedCounts] = useState([])
    useEffect(() => {
        getDailyBannedCountData()
    }, []);

    /**
     *
     * @return {void}
     */
    async function getDailyBannedCountData() {
        console.log("getDailyBannedCountData");
        let data = await getDailyBannedCount()
        if (Array.isArray(data)) {
            setDates(data.map(item => item.date))
            setBannedCounts(data.map(item => item["bannedCount"]))
        }
    }

    return <Chart option={{
        title: {
            text: 'IP封禁量',
            subtext: 'Banned Count',
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dates
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
        },

        dataZoom: [
            {
                start: 50,
                end: 100,
                dataBackground: {
                    areaStyle: {
                        color: "#05b45d"
                    }
                }
            },
            {
                start: 0,
                end: 10
            }
        ],
        series: [
            {
                name: '当日封禁量',
                type: 'line',
                showSymbol: false,
                data: bannedCounts,
                ...chartStyle
            }
        ]
    }} id={"bannedCount"}/>
}
