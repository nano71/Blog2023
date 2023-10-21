import "/src/stylesheet/articleList.less"
import {useContext} from "react";
import {CurrentIndexContext, RecentArticlesContext} from "/src/pages/index.jsx";
import {useNavigate} from "react-router-dom";

function ArticleList() {
    /**
     * @type {Article[]}
     */
    const recentArticles = useContext(RecentArticlesContext)
    const {setCurrentIndex} = useContext(CurrentIndexContext)
    const navigate = useNavigate()

    return (<div className="articleList" id="articleList">
        {recentArticles.map((value, index) =>
            <div key={index} className="article" onClick={() => navigate("/article/" + value.id)} onMouseEnter={() => value.coverImage && setCurrentIndex(index)}>
                <span className="date">{new Date(value.createTime).toLocaleString()}</span>
                <h2 className="title" itemProp="name">{value.title}</h2>
                <p className="text" itemProp="description">{value.description}</p>
                <span className="more">-view-</span>
            </div>
        )}
    </div>)
}

export default ArticleList
