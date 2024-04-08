import React, {useContext, useEffect, useState} from "react";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import "/src/stylesheets/write/editor.less";
import MarkdownIt from "markdown-it";
import {Icon} from "@iconify/react";
import {useNavigate} from "react-router-dom";
import hljs from 'highlight.js';
import * as http from "../../utils/http.js";
import {usePopup} from "../popup/popup.jsx";
import Window from "../popup/window.jsx";
import ArticleDetails from "../recent/articleDetails.jsx";
import Modal from "../popup/modal.jsx";
import {useImmer} from "use-immer";
import Loading from "../content/loading.jsx";
import {formatDatetime, sleep} from "../../utils/tools.js";
import Feedback from "../content/feedback.jsx";
import {useTip} from "../popup/tip.jsx";

import EventBus from "../../utils/bus.js";

let realCoverImage = ""
let id = 0
let coverImageDefaultValue = {url: "", uploadCompleted: false, errorMessage: ""}
let isFormatDateTime = true
let saveTimer
export default function Editor({isEditMode = false}) {
    const [markdown, setMarkdown] = useState("");
    const [html, setHTML] = useState("");
    const [title, setTitle] = useState("")
    const [coverImage, setCoverImage] = useImmer(coverImageDefaultValue)
    const [time, setTime] = useState(formatDatetime())
    const [description, setDescription] = useState("")
    const [tags, setTags] = useState([])

    const navigate = useNavigate()
    const popup = usePopup()
    const tip = useTip()

    useEffect(() => {
        popup.loadComponent(<Window><ArticleDetails/></Window>)
        readLocalStorageData()
    }, []);

    useEffect(() => {
        save()
    }, [time, title, coverImage, html, tags])

    useEffect(() => {
        let matches = html?.match(/<p>.*?<\/p>/gs)
        matches && setDescription(matches[0])
    }, [html])

    function readLocalStorageData() {
        console.info("readLocalStorageData");
        let data
        if (isEditMode) {
            data = JSON.parse(sessionStorage.getItem("draft"))
            id = data.id
        } else
            data = JSON.parse(localStorage.getItem("draft"))
        if (!data)
            return
        setTitle(data.title)
        data.time && setTime(data.time)
        data.coverImage && setCoverImage(draft => {
            draft.uploadCompleted = true
            draft.url = data.coverImage
            realCoverImage = data.coverImage
        })
        setHTML(data.html)
        setMarkdown(data.markdown)
        setTags(data.tags)
    }

    function template() {
        return {
            title,
            html,
            markdown,
            description,
            coverImage: realCoverImage,
            time,
            tags
        }
    }

    function save() {
        saveTimer && clearTimeout(saveTimer)
        saveTimer = setTimeout(() => {
            console.log("autosave");
            if (isEditMode)
                return
            localStorage.setItem("draft", JSON.stringify(template()))
        }, 1000)
    }

    function preview() {
        navigate("/write/preview")
        popup.show({
            onClose() {
                navigate(-1)
            }
        })
    }

    async function uploadImage(e) {
        console.log(e);
        let file = e.target.files[0]
        e.target.value = ""
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
                draft.errorMessage = "上传失败, 请重试"
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

    /**
     * 更新文章
     * @param {{
     * title: string,
     * content: string,
     * description: string,
     * markdown: string,
     * createTime: string,
     * coverImage: string,
     * tags: string[]
     * }} processedData
     * @return {Promise<void>}
     */
    async function update(processedData) {
        popup.loadTemporaryComponent(<Modal/>).title("操作处理中, 请稍等...").show({lockMask: true})

        await sleep(1000)
        let result = await http.updateArticle({id, ...processedData})
        popup.close()
        if (result) {
            tip.show("文章已更新!")
            EventBus.emit("update", "articleList")
        } else {
            tip.show("文章更新失败!")
        }
    }

    function editorChangeHandler({html, text}) {
        setHTML(html)
        setMarkdown(text)
    }

    async function submit() {
        const processedData = {
            title,
            content: html,
            description,
            markdown,
            coverImage: realCoverImage,
            createTime: time,
            tags
        }
        const checkMap = {
            title: "缺少标题",
            content: "缺少内容",
            description: "缺少内容",
        }
        if (!isFormatDateTime && formatDatetime(time) === "Invalid Date") {
            tip.show("时间格式不正确!")
            return
        }

        for (let checkMapKey in checkMap) {
            if (!processedData[checkMapKey]) {
                console.log(checkMapKey);
                tip.show(checkMap[checkMapKey])
                return
            }
        }

        if (isEditMode)
            return update(processedData)

        popup.loadTemporaryComponent(<Modal/>).title("文章发布中, 请稍等...").show({lockMask: true})

        // await sleep(1000)
        let result = await http.publishArticle(processedData)
        popup.close()

        if (result) {
            tip.show("文章已发布!")
        } else {
            tip.show("文章发布失败!")
        }
    }

    function format(event) {
        if (event.code?.includes("Enter")) {
            const value = event.target.value
            if (!value) {
                setTime(formatDatetime());
                return
            }
            setTime(formatDatetime(value));
        }
        isFormatDateTime = false
    }

    return <div className="editor">
        {isEditMode || <h1 className="title">
            <span>Write an article</span>
            <a href={"/"} title="返回"><Icon icon="ri:close-fill"/></a>
        </h1>}
        <div className="inputArea">
            <input value={title} onChange={e => setTitle(e.target.value)}
                   type="text" className="titleInput" placeholder="请输入标题"/>
            {isEditMode || <div className="previewButton" title="预览" onClick={preview}><Icon icon="ri:bill-line"/></div>}
            <MarkdownEditor value={markdown} handler={editorChangeHandler}/>
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
                        <input type="file" title="文章封面" className="imgUpload" alt={""} accept={"image/*"}
                               onChange={uploadImage}/>
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
                                <div key={index} className="tag"
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
                        <input type="text" value={time} className="dateTime"
                               onChange={e => setTime(e.target.value)}
                               onKeyDown={format}/>
                        <div className="tip">按回车键, 自动格式化时间</div>
                    </div>
                </div>

            </div>
            <div className="buttons">
                <div className="button preview" onClick={preview}>preview</div>
                <div className="button" onClick={submit}>{isEditMode ? "update" : "publish"}</div>
            </div>
        </div>

    </div>
}

function MarkdownEditor({value, handler}) {
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
        onChange={handler}/>
}
