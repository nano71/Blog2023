import Chart, {chartStyle} from "./chart.jsx";
import {useEffect, useState} from "react";
import {getDailyVisitorVolume} from "../../utils/http.js";

export default function VisitorVolume() {
    const [dates, setDates] = useState([])
    const [visitorVolumes, setVisitorVolumes] = useState([])
    useEffect(() => {
        getDailyVisitorVolumeData()
    }, []);

    /**
     *
     * @return {void}
     */
    async function getDailyVisitorVolumeData() {
        console.log("getDailyVisitorVolumeData");
        let data = await getDailyVisitorVolume()
        if (Array.isArray(data)) {
            setDates(data.map(item => item.date))
            setVisitorVolumes(data.map(item => item["visitorVolume"]))
        }
    }

    return <Chart option={{
        title: {
            text: '网站访问量',
            subtext: 'Visitor volume',
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

                name: '当日访问量',
                type: 'line',
                showSymbol: false,
                data: visitorVolumes,
                ...chartStyle
            }
        ]
    }} id={"visitorVolume"}/>
}
