var Organization = function (element, options) {

    // this.element = $(element);
    this.element = element
    // this.options = $.extend(true, {}, this.options, options);
    this.options = Object.assign(true, {}, this.options, options);
    this.init();

}
Organization.prototype = {
    options: {
        shape: "vertical", //方向
        width: null,     //容器宽度
        height: null,
        levelWidth: 120,   //每层默认高度
        top: 10,
        levelOfHeight: {},
        ptopArr: [],
        itemArr: []
    },
    init: function () {

        var me = this,
            el = me.element,
            opts = me.options,
            level = 0;

        // opts.width = el.width();
        // opts.height = el.height();
        opts.width = el.clientWidth
        opts.height = el.clientHeight

        if (!opts.data || opts.data.length == 0) throw new Error("数据不存在或未空");
        else {
            opts.dataMode = me.changeDataMode(opts.data);
        }

        me.createEL();

        // $(window).resize(function () {
        //     me.resize();
        // });
        window.onresize = function () {
            me.resize();
        }
        // el.on("click", ".node", function () {

        //     if (opts.nodeClick) opts.nodeClick.call(me, this.innerText)
        // })


        el.onclick = function (e) {
            if (opts.nodeClick && e.target.classList.contains("node-text")) opts.nodeClick.call(me, e.target.innerText)
            if (e.target.classList.contains("connector")) {
                let id = e.target.id,
                    pid = e.target.getAttribute("pid")
                console.log(pid, "——>", id)
            }
        }

    },
    resize: function () {
        var me = this,
            el = me.element,
            opts = me.options,
            level = 0;

        // el.empty();

        // opts.width = el.width();
        // opts.height = el.height();
        opts.width = el.clientWidth
        opts.height = el.clientHeight
        me.createEL();
    },
    changeDataMode: function (data) {
        var me = this,
            opts = me.options
        var dataMode = {};
        var level = 0;

        let t = []

        function loop(data, level) {

            data.forEach(function (item, i) {
                if (!dataMode[level]) { dataMode[level] = [] }
                item.level = level;
                if (dataMode[level].indexOf(item) == -1) {
                    t.push(item)
                    dataMode[level].push(item);
                }
                if (item.children) {
                    level++;
                    loop(item.children, level);
                    level--;
                }
            })
        }
        loop(data, level);
        opts.dataMode = dataMode
        console.log("data", data)
        // let newData = clearDataMode(dataMode)
        return dataMode;
    },
    createEL: function () {
        var me = this,
            el = me.element,
            opts = me.options,
            data = opts.data,
            html = '';

        function loop(arr, ptop, pleft, levelWidth, pwidth, pheight, pid) {
            var childItems = [];
            arr.forEach(function (item, i) {

                var thislevelWidth = 0;
                var childitem = {};
                // var itemInfo
                if (opts.itemArr.indexOf(item.id) == -1) {
                    var itemInfo = me.createItem(item, i, ptop, pleft, levelWidth, pwidth, pheight, pid);
                    opts.itemArr.push(item.id)
                    thislevelWidth = Math.max(thislevelWidth, itemInfo.width);
                    html += itemInfo.html;

                    if (item.children) {
                        //布局处理 上级排列完成在进行下级排列
                        childitem["child"] = item.children;
                        childitem["top"] = itemInfo.top;
                        childitem["left"] = itemInfo.left;
                        childitem["height"] = itemInfo.height;
                        childitem["width"] = itemInfo.width;
                        childitem["id"] = itemInfo.id;
                        childItems.push(childitem);
                    }
                    opts.itemArr.push(item)
                } else {
                    var itemInfo = me.lineItem(item, i, ptop, pleft, levelWidth, pwidth, pheight, pid);
                    // return
                }

                if (i == arr.length - 1) {
                    childItems.forEach(function (item, index) {

                        loop(item.child, item.top, item.left, thislevelWidth, item.width, item.height, item.id);
                    })
                }
            })
        }
        loop(data);

        el.innerHTML = el.innerHTML + html
    },
    createItem: function (item, _index, ptop, pleft, plevelWidth, pwidth, pheight, pid) {
        var me = this;
        var thislevelWidth = 0;
        ptop = ptop || 0;
        pleft = pleft || 0;
        plevelWidth = plevelWidth || 0;
        pwidth = pwidth || 0;
        pheight = pheight || 0;
        var me = this,
            el = me.element,
            opts = me.options,
            dataMode = opts.dataMode;

        var shape = item.shape || opts.shape;

        var s = '';
        // if (opts.itemArr.indexOf(item.id) > -1) {
        //     el.removeChild(document.getElementById(item.id))
        // }


        var box = document.createElement("div");
        box.id = item.id;
        box.className += shape + " node default ";

        if (item.cls) {
            box.className += item.cls;
        }

        var node = document.createElement("a");
        node.className = "node-text";
        node.innerText = item.name;
        // if (item.hide) {
        //     box.style.display = "none"
        // }
        box.appendChild(node);
        me.element.appendChild(box);

        // var width = $(box).width(), height = $(box).height();
        var width = box.clientWidth, height = box.clientHeight
        thislevelWidth = Math.max(thislevelWidth, width);
        //设置位置
        if (item.level == 0) {
            var left = opts.left + pleft + plevelWidth;

        }
        else {
            var left = pleft + plevelWidth + opts.levelWidth;
        }
        var levelLength = dataMode[item.level].length;
        var unitHeight = opts.height / (levelLength + 1);

        var index = dataMode[item.level].indexOf(item);
        var top = unitHeight * (index + 1) - width / 2;

        box.style.top = top + "px";
        box.style.left = left + "px";

        // //创建自身线条
        if (ptop) {
            //定义相连上下部分线高 levelWidth决定
            const plinewidth = me.options.levelWidth / 2;
            const clinewidth = me.options.levelWidth / 2;
            var midLeft = pleft < left ? pleft + pwidth + plinewidth : left + pwidth + plinewidth;
            var midTop = ptop < top ? top : ptop
            var midWidth = (Math.abs((top) - (ptop)));
            var topHeight = plinewidth
            // if (pheight != plevelWidth) {
            //     topHeight = plinewidth + (plevelWidth - pheight)
            // }
            let secondTop = ptop
            if (_index == 0) {
                var box = document.createElement("div");
                box.className = 'connector';
                box.style.top = ptop + "px";
                box.style.left = (pleft + pwidth / 2) + "px";
                let addHeight = 0
                if (pheight != plevelWidth) {
                    addHeight = plinewidth + (plevelWidth - pheight)
                }
                // box.id = item.id
                // box.pid = JSON.stringify(item.pid)
                box.setAttribute("pid", JSON.stringify(pid))
                box.style.width = plinewidth + pwidth / 2 + "px";
                me.thisPline = box; //父线高度固定
                me.element.appendChild(box);
                secondTop = midTop - midWidth
            }
            let lastHeight = secondTop
            // if (ptop == min) lastHeight = lastHeight + midWidth

            s += '<div class="connector" style="top:' + (secondTop) + 'px;left:' + midLeft + 'px;height:' + midWidth + 'px"></div>'
            s += '<div class="connector last" style="top:' + (top) + 'px;left:' + (midLeft) + 'px;width:' + (plinewidth + pwidth / 2) + 'px"></div>' //子线高度固定
        }
        // if (setBox == false) {
        //     console.log("item.id", item.id)
        //     el.removeChild(document.getElementById(item.id))  
        // }
        return { html: s, top: top, left: left, width: width, height: height, id: item.id };
    },
    lineItem: function (item, _index, ptop, pleft, plevelWidth, pwidth, pheight, pid) {
        var me = this;
        var thislevelWidth = 0;
        ptop = ptop || 0;
        pleft = pleft || 0;
        plevelWidth = plevelWidth || 0;
        pwidth = pwidth || 0;
        pheight = pheight || 0;
        var me = this,
            el = me.element,
            opts = me.options,
            dataMode = opts.dataMode;

        var s = '';
        var self = document.getElementById(item.id)
        var selfWidth = self.offsetWidth
        var selfLeft = self.offsetLeft //中心点
        var selfTop = self.offsetTop
        var selfHeight = self.offsetHeight

        var box1 = document.createElement("div")
        box1.className = 'connector'
        box1.style.left = pleft + pwidth / 2 + "px"
        box1.style.top = ptop + "px"
        box1.style.width = pwidth / 2 + 15 + "px"
        me.thisPline = box1
        me.element.appendChild(box1)

        let minTop = Math.min(selfTop, ptop)
        let differTop = Math.abs(selfTop - ptop)
        let differBoxHeight = Math.abs(selfHeight - pheight)  // 两个盒子的高度差
        var box2 = document.createElement("div");
        box2.className = 'connector';
        let box2Top = selfTop > ptop ? minTop : minTop + opts.levelWidth / 2
        let box2Left = pleft + pwidth + 15;
        let box2Height = (differTop + differBoxHeight) - opts.levelWidth / 2;
        box2.style.top = box2Top + "px"
        box2.style.left = box2Left + "px"
        box2.style.height = box2Height + "px"
        me.thisPline = box2; //父线高度固定
        me.element.appendChild(box2);

        var box3 = document.createElement("div")
        box3.className = 'connector'
        let differLeft = Math.abs(selfLeft - pleft)
        // box3.style.top = box2Top + "px"
        let box3Top = ptop < selfTop ? box2Top + box2Height : box2Top
        let box3Width = pleft < selfLeft ? differLeft - pwidth / 2 - 15 : differLeft + pwidth / 2 + 15
        let box3Left = pleft < selfLeft ? box2Left : box2Left - box3Width
        box3.style.top = box3Top + "px"
        box3.style.left = box3Left + "px"
        box3.style.width = box3Width + "px"
        me.thisPline = box3; //父线高度固定
        me.element.appendChild(box3);

        var box4 = document.createElement("div")
        box4.className = 'connector'
        let box4Height = opts.levelWidth / 2
        box4.style.height = box4Height + "px"
        box4.style.top = ptop < selfTop ? box3Top + "px" : box3Top - box4Height + "px"
        box4.style.left = pleft < selfLeft ? box2Left + box3Width + "px" : box2Left - box3Width + "px"

        me.thisPline = box4; //父线高度固定
        me.element.appendChild(box4);
    }
};

// $.fn.organization = function (options) {

//     var isSTR = typeof options == "string",
//         args, ret;

//     if (isSTR) {
//         args = $.makeArray(arguments)
//         args.splice(0, 1);
//     }

//     var name = "organization",
//         type = Organization;

//     var jq = this.each(function () {
//         var ui = $.data(this, name);

//         if (!ui) {
//             ui = new type(this, options);
//             $.data(this, name, ui);
//         }
//         if (isSTR) {
//             ret = ui[options].apply(ui, args);
//         }
//     });

//     return isSTR ? ret : jq;
// };

