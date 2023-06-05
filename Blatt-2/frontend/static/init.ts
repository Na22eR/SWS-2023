import {ShapeFactory, ShapeManager} from "./types";
import {CircleFactory, LineFactory, RectangleFactory, TriangleFactory} from "./Shapes";
import {ToolArea} from "./ToolArea";
import {Canvas} from "./Canvas";

function init() {
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
        addShape(s, rd) {
            return canvas.addShape(s,rd);
        },
        removeShape(s,rd) {
            return canvas.removeShape(s,rd);
        },
        removeShapeWithId(id, rd) {
            return canvas.removeShapeWithId(id, rd);
        }
    };
    const shapesSelector: ShapeFactory[] = [
        new LineFactory(sm),
        new CircleFactory(sm),
        new RectangleFactory(sm),
        new TriangleFactory(sm)
    ];
    const toolArea = new ToolArea(shapesSelector, menu[0]);
    canvas = new Canvas(canvasDomElm, toolArea);
    canvas.draw();
}
init();