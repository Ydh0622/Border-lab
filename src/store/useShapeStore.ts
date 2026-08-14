import { create } from 'zustand';
import type { Shape } from '../canvas/shapes/types';

interface ShapeState {
  shapes: Shape[];
  selectedShapeIds: string[];
  addShape: (shape: Shape) => void;
  updateShape: (id: string, partialShape: Partial<Shape>) => void;
  setSelectedShapeIds: (ids: string[]) => void;
  clearSelection: () => void;
}

export const useShapeStore = create<ShapeState>((set) => ({
  shapes: [],
  selectedShapeIds: [],

  addShape: (shape) =>
    set((state) => ({ shapes: [...state.shapes, shape] })),

  updateShape: (id, partialShape) =>
    set((state) => ({
      shapes: state.shapes.map((s) => (s.id === id ? { ...s, ...partialShape } : s)),
    })),

  setSelectedShapeIds: (ids) => set({ selectedShapeIds: ids }),
  clearSelection: () => set({ selectedShapeIds: [] }),
}));