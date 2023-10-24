import "/src/stylesheets/content/result.less"
import {useParams} from "react-router-dom";

function Result() {
    const params = useParams()

    return (
        <div className="result">
            Sorry we couldn't find any matches for "{params.query}"
        </div>)
}
export default Result
