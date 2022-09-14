class Notification extends HTMLElement {
    constructor() {
        super();
        let that = this
        const shadom = that.attachShadow({
            mode: 'open',
        });
        var div1 = document.createElement('div')
        div1.className = "notifi"

        //添加标题
        var titleDiv = document.createElement('div')
        titleDiv.className = "title"
        div1.appendChild(titleDiv)
        titleDiv.innerText = that.getAttribute('title')
        //添加message
        var msgDiv = document.createElement('div')
        msgDiv.className = "msg"
        div1.appendChild(msgDiv)
        msgDiv.innerText = that.getAttribute('message')


        shadom.appendChild(div1);
        var allStyle = document.createElement("style");

        //添加icon,并通过type控制icon的样式
        if (that.getAttribute('type')) {
            var iconDiv = document.createElement('div')
            iconDiv.className = "icon"
            div1.appendChild(iconDiv)
            var iconImg = document.createElement('img')
            if (that.getAttribute('type') == "warning") {
                iconImg.src = "./png/warning.png"
            } else if (that.getAttribute('type') == "info") {
                iconImg.src = "./png/info.png"
            } else if (that.getAttribute('type') == "error") {
                iconImg.src = "./png/error.png"
            } else {
                iconImg.src = "./png/success.png"
            }
            iconDiv.appendChild(iconImg)
            iconImg.className = "img"

            titleDiv.classList.add("new")
            msgDiv.classList.add("new")
        }

        //添加关闭图标
        let showClose = that.getAttribute('showClose') ? that.getAttribute('showClose') : true
        if (showClose == true) {
            var closeDiv = document.createElement('div')
            closeDiv.className = "closeDiv"
            var closeImg = document.createElement('img')
            closeImg.src = "./png/close.png"
            closeImg.className = "closeImg"
            div1.appendChild(closeDiv)
            closeDiv.appendChild(closeImg)
            closeDiv.onclick = function() {
                that.style.display = "none"
                // shadom.removeChild(div1)
            }
        }



        //设置位置
        let position = that.getAttribute('position')
        let pX = "right"
        let pY = "top"
        if (position == "top-left") {
            pX = "left"
        } else if (position == "bottom-left") {
            pX = "left"
            pY = "bottom"
        } else if (position == "bottom-right") {
            pY = "bottom"
        }

        //设置样式
        allStyle.innerHTML = `
            .notifi{
                position: relative;
                width:300px;
                height:100px;
                border-radius: 8px;
                box-sizing: border-box;
                border: 1px solid #ebeef5;
                position: fixed;
                background-color: #fff;
                box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
                ${pX}: 0px;
                ${pY}: 20px;
            }
            .icon{
                width:100px;
                height:100px;
            }
            .title{
                width:200px;
                height:30px;
                position: absolute;
                top:0px;
                font-weight:600;
            }
            .msg{
                width:200px;
                height:70px;
                position: absolute;
                top:30px;
            }
            .img{
                width:40px;
                height:40px;
                margin-top:20px;
                margin-left:20px;
            }
            .new{
                left:100px;
            }
            .closeDiv{
                width:20px;
                height:20px;
                position:absolute;
                right:0px;
                top:0px;
            }
            .closeImg{
                width:100%;
                height:100%;
            }
            `
        shadom.appendChild(allStyle);
        //控制组件消失的时间
        let duration = that.getAttribute('duration') ? that.getAttribute('duration') : 4500
        setTimeout(() => {
        // shadom.removeChild(div1)
        that.style.display = "none"
        }, duration)
    }
}
