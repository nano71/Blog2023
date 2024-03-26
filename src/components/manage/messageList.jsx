import "/src/stylesheets/manage/messageList.less"

import React, {useContext} from "react";
import {MessageListObjectContextForManage} from "../../pages/manage.jsx";
import {Icon} from "@iconify/react";
import Loading from "../content/loading.jsx";
import {PopupContext} from "../popup/popup.jsx";
import {formatDatetime} from "../../utils/tools.js";
import * as http from "../../utils/http.js";
import Result from "../content/result.jsx";

export default function MessageListForManage() {
    const popup = useContext(PopupContext)
    const messageListObject = useContext(MessageListObjectContextForManage)

    async function deleteMessage(id) {
        let result = await http.deleteMessage(id)
        if (result) {
            popup.tip("删除成功")
        }
    }

    return <div className="messageList">
        <div className="head">
            <div className="label face">Face</div>
            <div className="label nickname">Nickname</div>
            <div className="label url">URL</div>
            <div className="label content">Content</div>
            <div className="placeholder"></div>
            <div className="label datetime">Datetime</div>
            <div className="label operation">Operation</div>
        </div>
        {messageListObject.isLoading
            ? <Loading/>
            : <div className="list">
                {messageListObject.list.map((value, index) =>
                    <div className="item" key={index}>
                        <div className="face">
                            <Icon icon={"emojione-v1:" + value.face}/>
                        </div>
                        <div className="nickname">{value.nickname || "匿名网友"}</div>
                        {value.url
                            ? <a href={value.url} className="url">{value.url}</a>
                            : <div className="url">无</div>}
                        <div className="content">{value.content}</div>
                        <div className="datetime">{formatDatetime(value.createTime)}</div>
                        <div className="operation">
                            <Icon icon="ri:eye-off-line" />
                            <Icon icon="ri:delete-bin-3-line" onClick={_ => deleteMessage(value.id)} className={"delete"}/>
                        </div>
                    </div>
                )}
                {messageListObject.total || <Result result={messageListObject.result}/>}
                {messageListObject.total ? <div className="placeholder"></div> : null}
            </div>}
        <div className="bottomBar">
            <div className="total">Total: {messageListObject.total}</div>
            <div className="pagination"></div>
        </div>
    </div>
}
