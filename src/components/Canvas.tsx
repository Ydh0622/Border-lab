import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useViewportStore } from '../store/useViewportStore';
import { calculateZoomAtPoint } from '../canvas/math/transform';

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Viewport 스토어 상태 및 액션
  const { panX, panY, zoom, updatePan, setPan, setZoom } = useViewportStore();

  // 마우스 상태 (Pan 중인지 여부)
  const [isPanning, setIsPanning] = useState(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // 1. 브라우저 창 크기에 맞게 Canvas 픽셀 해상도 동기화
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Retina Display(고해상도) 대응
    const dpr = window.devicePixelRatio || 1;
    const width = container.clientWidth;
    const height = container.clientHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // 2. Canvas 렌더링 루프 (Pan/Zoom 반영 & 격자/그리드 및 기준선 그리기)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    // 캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    // DPR 및 Viewport Matrix 적용 (Pan & Zoom)
    ctx.scale(dpr, dpr);
    ctx.translate(panX, panY);
    ctx.scale(zoom, zoom);

    // [임시 시각화] 무한 캔버스 감각을 위한 100px 격자(Grid) 패턴
    const gridSize = 100;
    const startX = Math.floor((-panX / zoom) / gridSize) * gridSize - gridSize;
    const startY = Math.floor((-panY / zoom) / gridSize) * gridSize - gridSize;
    const endX = startX + (canvas.width / dpr / zoom) + gridSize * 2;
    const endY = startY + (canvas.height / dpr / zoom) + gridSize * 2;

    ctx.strokeStyle = '#1e293b'; // 격자선 색상
    ctx.lineWidth = 1 / zoom; // Zoom 레벨에 상관없이 일정 선 굵기 유지

    ctx.beginPath();
    for (let x = startX; x < endX; x += gridSize) {
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
    }
    for (let y = startY; y < endY; y += gridSize) {
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
    }
    ctx.stroke();

    // [임시 시각화] World 원점 (0,0) 십자가 표시
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2 / zoom;
    ctx.beginPath();
    ctx.moveTo(-20, 0); ctx.lineTo(20, 0);
    ctx.moveTo(0, -20); ctx.lineTo(0, 20);
    ctx.stroke();

    ctx.restore();
  }, [panX, panY, zoom]);

  // 3. Pan (화면 이동) - 마우스 휠 클릭 또는 우클릭 드래그
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button === 1 || e.button === 2) {
      setIsPanning(true);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPanning) return;

    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;

    updatePan(deltaX, deltaY);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isPanning) {
      setIsPanning(false);
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
  };

  // 4. Zoom (확대/축소) - 마우스 커서 위치 기준 Anchor 축소/확대
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.1), 5);

    const cursorScreenPoint = { x: e.clientX, y: e.clientY };
    const newViewport = calculateZoomAtPoint(
      cursorScreenPoint,
      { panX, panY, zoom },
      newZoom
    );

    setPan(newViewport.panX, newViewport.panY);
    setZoom(newViewport.zoom);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-slate-900 cursor-crosshair select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        className="block w-full h-full touch-none"
      />

      {/* 우측 하단 뷰포트 정보 Overlay */}
      <div className="absolute bottom-4 right-4 bg-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 border border-slate-700 pointer-events-none">
        Zoom: {Math.round(zoom * 100)}% | Pan: ({Math.round(panX)}, {Math.round(panY)})
      </div>
    </div>
  );
};