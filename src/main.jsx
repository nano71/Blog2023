import React from "react"
import ReactDOM from "react-dom/client"
import "./global.less"
import {RouterProvider} from "react-router-dom";
import router from "./router/router.jsx";

String.prototype.toInt = function () {
    return parseInt(this.replace(/\D+/g, "") || 0)
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <RouterProvider router={router}/>
)
