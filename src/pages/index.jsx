import "/src/stylesheets/index.less"
import React, {createContext, useEffect, useState} from "react";
import {getRecentArticles, getTagList} from "../utils/http.js";
import Cover from "../components/cover/cover.jsx";
import Content from "../components/content/content.jsx";
import PopupProvider from "../components/popup/popup.jsx";
import {useParams, useSearchParams} from "react-router-dom";
import {useImmer} from "use-immer";
import {routeTools} from "../router/router.jsx";

/**
 *
 * @type {{total: number, limit: number, page: number, list: Article[],isLoading:boolean}}
 */
let recentArticlesContextValue = {isLoading: false, list: [], total: 0, limit: 0, page: 0}
export const ArticleListObjectContext = createContext(recentArticlesContextValue)
export const CoverImageIndexContext = createContext(null)
export const TagListContext = createContext(null)

let fetchingArticles = false
let fetchingTagList = false
let currentPage = 1

function Index() {
    const [articleListObject, setArticleListObject] = useImmer(recentArticlesContextValue)
    const [tagList, setTagList] = useState([])
    const [coverImage, setCoverImage] = useState("")
    let [searchParams, setSearchParams] = useSearchParams();
    const params = useParams()
    /**
     * 获取文章列表数据
     * @param {string} message debug消息
     * @returns {void}
     */
    async function getArticleListData(message) {
        if (fetchingArticles || currentPage === searchParams.get("page")?.toInt())
            return
        currentPage = searchParams.get("page")?.toInt() || 1
        fetchingArticles = true
        setArticleListObject(draft => {
            draft.isLoading = true
        })
        console.log("getArticleListData", message);
        const result = await getRecentArticles(8, currentPage)
        if (result) {
            setArticleListObject(result)
        } else {
            // todo 文章列表获取失败的处理
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
        getArticleListData("initial")
        getTagListData()
    }, [])

    useEffect(() => {
        if (searchParams.has("page") && routeTools.isArticles()) {
            getArticleListData("onUpdate")
        }
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
