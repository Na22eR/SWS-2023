export interface Shape {
    readonly id: number;
    fillColor: string;
    strokeColor: string;

    draw(ctx: CanvasRenderingContext2D, isSelected: boolean, selectionColor: string);
    isSelected(x: number, y: number): boolean;
    setFillColor(color: string);
    setOutlineColor(color: string);

}

export interface ShapeManager {
    addShape(shape: Shape);
    removeShape(shape: Shape, bool: boolean);

    selectShape();
    selectShapes();

    iterateShapes();
    isShapeOnClickedPoint(x: number, y: number): boolean;

}

export interface ShapeFactory {
    label: string;
    handleMouseDown(x: number, y: number, e: MouseEvent);
    handleMouseUp(x: number, y: number, e: MouseEvent);
    handleMouseMove(x: number, y: number);
    handleMouseClick(x: number, y: number, e: MouseEvent);

}