export type ShapeType = 'rectangle' | 'circle' | 'select';

export interface BaseShape {
  id: string;
  type: ShapeType;
  x: number;       // World Coordinate X
  y: number;       // World Coordinate Y
  width: number;
  height: number;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
}

export interface RectangleShape extends BaseShape {
  type: 'rectangle';
}

export interface CircleShape extends BaseShape {
  type: 'circle';
}

export type Shape = RectangleShape | CircleShape;