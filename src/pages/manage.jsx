import "/src/stylesheets/manage/manage.less"
import React, {createContext, useEffect, useState} from "react";
import PopupProvider from "../components/popup/popup.jsx";
import {Outlet, useNavigate} from "react-router-dom";
import {Icon} from "@iconify/react";
import {useImmer} from "use-immer";
import {articleListObjectContextValue, messageListContextValue, tagListContextValue} from "./index.jsx";
import {getMessageList, getRecentArticles, getTagList} from "../utils/http.js";

export const ArticleListObjectContextForManage = createContext(articleListObjectContextValue)
export const TagListObjectContextForManage = createContext(tagListContextValue)
export const MessageListObjectContextForManage = createContext(messageListContextValue)

function Manage() {
    const sidebarItems = ["Articles", "Category", "Guestbook", "Charts"];
    const [activeIndex, setActiveIndex] = useState(-1);
    const [articleListObject, setArticleListObject] = useImmer(articleListObjectContextValue)
    const [tagListObject, setTagListObject] = useImmer(tagListContextValue)
    const [messageListObject, setMessageListObject] = useImmer(messageListContextValue)
    const navigate = useNavigate()

    useEffect(() => {
        window.scrollTo(0, 0);
        getArticleListData()
        getMessageListData()
        getTagListData()
        activeIndexInitial()
    }, []);

    function activeIndexInitial() {
        let i = 0
        for (let sidebarItem of sidebarItems) {
            if (location.pathname.includes(sidebarItem.toLowerCase())) {
                setActiveIndex(i)
                return
            }
            i++
        }
        setActiveIndex(0)
    }

    /**
     * 获取文章列表数据
     * @returns {void}
     */
    async function getArticleListData() {
        console.log("getTagListData");
        let result = await getRecentArticles(50, 1, true)
        setArticleListObject(result)
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

    /**
     * 获取留言列表数据
     * @returns {void}
     */
    async function getMessageListData() {
        console.log("getTagListData");
        let result = await getMessageList()
        setMessageListObject(result)
    }

    function switchSidebarItem(index, value) {
        if (activeIndex === index)
            return
        setActiveIndex(index)
        navigate(value.toLowerCase())
    }

    return <>
        <PopupProvider>
            <div className="manage" id="manage">
                <h1 className="title">
                    <span>Management Console</span>
                    <a href={"/"} title="返回"><Icon icon="ri:close-fill"/></a>
                </h1>
                <div className="manageArea">
                    <div className="sidebar">
                        {sidebarItems.map((value, index) => {
                            return <div
                                key={index}
                                className={activeIndex === index ? "barItem active" : "barItem"}
                                onClick={() => switchSidebarItem(index, value)}
                            >
                                {value}
                            </div>
                        })}
                    </div>
                    <div className="content">
                        <ArticleListObjectContextForManage.Provider value={articleListObject}>
                            <TagListObjectContextForManage.Provider value={tagListObject}>
                                <MessageListObjectContextForManage.Provider value={messageListObject}>
                                    <Outlet/>
                                </MessageListObjectContextForManage.Provider>
                            </TagListObjectContextForManage.Provider>
                        </ArticleListObjectContextForManage.Provider>
                    </div>
                </div>
            </div>
        </PopupProvider>
    </>
}

export default Manage
