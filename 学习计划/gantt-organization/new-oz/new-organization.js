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
        levelWidth: 80,   //每层默认高度
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

        el.empty();

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
                    level++
                    loop(item.children, level);
                    level--;
                }
            })
        }
        loop(data, level);
        opts.dataMode = dataMode
        console.log("dataMode", dataMode)
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
                // console.log("item", item)
                // var itemInfo
                if (opts.itemArr.indexOf(item) == -1) {
                    var itemInfo = me.createItem(item, i, ptop, pleft, levelWidth, pwidth, pheight, pid, true);
                    opts.itemArr.push(item)
                } else {
                    // return
                    var itemInfo = me.createItem(item, i, ptop, pleft, levelWidth, pwidth, pheight, pid, false);
                }
                opts.itemArr.push(item)

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
    createItem: function (item, _index, ptop, pleft, plevelWidth, pwidth, pheight, pid, setBox) {
        // debugger
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
        // if (setBox == true) {
        var box = document.createElement("div");
        box.id = item.id;
        box.className += shape + " node default ";

        if (item.cls) {
            box.className += item.cls;
        }

        var node = document.createElement("a");
        node.className = "node-text";
        node.innerText = item.name;

        box.appendChild(node);

        me.element.appendChild(box);
        // var width = $(box).width(), height = $(box).height();
        var width = box.clientWidth, height = box.clientHeight
        thislevelWidth = Math.max(thislevelWidth, height);
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
        // }


        // //创建自身线条
        if (ptop) {
            let length1 = opts.ptopArr.length
            if (opts.ptopArr) opts.ptopArr.push(ptop)
            let length2 = opts.ptopArr.length
            let min
            if (length1 === length2) min = Math.min(...opts.ptopArr)
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
            if (ptop == min) lastHeight = lastHeight + midWidth

            s += '<div class="connector" id=' + item.id + ' pid=' + JSON.stringify(pid) + ' style="top:' + (secondTop) + 'px;left:' + midLeft + 'px;height:' + midWidth + 'px"></div>'
            s += '<div class="connector last" id=' + item.id + ' pid=' + JSON.stringify(item.pid) + ' style="top:' + (top) + 'px;left:' + (midLeft) + 'px;width:' + (plinewidth + pwidth / 2) + 'px"></div>' //子线高度固定
        }
        // debugger
        // if (setBox == false) {
        //     console.log("item.id", item.id)
        //     el.removeChild(document.getElementById(item.id))  
        // }
        return { html: s, top: top, left: left, width: width, height: height, id: item.id };
    },

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

