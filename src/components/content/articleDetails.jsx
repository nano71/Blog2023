import {useLoaderData} from "react-router-dom";
import "/src/stylesheet/articleDetails.less"

function ArticleDetails({articleId}) {
    const article = useLoaderData()
    return (
        <div className="articleDetails">
            <h1 className="title">{article.title}</h1>
            <div className="date">{new Date(article.createTime).toLocaleString()}</div>
            <div className="description">{article.description}</div>
            <img className="image" src={article.backgroundImage} alt=""/>
            <div className="content">{article.content}</div>
        </div>
    );
}

export default ArticleDetails
