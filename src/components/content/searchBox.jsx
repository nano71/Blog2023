import "/src/stylesheets/search/search.less"
import {useState} from "react";

export default function () {
    // todo 文章搜索功能
    const [input, setInput] = useState("")

    function onInput(event) {
        setInput(event.target.value)
    }

    return (
        <div className="searchBox">
            <label className={input ? " active" : ""} htmlFor="searchInput">
                <input id="searchInput" type="text" onInput={onInput}/>
            </label>
        </div>
    )
}
