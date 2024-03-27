import axios from "axios";
import {sleep} from "./tools.js";
import {ArticleListObject, MessageListObject, TagListObject} from "./type.js";

axios.defaults.baseURL = import.meta.env.DEV ? "http://localhost:9000/api" : "https://nano71.com:9000/api"
axios.defaults.withCredentials = false

const baseStaticResourceURL = import.meta.env.DEV ? "http://localhost:9000" : "https://nano71.com:9000"
export const staticResourceURL = "./"
const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=]+$/gm;

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
            console.log(url, reason);
            resolve({
                code: reason.code,
                message: reason.message,
                data: null
            });
        })
    })

}

/**
 * 获取文章列表
 * @param {number} limit 返回多少项
 * @param {number|string} page 第几页, 1开始
 * @param {boolean} isManager 是否管理员
 * @returns {Promise<ArticleListObject>} 文章列表,包含文章总数 / 失败
 */
export async function getRecentArticles(limit = 8, page = 1, isManager = false) {
    console.log("getRecentArticles");
    page = page.toInt()

    /**
     *
     * @type {{data: ArticlesResponseData, code: number, message: string}}
     */
    const response = await r((isManager ? "/manage" : "") + "/getArticleList", {
        limit,
        page: page - 1
    })

    return processResponse(response, limit, page)

}

/**
 * 获取技术栈标签列表
 * @returns {Promise<TagListObject>} 技术栈标签列表 / 失败
 */
export async function getTagList() {
    /**
     *
     * @type {{data: Tag[]|false, code: number, message: string}}
     */
    const response = await r("/getTagList")
    let returnValue = new TagListObject({
        result: response
    })
    if (response.data) {
        returnValue.list = response.data
        returnValue.total = returnValue.list.length
    }
    return returnValue
}

/**
 * 获取留言列表
 * @param {number} limit 返回多少项
 * @param {number|string} page 第几页, 1开始
 * @returns {Promise<MessageListObject>} 文章列表,包含文章总数 / 失败
 */
export async function getMessageList(limit = 10000, page = 1) {
    console.log("getMessageList");
    page = page.toInt()

    const response = await r("/getMessageList", {
        limit,
        page: page - 1
    })

    let returnValue = new MessageListObject({
        result: response
    })
    if (response.data) {
        returnValue.list = response.data.list
        returnValue.total = returnValue.list.length
    }
    return returnValue

}

/**
 *  获取一个文章的内容
 * @param {number} articleId 文章id
 * @returns {Promise<Article>} 文章
 */
export async function getArticleContent(articleId) {
    const response = await r("/getArticleContent", {articleId})
    return response?.data
}

/**
 * 删除一条留言
 * @param {number} messageId 留言id
 * @returns {Promise<boolean>} 发布成功 / 失败
 */
export async function deleteMessage(messageId) {
    const response = await r("/manage/deleteMessage", {messageId})
    return response?.data
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
 * @param {string} markdown 源数据
 * @param {string} createTime 发表时间
 * @param {string} coverImage 封面图
 * @param {string[]} tags 技术栈标签
 * @returns {Promise<boolean>} 发布成功 / 失败
 */
export async function publishArticle({title, content, description, markdown, createTime, coverImage, tags}) {
    const response = await r("/publishArticle", {
        title, content, description, createTime, coverImage, markdown, tags: tags.toString()
    })
    return response?.data
}

/**
 * 添加一条标签
 * @param {string} name 名称
 * @param {string} content 内容
 * @returns {Promise<boolean>} 发布成功 / 失败
 */
export async function addCategory({name, content}) {
    const response = await r("/manage/addCategory", {
        name, content
    })
    return response?.data
}

/**
 *  更新一篇文章
 * @param {number} id
 * @param {string} title 标题
 * @param {string} content 正文内容
 * @param {string} description 描述/前言
 * @param {string} markdown 源数据
 * @param {string} createTime 发表时间
 * @param {string} coverImage 封面图
 * @param {string[]} tags 技术栈标签
 * @returns {Promise<boolean>} 更新成功 / 失败
 */
export async function updateArticle({id, title, content, description, markdown, createTime, coverImage, tags}) {
    const response = await r("/updateArticle", {
        id, title, content, description, createTime, coverImage, markdown, tags: tags.toString()
    })
    return response.data
}

/**
 *  发布一个留言
 * @param {string} nickname 昵称
 * @param {string} url 网址
 * @param {string} face 头像
 * @param {string} content 内容
 * @param {string} createTime 发表时间
 * @returns {Promise<boolean>} 发布成功 / 失败
 */
export async function leaveMessage({nickname, url, face, content, createTime}) {
    const response = await r("/leaveMessage", {
        nickname, url, face, content, createTime
    })
    return response.data
}

/**
 * 获取文章列表
 * @param {string} query
 * @param {number} limit 返回多少项
 * @param {number|string} page 第几页, 1开始
 * @returns {Promise<ArticleListObject>} 文章列表,包含文章总数 / 失败
 */
export async function searchArticles(query, limit, page) {
    console.log("searchArticles");
    page = page.toInt()
    /**
     *
     * @type {{data: ArticlesResponseData, code: number, message: string}}
     */
    const response = await r("/searchArticles", {
        query,
        limit,
        page: page - 1
    })
    return processResponse(response, limit, page)
}

/**
 * 获取文章列表, 通过Tag
 * @param {string} tag
 * @param {number} limit 返回多少项
 * @param {number|string} page 第几页, 1开始
 * @returns {Promise<ArticleListObject>} 文章列表,包含文章总数 / 失败
 */
export async function searchArticlesByTag(tag, limit, page) {
    console.log("searchArticlesByTag");
    page = page.toInt()
    /**
     *
     * @type {{data: ArticlesResponseData, code: number, message: string}}
     */
    const response = await r("/searchArticlesByTag", {
        tag,
        limit,
        page: page - 1
    })
    return processResponse(response, limit, page)
}

/**
 * 数据后处理
 * @param {ResponseData} response
 * @param {number} limit 返回多少项
 * @param {number} page 第几页, 1开始
 * @return {ArticleListObject}
 */
function processResponse(response, limit, page) {

    let returnValue = new ArticleListObject({
        result: response,
        limit,
        page
    })
    let {list, total} = response.data
    if (response.data && total) {
        for (let object of list) {
            sessionStorage.setItem("article-" + object.id, JSON.stringify(object))
        }
        returnValue.list = list
        returnValue.total = total
    }
    return returnValue
}

/**
 *
 * @param {number|string} articleId
 * @param {number|string} count
 * @return {void}
 */
export async function updateArticleCommentCount(articleId, count) {
    const response = await r("/updateArticleCommentCount", {
        articleId: articleId.toInt(),
        count: count.toInt()
    })
}


export function isValidUrl(url) {

    return urlRegex.test(url);
}
