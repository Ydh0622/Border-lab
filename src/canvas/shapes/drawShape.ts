import type { Shape } from './types';

export const drawShape = (ctx: CanvasRenderingContext2D, shape: Shape, isSelected: boolean) => {
  ctx.save();
  ctx.fillStyle = shape.fillColor;
  ctx.strokeStyle = shape.strokeColor;
  ctx.lineWidth = shape.strokeWidth;

  if (shape.type === 'rectangle') {
    ctx.beginPath();
    ctx.rect(shape.x, shape.y, shape.width, shape.height);
    ctx.fill();
    ctx.stroke();
  } else if (shape.type === 'circle') {
    const radiusX = Math.abs(shape.width) / 2;
    const radiusY = Math.abs(shape.height) / 2;
    const centerX = shape.x + radiusX;
    const centerY = shape.y + radiusY;

    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // 선택된 도형인 경우 Bounding Box 및 테두리 하이라이트 시각화
  if (isSelected) {
    ctx.strokeStyle = '#38bdf8'; // 하늘색 선택 가이드
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]); // 점선 표시
    ctx.strokeRect(shape.x - 4, shape.y - 4, shape.width + 8, shape.height + 8);
  }

  ctx.restore();
};