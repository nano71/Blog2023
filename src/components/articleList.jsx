import "/src/stylesheet/articleList.less"
import {useContext} from "react";
import {CurrentIndexContext, RecentArticlesContext} from "../pages/index.jsx";

function ArticleList() {
    const recentArticles = useContext(RecentArticlesContext)
    const {setCurrentIndex} = useContext(CurrentIndexContext)

    return (<div className="articleList" id="articleList">{

        recentArticles.map((value, index) => <div className="article" onMouseEnter={() => setCurrentIndex(index)}>
            <span className="date">{new Date(value["updateTime"]).toLocaleString()}</span>
            <h2 className="title" itemProp="name">{value.title}</h2>
            <p className="text" itemProp="description">{value.content}</p>
            <span className="more">VIEW</span>
        </div>)
    }

    </div>)
}

export default ArticleList
