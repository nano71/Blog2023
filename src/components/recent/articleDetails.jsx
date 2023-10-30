import {useParams} from "react-router-dom";
import "/src/stylesheets/article/articleDetails.less"
import {useEffect, useRef, useState} from "react";
import {getArticleContent, updateArticleCommentCount} from "../../utils/http.js";
import Loading from "../content/loading.jsx";
import 'highlight.js/styles/atom-one-light.css';
import {Icon} from "@iconify/react";
import Giscus from "@giscus/react";
import {useImmer} from "use-immer";

let previousDataStringify = ""
let articleObject = {}

function ArticleDetails() {
    /**
     *
     * @type {[Article, React.Dispatch<React.SetStateAction<any>>]}
     */
    const articleState = useImmer(Object)
    const params = useParams()
    const articleDetailsRef = useRef(null);
    const [article, setArticle] = articleState
    const [scrollHeight, setScrollHeight] = useState(0)
    useEffect(() => {
        console.log("ArticleDetails Mounted");
        loader()
        return () => {
            window.removeEventListener('message', handleMessage);
        }
    }, [])

    useEffect(() => {
        if (articleDetailsRef.current) {
            setScrollHeight(articleDetailsRef.current.scrollHeight);
        }
    }, [article]);

    function handleMessage(event) {
        if (event.origin !== 'https://giscus.app') return;
        if (!(typeof event.data === 'object' && event.data["giscus"])) return;
        const giscusData = event.data["giscus"];
        const currentDataStringify = JSON.stringify(event.data["giscus"])
        if (previousDataStringify === currentDataStringify) {
            return;
        }
        previousDataStringify = currentDataStringify
        if ("discussion" in giscusData) {
            const count = giscusData.discussion?.totalCommentCount
            setArticle(draft => {
                if (count && count !== draft.commentCount) {
                    draft.commentCount = count
                    updateArticleCommentCount(draft.id, count)
                }
            })
        }
    }

    function bindDiscussion() {
        console.log("bindDiscussion");
        window.addEventListener('message', handleMessage);
        let ogTitleMeta = document.querySelector('meta[property="og:title"]')
        let giscusBacklinkMeta = document.querySelector('meta[name="giscus:backlink"]')
        ogTitleMeta.setAttribute("content", `Blog#${articleObject.id} ${articleObject.title}`);
        giscusBacklinkMeta.setAttribute("content", `https://blog.nano71.com/articles/${articleObject.id}`);
    }

    /**
     * 加载器
     * @returns {void}
     */
    async function loader() {
        console.log("article details loader");
        if (location.pathname === "/write/preview") {
            setArticle(JSON.parse(localStorage.getItem("draft")))
        } else {
            const article = await getArticleContent(parseInt(params.articleId))
            if (article) {
                setArticle(article)
                articleObject = article
                bindDiscussion()
            }
        }
    }

    function haveScrollbar(scrollHeight) {
        return scrollHeight > window.innerHeight * 0.95 - 62
    }

    const articleDetails =
        <div className={"markdown-body articleDetails" + (haveScrollbar(scrollHeight) ? " scrollbar" : "")} ref={articleDetailsRef}>
            <h1 className="title">{article.title || "无标题"}</h1>
            <BaseInfoArea article={article}/>
            <div className="description" dangerouslySetInnerHTML={{__html: article.description}}></div>
            {article.coverImage && <img className="image" src={article.coverImage} alt=""/>}
            <div className="content" dangerouslySetInnerHTML={{__html: article.content?.replace(article.description, "")}}></div>
            <BaseInfoArea article={article}/>
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
                // loading="lazy"
                theme={"https://blog.nano71.com/light.css"}
                lang="en"
                async
            />
        </div>
    return (Object.keys(article).length ? articleDetails : <Loading/>);
}

function BaseInfoArea({article}) {
    if (!article) {
        return <></>
    }
    return <div className="infoBar">
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
            <div className="date">{article.commentCount} comments</div>
        </div>
        <div className="item">
            <Icon icon="ri:eye-line"/>
            <div className="date">{article.readCount} views</div>
        </div>
    </div>
}

export default ArticleDetails
