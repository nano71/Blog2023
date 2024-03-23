import "/src/stylesheets/index.less"
import React, {createContext, useEffect, useState} from "react";
import * as http from "../utils/http.js";
import {getRecentArticles, getTagList, searchArticles, searchArticlesByTag, staticResourceURL} from "../utils/http.js";
import Cover from "../components/cover/cover.jsx";
import Content from "../components/content/content.jsx";
import PopupProvider from "../components/popup/popup.jsx";
import {useParams} from "react-router-dom";
import {useImmer} from "use-immer";
import {routeTools} from "../utils/tools.js";

const resultObjectDefault = {code: 0, message: "", data: null}
const listObjectDefault = {isLoading: true, list: [], total: 0}

const articleListObjectContextValue = {
    ...listObjectDefault, limit: 0, page: 0, result: resultObjectDefault
}
const tagListContextValue = {
    ...listObjectDefault, result: resultObjectDefault
}

const messageListContextValue = {
    ...tagListContextValue
}

const resultLimit = 6

export const ArticleListObjectContext = createContext(articleListObjectContextValue)
export const TagListObjectContext = createContext(tagListContextValue)
export const CoverImageIndexContext = createContext(null)
export const MessageListObjectContext = createContext(messageListContextValue)

export let previousRoute = "initial"
let previousAction = ""
let fetchingArticles = false

function Index() {
    const [articleListObject, setArticleListObject] = useImmer(articleListObjectContextValue)
    const [tagListObject, setTagListObject] = useImmer(tagListContextValue)
    const [messageListObject, setMessageListObject] = useImmer(messageListContextValue)
    const [coverImage, setCoverImage] = useState("")
    const params = useParams()


    useEffect(() => {
        getTagListData()
        getMessageList()
    }, [])

    /**
     * 获取留言列表数据
     * @returns {void}
     */
    async function getMessageList() {
        console.log("getTagListData");
        // let messageList = await http.getMessageList()
        let result = await http.getMessageList()
        setMessageListObject(result)
    }

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
        fetchingArticles = true
        setArticleListObject(draft => {
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

        setArticleListObject({...result})

        fetchingArticles = false
    }

    /**
     * 获取标签列表数据
     * @returns {void}
     */
    async function getTagListData() {
        console.log("getTagListData");
        let result = await getTagList()
        setTagListObject(result)
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
            case routeTools.isCategory(previousRoute) && routeTools.isArticles() && previousAction.startsWith("recent"):
            // 本次路由为为Category页
            case routeTools.isCategory():
            // 本次路由为为Guestbook页
            case routeTools.isGuestbook():
            // 上一次路由为文章页,
            case previousRoute === "article":
            // 上一次为操作页数和当前页数相同
            case previousAction === (`recent-${params.pageIndex || 1}`) && routeTools.isArticles():
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
        if (params.query?.startsWith("Tag:")) {
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
                        <TagListObjectContext.Provider value={tagListObject}>
                            <MessageListObjectContext.Provider value={{
                                ...messageListObject,
                                push: (data) => {
                                    setMessageListObject({
                                        ...messageListObject,
                                        total: messageListObject.total + 1,
                                        list: [data, ...messageListObject.list]
                                    })
                                }
                            }}>
                                <Content/>
                            </MessageListObjectContext.Provider>
                        </TagListObjectContext.Provider>
                    </CoverImageIndexContext.Provider>
                </ArticleListObjectContext.Provider>
                <img src={staticResourceURL + "mona-loading-default.gif"} style={{display: "none"}} alt="loading-GIF"/>
            </div>
        </PopupProvider>
    </>)
}

export default Index
