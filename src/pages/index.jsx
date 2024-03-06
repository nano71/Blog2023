import "/src/stylesheets/index.less"
import React, {createContext, useEffect, useState} from "react";
import {getRecentArticles, getTagList, searchArticles, searchArticlesByTag, staticResourceURL} from "../utils/http.js";
import Cover from "../components/cover/cover.jsx";
import Content from "../components/content/content.jsx";
import PopupProvider from "../components/popup/popup.jsx";
import {useParams} from "react-router-dom";
import {useImmer} from "use-immer";
import {routeTools} from "../utils/tools.js";


const recentArticlesContextValue = {
    isLoading: true, list: [], total: 0, limit: 0, page: 0
}
const resultLimit = 2

const articleListRequestStateContextValue = {code: 0, message: "", data: null}
export const ArticleListObjectContext = createContext(null)
export const ArticleListRequestStateContext = createContext(articleListRequestStateContextValue)
export const CoverImageIndexContext = createContext(null)
export const TagListContext = createContext(null)
export let previousRoute = "initial"
let previousAction = ""
let fetchingArticles = false

function Index() {
    const [articleListObject, setArticleListObject] = useImmer(recentArticlesContextValue)
    const [tagList, setTagList] = useState([])
    const [coverImage, setCoverImage] = useState("")
    const [articleListRequestState, setArticleListRequestState] = useState(articleListRequestStateContextValue)
    const params = useParams()

    useEffect(() => {
        getTagListData()
    }, [])

    /**
     * 获取文章列表数据
     * @param {string} message debug消息
     * @param {string} query
     * @param {string} tag 通过标签搜索
     * @param {number|string} page
     * @returns {void}
     */
    async function getArticleListData({message = "", query = "", tag = "", page = 1} = {}) {
        if (fetchingArticles)
            return

        setArticleListObject(draft => {
            fetchingArticles = true
            draft.isLoading = true
        })
        console.info("getArticleListData", message, "query:", query, "tag:", tag, "page:", page);

        let result
        if (tag) {
            result = await searchArticlesByTag(tag, resultLimit, page)
            previousAction = `tag-${tag}-${page}`
        } else if (query) {
            result = await searchArticles(query, resultLimit, page)
            previousAction = `query-${query}-${page}`
        } else {
            result = await getRecentArticles(resultLimit, page)
            previousAction = `recent-${page}`
        }

        setArticleListObject(draft => {
            if (result[0])
                return result[0]
            else
                draft.isLoading = false
        })
        setArticleListRequestState(result[1])

        fetchingArticles = false
    }

    /**
     * 获取标签列表数据
     * @returns {void}
     */
    async function getTagListData() {
        console.log("getTagListData");
        let tagList = await getTagList()
        if (tagList) {
            setTagList(tagList)
        } else {
            // todo 技术栈标签列表获取失败的处理
        }
    }

    function routeEffectInfo() {
        return {
            previousRoute,
            previousAction,
            params
        }
    }

    function routeEffectPreCheck() {
        console.log("effect before", routeEffectInfo());
        // 本次路由为文章页, 且有上一个路由的时候, 不触发刷新,
        if (params.articleId && previousRoute !== "initial") {
            previousRoute = "article"
            return false;
        }
        return true;
    }

    function routeEffectCheck() {
        let pattern = `\\w+-\\${params.query?.split(":")[1]}+-${params.pageIndex || 1}`
        switch (true) {
            // 上一次路由为Category页,且本次路由为Articles页,且上一次操作为Recent,
            case routeTools.isCategory(previousRoute) && routeTools.isArticles() && previousAction.indexOf("recent") === 0:
            // 本次路由为为Category页
            case routeTools.isCategory():
            // 上一次路由为文章页,
            case previousRoute === "article":
            // 上一次为操作为文章列表
            case previousAction === (`recent-${params.pageIndex || 1}`):
            // 上一次操作为搜索
            case new RegExp(pattern, "g").test(previousAction):
                previousRoute = location.pathname
                return false
        }
        return true
    }

    function routeEffect() {
        console.log("effect hit", routeEffectInfo());
        if (!(previousRoute === "initial" && params.articleId))
            previousRoute = location.pathname

        let tag = undefined
        if (params.query?.indexOf("Tag:") === 0) {
            tag = params.query.replace("Tag:", "")
        }
        getArticleListData({message: "onUpdate", query: params.query, tag, page: params.pageIndex})

    }

    useEffect(() => {
        routeEffectPreCheck() && routeEffectCheck() && routeEffect()
    }, [params])

    return (<>
        <PopupProvider>
            <div className="index">
                <ArticleListObjectContext.Provider value={articleListObject}>
                    <CoverImageIndexContext.Provider value={{coverImage, setCoverImage}}>
                        <Cover/>
                        <ArticleListRequestStateContext.Provider value={articleListRequestState}>
                            <TagListContext.Provider value={tagList}>
                                <Content/>
                            </TagListContext.Provider>
                        </ArticleListRequestStateContext.Provider>
                    </CoverImageIndexContext.Provider>
                </ArticleListObjectContext.Provider>
                <img src={staticResourceURL + "mona-loading-default.gif"} style={{display: "none"}} alt=""/>
            </div>
        </PopupProvider>
    </>)
}

export default Index
