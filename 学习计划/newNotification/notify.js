/*
 * @Author: songmengchao@powerpms.com songmengchao@powerpms.com
 * @Date: 2022-07-18 11:41:22
 * @LastEditors: songmengchao@powerpms.com songmengchao@powerpms.com
 * @LastEditTime: 2022-07-29 17:19:42
 * @FilePath: \学习计划\newNotification\notify.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
let $notify = {
    defaultConfig: {
        title: "标题",
        message: "这是一条notification信息",
        type: "success",
        position: "top-right",
        showClose: false,
        duration: 4500,
        showClose: true
    },
    success: function (config) {
        return this.createNotify(this.combineConfig(config))
    },
    warning: function (config) {
        return this.createNotify(this.combineConfig(config))
    },
    info: function (config) {
        return this.createNotify(this.combineConfig(config))
    },
    error: function (config) {
        return this.createNotify(this.combineConfig(config))
    },
    createNotify(config) {
        let that = this
        let displayStyle = config.showClose ? "inline-block" : "none"
        let html = `<div class="notify" id="notify">
            <img class="img" src="./png/${config.type}.png" alt="">
            <p class="title">${config.title}</p>
            <p class="msg">${config.message}</p>
            <div class="close" style="display: ${displayStyle}">
                <img src="./png/close.png" alt="" />
            </div>
        </div>`
        config.$el = $(html);
        $('body').append(config.$el)
        //设置notification出现的时间
        
        that.setShowTime(config);
        config.$el.on("click", ".close", function () {
            that.handleRemove(config)
        })
    },
    combineConfig(config) {
        return $.extend(true, {}, this.defaultConfig, config)
    },
    getPosition(config) {
        console.log("config", $("body"))
        let _top = ($(".notify").length - 1) * 120 + 30
        if (config.position && config.position === "top-left") {
            config.$el.css("top", _top + "px").css("left", "0px")
        } else if (config.position && config.position === "bottom-right") {
            config.$el.css("bottom", _top + "px").css("right", "0px")
        } else if (config.position && config.position === "bottom-left") {
            config.$el.css("bottom", _top + "px").css("left", "0px")
        } else {
            config.$el.css("top", _top + "px").css("right", "0px")
        }

    },
    setShowTime(config) {
        let that = this
        //设置notification的位置
        this.getPosition(config)
        let newclassName = `new-notify${$(".notify").length}`
        $(config.$el).addClass(newclassName)
        setTimeout(() => {
            that.handleRemove(config)
        }, config.duration)
    },
    handleRemove(config) {
        config.$el.remove()
        $("body").find(".notify").map((index, e) => {
            setTimeout(() => {
                if (config.position.indexOf("bottom") > -1) {
                    e.style.bottom = index * 120 + 30 + "px"
                } else {
                    e.style.top = index * 120 + 30 + "px"
                }
            }, 300)
        })
        if (config.onClose) {
            config.onClose.call(this, config)
        }
    }
}

