import {useEffect, useState} from "react";
import {getPopularArticles} from "../../utils/http.js";
import Chart, {chartStyle} from "./chart.jsx";

export default function PopularArticles() {
    const [articleTitles, setArticleTitles] = useState([])
    const [readCounts, setReadCounts] = useState([])
    const [commentCounts, setCommentCounts] = useState([])
    useEffect(() => {
        getArticleCountsByCategory()
    }, []);

    /**
     *
     * @return {void}
     */
    async function getArticleCountsByCategory() {
        console.log("getDailyBannedCountData");
        let data = (await getPopularArticles()).list
        setArticleTitles(data.map(item => item.title))
        setReadCounts(data.map(item => item.readCount))
        setCommentCounts(data.map(item => item.commentCount))
    }

    return <><Chart option={{
        title: {
            text: "最多阅读",
            subtext: "Most ReadCount"
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: {
            axisLabel: {
                formatter: function (value, index) {
                    return value.substring(0, 4) + '...';
                }
            },
            axisTick: {
                alignWithLabel: true
            },
            type: 'category',
            data: articleTitles
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, 1],
        },
        series: [
            {
                name: '阅读量',
                type: 'bar',
                data: readCounts,
                ...chartStyle
            }
        ]
    }} id={"popularArticles"}/>
        <Chart option={{
            title: {
                text: "最多评论",
                subtext: "Most Comment Count"
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: {
                axisLabel: {
                    formatter: function (value, index) {
                        return value.substring(0, 4) + '...';
                    }
                },
                axisTick: {
                    alignWithLabel: true
                },
                type: 'category',
                data: articleTitles
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, 1],
            },
            series: [
                {
                    name: '评论量',
                    type: 'bar',
                    data: commentCounts,
                    ...chartStyle
                }
            ]
        }} id={"popularArticles2"}/></>
}
