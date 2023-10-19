import "/src/stylesheet/articleList.less"
import {useContext} from "react";
import {CurrentIndexContext, RecentArticlesContext} from "/src/pages/index.jsx";
import {Link} from "react-router-dom";

function ArticleList() {
    const recentArticles = useContext(RecentArticlesContext)
    const {setCurrentIndex} = useContext(CurrentIndexContext)

    return (<div className="articleList" id="articleList">
        {recentArticles.map((value, index) =>
            <Link to={"/article/" + value.id} key={index}>
                <div className="article" onMouseEnter={() => value.backgroundImage && setCurrentIndex(index)}>
                    <span className="date">{new Date(value["updateTime"]).toLocaleString()}</span>
                    <h2 className="title" itemProp="name">{value.title}</h2>
                    <p className="text" itemProp="description">{value.content}</p>
                    <span className="more">view</span>
                </div>
            </Link>
        )}
    </div>)
}

export default ArticleList
