import { create } from 'zustand';
import type { ShapeType } from '../canvas/shapes/types';

interface ToolState {
  selectedTool: ShapeType;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  setSelectedTool: (tool: ShapeType) => void;
  setFillColor: (color: string) => void;
  setStrokeColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
}

export const useToolStore = create<ToolState>((set) => ({
  selectedTool: 'select', // 기본값: 선택 툴
  fillColor: '#3b82f6',   // 기본 채우기 색상 (파란색)
  strokeColor: '#93c5fd', // 기본 테두리 색상
  strokeWidth: 2,

  setSelectedTool: (tool) => set({ selectedTool: tool }),
  setFillColor: (color) => set({ fillColor: color }),
  setStrokeColor: (color) => set({ strokeColor: color }),
  setStrokeWidth: (width) => set({ strokeWidth: width }),
}));