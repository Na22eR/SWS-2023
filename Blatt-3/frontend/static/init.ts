import {ShapeFactory, ShapeManager} from "./canvas/types.js";
import {CircleFactory, LineFactory, RectangleFactory, SelectionFactory, TriangleFactory} from "./canvas/Shapes.js";
import {ToolArea} from "./ToolArea.js";
import {Canvas} from "./canvas/Canvas.js";

export function initCanvas(): void{
    const canvasDomElm = document.getElementById("drawArea") as HTMLCanvasElement;
    const menu = document.getElementsByClassName("tools");
    // Problem here: Factories needs a way to create new Shapes, so they
    // have to call a method of the canvas.
    // The canvas on the other side wants to call the event methods
    // on the toolbar, because the toolbar knows what tool is currently
    // selected.
    // Anyway, we do not want the two to have references on each other
    let canvas: Canvas;
    const sm: ShapeManager = {
        addShape(s) {
            return canvas.addShape(s);
        },
        removeShape(s, bool) {
            return canvas.removeShape(s, bool);
        },
        iterateShapes(){
            return canvas.iterateShapes();
        },
        selectShapes(){
            return canvas.selectShapes();
        },
        selectShape() {
            return canvas.selectShape();
        },
        isShapeOnClickedPoint(x: number, y: number) {
            return canvas.isShapeOnClickedPoint(x,y);
        },

    };
    const shapesSelector: ShapeFactory[] = [
        new LineFactory(sm),
        new CircleFactory(sm),
        new RectangleFactory(sm),
        new TriangleFactory(sm),
        new SelectionFactory(sm),
    ];

    const toolArea = new ToolArea(shapesSelector, menu[0]);
    canvas = new Canvas(canvasDomElm, toolArea);
    canvas.drawCanvas();
}

initCanvas();