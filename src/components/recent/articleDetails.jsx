import {useLocation, useParams} from "react-router-dom";
import "/src/stylesheet/articleDetails.less"
import {useEffect, useRef, useState} from "react";
import {getArticleContent} from "../../utils/http.js";
import Loading from "../content/loading.jsx";
import 'highlight.js/styles/atom-one-light.css';

function ArticleDetails() {
    /**
     *
     * @type {[Article, React.Dispatch<React.SetStateAction<any>>]}
     */
    const articleState = useState(Object)
    const location = useLocation()
    const [loading, setLoadingStatus] = useState(true)
    const params = useParams()
    const articleDetailsRef = useRef(null);
    const [article, setArticle] = articleState
    const [scrollHeight, setScrollHeight] = useState(0)
    useEffect(() => {
        loader()
    }, [])

    useEffect(() => {
        if (articleDetailsRef.current) {
            setScrollHeight(articleDetailsRef.current.scrollHeight);
        }
    }, [article]);

    async function loader() {
        console.log(location.pathname);
        if (location.pathname === "/write/preview") {
            setArticle(JSON.parse(localStorage.getItem("draft")))
        } else {
            const article = await getArticleContent(parseInt(params.articleId))
            if (article)
                return setArticle(article)
        }
    }

    function haveScrollbar(scrollHeight) {
        return scrollHeight > window.innerHeight * 0.95 - 62
    }

    const articleDetails = <div className={"markdown-body articleDetails" + (haveScrollbar(scrollHeight) ? " scrollbar" : "")} ref={articleDetailsRef}>
        <h1 className="title">{article.title || "无标题"}</h1>
        <div className="infoBar">
            <div className="label">Date:</div>
            <div className="date">{new Date(article.createTime).toLocaleString()}</div>
        </div>
        <div className="description" dangerouslySetInnerHTML={{__html: article.description}}></div>
        {article.coverImage && <img className="image" src={article.coverImage} alt=""/>}
        <div className="content" dangerouslySetInnerHTML={{__html: article.content}}></div>
        <h2>Comments</h2>
    </div>
    return (Object.keys(article).length ? articleDetails : <Loading/>);
}

export default ArticleDetails
