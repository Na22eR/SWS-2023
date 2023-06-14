import {Shape, ShapeManager} from "./types";
import {ToolArea} from "../ToolArea";
import {MenuApi} from "./menuApi.js";
import {Menu} from "./menu.js";

export class Canvas implements ShapeManager {

    private ctx: CanvasRenderingContext2D;

    //Dom element to draw every created shape
    private readonly canvasDomElement: HTMLCanvasElement;

    //holds every shape after being created
    private _canvasShapes: Map<number, Shape> = new Map();
    //holds temporarily all the shapes that are clicked
    private shapesOnClickedPoint: Shape[] = [];
    //holds every selected shape
    selectedShapes: Shape[] = [];


    private readonly width: number;
    private readonly height: number;
    private readonly selectionColor = `rgb(0, 255, 115)`;

    private readonly standardFillColor: string = "transparent";
    private readonly standardOutlineColor: string = "black";


    constructor(canvasDomElement: HTMLCanvasElement, toolArea: ToolArea) {

        this.canvasDomElement = canvasDomElement;

        this.ctx = this.canvasDomElement.getContext("2d");

        const {width, height} = this.canvasDomElement.getBoundingClientRect();
        this.width = width;
        this.height = height;

        this.canvasDomElement.addEventListener("mousemove",
            this.createMouseHandler("handleMouseMove", this.canvasDomElement, toolArea));
        this.canvasDomElement.addEventListener("mousedown",
            this.createMouseHandler("handleMouseDown", this.canvasDomElement, toolArea));
        this.canvasDomElement.addEventListener("mouseup",
            this.createMouseHandler("handleMouseUp", this.canvasDomElement, toolArea));
        this.canvasDomElement.addEventListener("click",
            this.createMouseHandler("handleMouseClick", this.canvasDomElement, toolArea));

        this.canvasDomElement.addEventListener("contextmenu", ev => {
            ev.preventDefault();
            const toolSelection = toolArea.getSelectedShape();
            if (toolSelection !== undefined) {
                if (toolSelection.label === "Selektion") {
                    let contextMenu: Menu = this.setupContextMenu();
                    contextMenu.show(ev.clientX, ev.clientY);
                }
            }
        });

    }

    createMouseHandler(methodName: string, canvasDomElement, toolArea) {
        return function (e) {
            e = e || window.event;

            if ('object' === typeof e) {
                const
                    x = e.clientX - canvasDomElement.offsetLeft,
                    y = e.clientY - canvasDomElement.offsetTop,
                    ss = toolArea.getSelectedShape();
                // if left mouse button is pressed,
                // and if a tool is selected, do something
                if (e.button === 0 && ss) {
                    const m = ss[methodName];
                    // This in the shapeFactory should be the factory itself.
                    m.call(ss, x, y, e);
                }
            }
        }
    }

    drawCanvas() {
        let markingColor;
        this.setContextToCanvas();
        this.ctx.beginPath();
        //used to reset the canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        //checks if shape is selected and sets color appropriately
        this._canvasShapes.forEach((shape) => {
            let isSelected = false;

            for (let selectedShape of this.selectedShapes) {
                if (shape.id === selectedShape.id) {
                    isSelected = true;
                    markingColor = this.selectionColor;
                    break;
                }
            }

            //draw background shapes
            this.setCtxStandardState();
            shape.draw(this.ctx, isSelected, markingColor);
        });
    }

    addShape(shape: Shape) {
        this._canvasShapes.set(shape.id, shape);
        this.drawCanvas();
    }

    removeShape(shape: Shape, bool: boolean) {
        this._canvasShapes.delete(shape.id);
        this.selectedShapes = this.selectedShapes.filter(selShape => selShape.id !== shape.id);
        bool ? this.drawCanvas() : this;
    }

    isShapeOnClickedPoint(x: number, y: number): boolean {
        this.shapesOnClickedPoint = [];
        let isShapeOnPoint: boolean = false;
        this._canvasShapes.forEach((Shape) => {
            if (Shape.isSelected(x, y)) {
                this.shapesOnClickedPoint.push(Shape);
                isShapeOnPoint = true;
            }
        });
        return isShapeOnPoint;
    }

    iterateShapes() {
        if (this.shapesOnClickedPoint.length > 0) {
            //offset is used so iteration ignores previously selected shapes
            //offset is the number of shapes that were previously selected
            var offset = this.selectedShapes.length
            let index = this.shapesOnClickedPoint.indexOf(this.selectedShapes[offset-1]);

            //only unselect the last selected shape is in shapesOnClickedPoint
            if (this.shapesOnClickedPoint.length - 1 > index) {
                if (this.selectedShapes[offset-1] && this.shapesOnClickedPoint.includes(this.selectedShapes[offset-1])) {
                    this.doUnselectShape(this.selectedShapes[offset-1]);
                }
                this.doSelectShape(this.shapesOnClickedPoint[index + 1]);

            //else is used when the end of the shapesOnClickedPoint array is reached
            } else {
                //only handle selection if the last selected shape and the shapeOnClick are different
                if (this.selectedShapes[offset-1] !== this.shapesOnClickedPoint[0]) {
                    if (this.selectedShapes[offset-1]) {
                        this.doUnselectShape(this.selectedShapes[offset-1]);
                    }
                    this.doSelectShape(this.shapesOnClickedPoint[0]);
                }
            }
        }
    }

