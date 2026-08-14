import { create } from 'zustand';

interface ViewportState {
  panX: number;
  panY: number;
  zoom: number;
  setPan: (panX: number, panY: number) => void;
  setZoom: (zoom: number) => void;
  updatePan: (deltaX: number, deltaY: number) => void;
  resetViewport: () => void;
}

export const useViewportStore = create<ViewportState>((set) => ({
  panX: 0,
  panY: 0,
  zoom: 1, // 기본 Zoom: 100%

  setPan: (panX, panY) => set({ panX, panY }),
  setZoom: (zoom) => set({ zoom: Math.min(Math.max(zoom, 0.1), 5) }), // 10% ~ 500% 제한

  updatePan: (deltaX, deltaY) =>
    set((state) => ({
      panX: state.panX + deltaX,
      panY: state.panY + deltaY,
    })),

  resetViewport: () => set({ panX: 0, panY: 0, zoom: 1 }),
}));