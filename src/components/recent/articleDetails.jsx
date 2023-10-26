import {useParams} from "react-router-dom";
import "/src/stylesheets/article/articleDetails.less"
import {useEffect, useRef, useState} from "react";
import {getArticleContent} from "../../utils/http.js";
import Loading from "../content/loading.jsx";
import 'highlight.js/styles/atom-one-light.css';
import {Icon} from "@iconify/react";
import Giscus from "@giscus/react";

function ArticleDetails() {
    /**
     *
     * @type {[Article, React.Dispatch<React.SetStateAction<any>>]}
     */
    const articleState = useState(Object)
    const params = useParams()
    const articleDetailsRef = useRef(null);
    const [article, setArticle] = articleState
    const [scrollHeight, setScrollHeight] = useState(0)
    useEffect(() => {
        console.log("ArticleDetails Mounted");
        loader()
    }, [])

    useEffect(() => {
        if (articleDetailsRef.current) {
            setScrollHeight(articleDetailsRef.current.scrollHeight);
        }
        bindDiscussion()
    }, [article]);

    function bindDiscussion() {
        let ogTitleMeta = document.querySelector('meta[property="og:title"]')
        ogTitleMeta.setAttribute("content", `Blog#${article.id} ${article.title}`);

        function handleMessage(event) {
            if (event.origin !== 'https://giscus.app') return;
            if (!(typeof event.data === 'object' && event.data.giscus)) return;

            const giscusData = event.data.giscus;
            console.info(giscusData);
            // Do whatever you want with it, e.g. `console.log(giscusData)`.
            // You'll need to make sure that `giscusData` contains the message you're
            // expecting, e.g. by using `if ('discussion' in giscusData)`.
        }

        window.addEventListener('message', handleMessage);
// Some time later...
        window.removeEventListener('message', handleMessage);

    }

    /**
     * 加载器
     * @returns {void}
     */
    async function loader() {
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

    const articleDetails =
        <div className={"markdown-body articleDetails" + (haveScrollbar(scrollHeight) ? " scrollbar" : "")} ref={articleDetailsRef}>
            <h1 className="title">{article.title || "无标题"}</h1>
            <div className="infoBar">
                <div className="item">
                    <Icon icon="ri:user-5-line"/>
                    <div className="user">nano71.com</div>
                </div>
                <div className="item">
                    <Icon icon="ri:time-line"/>
                    <div className="date">{new Date(article.createTime).toLocaleString()}</div>
                </div>
                <div className="item">
                    <Icon icon="ri:message-3-line"/>
                    <div className="date">{2} comments</div>
                </div>
            </div>
            <div className="description" dangerouslySetInnerHTML={{__html: article.description}}></div>
            {article.coverImage && <img className="image" src={article.coverImage} alt=""/>}
            <div className="content" dangerouslySetInnerHTML={{__html: article.content}}></div>
            <div className="infoBar">
                <div className="item">
                    <Icon icon="ri:user-5-line"/>
                    <div className="user">nano71.com</div>
                </div>
                <div className="item">
                    <Icon icon="ri:time-line"/>
                    <div className="date">{new Date(article.createTime).toLocaleString()}</div>
                </div>
                <div className="item">
                    <Icon icon="ri:message-3-line"/>
                    <div className="date">{2} comments</div>
                </div>
            </div>
            <Giscus
                id="comments"
                repo="nano71/Blog-2023"
                repoId="R_kgDOKh1WEg"
                category="Announcements"
                categoryId="DIC_kwDOKh1WEs4Cacuy"
                mapping="og:title"
                reactionsEnabled="1"
                strict="0"
                emitMetadata="1"
                inputPosition="top"
                loading="lazy"
                theme="http://localhost:5173/light.css"
                lang="en"
            />
        </div>
    return (Object.keys(article).length ? articleDetails : <Loading/>);
}

export default ArticleDetails
