import "/src/stylesheet/index.less"
import {createContext, useEffect, useState} from "react";
import {getRecentArticles, getTagList} from "../utils/http.js";
import {useLocation} from "react-router-dom";
import Preview from "../components/preview/preview.jsx";
import Content from "../components/content/content.jsx";

export const RecentArticlesContext = createContext([])
export const CurrentIndexContext = createContext(null)
export const TagListContext = createContext(null)

function Index() {
    const [recentArticles, setRecentArticles] = useState([])
    const [tagList, setTagList] = useState([])
    const [currentIndex, setCurrentIndex] = useState(-1)
    let location = useLocation();

    useEffect(() => {
        (async function () {
            setRecentArticles(await getRecentArticles())
            setTagList(await getTagList())
        })()
        if (location.pathname === "/") {
            window.location.href = "#/recent"
        }
    }, [])
    return (<div className="index">
        <RecentArticlesContext.Provider value={recentArticles}>
            <CurrentIndexContext.Provider value={{currentIndex, setCurrentIndex}}>
                <Preview imageUrls={recentArticles.map(v => v.backgroundImage)}/>
                <TagListContext.Provider value={tagList}><Content/></TagListContext.Provider>
            </CurrentIndexContext.Provider>
        </RecentArticlesContext.Provider>
    </div>)
}

export default Index
