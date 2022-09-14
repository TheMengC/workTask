var powerGantt = function (element, config) {
    this.config = {
        width: "100%",
        height: "95%",
        columnDefaultWidth: "100px",
        scaleDefautWidth: 38,
        initScrollTop: 0,
        initScrollLeft: 0,
        scrollTicking: false,
        scaleDefaultHeight: 38,
        defaultSum: 2000,
        scaleLength: 0,
        scale: 100
    }
    this.data = []
    this.columns = []
    this.el = element
    this.config = {
        ...this.config,
        ...config
    }
    this.init()
}

powerGantt.prototype.init = function () {

    this.ganttGrid = document.createElement("div")
    this.ganttGrid.className = "power-ganttgrid"
    this.ganttGrid.innerHTML = ""

    this.ganttView = document.createElement("div");
    this.ganttView.innerHTML = "";
    this.ganttView.className = "power-ganttview "


    this.el.appendChild(this.ganttGrid)
    this.el.appendChild(this.ganttView)

    this.render()

    this.el.onclick = function(e) {
        if(e.target.classList.contains("ganttview-block-user")) console.log("点击事件")
    }
}

powerGantt.prototype.scaleChange = function (inputValue) {
    this.config.scale = inputValue
    this.renderGantt()
}

powerGantt.prototype.render = function () {
    this.initScrollTop = 0;
    this.initScrollLeft = 0;
    this.renderGrid();
    this.renderGantt();
}
//左边表格绘制
powerGantt.prototype.renderGrid = function () {
    let that = this
    this.ganttGrid.innerHTML = '';
    let scaleHeight = this.config.scaleDefaultHeight
    let left = 0
    that.ganttgridHeader = document.createElement("div")
    that.ganttgridHeader.className = "power-ganttgrid-header"
    for (let i = 0; i < this.columns.length; i++) {
        let headercell = document.createElement("div")
        headercell.className = "power-ganttgrid-header-cell power-ganttgrid-cell"
        headercell.style.left = left;
        let width = this.columns[i].width || this.config.columnDefaultWidth;
        headercell.style.textAlign = "center"
        headercell.style.width = width;
        headercell.style.left = left;
        headercell.innerHTML = this.columns[i].text || ""
        left += parseInt(width);

        that.ganttgridHeader.appendChild(headercell)
    }

    that.ganttgridBody = document.createElement("div");
    that.ganttgridBody.className = "power-ganttgrid-body"
    for (let i = 0; i < this.data.length; i++) {
        let row = this.data[i]
        let ganttGridRow = document.createElement("div")
        ganttGridRow.className = "power-ganttgrid-row"
        ganttGridRow.style.height = `${scaleHeight}px`
        ganttGridRow.style.lineHeight = `${scaleHeight}px`
        for (let j = 0; j < this.columns.length; j++) {
            let ganttgridCell = document.createElement("div");
            ganttgridCell.className = "power-ganttgrid-row-cell power-ganttgrid-cell"
            ganttgridCell.style.width = this.columns[j].width || this.config.columnDefaultWidth
            ganttgridCell.style.textAlign = "center"
            ganttgridCell.innerHTML = row[this.columns[j].field] || ""
            ganttGridRow.appendChild(ganttgridCell)
        }
        that.ganttgridBody.appendChild(ganttGridRow)
    }

    this.ganttGrid.appendChild(that.ganttgridHeader);
    this.ganttGrid.appendChild(that.ganttgridBody);

    this.ganttgridBody.onscroll = function (event) {
        //上下滚动
        let _ganttViewBody = this;
        if (this.scrollTop != that.config.initScrollTop) {
            if (!that.config.scrollTicking) {
                requestAnimationFrame(function () {
                    // debugger
                    that.config.initScrollTop = _ganttViewBody.scrollTop;
                    that.ganttViewBody.scrollTop = _ganttViewBody.scrollTop;
                    that.config.scrollTicking = false;
                });
                that.config.scrollTicking = true;
            }
        }
        if (this.scrollLeft != that.config.initScrollLeft) {
            that.config.initScrollLeft = _ganttViewBody.scrollLeft;
            that.ganttViewHeader.scrollLeft = _ganttViewBody.scrollLeft;
        }
    }
}

