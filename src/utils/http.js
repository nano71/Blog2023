import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080/api";

// axios.defaults.baseURL = "https://api.example.com";

async function r(url, data) {
    const response = await axios.post(url, data)
    return response.data
}

/**
 *
 * @returns {Promise<Awaited<string[]>>}
 */
export async function getRecentArticles() {
    const response = await r("/getArticleList", {
        "limit": 8,
        "page": 0
    })
    return response.data.list
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
