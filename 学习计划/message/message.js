/*
 * @Description: 
 * @Author: 王玉宝
 * @Date: 2022-04-12 14:04:32
 * @LastEditTime: 2022-04-13 16:15:48
 * @LastEditors:  
 * @FilePath: \jqueryui.2.0\message\message.js
 */
var $message = {
    m_config: {
        message: "说明文字",
        type: "success",
        target: "body",
        duration: 2200,
    },
    success: function (message, config = {}) {
        config.message = message;
        this.createEl(this.initConfig(config), "success")
    },
    info: function (message, config = {}) {
        config.message = message;
        this.createEl(this.initConfig(config), "info")
    },
    warning: function (message, config = {}) {
        config.message = message;
        this.createEl(this.initConfig(config), "warning")
    },
    error: function (message, config = {}) {
        config.message = message;
        this.createEl(this.initConfig(config), "error")
    },
    initConfig(config) {
        return $.extend(true, {}, this.m_config, typeof (config) === "string" ? { message: config } : config);
    },
    createEl(config, type) {
        config.type = type;
        let _lastNote = $(config.target).find(".el-message").last();
        let _top = 20;
        if (_lastNote.length) {
            _top = _lastNote[0].offsetTop + _lastNote.outerHeight() + 20;
        }
        let _html = `<div  class="el-message el-message--${type} message-fade-in" style="top: ${_top}px; z-index: 2000;">
                        <i class="el-message__icon iconfont icon-${type}"></i>
                        <p class="el-message__content">${config.message}</p>
                     </div>`;
        config.$el = $(_html);

        $(config.target).append(config.$el);
        setTimeout(() => {
            $(config.$el).removeClass("message-fade-in")
        }, 400)
        if (config.duration > 0) {
            this.destory(config)
        }
        config.$el.on("mouseenter", function () {
            console.log("111")
            $(config.$el).addClass("message-hover")
            if (config.timer) {
                clearTimeout(config.timer);
            }
        })
        config.$el.on("mouseleave", () => {
            console.log("222")
            $(config.$el).removeClass("message-hover")
            if (config.duration > 0) {
                this.destory(config)
            }
        })
    },
    destory(config) {
        config.timer = setTimeout(() => {
            $(config.$el).addClass("message-fade-out")
            setTimeout(() => {
                // config.$el.remove();
                this.dolayout(config)
            }, 300)
            if (config.onClose) {
                config.onClose.call(this, config)
            }
        }, config.duration)
    },
    // syncDestroy($el) {
    //     $el.remove();
    // },
    dolayout(config) {
        let _top = 20;
        $(config.target).find(".el-message").map((index, element) => {
            if (!$(element).hasClass("message-hover")) {
                element.style.top = _top + "px";
            }
            _top = element.offsetTop + element.offsetHeight + 20
            console.log("_top", _top)
        })
    }
}