powerGantt.prototype.renderGantt = function () {
    this.ganttView.innerHTML = ""
    this.ganttViewHeader = document.createElement("div")
    this.ganttViewHeader.className = "power-ganttview-header"
    this.ganttViewBody = document.createElement("div")
    this.ganttViewBody.className = "power-ganttview-body"

    this.ganttView.appendChild(this.ganttViewHeader)
    this.ganttView.appendChild(this.ganttViewBody)

    this.renderGanttHeader()
    this.renderGanttBody()
    this.renderGanttTask()

    var that = this
    this.ganttViewBody.onscroll = function (event) {
        //上下滚动
        let _ganttViewBody = this;
        if (this.scrollTop != that.initScrollTop) {
            // debugger
            if (!that.scrollTicking) {
                requestAnimationFrame(function () {
                    that.initScrollTop = _ganttViewBody.scrollTop;
                    that.ganttgridBody.scrollTop = _ganttViewBody.scrollTop;
                    that.scrollTicking = false;
                });
                that.scrollTicking = true;
            }
        }
        if (this.scrollLeft != that.initScrollLeft) {
            that.initScrollLeft = _ganttViewBody.scrollLeft;
            that.ganttViewHeader.scrollLeft = _ganttViewBody.scrollLeft;
        }
    }
}

//甘特图头部绘制
powerGantt.prototype.renderGanttHeader = function () {
    let scaleWidth = this.config.scaleDefautWidth;
    let topScale = `<div class="power-ganttview-toptimescale">`;
    let bottomScale = `<div class="power-ganttview-bottomtimescale">`;
    let currentScale = ``
    let sum = 0
    for (let i = 0; i < this.data.length; i++) {
        let max = Number(this.data[i].duration) + Number(this.data[i].start)
        if (max > sum) {
            sum = max
        }
    }
    this.config.scaleLength = sum / this.config.scale || this.config.defaultSum / this.config.scale
    for (let i = 0; i < this.config.scaleLength; i++) {
        currentScale = `<div class="power-ganttview-headercell" style="width:${scaleWidth}px">${(i + 1) * this.config.scale}</div>`
        bottomScale += currentScale
    }

    topScale += `<div class="power-ganttview-headercell" style="width:${scaleWidth * Math.ceil(this.config.scaleLength)}px">请求时长</div></div>`
    bottomScale += `</div>`
    this.ganttViewHeader.innerHTML = topScale + bottomScale
}

//甘特图表格绘制
powerGantt.prototype.renderGanttBody = function () {
    let ganttGrid = document.createElement("div")
    ganttGrid.className = "power-ganttview-grid"
    //计算行和列
    let scaleWidth = this.config.scaleDefautWidth
    let scaleHeight = this.config.scaleDefaultHeight
    let rowLength = this.data.length
    let columnLength = this.config.scaleLength
    let rowHeight = 0

    for (let i = 0; i < rowLength; i++) {
        let gridRow = document.createElement("div")
        gridRow.className = "power-ganttview-row";
        gridRow.style.top = rowHeight + "px"
        gridRow.style.width = columnLength * scaleWidth + "px"
        gridRow.style.height = scaleHeight + "px"
        rowHeight = scaleHeight * rowLength
        ganttGrid.appendChild(gridRow)
    }

    for (let i = 0; i < columnLength; i++) {
        gridColumn = document.createElement("div")
        gridColumn.className = "power-ganttview-column"
        gridColumn.style.left = i * scaleWidth + "px"
        gridColumn.style.width = scaleWidth + "px"
        gridColumn.style.height = rowHeight + "px"
        ganttGrid.appendChild(gridColumn)
    }

    this.ganttViewBody.appendChild(ganttGrid)
}

powerGantt.prototype.renderGanttTask = function () {
    let scaleHeight = this.config.scaleDefaultHeight
    let scaleWidth = this.config.scaleDefautWidth
    let taskDomContainer = document.createElement("div")
    taskDomContainer.className = "power-ganttview-taskview"

    for (let i = 0; i < this.data.length; i++) {

        let oneTask = this.data[i].duration / this.config.scale
        let taskDom = document.createElement("div")
        taskDom.className = "power-ganttview-task";

        let taskLeft = (this.data[i].start / this.config.scale) * scaleWidth
        taskDom.style.left = taskLeft + "px"
        taskDom.style.top = i * scaleHeight + "px"
        taskDom.style.width = oneTask * scaleWidth + "px"
        // taskDom.style.height = scaleHeight + "px"
        taskDom.style.position = "absolute"

        let userContent = document.createElement("div")
        userContent.className = "ganttview-block-user"
        userContent.id = this.data[i].id
        // userContent.style.height = scaleHeight + "px"
        // userContent.style.lineHeight = scaleHeight + "px"

        taskDom.appendChild(userContent)
        taskDomContainer.appendChild(taskDom)
    }
    this.ganttViewBody.appendChild(taskDomContainer)
}

powerGantt.prototype.setColumn = function (columns) {
    this.columns = columns
    this.renderGrid()
}
powerGantt.prototype.setData = function (data) {
    this.data = data
    this.render()
}

powerGantt.prototype.render = function () {
    this.renderGrid();
    this.renderGantt();
}