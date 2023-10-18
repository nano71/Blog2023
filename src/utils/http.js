import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080/api";

// axios.defaults.baseURL = "https://api.example.com";

/**
 *
 * @returns {Promise<Awaited<string[]>>}
 */
export async function getRecentArticles() {
    const response = await axios.post("/getArticleList", {
        "limit": 6,
        "page": 0
    })
    return response.data.data.list
}

