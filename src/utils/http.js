import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080/api";
const baseStaticResourceURL = "http://localhost:8080"

// axios.defaults.baseURL = "https://api.example.com";

/**
 *
 * @param {string} url
 * @param {Object} data
 * @returns {Promise<{data:any,code:number,message:string}>}
 */
async function r(url, data = undefined) {
    return new Promise(resolve => {
        axios.post(url, data).then(response => {
            resolve(response.data)
            console.log(response.data);
        }).catch(reason => {
            console.log(reason.response.data);
            resolve(reason.response.data);
        })
    })

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


export async function uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);

    return new Promise(resolve => {
        axios.post("/uploadImage", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then(response => {
            resolve(baseStaticResourceURL + response.data.data)
        }).catch(reason => {
            resolve("上传失败")
        })
    })

}

/**
 *
 * @param {string} title
 * @param {string} content
 * @param {string} description
 * @param {string} createTime
 * @param {string} coverImage
 * @param {string[]} tags
 * @returns {Promise<number>}
 */
export async function publishArticle({title, content, description, createTime, coverImage, tags}) {
    const response = await r("/publishArticle", {
        title, content, description, createTime, coverImage, tags: tags.toString()
    })
    return response.data.data
}
