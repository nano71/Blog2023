import React, {useContext, useEffect, useRef, useState} from "react";
import {MessageListContext} from "../../pages/index.jsx";
import Loading from "../content/loading.jsx";
import MessageList from "./messageList.jsx";
import "/src/stylesheets/guestbook/guestbook.less"
import {useImmer} from "use-immer";
import {Icon} from "@iconify/react";
import {emojiLabels} from "../../utils/data.js";
import {PopupContext} from "../popup/popup.jsx";
import Modal from "../popup/modal.jsx";
import * as http from "../../utils/http.js";
import {isValidUrl} from "../../utils/http.js";

export default function () {
    const {messageList, setMessageList} = useContext(MessageListContext)

    useEffect(() => {
        getMessageList()
    }, [])

    /**
     * 获取留言列表数据
     * @returns {void}
     */
    async function getMessageList() {
        console.log("getTagListData");
        // let messageList = await http.getMessageList()
        let {list} = await http.getMessageList()
        if (list) {
            setMessageList(list)
        } else {
            // todo 消息列表获取失败的处理
        }
    }

    return (
        <div className="tab active">
            <div id="guestbook">
                <InputArea/>
                {messageList.length ? <MessageList messageList={messageList}/> : <Loading/>}
            </div>
        </div>
    )
}

function InputArea() {
    const {setMessageList} = useContext(MessageListContext)
    const popup = useContext(PopupContext)

    const [message, setMessage] = useImmer("")
    const [nickname, setNickname] = useImmer("")
    const [url, setUrl] = useImmer("")
    const [faceIndex, setFaceIndex] = useState(200 - 15)
    const face = useRef(null)

    function submit() {
        let data = {
            nickname,
            url,
            face: emojiLabels[faceIndex],
            content: message,
            createTime: new Date().toLocaleString()
        }
        if (!data.content) {
            popup.tip("多少写点!")
            return
        }
        if (data.url) {
            if (!url.startsWith("http"))
                data.url = "http://" + url
            if (!isValidUrl(data.url)) {
                popup.tip("网址格式错误!")
                return
            }
        }
        popup.loadTemporaryComponent(<Modal/>).title("处理中, 稍等一会...")
            .show({lockMask: true})
        setTimeout(async () => {
            let result = await http.leaveMessage(data)
            console.log(result);
            if (result) {
                setMessageList(draft => {
                    draft.unshift(data)
                })
                setMessage("")
                popup.tip("留言成功!")
            } else {
                popup.tip("留言失败!")
            }
        }, 2000)
    }

    return <div className="inputArea">
        <div className="top">
            <div className="item">
                <div className="label">昵称</div>
                <input type="text"
                       value={nickname}
                       onChange={e => setNickname(e.target.value)}
                       className="nickname"
                       placeholder={"你的昵称"}/>
            </div>
            <div className="item">
                <div className="label">网站</div>
                <input type="text"
                       onChange={e => setUrl(e.target.value)}
                       value={url}
                       className="url"
                       placeholder={"你的网站"}/>
            </div>
            <div className="item face" ref={face}
                 onMouseOver={_ => {
                     face.current.classList.add("show")
                     face.current.classList.remove("hide")
                 }}
                 onMouseOut={_ => {
                     face.current.classList.add("hide")
                     face.current.classList.remove("show")
                 }}>
                <Icon className="emoji" icon={"emojione-v1:" + emojiLabels[faceIndex]}/>
                <div className="label">
                    Face
                    <Icon icon="ri:arrow-down-s-line"/>
                </div>
                <div className="downDropMenu"
                     onMouseOver={_ => {
                         document.body.style.overflow = "hidden"
                     }}
                     onMouseOut={_ => {
                         document.body.style.overflow = "unset"
                     }}
                >
                    <div className="box">
                        <div className="content">
                            {
                                emojiLabels.map((value, index) =>
                                    <Icon key={index} onClick={_ => setFaceIndex(index)} icon={"emojione-v1:" + value}/>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="item">
            <div className="label">内容</div>
            <div className="right">
                       <textarea maxLength={255} cols="50" value={message} onChange={e => setMessage(e.target.value)}
                                 placeholder="欢迎留言~"/>
                <div className="bottom">
                    <div className="count">{message.length} / 255</div>
                    <div className="submit button" onClick={submit}>submit</div>
                </div>
            </div>

        </div>


    </div>
}
