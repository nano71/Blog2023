import "/src/stylesheets/manage/messageList.less"

import React, {useContext} from "react";
import {ManagementConsoleUpdateContext, MessageListObjectContextForManage} from "../../pages/manage.jsx";
import {Icon} from "@iconify/react";
import Loading from "../content/loading.jsx";
import {usePopup} from "../popup/popup.jsx";
import {formatDatetime} from "../../utils/tools.js";
import * as http from "../../utils/http.js";
import Result from "../content/result.jsx";
import {useTip} from "../popup/tip.jsx";

export default function MessageListForManage() {
    const popup = usePopup()
    const tip = useTip()
    const managementConsole = useContext(ManagementConsoleUpdateContext)
    const messageListObject = useContext(MessageListObjectContextForManage)

    async function deleteMessage(id) {
        popup.confirm("Your action will delete this message, Are you sure?",
            async () => {
                popup.close()
                let result = await http.deleteMessage(id)
                if (result) {
                    tip.show("删除成功")
                } else {
                    tip.show("删除失败")
                }
            })
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
                            <Icon icon="ri:eye-off-line"/>
                            <Icon icon="ri:delete-bin-3-line" onClick={_ => deleteMessage(value.id)} className={"delete"}/>
                        </div>
                    </div>
                )}
                {messageListObject.total ? <div className="placeholder"></div> : <Result result={messageListObject.result}/>}
            </div>}
        <div className="bottomBar">
            <div className="total">Total: {messageListObject.total}</div>
            <div className="pagination"></div>
        </div>
    </div>
}
