var Organization = function (element, config) {
    this.config = {
        width: null,     //容器宽度
        height: null,
        levelHeight: 80,   //每层默认高度
        ...config
    }
    this.element = element
    this.init()
}

Organization.prototype = {
    init() {
        let that = this
        if (!this.config.data || this.config.data.length == 0) {
            throw new Error("数据不存在或为空")
        } else {
            this.dataMode = this.changeDataMode()
        }

        this.element.on("click", ".node", function () {
            if (this.config.nodeclick) this.config.nodeclick.call(that, this.innerText)
        })
    },
    changeDataMode() {
        let level = 0
        let dataMode = {}
        function addLevel(data, level) {
            data.forEach(item => {
                if (!dataMode[level]) { dataMode[level] = [] }
                item.level = level;
                dataMode[level].push(item);

                if (item.children) {
                    level++
                    loop(item.children, level);
                    level--;
                }
            });
        }

        addLevel(this.config.data, level)
    },
    createEl() {
        
    },
}