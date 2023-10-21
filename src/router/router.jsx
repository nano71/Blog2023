import {createHashRouter, json} from "react-router-dom";
import Index from "/src/pages/index.jsx";
import ErrorPage from "/src/pages/error.jsx";
import React from "react";
import Recent from "/src/components/recent/recent.jsx";
import PopupWindow from "/src/components/content/popupWindow.jsx";
import ArticleDetails from "/src/components/recent/articleDetails.jsx";
import Category from "/src/components/category/category.jsx";
import Write from "../pages/write.jsx";
import Editor from "../components/editor/editor.jsx";

export default createHashRouter([
    {
        path: "/write",
        element: <Write/>,
        errorElement: <ErrorPage/>,
        loader() {
            let key = prompt("请输入密钥")
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
                element: <><Editor/><PopupWindow><ArticleDetails/></PopupWindow></>
            }
        ]
    },
    {
        path: "/",
        element: <Index/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: "article",
                element: <Recent/>,
                children: [
                    {
                        path: ":articleId",
                        element: <PopupWindow><ArticleDetails/></PopupWindow>
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
