class Point2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class AbstractShape {
    constructor() {
        this.id = AbstractShape.counter++;
    }
    setFillColor(color) {
        this.fillColor = color;
    }
    setOutlineColor(color) {
        this.strokeColor = color;
    }
}
AbstractShape.counter = 0;
class AbstractFactory {
    constructor(shapeManager) {
        this.shapeManager = shapeManager;
    }
    handleMouseDown(x, y) {
        this.from = new Point2D(x, y);
    }
    handleMouseUp(x, y) {
        if (this.tmpShape) {
            this.shapeManager.removeShape(this.tmpShape, false);
        }
        this.shapeManager.addShape(this.createShape(this.from, new Point2D(x, y)));
        this.from = undefined;
    }
    handleMouseMove(x, y) {
        // show temp circle only, if the start point is defined;
        if (!this.from) {
            return;
        }
        if (!this.tmpTo || (this.tmpTo.x !== x || this.tmpTo.y !== y)) {
            this.tmpTo = new Point2D(x, y);
            if (this.tmpShape) {
                // remove the old temp line, if there was one
                this.shapeManager.removeShape(this.tmpShape, false);
            }
            // adds a new temp line
            this.tmpShape = this.createShape(this.from, new Point2D(x, y));
            this.shapeManager.addShape(this.tmpShape);
        }
    }
}
export class SelectionFactory {
    constructor(shapeManager) {
        this.shapeManager = shapeManager;
        this.label = "Selektion";
    }
    handleMouseDown(x, y, e) { }
    handleMouseMove(x, y) { }
    handleMouseUp(x, y, e) { }
    //used to handle selection
    handleMouseClick(x, y, e) {
        this.shapeManager.isShapeOnClickedPoint(x, y);
        if (e.ctrlKey) {
            this.shapeManager.selectShapes();
        }
        else if (e.altKey) {
            this.shapeManager.iterateShapes();
        }
        else {
            this.shapeManager.selectShape();
        }
    }
}
export class Line extends AbstractShape {
    constructor(from, to) {
        super();
        this.from = from;
        this.to = to;
        // low number = high accuracy => 10 points toleration allowed
        this.selectionAccuracy = 10;
    }
    draw(ctx, isSelected, colorForSelection) {
        ctx.beginPath();
        ctx.moveTo(this.from.x, this.from.y);
        ctx.lineTo(this.to.x, this.to.y);
        ctx.strokeStyle = this.strokeColor;
        ctx.stroke();
        if (isSelected) {
            ctx.fillStyle = colorForSelection;
            ctx.fillRect(this.from.x - 3, this.from.y - 3, 6, 6);
            ctx.fillRect(this.to.x - 3, this.to.y - 3, 6, 6);
        }
    }
    isSelected(x, y) {
        // method to calculate shortest distance between point and line taken from stack overflow:
        // https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
        let a = x - this.from.x;
        let b = y - this.from.y;
        let c = this.to.x - this.from.x;
        let d = this.to.y - this.from.y;
        let dot = a * c + b * d;
        let length_sqr = c * c + d * d;
        let parameter = -1;
        if (length_sqr != 0)
            parameter = dot / length_sqr;
        let xx, yy;
        if (parameter < 0) {
            xx = this.from.x;
            yy = this.from.y;
        }
        else if (parameter > 1) {
            xx = this.to.x;
            yy = this.to.y;
        }
        else {
            xx = this.from.x + parameter * c;
            yy = this.from.y + parameter * d;
        }
        let dx = x - xx;
        let dy = y - yy;
        let distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.selectionAccuracy;
    }
}
export class LineFactory extends AbstractFactory {
    constructor(shapeManager) {
        super(shapeManager);
        this.label = "Linie";
    }
    createShape(from, to) {
        return new Line(from, to);
    }
    handleMouseClick(x, y, e) {
    }
}
export class Circle extends AbstractShape {
    constructor(center, radius) {
        super();
        this.center = center;
        this.radius = radius;
    }
    draw(ctx, isSelected, colorForSelection) {
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.strokeColor;
        ctx.fill();
        ctx.stroke();
        if (isSelected) {
            ctx.fillStyle = colorForSelection;
            ctx.fillRect(this.center.x - (this.radius + 3), this.center.y, 6, 6);
            ctx.fillRect(this.center.x, this.center.y - (this.radius + 3), 6, 6);
            ctx.fillRect(this.center.x + (this.radius - 3), this.center.y, 6, 6);
            ctx.fillRect(this.center.x, this.center.y + (this.radius - 3), 6, 6);
        }
    }
    isSelected(x, y) {
        //true if distance between click and center of circle < radius
        let distanceSqr = Math.pow(this.center.x - x, 2) + Math.pow(this.center.y - y, 2);
        return distanceSqr < Math.pow(this.radius, 2);
    }
}
export class CircleFactory extends AbstractFactory {
    constructor(shapeManager) {
        super(shapeManager);
        this.label = "Kreis";
    }
    createShape(from, to) {
        return new Circle(from, CircleFactory.computeRadius(from, to.x, to.y));
    }
    static computeRadius(from, x, y) {
        const xDiff = (from.x - x), yDiff = (from.y - y);
        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    }
    handleMouseClick(x, y, e) {
    }
}
export class Rectangle extends AbstractShape {
    constructor(from, to) {
        super();
        this.from = from;
        this.to = to;
    }
    draw(ctx, isSelected, colorForSelection) {
        ctx.beginPath();
        ctx.rect(this.from.x, this.from.y, this.to.x - this.from.x, this.to.y - this.from.y);
        ctx.strokeStyle = this.strokeColor;
        ctx.fillStyle = this.fillColor;
        ctx.fill();
        ctx.stroke();
        if (isSelected) {
            ctx.fillStyle = colorForSelection;
            ctx.fillRect(this.from.x - 3, this.from.y - 3, 6, 6);
            ctx.fillRect(this.to.x - 3, this.from.y - 3, 6, 6);
            ctx.fillRect(this.to.x - 3, this.to.y - 3, 6, 6);
            ctx.fillRect(this.from.x - 3, this.to.y - 3, 6, 6);
        }
    }
    isSelected(x, y) {
        // when drawn from left to right
        if (this.from.x < this.to.x) {
            if (x < this.from.x || x > this.to.x) {
                return false;
            }
            //when drawn from top to bottom
            if (this.from.y < this.to.y) {
                return !(y < this.from.y || y > this.to.y);
            }
            //when drawn from bottom to top
            else {
                return !(y > this.from.y || y < this.to.y);
            }
        }
        // when drawn from right to left
        else {
            if (x > this.from.x || x < this.to.x) {
                return false;
            }
            //when drawn from top to bottom
            if (this.from.y < this.to.y) {
                return !(y < this.from.y || y > this.to.y);
            }
            //when drawn from bottom to top
            else {
                return !(y > this.from.y || y < this.to.y);
            }
        }
    }
}
export class RectangleFactory extends AbstractFactory {
    constructor(shapeManager) {
        super(shapeManager);
        this.label = "Rechteck";
    }
    createShape(from, to) {
        return new Rectangle(from, to);
    }
    handleMouseClick(x, y, e) {
    }
}
export class Triangle extends AbstractShape {
    constructor(p1, p2, p3) {
        super();
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
    }
    draw(ctx, isSelected, colorForSelection) {
        ctx.beginPath();
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.lineTo(this.p3.x, this.p3.y);
        ctx.lineTo(this.p1.x, this.p1.y);
        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.strokeColor;
        ctx.fill();
        ctx.stroke();
        if (isSelected) {
            ctx.fillStyle = colorForSelection;
            ctx.fillRect(this.p1.x - 3, this.p1.y - 3, 6, 6);
            ctx.fillRect(this.p2.x - 3, this.p2.y - 3, 6, 6);
            ctx.fillRect(this.p3.x - 3, this.p3.y - 3, 6, 6);
        }
    }
    isSelected(x, y) {
        // method to check if point in triangle taken from stack overflow:
        // https://stackoverflow.com/questions/2049582/how-to-determine-if-a-point-is-in-a-2d-triangle
        let v1, v2, v3;
        let negative, positive;
        v1 = check(x, y, this.p1, this.p2);
        v2 = check(x, y, this.p2, this.p3);
        v3 = check(x, y, this.p3, this.p1);
        negative = (v1 < 0) || (v2 < 0) || (v3 < 0);
        positive = (v1 > 0) || (v2 > 0) || (v3 > 0);
        return !(negative && positive);
        function check(x, y, p2, p3) {
            return (x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (y - p3.y);
        }
    }
}
export class TriangleFactory {
    constructor(shapeManager) {
        this.shapeManager = shapeManager;
        this.label = "Dreieck";
    }
    handleMouseDown(x, y) {
        if (this.tmpShape) {
            this.shapeManager.removeShape(this.tmpShape, false);
            this.shapeManager.addShape(new Triangle(this.from, this.tmpTo, new Point2D(x, y)));
            this.from = undefined;
            this.tmpTo = undefined;
            this.tmpLine = undefined;
            this.thirdPoint = undefined;
            this.tmpShape = undefined;
        }
        else {
            this.from = new Point2D(x, y);
        }
    }
    handleMouseUp(x, y) {
        // remove the temp line, if there was one
        if (this.tmpLine) {
            this.shapeManager.removeShape(this.tmpLine, false);
            this.tmpLine = undefined;
            this.tmpTo = new Point2D(x, y);
            this.thirdPoint = new Point2D(x, y);
            this.tmpShape = new Triangle(this.from, this.tmpTo, this.thirdPoint);
            this.shapeManager.addShape(this.tmpShape);
        }
    }
    handleMouseMove(x, y) {
        // show temp circle only, if the start point is defined;
        if (!this.from) {
            return;
        }
        if (this.tmpShape) { // second point already defined, update temp triangle
            if (!this.thirdPoint || (this.thirdPoint.x !== x || this.thirdPoint.y !== y)) {
                this.thirdPoint = new Point2D(x, y);
                if (this.tmpShape) {
                    // remove the old temp line, if there was one
                    this.shapeManager.removeShape(this.tmpShape, false);
                }
                // adds a new temp triangle
                this.tmpShape = new Triangle(this.from, this.tmpTo, this.thirdPoint);
                this.shapeManager.addShape(this.tmpShape);
            }
        }
        else { // no second point fixed, update tmp line
            if (!this.tmpTo || (this.tmpTo.x !== x || this.tmpTo.y !== y)) {
                this.tmpTo = new Point2D(x, y);
                if (this.tmpLine) {
                    // remove the old temp line, if there was one
                    this.shapeManager.removeShape(this.tmpLine, false);
                }
                // adds a new temp line
                this.tmpLine = new Line(this.from, this.tmpTo);
                this.shapeManager.addShape(this.tmpLine);
            }
        }
    }
    handleMouseClick(x, y, e) {
    }
}
//# sourceMappingURL=Shapes.js.map