    private changeShapeOrder(toForeGround: boolean) {
        const shapeToMove: Shape = this.selectedShapes[0];

        // selected shape is deleted so position can be changed
        this.removeShape(shapeToMove, true);

        if (toForeGround) {
            this.addShape(shapeToMove);
        } else {
            this.doMoveToBackground(shapeToMove);
        }
        //add shape to selected shapes again
        this.doSelectShape(shapeToMove);
    }

    selectShapes() {
        if (this.shapesOnClickedPoint.length > 0) {
            if (!this.selectedShapes.includes(this.shapesOnClickedPoint[0])) {
                this.doSelectShape(this.shapesOnClickedPoint[0]);
            }
        }
    }

    selectShape() {
        this.selectedShapes.forEach(shape => {
            this.doUnselectShape(shape);
        });
        if (this.shapesOnClickedPoint.length > 0) {
            this.doSelectShape(this.shapesOnClickedPoint[0]);
        }
    }

    private doSelectShape(shapeToSelect: Shape) {
        const shape = this._canvasShapes.get(shapeToSelect.id);
        if (shape !== undefined) {
            this.selectedShapes.push(shape);
            this.drawCanvas();
        }

    }

    private doUnselectShape(shapeToUnselect: Shape) {
        const shape = this._canvasShapes.get(shapeToUnselect.id);
        if (shape !== undefined) {
            this.selectedShapes = this.selectedShapes.filter(shape => shape.id !== shapeToUnselect.id);
            this.drawCanvas();
        }
    }

    private doMoveToBackground(shapeToMove: Shape) {
        // two maps are combined, with the first having the shape that should be at the start
        // and the second being the shapes map holding the rest of the shapes.
        const helperMap: Map<number, Shape> = new Map();
        helperMap.set(shapeToMove.id, shapeToMove);
        this._canvasShapes = new Map([...helperMap, ...this._canvasShapes]);
        this.drawCanvas();
    }


    setupContextMenu(): Menu {
        let currentFillColor = this.standardFillColor;
        let currentOutlineColor = this.standardOutlineColor;

        // if one shape selected the options will be set to the current state
        if (this.selectedShapes.length < 2 && this.selectedShapes[0] != undefined) {
            if (this.selectedShapes[0].fillColor != undefined)
                currentFillColor = this.selectedShapes[0].fillColor;
            if (this.selectedShapes[0].strokeColor != undefined)
                currentOutlineColor = this.selectedShapes[0].strokeColor;
        }

        let menu = MenuApi.createMenu();
        let deleteItem = MenuApi.createItem("Delete", () => {
            this.selectedShapes.forEach((shape) => {
                this.removeShape(shape, true)
            });
        });

        const moveForeGroundItem = MenuApi.createItem("To Foreground", () => {
            if (this.selectedShapes.length == 1) {
                this.changeShapeOrder(true);
            }
        });
        const moveToBackGroundItem = MenuApi.createItem("To Background", () => {
            if (this.selectedShapes.length == 1) {
                this.changeShapeOrder(false);
            }
        });

        // if none or more than one shape is selected the options were not changed and will still be in standard state
        let radioColorOption = MenuApi.createRadioOption(
            "Background color",
            {"transparent": "transparent", "red": "rot", "green": "grün", "blue": "blau", "black": "schwarz"},
            currentFillColor,
            this,
            true,
        );
        let radioLineOption = MenuApi.createRadioOption(
            "Outline color",
            {"red": "rot", "green": "grün", "blue": "blau", "black": "schwarz"},
            currentOutlineColor,
            this,
            false,
        );

        let sep1 = MenuApi.createSeparator();
        let sep2 = MenuApi.createSeparator();
        let sep3 = MenuApi.createSeparator();
        let sep4 = MenuApi.createSeparator();


        menu.addItem(deleteItem);
        menu.addItem(sep1);
        menu.addItem(radioColorOption);
        menu.addItem(sep2);
        menu.addItem(radioLineOption);
        menu.addItem(sep3);
        menu.addItem(moveForeGroundItem);
        menu.addItem(sep4);
        menu.addItem(moveToBackGroundItem);
        return menu;
    }

    private setContextToCanvas() {
        this.ctx = this.canvasDomElement.getContext("2d");
    }

    private setCtxStandardState() {
        this.ctx.fillStyle = this.standardFillColor;
        this.ctx.strokeStyle = this.standardOutlineColor;
        this.ctx.save();
    }

}
