import "/src/stylesheets/article/articleDetails.less"
import {useEffect, useRef, useState} from "react";
import {updateArticleCommentCount} from "../../utils/http.js";
import Loading from "../content/loading.jsx";
import 'highlight.js/styles/atom-one-light.css';
import {Icon} from "@iconify/react";
import Giscus from "@giscus/react";
import {useImmer} from "use-immer";
import {formatDatetime, SEOTools} from "../../utils/tools.js";
import Result from "../content/result.jsx";
import {usePopup} from "../popup/popup.jsx";
import {useTip} from "../popup/tip.jsx";

let previousDataStringify = ""
let articleObject = {}

function ArticleDetails({isPreviewMode = true}) {
    /**
     *
     * @type {[Article, React.Dispatch<React.SetStateAction<any>>]}
     */
    const articleState = useImmer(Object)
    const articleDetailsRef = useRef(null);
    // const [isPreviewMode, setPreviewMode] = useState(true)
    const [isGiscusLoading, setGiscusLoading] = useState(true)
    const [article, setArticle] = articleState
    const [scrollHeight, setScrollHeight] = useState(0)
    const [loadTime] = useState(new Date().getTime())
    const popup = usePopup()
    const tip = useTip()

    useEffect(() => {
        console.log("ArticleDetails Mounted");
        loader()
        return () => {
            window.removeEventListener('message', handleMessage);
            SEOTools.reset()
        }
    }, [])

    useEffect(() => {
        if (articleDetailsRef.current) {
            setScrollHeight(articleDetailsRef.current.scrollHeight);
            SEOTools.setTitle(article.title).setDescription(article.description)
        }
    }, [article]);

    function handleMessage(event) {
        if (event.origin !== 'https://giscus.app') return;
        if (!(typeof event.data === 'object' && event.data["giscus"])) return;
        const giscusData = event.data["giscus"];
        setGiscusLoading(false)
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
            let data = JSON.parse(localStorage.getItem("draft"))
            data.content = data.html
            setArticle(data)
        } else {
            let timer = setInterval(async () => {
                console.log("timer");
                let article = sessionStorage.getItem("articleDetails")
                if (article) {
                    article = JSON.parse(article)
                    setArticle(article)
                    articleObject = article
                    sessionStorage.removeItem("articleDetails")
                    isPreviewMode || bindDiscussion()
                    clearInterval(timer)
                } else if (new Date().getTime() - loadTime > 1000) {
                    clearInterval(timer)
                    await popup.close()
                    tip.show("文章加载失败, 请重试")
                }
            }, 200)
        }
    }

    function haveScrollbar(scrollHeight) {
        return scrollHeight > window.innerHeight * 0.95 - 62
    }

    const articleDetails =
        <div className={"markdown-body articleDetails" + (haveScrollbar(scrollHeight) ? " scrollbar" : "")} ref={articleDetailsRef}>
            <h1 className="title">{article.title || "无标题"}</h1>
            <BaseInfoArea article={article}/>
            {/*<div className="description" dangerouslySetInnerHTML={{__html: article.description}}></div>*/}
            {/*{article.coverImage && <img className="image" src={article.coverImage} alt="articleCoverImage"/>}*/}
            <div className="content" dangerouslySetInnerHTML={{__html: article.content}}></div>
            <BaseInfoArea article={article}/>
            {isPreviewMode
                ? <Result
                    minHeight={"380px"}
                    result={{code: 0, message: "The comment section is not accessible in preview mode."}}/>
                : <Giscus
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
                    loading="eager"
                    theme={"https://blog.nano71.com/light.css"}
                    lang="en"
                    async
                />
            }
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
            <div className="date">{formatDatetime(article.createTime)}</div>
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
