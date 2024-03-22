/**
 * @typedef {Object} Article
 * @property {number} id - The unique identifier of the article.
 * @property {string} title - The title of the article.
 * @property {string} content - The content of the article.
 * @property {string} description - A brief description of the article.
 * @property {string} updateTime - The date and time when the article was last updated.
 * @property {string} createTime - The date and time when the article was created.
 * @property {string} tags - The tags associated with the article.
 * @property {string} coverImage - The URL of the cover image for the article.
 * @property {number} readCount - The number of times the article has been read.
 * @property {number} commentCount - The number of times the article has been read.
 */

/**
 * @typedef PopupComponent
 */

/**
 * @typedef {Object} popupProviderValue
 * @property {boolean} isVisible - The unique identifier of the article.
 * @property {function} setVisibility - The title of the article.
 * @property {boolean} isHiding - The content of the article.
 * @property {function} load - A brief description of the article.
 * @property {function} close - The date and time when the article was last updated.
 * @property {function} show - The date and time when the article was created.
 * @property {string} tags - The tags associated with the article.
 * @property {string} coverImage - The URL of the cover image for the article.
 * @property {number} readCount - The number of times the article has been read.
 */

/**
 * @typedef {Object} Tag
 * @property {string} name
 * @property {string} content
 * @property {number} count
 */

/**
 * @typedef {Object} ResponseData
 * @property {any} data
 * @property {string} message
 * @property {number|string} code
 */

/**
 * @typedef {Object} ArticlesResponseData
 * @property {{list:Article[],total:number ,limit:number,page:number}|false} data
 * @property {string} message
 * @property {number} code
 */

/**
 * @typedef {Object} ArticleListObject
 * @type {{total: number, limit: number, page: number, list: Article[],isLoading:boolean}|false}
 */

/**
 * @typedef {Object} MessageListObject
 * @type {{total: number, limit: number, page: number, list: MessageItem[],isLoading:boolean}|false}
 */


/**
 * @typedef {Object} MessageItem
 * @property {string} nickname
 * @property {string} url
 * @property {string} face
 * @property {string} content
 * @property {string} createTime
 */
