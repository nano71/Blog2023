import {useEffect, useState} from "react";
import {getDailyBannedCount, getTagList} from "../../utils/http.js";
import Chart, {chartStyle} from "./chart.jsx";

export default function ArticleCountsByCategory() {
    const [tagNames, setTagNames] = useState([])
    const [counts, setCounts] = useState([])
    useEffect(() => {
        getArticleCountsByCategory()
    }, []);

    /**
     *
     * @return {void}
     */
    async function getArticleCountsByCategory() {
        console.log("getDailyBannedCountData");
        let data = await getTagList()
        data.result.data = data.result.data.sort((a, b) => {return b.count - a.count})
        setTagNames(data.result.data.map(item => item.name))
        setCounts(data.result.data.map(item => item.count))
    }

    return <Chart option={{
        title: {
            text: "标签统计",
            subtext:"Counts By Category"
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: {
            type: 'category',
            data: tagNames
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, 1],
        },
        series: [
            {
                name: '文章数量',
                type: 'bar',
                data: counts,
                ...chartStyle
            }
        ]
    }} id={"articleCountsByCategory"}/>
}
