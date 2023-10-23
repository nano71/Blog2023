import "/src/stylesheets/search/search.less"
import {useRef, useState} from "react";
import {Icon} from "@iconify/react";
import {useNavigate} from "react-router-dom";

export default function () {
    // todo 文章搜索功能
    const input = useRef(null)
    const navigate = useNavigate()

    function search() {
        console.log(input.current.value);
        navigate("/articles/search?page=1&text=" + input.current.value)
    }

    return (
        <div className="searchBox">
            <label className={input ? " active" : ""} htmlFor="searchInput">
                <input ref={input} id="searchInput" type="text"/>
                <a onClick={search}><Icon icon="ri:search-2-line"/></a>
            </label>
        </div>
    )
}
