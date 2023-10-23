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

