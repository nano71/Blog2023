import "/src/stylesheets/index.less"
import React, {createContext, useEffect, useState} from "react";
import {getRecentArticles, getTagList, searchArticles} from "../utils/http.js";
import Cover from "../components/cover/cover.jsx";
import Content from "../components/content/content.jsx";
import PopupProvider from "../components/popup/popup.jsx";
import {useLocation, useParams} from "react-router-dom";
import {useImmer} from "use-immer";
import {routeTools} from "../router/router.jsx";


let recentArticlesContextValue = {isLoading: true, list: [], total: 0, limit: 0, page: 0}
export const ArticleListObjectContext = createContext(recentArticlesContextValue)
export const CoverImageIndexContext = createContext(null)
export const TagListContext = createContext(null)

let fetchingArticles = false
let fetchingTagList = false
let pageIndex = 1
const resultLimit = 8
let previousRoutePath = ""

function Index() {
    const [articleListObject, setArticleListObject] = useImmer(recentArticlesContextValue)
    const [tagList, setTagList] = useState([])
    const [coverImage, setCoverImage] = useState("")
    const params = useParams()
    const location = useLocation()

    /**
     * 获取文章列表数据
     * @param {string} message debug消息
     * @param {string} query 搜索文本
     * @returns {void}
     */
    async function getArticleListData({message = "", query = ""} = {}) {
        if (fetchingArticles)
            return
        fetchingArticles = true
        setArticleListObject(draft => {
            draft.isLoading = true
        })
        message && console.log("getArticleListData", message);
        pageIndex = parseInt(params.pageIndex || 1)
        /**
         * @type {ArticleListObject}
         */
        let result
        if (query) {
            result = await searchArticles(query, resultLimit, pageIndex)
        } else {
            result = await getRecentArticles(resultLimit, pageIndex)
        }
        if (result) {
            setArticleListObject(result)
        } else {
            // todo 文章列表获取失败的处理
        }
        console.log(result);
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

    useEffect(() => {
        if (params.query && routeTools.isSearch())
            getArticleListData({message: "onUpdate", query: params.query})
        else
            getArticleListData({message: "initial"})
        getTagListData()
    }, [])

    useEffect(() => {
        console.log("location.key", location.key);
        if (params.query && routeTools.isSearch()) {
            getArticleListData({message: "onUpdate search", query: params.query})
        } else if (routeTools.isSearch(previousRoutePath) || params.pageIndex && routeTools.isArticles() && (pageIndex !== params.pageIndex.toInt())) {
            getArticleListData({message: "onUpdate recent"})
        }
        previousRoutePath = location.pathname
    }, [params])


    return (<>
        <PopupProvider>
            <div className="index">
                <ArticleListObjectContext.Provider value={articleListObject}>
                    <CoverImageIndexContext.Provider value={{coverImage, setCoverImage}}>
                        <Cover/>
                        <TagListContext.Provider value={tagList}><Content/></TagListContext.Provider>
                    </CoverImageIndexContext.Provider>
                </ArticleListObjectContext.Provider>
            </div>
        </PopupProvider>
    </>)
}

export default Index
