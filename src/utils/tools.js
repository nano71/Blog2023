export function scrollToTop(scrollDuration = 200) {
    const scrollStep = -window.scrollY / (scrollDuration / 15);

    const scrollInterval = setInterval(() => {
        if (window.scrollY !== 0) {
            window.scrollBy(0, scrollStep);
        } else {
            clearInterval(scrollInterval);
        }
    }, 15);
}

/**
 * 延迟执行
 * @param {number} delay 延迟多少毫秒
 * @returns {Promise<unknown>}
 */
export const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

String.prototype.toInt = function () {
    return parseInt(this.replace(/\D+/g, "") || 0)
}
Number.prototype.toInt = function () {
    return this
}
const consoleLog = console.log
const consoleInfo = console.info
console.log = function (...args) {
    consoleLog(...args)
}
console.info = function (...args) {
    consoleInfo("%c" + (args.join(" ")), "padding:2px 4px;color:white;background:dodgerblue;")
}

let p = _ => location.hash
export const routeTools = {
    root: "/",
    articles: "/articles",
    default: "/articles",
    search: "/search",
    category: "/category",
    articleDetails(id) {
        return this.articles + "/" + id
    },
    searchArticle(search) {
        return this.search + "/" + search
    },
    isSearch() {
        return p().indexOf("#" + this.search) === 0
    },
    isCategory(path) {
        if (path)
            return path.indexOf("#" + this.category) === 0

        return p().indexOf("#" + this.category) === 0
    },
    isSearchByTag(params) {
        return params.query.indexOf("Tag:") === 0
    },
    /**
     *
     * @param {number|string} current
     * @param {number|string} target
     */
    isCurrentIndex(current, target) {
        return current.toInt() === target.toInt()
    },
    isRoot() {
        return p() === this.root
    },
    isDefault() {
        return p() === ("#" + this.root) || p() === ("#" + this.default)
    },
    front() {
        if (this.isDefault())
            return this.default
        return p().match(/\w+/g)[0]
    },
    isArticles() {
        return p().indexOf("#" + this.articles) === 0 || p() === this.root
    }

}
