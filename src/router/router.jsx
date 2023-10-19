import {createHashRouter} from "react-router-dom";
import Index from "../pages/index.jsx";
import Error from "../pages/error.jsx";
import React from "react";
import Recent from "../components/content/recent.jsx";
import PopupWindow from "../components/content/popupWindow.jsx";
import ArticleDetails from "../components/content/articleDetails.jsx";
import Category from "../components/content/category.jsx";
import {getArticleContent} from "../utils/http.js";

export default createHashRouter([
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
                        async loader({params}) {
                            return await getArticleContent(parseInt(params.articleId));
                        },
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
