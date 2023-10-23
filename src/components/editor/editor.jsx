import React, {useContext, useEffect, useState} from "react";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import "/src/stylesheets/write/editor.less";
import MarkdownIt from "markdown-it";
import {Icon} from "@iconify/react";
import {Link, useNavigate} from "react-router-dom";
import hljs from 'highlight.js';
import * as http from "../../utils/http.js";
import Message from "../popup/message.jsx";
import {PopupContext} from "../popup/popup.jsx";
import Window from "../popup/window.jsx";
import ArticleDetails from "../recent/articleDetails.jsx";
import Modal from "../popup/modal.jsx";
import {useImmer} from "use-immer";
import Loading from "../content/loading.jsx";
import {sleep} from "../../utils/tools.js";
import Feedback from "../content/feedback.jsx";

let realCoverImage = ""
let coverImageDefaultValue = {url: "", uploadCompleted: false, errorMessage: ""}
export default function Editor() {
    const [content, setContent] = useState("");
    const [HTML, setHTML] = useState("");
    const [title, setTitle] = useState("")
    const [coverImage, setCoverImage] = useImmer(coverImageDefaultValue)
    const [createTime, setTime] = useState("")
    const [isFormat, setFormatStatus] = useState(false)
    const [tags, setTags] = useState([])
    const navigate = useNavigate()
    const popup = useContext(PopupContext)

    useEffect(() => {
        popup.loadComponent(<Window><ArticleDetails/></Window>)
        setTime(new Date().toLocaleString())
    }, []);

    /**
     *
     * @returns {{createTime: string, coverImage: string, description: (string|string), title: string, content: string, tags: string[]}}
     */
    function preprocessedData() {
        let matches = HTML.match(/<p>(.*?)<\/p>/g)
        if (matches)
            matches = matches[0]
        return {
            title,
            content: HTML,
            description: matches || "",
            createTime,
            coverImage: realCoverImage,
            tags
        }
    }

    function preview() {
        localStorage.setItem("draft", JSON.stringify(preprocessedData()))
        navigate("/write/preview")
        popup.show()
    }

    async function uploadImage(file) {
        setCoverImage(draft => {
            draft.url = URL.createObjectURL(file)
            draft.uploadCompleted = false
            draft.errorMessage = ""
        })
        await sleep(2000)
        realCoverImage = await http.uploadImage(file)
        setCoverImage(draft => {
            draft.uploadCompleted = true
            if (!realCoverImage) {
                draft.errorMessage = "上传失败,请重试"
            }
        })
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
        const checkMap = {
            title: "缺少标题",
            content: "缺少内容",
            description: "缺少内容",
        }
        for (let checkMapKey in checkMap) {
            if (!processedData[checkMapKey]) {
                console.log(checkMapKey);
                popup.loadTemporaryComponent(<Message/>)
                    .title(checkMap[checkMapKey])
                    .show({showMask: false, lockScroll: false, autoClose: true})
                return
            }
        }
        popup.loadTemporaryComponent(<Modal/>).title("请等待...").show()
        let result = await http.publishArticle(processedData)
        if (result) {
            console.log(result);
        } else {
            console.log(result);
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
                        {coverImage.url && !coverImage.uploadCompleted &&
                            <Loading/>
                        }
                        {coverImage.url && coverImage.errorMessage &&
                            <Feedback message={coverImage.errorMessage}/>
                        }
                        {!coverImage.url ? <div className="previewBox">
                                <Icon icon="ri:add-fill"/>
                                <span>添加文章封面</span>
                            </div> :
                            <div className={"previewImage " + (coverImage.uploadCompleted && !coverImage.errorMessage && "ok")}>
                                <img src={coverImage.url} alt=""/>
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
                <div className="button preview" onClick={preview}>preview</div>

                <div className="button" onClick={submit}>publish</div>
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
        if (url)
            return Promise.resolve(url)
        return Promise.resolve("上传失败")
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
