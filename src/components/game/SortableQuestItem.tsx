"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SortableQuestItemProps {
  id: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export const SortableQuestItem = ({ id, children, disabled }: SortableQuestItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={cn(
        "relative group flex items-center gap-2",
        isDragging && "opacity-50 scale-[1.02] rotate-1 shadow-2xl z-50"
      )}
    >
      {!disabled && (
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab active:cursor-grabbing p-2 text-slate-300 hover:text-indigo-500 transition-colors"
        >
          <GripVertical className="w-5 h-5" />
        </div>
      )}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};