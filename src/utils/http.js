import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080/api";
const baseStaticResourceURL = "http://localhost:8080"

// axios.defaults.baseURL = "https://api.example.com";

/**
 *  发起一个post请求
 * @param {string} url 请求地址
 * @param {Object} data 请求体
 * @returns {Promise<ResponseData>} 响应体包含code,data,message
 */
async function r(url, data = undefined) {
    return new Promise(resolve => {
        axios.post(url, data).then(response => {
            resolve(response.data)
        }).catch(reason => {
            console.log(url, reason.response.data);
            resolve(reason.response.data);
        })
    })

}

/**
 * 获取文章列表
 * @param {number} limit 返回多少项
 * @param {number} page 第几页, 1开始
 * @returns {Promise<ArticleListObject>} 文章列表,包含文章总数 / 失败
 */
export async function getRecentArticles(limit = 8, page = 1) {
    /**
     *
     * @type {{data: ArticlesResponseData, code: number, message: string}}
     */
    const response = await r("/getArticleList", {
        limit,
        page: page - 1
    })

    if (response.data) {
        for (let object of response.data.list) {
            sessionStorage.setItem("article-" + object.id, JSON.stringify(object))
        }
        response.data.limit = limit
        response.data.page = page
        response.data.isLoading = false
    }

    return response.data
}

/**
 * 获取技术栈标签列表
 * @returns {Promise<Tag[]|false>} 技术栈标签列表 / 失败
 */
export async function getTagList() {
    /**
     *
     * @type {{data: Tag[]|false, code: number, message: string}}
     */
    const response = await r("/getTagList")
    return response.data
}

/**
 *  获取一个文章的内容
 * @param {number} articleId 文章id
 * @returns {Promise<Article>} 文章
 */
export async function getArticleContent(articleId) {
    const response = await r("/getArticleContent", {articleId})
    return response.data
}


/**
 *  上传图片
 * @param {File} file 文件对象
 * @returns {Promise<string|false>} 上传成功后服务器返回的url / 失败
 */
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
            resolve(false)
        })
    })

}

/**
 *  发布一篇文章
 * @param {string} title 标题
 * @param {string} content 正文内容
 * @param {string} description 描述/前言
 * @param {string} createTime 发表时间
 * @param {string} coverImage 封面图
 * @param {string[]} tags 技术栈标签
 * @returns {Promise<boolean>} 发布成功 / 失败
 */
export async function publishArticle({title, content, description, createTime, coverImage, tags}) {
    const response = await r("/publishArticle", {
        title, content, description, createTime, coverImage, tags: tags.toString()
    })
    return response.data
}

/**
 * 获取文章列表
 * @param {string} query
 * @param {number} limit 返回多少项
 * @param {number} page 第几页, 1开始
 * @returns {Promise<ArticleListObject>} 文章列表,包含文章总数 / 失败
 */
export async function searchArticles(query, limit, page) {
    /**
     *
     * @type {{data: ArticlesResponseData, code: number, message: string}}
     */
    const response = await r("/searchArticles", {
        query,
        limit,
        page: page - 1
    })

    if (response.data) {
        for (let object of response.data.list) {
            sessionStorage.setItem("article-" + object.id, JSON.stringify(object))
        }
        response.data.limit = limit
        response.data.page = page
        response.data.isLoading = false
    }

    return response.data
}
