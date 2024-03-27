import React from "react"
import ReactDOM from "react-dom/client"
import "./global.less"
import {RouterProvider} from "react-router-dom";
import router from "./router/router.jsx";
import PopupProvider from "./components/popup/popup.jsx";
import TipProvider from "./components/popup/tip.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
    <RouterProvider router={router}/>
)
