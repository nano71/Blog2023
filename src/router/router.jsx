import {createBrowserRouter} from "react-router-dom";
import Index from "/src/pages/index.jsx";
import ErrorView from "/src/pages/errorView.jsx";
import React from "react";
import Category from "/src/components/category/category.jsx";
import Write from "../pages/write.jsx";
import Editor from "../components/editor/editor.jsx";
import Recent from "../components/recent/recent.jsx";
import {SEOTools} from "../utils/tools.js";

const pageRouteTree = [
    {
        path: "p/:pageIndex",
        children: [
            {
                path: ":articleId",
                loader({params}) {
                    SEOTools.articleDetailsLoader(params.articleId)
                    return true
                }
            }
        ]
    },
    {
        path: ":articleId",
        loader({params}) {
            SEOTools.articleDetailsLoader(params.articleId)
            return true
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
        path: "/write",
        element: <Write/>,
        errorElement: <ErrorView/>,
        loader() {
            console.info("Write loader");
            const key = sessionStorage.getItem("authenticationCode")
            sessionStorage.removeItem("authenticationCode")
            if (key === "1742") {
                return null
            }
            throw hiddenError("Access denied, there are always some doors closed to you.")
        },
        children: [
            {
                path: "",
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
        element: <Index/>,
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
                loader() {
                    throw hiddenError("It may be accessible later, but not now.")
                },
                element: <></>,
            }
        ]
    }
]);
