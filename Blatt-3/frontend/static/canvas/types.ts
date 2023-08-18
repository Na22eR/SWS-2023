import {Point2D} from "./Shapes.js";
import {ShapeTypes} from "../enums/ShapeTypes";

export interface Shape {
    readonly id: string;
    fillColor: string;
    strokeColor: string;
    type: ShapeTypes;

    draw(ctx: CanvasRenderingContext2D, isSelected: boolean, selectionColor: string);
    isSelected(x: number, y: number): boolean;
    setFillColor(color: string);
    setOutlineColor(color: string);
    copyShape(positionMovement?: Point2D): Shape;

}

export interface ShapeManager {
    addShape(shape: Shape, shapeFinished: boolean, shapeMoved?: boolean);

    selectShape();
    selectShapes();

    iterateShapes();
    makeShapeTransparent(oldShape: Shape): void;

    isShapeOnClickedPoint(x: number, y: number): boolean;
    isShapeReadyToMove(x: number, y: number): Shape;

}

export interface ShapeFactory {
    label: string;

    handleMouseDown(x: number, y: number, e: MouseEvent);
    handleMouseUp(x: number, y: number, e: MouseEvent);
    handleMouseMove(x: number, y: number);
    handleMouseClick(x: number, y: number, e: MouseEvent);

}
