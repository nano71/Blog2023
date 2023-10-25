import "/src/stylesheets/index.less"
import React, {createContext, useEffect, useState} from "react";
import {getRecentArticles, getTagList, searchArticles, searchArticlesByTag} from "../utils/http.js";
import Cover from "../components/cover/cover.jsx";
import Content from "../components/content/content.jsx";
import PopupProvider from "../components/popup/popup.jsx";
import {useLocation, useParams} from "react-router-dom";
import {useImmer} from "use-immer";
import {routeTools} from "../router/router.jsx";


const recentArticlesContextValue = {
    isLoading: true, list: [], total: 0, limit: 0, page: 0
}
const articleListRequestStateContextValue = {code: 0, message: "", data: null}
export const ArticleListObjectContext = createContext(recentArticlesContextValue)
export const ArticleListRequestStateContext = createContext(articleListRequestStateContextValue)
export const CoverImageIndexContext = createContext(null)
export const TagListContext = createContext(null)

let fetchingArticles = false
let fetchingTagList = false
let currentPageIndex = 1
const resultLimit = 8
let previousRoutePath = ""

function Index() {
    const [articleListObject, setArticleListObject] = useImmer(recentArticlesContextValue)
    const [tagList, setTagList] = useState([])
    const [coverImage, setCoverImage] = useState("")
    const [articleListRequestState, setArticleListRequestState] = useState(articleListRequestStateContextValue)

    const params = useParams()
    const location = useLocation()

    /**
     * 获取文章列表数据
     * @param {string} message debug消息
     * @param {boolean} byTag 通过标签搜索
     * @returns {void}
     */
    async function getArticleListData({message = "", byTag = false} = {}) {
        if (fetchingArticles)
            return
        fetchingArticles = true
        setArticleListObject(draft => {
            draft.isLoading = true
        })
        message && console.log("getArticleListData", message);
        currentPageIndex = parseInt(params.pageIndex || 1)

        let result
        let query = params.query
        if (query) {
            if (byTag) {
                result = await searchArticlesByTag(query.replace("Tag:", ""), resultLimit, currentPageIndex)
            } else {
                result = await searchArticles(query, resultLimit, currentPageIndex)
            }
        } else {
            result = await getRecentArticles(resultLimit, currentPageIndex)
        }
        if (result[0]) {
            setArticleListObject(result[0])
        } else {
            setArticleListObject(draft => {
                draft.isLoading = false
            })
            setArticleListRequestState(result[1])
        }
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
            getArticleListData({message: "onUpdate", query: params.query, byTag: params.query.indexOf("Tag:") === 0})
        else
            getArticleListData({message: "initial"})
        getTagListData()
    }, [])

    useEffect(() => {
        console.log("location.key", location.key);
        if (isSearchable()) {
            getArticleListData({message: "onUpdate search", byTag: routeTools.isSearchByTag(params)})
        } else if (routeTools.isSearch(previousRoutePath) || haveIndex() && routeTools.isArticles() && !routeTools.isCurrentIndex(currentPageIndex, params.pageIndex)) {
            getArticleListData({message: "onUpdate recent"})
        }
        previousRoutePath = location.pathname
    }, [params])

    function isSearchable() {
        return !!params.query && routeTools.isSearch()
    }

    function haveIndex() {
        return !!params.pageIndex
    }


    return (<>
        <PopupProvider>
            <div className="index">
                <ArticleListObjectContext.Provider value={articleListObject}>
                    <CoverImageIndexContext.Provider value={{coverImage, setCoverImage}}>
                        <Cover/>
                        <ArticleListRequestStateContext.Provider value={articleListRequestState}>
                            <TagListContext.Provider value={tagList}><Content/></TagListContext.Provider>
                        </ArticleListRequestStateContext.Provider>
                    </CoverImageIndexContext.Provider>
                </ArticleListObjectContext.Provider>
            </div>
        </PopupProvider>
    </>)
}

export default Index
