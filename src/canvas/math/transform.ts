export interface Point {
  x: number;
  y: number;
}

export interface Viewport {
  panX: number;
  panY: number;
  zoom: number;
}

/**
 * Screen Coordinate -> World Coordinate 변환
 * 브라우저 마우스 클릭 위치를 무한 캔버스 절대 좌표로 변환
 */
export const screenToWorld = (screenPoint: Point, viewport: Viewport): Point => {
  return {
    x: (screenPoint.x - viewport.panX) / viewport.zoom,
    y: (screenPoint.y - viewport.panY) / viewport.zoom,
  };
};

/**
 * World Coordinate -> Screen Coordinate 변환
 * 캔버스 절대 좌표를 브라우저 뷰포트 화면 픽셀 위치로 변환
 */
export const worldToScreen = (worldPoint: Point, viewport: Viewport): Point => {
  return {
    x: worldPoint.x * viewport.zoom + viewport.panX,
    y: worldPoint.y * viewport.zoom + viewport.panY,
  };
};

/**
 * 마우스 포인터를 기준으로 한 Zoom Anchor 계산
 */
export const calculateZoomAtPoint = (
  cursorScreenPoint: Point,
  currentViewport: Viewport,
  newZoom: number
): { panX: number; panY: number; zoom: number } => {
  const worldPoint = screenToWorld(cursorScreenPoint, currentViewport);

  const newPanX = cursorScreenPoint.x - worldPoint.x * newZoom;
  const newPanY = cursorScreenPoint.y - worldPoint.y * newZoom;

  return {
    panX: newPanX,
    panY: newPanY,
    zoom: newZoom,
  };
};