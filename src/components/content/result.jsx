import "/src/stylesheets/content/result.less"
import {useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {ArticleListRequestStateContext} from "../../pages/index.jsx";

function Result() {
    const params = useParams()
    const articleRequestState = useContext(ArticleListRequestStateContext)
    const [view, setView] = useState(<></>)

    function notFound() {
        console.log("notFound");
        return <div className="notFound">
            <div className="message">Sorry we couldn't find any matches for "{params.query}"</div>
        </div>
    }
    function forbidden(){
        console.log("forbidden");
        return <div>
            <div className="message">Your IP address is banned.</div>
        </div>
    }
    function timeout() {
        console.log("timeout");

        function retry() {
            location.reload()
        }

        return <div className="timeout">
            <div className="message">The article list request timed out, please <a onClick={retry}>try again</a>.</div>
        </div>
    }

    useEffect(() => {
        console.log("result render");
        switch (articleRequestState.code) {
            case 504:
                setView(timeout())
                break
            case 403:
                setView(forbidden())
                break
            default:
                setView(notFound())
        }
    }, []);

    return (
        <div className="result">
            {view}
        </div>)
}

export default Result
