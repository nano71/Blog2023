import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080/api";

// axios.defaults.baseURL = "https://api.example.com";

async function r(url, data) {
    const response = await axios.post(url, data)
    return response.data
}

/**
 *
 * @returns {Promise<Awaited<Article[]>>}
 */
export async function getRecentArticles() {
    const response = await r("/getArticleList", {
        "limit": 8,
        "page": 0
    })
    /**
     * @type {Article[]}
     */
    const list = response.data.list
    for (let object of list) {
        sessionStorage.setItem("article-" + object.id, JSON.stringify(object))
    }
    return list
}

/**
 *
 * @returns {Promise<Awaited<Object[]>>}
 */
export async function getTagList() {
    const response = await r("/getTagList")
    return response.data
}

/**
 *
 * @param {number} articleId
 * @returns {Promise<Object>}
 */
export async function getArticleContent(articleId) {
    const response = await r("/getArticleContent", {articleId})
    return response.data
}
