import {createBrowserRouter} from "react-router-dom";
import Index from "/src/pages/index.jsx";
import ErrorView from "/src/pages/errorView.jsx";
import React from "react";
import Category from "/src/components/category/category.jsx";
import Write from "../pages/write.jsx";
import Editor from "../components/editor/editor.jsx";
import Recent from "../components/recent/recent.jsx";

let p = _ => location.pathname
export const routeTools = {
    root: "/",
    articles: "/articles",
    default: "/articles",
    search: "/search",
    articleDetails(id) {
        return this.articles + "/" + id
    },
    searchArticle(search) {
        return this.search + "/" + search
    },
    isSearch(path) {
        if (path)
            return path.indexOf(this.search) === 0
        return p().includes(this.search)
    },
    isDefault() {
        return p() === this.root || p() === this.default
    },
    front() {
        if (this.isDefault())
            return this.default
        return p().match(/\w+/g)[0]
    },
    isArticles() {
        return p().indexOf(this.articles) === 0 || p() === this.root
    }

}

function hiddenError(errorMessage) {
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
                children: [
                    {
                        path: "p/:pageIndex",
                        element: <></>
                    },
                    {
                        path: ":articleId",
                        element: <></>
                    }
                ]
            },
            {
                path: "search",
                element: <Recent/>,
                children: [
                    {
                        path: ":query",
                        element: <></>,
                        children: [
                            {
                                path: "p/:pageIndex",
                                element: <></>
                            }
                        ]
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
