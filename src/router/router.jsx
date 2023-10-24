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
            const errorMessage = "You don't have permission to perform actions on this page"
            const permissionError = new Error(errorMessage)
            permissionError.stack = undefined
            permissionError.cause = undefined
            throw permissionError
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
            }
        ]
    }
]);
