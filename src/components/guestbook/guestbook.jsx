import React, {useContext, useRef, useState} from "react";
import {MessageListObjectContext} from "../../pages/index.jsx";
import Loading from "../content/loading.jsx";
import MessageList from "./messageList.jsx";
import "/src/stylesheets/guestbook/guestbook.less"
import {useImmer} from "use-immer";
import {Icon} from "@iconify/react";
import {emojiLabels} from "../../utils/data.js";
import {usePopup} from "../popup/popup.jsx";
import Modal from "../popup/modal.jsx";
import * as http from "../../utils/http.js";
import {isValidUrl} from "../../utils/http.js";
import {formatDatetime, sleep} from "../../utils/tools.js";
import Result from "../content/result.jsx";
import {useTip} from "../popup/tip.jsx";

export default function () {
    const messageListObject = useContext(MessageListObjectContext)

    function List() {
        if (messageListObject.total)
            return <MessageList messageList={messageListObject.list}/>
        return <Result result={messageListObject.result}/>
    }

    return (
        <div className="tab active">
            <div id="guestbook">
                <InputArea/>
                {messageListObject.isLoading ? <Loading/> : <List/>}
            </div>
        </div>
    )
}

function InputArea() {
    const messageListObject = useContext(MessageListObjectContext)
    const popup = usePopup()
    const tip = useTip()

    const [message, setMessage] = useImmer("")
    const [nickname, setNickname] = useImmer("")
    const [url, setUrl] = useImmer("")
    const [faceIndex, setFaceIndex] = useState(200 - 15)
    const face = useRef(null)

    async function submit() {
        let data = {
            nickname,
            url,
            face: emojiLabels[faceIndex],
            content: message,
            createTime: formatDatetime()
        }
        if (!data.content) {
            tip.show("多少写点!")
            return
        }
        if (data.url) {
            if (!url.startsWith("http"))
                data.url = "http://" + url
            if (!isValidUrl(data.url)) {
                tip.show("网址格式错误!")
                return
            }
        }
        popup.loadTemporaryComponent(<Modal/>).title("处理中, 稍等一会...")
            .show({lockMask: true})
        await sleep(1000)

        let result = await http.leaveMessage(data)
        console.log(result);
        popup.close()
        if (result) {
            messageListObject.push(data)
            setMessage("")
            tip.show("留言成功!")
        } else {
            tip.show("留言失败!")
        }
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
