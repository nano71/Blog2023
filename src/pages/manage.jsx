import "/src/stylesheets/manage/manage.less"
import React, {createContext, useEffect, useState} from "react";
import {Outlet, useNavigate} from "react-router-dom";
import {Icon} from "@iconify/react";
import {useImmer} from "use-immer";
import {articleListObjectContextValue, messageListContextValue, tagListContextValue} from "./index.jsx";
import {getMessageList, getRecentArticles, getTagList} from "../utils/http.js";
import EventBus from "../utils/bus.js";

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

        EventBus.on("update", handleUpdateListEvent);

        return () => {
            EventBus.off("update", handleUpdateListEvent);
        };
    }, []);

    function handleUpdateListEvent(targetList) {
        switch (targetList) {
            case "articleList":
                getArticleListData()
                break
            case "tagList":
                getTagListData()
                break
            case "messageList":
                getMessageListData()
                break
        }
    }


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
        setArticleListObject(draft => {
            draft.isLoading = true
        })
        console.log("getTagListData");
        let result = await getRecentArticles(50, 1, true)
        setArticleListObject(result)
    }

    /**
     * 获取标签列表数据
     * @returns {void}
     */
    async function getTagListData() {
        setTagListObject(draft => {
            draft.isLoading = true
        })
        console.log("getTagListData");
        let result = await getTagList()
        setTagListObject(result)
    }

    /**
     * 获取留言列表数据
     * @returns {void}
     */
    async function getMessageListData() {
        setMessageListObject(draft => {
            draft.isLoading = true
        })
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

    return <div className="manage" id="manage">
        <h1 className="title">
            <span>Management Console</span>
            <a href={"/"} title="返回"><Icon icon="ri:close-fill"/></a>
        </h1>
        <div className="manageArea">
            <div className="sidebar">
                {sidebarItems.map((value, index) => <div
                        key={index}
                        className={activeIndex === index ? "barItem active" : "barItem"}
                        onClick={() => switchSidebarItem(index, value)}
                    >
                        {value}
                    </div>
                )}
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
}

export default Manage
