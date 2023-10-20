import {createHashRouter} from "react-router-dom";
import Index from "/src/pages/index.jsx";
import Error from "/src/pages/error.jsx";
import React from "react";
import Recent from "/src/components/recent/recent.jsx";
import PopupWindow from "/src/components/content/popupWindow.jsx";
import ArticleDetails from "/src/components/recent/articleDetails.jsx";
import Category from "/src/components/category/category.jsx";
import {getArticleContent} from "../utils/http.js";
import Write from "../pages/write.jsx";
import Editor from "../components/editor/editor.jsx";

export default createHashRouter([
    {
        path: "/write",
        element: <Write/>,
        errorElement: <Error/>,
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
        errorElement: <Error/>,
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
