import {createBrowserRouter} from "react-router-dom";
import Index from "/src/pages/index.jsx";
import ErrorView from "/src/pages/errorView.jsx";
import React from "react";
import Recent from "/src/components/recent/recent.jsx";
import Category from "/src/components/category/category.jsx";
import Write from "../pages/write.jsx";
import Editor from "../components/editor/editor.jsx";

export default createBrowserRouter([
    {
        path: "/write",
        element: <Write/>,
        errorElement: <ErrorView/>,
        loader() {
            console.log("Write loader");
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
        loader() {
            console.log("Index loader");
            return null
        },
        children: [
            {
                index: true,
                element: <Recent/>,
            },
            {

                path: "article",
                element: <Recent/>,
                children: [
                    {
                        path: "page",
                        children: [
                            {
                                path: ":pageIndex",
                                element:<></>
                            }
                        ]
                    },
                    {
                        path: ":articleId",
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
