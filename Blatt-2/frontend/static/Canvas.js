export class Canvas {
    constructor(canvasDomElement, toolarea) {
        this.shapes = {};
        const { width, height } = canvasDomElement.getBoundingClientRect();
        this.width = width;
        this.height = height;
        this.ctx = canvasDomElement.getContext("2d");
        canvasDomElement.addEventListener("mousemove", createMouseHandler("handleMouseMove"));
        canvasDomElement.addEventListener("mousedown", createMouseHandler("handleMouseDown"));
        canvasDomElement.addEventListener("mouseup", createMouseHandler("handleMouseUp"));
        function createMouseHandler(methodName) {
            return function (e) {
                e = e || window.event;
                if ('object' === typeof e) {
                    const btnCode = e.button, x = e.pageX - this.offsetLeft, y = e.pageY - this.offsetTop, ss = toolarea.getSelectedShape();
                    // if left mouse button is pressed,
                    // and if a tool is selected, do something
                    if (e.button === 0 && ss) {
                        const m = ss[methodName];
                        // This in the shapeFactory should be the factory itself.
                        m.call(ss, x, y);
                    }
                }
            };
        }
    }
    draw() {
        // TODO: it there a better way to reset the canvas?
        this.ctx.beginPath();
        this.ctx.fillStyle = 'lightgrey';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.stroke();
        // draw shapes
        this.ctx.fillStyle = 'black';
        for (let id in this.shapes) {
            this.shapes[id].draw(this.ctx);
        }
        return this;
    }
    addShape(shape, redraw = true) {
        this.shapes[shape.id] = shape;
        return redraw ? this.draw() : this;
    }
    removeShape(shape, redraw = true) {
        const id = shape.id;
        delete this.shapes[id];
        return redraw ? this.draw() : this;
    }
    removeShapeWithId(id, redraw = true) {
        delete this.shapes[id];
        return redraw ? this.draw() : this;
    }
}
//# sourceMappingURL=Canvas.js.map