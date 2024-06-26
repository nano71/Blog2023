import {createBrowserRouter} from "react-router-dom";
import Index from "/src/pages/index.jsx";
import ErrorView from "/src/pages/errorView.jsx";
import React from "react";
import Category from "/src/components/category/category.jsx";
import Write from "../pages/write.jsx";
import Editor from "../components/write/editor.jsx";
import Recent from "../components/recent/recent.jsx";
import {SEOTools} from "../utils/tools.js";
import Guestbook from "../components/guestbook/guestbook.jsx";
import Manage from "../pages/manage.jsx";
import ArticleListForManage from "../components/manage/articleList.jsx";
import TagListForManage from "../components/manage/tagList.jsx";
import MessageListForManage from "../components/manage/messageList.jsx";
import Provider from "../pages/provider.jsx";
import Charts from "../components/manage/charts.jsx";

const pageRouteTree = [
    {
        path: "p/:pageIndex",
        children: [
            {
                path: ":articleId",
                async loader({params}) {
                    let ok = await SEOTools.articleDetailsLoader(params.articleId)
                    if (ok)
                        return true
                    throw hiddenError("The article is non-existent.")
                }
            }
        ]
    },
    {
        path: ":articleId",
        async loader({params}) {
            let ok = await SEOTools.articleDetailsLoader(params.articleId)
            if (ok)
                return true
            throw hiddenError("The article is non-existent.")
        }
    }
]


export function hiddenError(errorMessage) {
    const error = new Error(errorMessage)
    error.stack = undefined
    error.cause = undefined
    return error
}

export default createBrowserRouter([
    {
        path: "/manage",
        element: <Provider><Manage/></Provider>,
        errorElement: <ErrorView/>,
        loader() {
            console.info("Manage loader");
            const key = sessionStorage.getItem("authenticationCode")
            sessionStorage.removeItem("authenticationCode")
            if (import.meta.env.DEV)
                return null
            if (key === "1742") {
                return null
            }
            throw hiddenError("Access denied, There are always some doors closed to you.")
        },
        children: [
            {
                index: true,
                element: <ArticleListForManage/>
            },
            {
                path: "articles",
                element: <ArticleListForManage/>
            },
            {
                path: "category",
                element: <TagListForManage/>,
            },
            {
                path: "guestbook",
                element: <MessageListForManage/>,
                // loader() {
                //     throw hiddenError("It may be accessible later, but not now.")
                // },
            },
            {
                path: "charts",
                element: <Charts/>,
                // loader() {
                //     throw hiddenError("It may be accessible later, but not now.")
                // },
            }
        ]
    },
    {
        path: "/write",
        element: <Provider><Write/></Provider>,
        errorElement: <ErrorView/>,
        loader() {
            console.info("Write loader");
            const key = sessionStorage.getItem("authenticationCode")
            sessionStorage.removeItem("authenticationCode")
            if (import.meta.env.DEV)
                return null
            if (key === "1742") {
                return null
            }
            throw hiddenError("Access denied, There are always some doors closed to you.")
        },
        children: [
            {
                index: true,
                element: <Editor/>
            },
            {
                path: "preview",
                element: <Editor/>
            }
        ]
    },
    {
        path: "/",
        element: <Provider><Index/></Provider>,
        errorElement: <ErrorView/>,
        loader: () => {
            console.info("Index loader");
            return null
        },
        children: [
            {
                index: true,
                element: <Recent/>,
            },
            {
                path: "articles",
                element: <Recent/>,
                children: pageRouteTree
            },
            {
                path: "search",
                element: <Recent/>,
                children: [
                    {
                        path: ":query",
                        element: <></>,
                        children: pageRouteTree,
                    }
                ]
            },
            {
                path: "category",
                element: <Category/>,
            },
            {
                path: "guestbook",
                element: <Guestbook/>,
                // loader() {
                //     throw hiddenError("It may be accessible later, but not now.")
                // },
            }
        ]
    }
]);
