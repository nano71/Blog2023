import "/src/stylesheet/catefories.less"

function Category() {
    return (<div className="categories">
        <div className="card">
            <h2 className="title">JavaScript</h2>
            <p className="descript">JavaScript 编程语言允许你在 Web 页面上实现复杂的功能。</p>
            <div className="info"><div className="label">文章数量:</div><div className="count">48 Articles</div></div>
        </div>
        <div className="card">
            <h2 className="title">React</h2>
            <p className="descript">React 使用称为 JSX（JavaScript 和 XML）的 HTML-in-JavaScript 语法。</p>
            <div className="info"><div className="label">文章数量:</div><div className="count">2 Articles</div></div>
        </div>
        <div className="card">
            <h2 className="title">Vue</h2>
            <p className="descript">Vue 是一个现代 JavaScript 框架提。</p>
            <div className="info"><div className="label">文章数量:</div><div className="count">11 Articles</div></div>
        </div>
        <div className="card">
            <h2 className="title">Golang</h2>
            <p className="descript">Go 语言表现力强、简洁、干净、高效。</p>
            <div className="info"><div className="label">文章数量:</div><div className="count">3 Articles</div></div>
        </div>
        <div className="card">
            <h2 className="title">Python</h2>
            <p className="descript">是一种广泛使用的解释型、高级和通用的编程语言。</p>
            <div className="info"><div className="label">文章数量:</div><div className="count">1 Articles</div></div>
        </div>
        <div className="card">
            <h2 className="title">Node</h2>
            <p className="descript">Node（正式名称 Node.js）是一个开源的、跨平台的运行时环境。</p>
            <div className="info"><div className="label">文章数量:</div><div className="count">4 Articles</div></div>
        </div>
        <div className="card">
            <h2 className="title">MySQL</h2>
            <p className="descript">MySQL由Oracle提供，是一个数据库管理系统。</p>
            <div className="info"><div className="label">文章数量:</div><div className="count">6 Articles</div></div>
        </div>
    </div>)
}

export default Category
