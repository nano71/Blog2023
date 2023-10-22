import React, {useContext, useEffect, useState} from "react";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import "/src/stylesheet/editor.less";
import MarkdownIt from "markdown-it";
import {Icon} from "@iconify/react";
import {Link, useNavigate} from "react-router-dom";
import hljs from 'highlight.js';
import * as http from "../../utils/http.js";
import Message from "../popup/message.jsx";
import {PopupContext} from "../popup/popup.jsx";
import Window from "../popup/window.jsx";
import ArticleDetails from "../recent/articleDetails.jsx";

export default function Editor() {
    const [content, setContent] = useState("");
    const [HTML, setHTML] = useState("");
    const [title, setTitle] = useState("")
    const [coverImage, setCoverImage] = useState("")
    const [createTime, setTime] = useState("")
    const [isFormat, setFormatStatus] = useState(false)
    const [tags, setTags] = useState([])
    const navigate = useNavigate()
    const popup = useContext(PopupContext)
    useEffect(() => {
        setTime(new Date().toLocaleString())
        console.log(1);
    }, []);

    /**
     *
     * @returns {{createTime: string, coverImage: string, description: (string|string), title: string, content: string, tags: string[]}}
     */
    function preprocessedData() {
        return {
            title,
            content: HTML,
            description: HTML.match(/<p>(.*?)<\/p>/g)[0] || "",
            createTime,
            coverImage,
            tags
        }
    }

    function preview() {
        localStorage.setItem("draft", JSON.stringify(preprocessedData()))
        navigate("/write/preview")
        popup.loadTemporaryComponent(<Window><ArticleDetails/></Window>).show()
    }

    async function uploadImage(file) {
        const url = await http.uploadImage(file)
        setCoverImage(url)
    }

    function addTag(event) {
        if (["Enter", "Space", "NumpadEnter"].includes(event.code) && tags.length < 3) {
            const string = event.target.value
            if (!string) {
                return
            }
            if (!tags.includes(string)) {
                setTags(tags.concat(event.target.value.split(" ")[0]))
            }
            setTimeout(() => {
                event.target.value = ""
            }, 0)
        }
    }

    async function submit() {
        const processedData = preprocessedData()
        if (!processedData.title) {
            popup.loadTemporaryComponent(<Message/>)
                .title("缺少标题")
                .show({showMask: false, lockScroll: false, autoClose: true})
            return
        }
        if (await http.publishArticle(processedData)) {
            console.log(1);
        } else {
            console.log(2);
        }
    }

    function formatDateTime(event) {
        if (event.code.includes("Enter")) {
            const value = event.target.value
            if (!value) {
                setTime(new Date().toLocaleString());
                setFormatStatus(true)
                return
            }
            setTime(new Date(value).toLocaleString());
            setFormatStatus(true)
        } else {
            setFormatStatus(false)
        }
    }

    return <div className="editor">
        <h1 className="title"><span>Write an article</span>
            <Link to={"/"} title="返回"><Icon icon="ri:close-fill"/></Link></h1>
        <div className="inputArea">
            <input onChange={e => setTitle(e.target.value)}
                   type="text" className="titleInput" placeholder="请输入标题"/>
            <div className="previewButton" title="预览" onClick={preview}><Icon icon="ri:bill-line"/></div>
            <MarkdownEditor value={content} setValue={setContent} setOut={setHTML}/>
            <div className="options">
                <div className="item">
                    <div className="label">文章的封面</div>
                    <div className="inputBox">
                        {!coverImage ? <div className="previewBox">
                                <Icon icon="ri:add-fill"/>
                                <span>添加文章封面</span>
                            </div> :
                            <div className="previewImage">
                                <img src={coverImage} alt=""/>
                            </div>
                        }
                        <input type="file" className="imgUpload" alt={""} accept={"image/*"}
                               onChange={e => uploadImage(e.target.files[0])}/>
                        <div className="tip">图片上传格式支持 JPEG、JPG、PNG</div>
                    </div>
                </div>
                <div className="item">
                    <div className="label">技术栈标签</div>
                    <div className="inputBox">
                        <input type="text" placeholder="回车或者空格添加标签" className="dateTime"
                               onKeyDown={addTag}/>
                        {!!tags.length && <div className="tags">
                            {tags.map((value, index) =>
                                <div className="tag"
                                     title={"删除" + value}
                                     onClick={() =>
                                         setTags(tags.filter((v, i) => i !== index))}>
                                    {value}
                                    <Icon icon="ri:close-fill"/>
                                </div>
                            )}
                        </div>}
                        <div className="tip">技术栈标签最多添加三个</div>

                    </div>
                </div>
                <div className="item">
                    <div className="label">自定义时间</div>
                    <div className="inputBox">
                        <input type="text" value={createTime} className="dateTime"
                               onChange={e => setTime(e.target.value)}
                               onKeyDown={formatDateTime}/>
                        <div className="tip">按回车键, 自动格式化时间</div>
                    </div>
                </div>

            </div>
            <div className="buttons">
                <div className="button" onClick={submit}>Submit</div>
            </div>
        </div>

    </div>
}

function MarkdownEditor({value, setValue, setOut}) {
    const mdParser = new MarkdownIt({
        html: true,
        linkify: true,
        highlight(str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                return hljs.highlight(lang, str).value;
            }
            return hljs.highlightAuto(str).value;
        }
    });

    const plugins = ["font-bold", "font-italic", "font-underline", "font-strikethrough", "list-unordered", "list-ordered", "block-quote", "block-code-inline", "block-code-block", "image", "link", "logger"]

    useEffect(() => {
        setValue(localStorage.getItem("markdownInputHistory") || "")
        setOut(localStorage.getItem("markdownOutHistory") || "")
    }, []);

    function handleEditorChange({html, text}) {
        setValue(text)
        setOut(html)
        localStorage.setItem("markdownInputHistory", text)
        localStorage.setItem("markdownOutHistory", html)
    }

    async function onImageUpload(file) {
        const url = await http.uploadImage(file)
        console.log(url);
        return Promise.resolve(url)
    }

    return <MdEditor
        id="markdownEditor"
        style={{height: "700px", border: 0}}
        plugins={plugins}
        value={value}
        shortcuts={true}
        markdownClass="editorContainer"
        placeholder="Compose an epic..."
        renderHTML={text => mdParser.render(text)}
        view={{menu: true, md: true, html: false}}
        onImageUpload={onImageUpload}
        onChange={handleEditorChange}/>
}
