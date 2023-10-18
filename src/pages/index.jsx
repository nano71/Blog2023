import Previews from "../components/previews.jsx";
import "/src/stylesheet/index.less"
import Content from "../components/content.jsx";
import {createContext, useEffect, useState} from "react";
import {getRecentArticles} from "../utils/http.js";

export const RecentArticlesContext = createContext([])
export const CurrentIndexContext = createContext(null)

function Index() {
    const [recentArticles, setRecentArticles] = useState([])
    const [currentIndex, setCurrentIndex] = useState(-1)
    useEffect(() => {
        (async function () {
            setRecentArticles(await getRecentArticles())
        })()
    }, [])
    return (<div className="index">
        <RecentArticlesContext.Provider value={recentArticles}>
            <CurrentIndexContext.Provider value={{currentIndex, setCurrentIndex}}>
                <Previews imageUrls={recentArticles.map(v => v.backgroundImage)}/>
                <Content/>
            </CurrentIndexContext.Provider>
        </RecentArticlesContext.Provider>
    </div>)
}

export default Index
