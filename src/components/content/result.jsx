import "/src/stylesheets/content/result.less"
import {useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {ArticleListRequestStateContext} from "../../pages/index.jsx";

function Result() {
    const params = useParams()
    const articleRequestState = useContext(ArticleListRequestStateContext)
    const [view, setView] = useState(<></>)

    function notFound() {
        return <div className="notFound">
            <div className="message">Sorry we couldn't find any matches for "{params.query}"</div>
        </div>
    }

    function timeout() {
        function retry() {

        }

        return <div className="timeout">
            <div className="message">The article list request timed out, please <a onClick={retry}>try again</a>.</div>
        </div>
    }

    useEffect(() => {
        switch (articleRequestState.code) {
            case 504:
                setView(timeout())
                break
            default:
                setView(notFound())
        }
        console.log(articleRequestState);
    }, []);
    return (
        <div className="result">
            {view}
        </div>)
}

export default Result
