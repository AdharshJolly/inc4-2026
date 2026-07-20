import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';
import { Edit, Trash2, GripVertical, User } from 'lucide-react';
import { getPhotoUrl } from '@/lib/photoMigration';
import { isExternalUrl } from '@/lib/utils';
import type { SpeakerItem } from '@/types/data';

interface SortableSpeakerCardProps {
  speaker: SpeakerItem;
  id: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit: (id: string, name: string) => void;
  onDeleteClick: (id: string) => void;
}

export function SortableSpeakerCard({
  speaker,
  id,
  isSelected,
  onSelect,
  onEdit,
  onDeleteClick,
}: SortableSpeakerCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const photoUrl = getPhotoUrl(speaker.photo);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex items-center gap-4 p-4 rounded-2xl border bg-card transition-all duration-200 cursor-pointer
        ${isDragging ? 'shadow-2xl scale-[1.02] border-primary/40 opacity-90' : ''}
        ${isSelected
          ? 'border-orange-500/50 bg-orange-500/5 shadow-md shadow-orange-500/10'
          : 'border-border/60 hover:border-border hover:shadow-md hover:bg-muted/30'
        }`}
      onClick={() => onSelect(id)}
    >
      {/* Checkbox */}
      <div className="absolute top-3 right-3 z-10" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(id)}
          className="w-3.5 h-3.5 rounded cursor-pointer accent-orange-500"
        />
      </div>

      {/* Avatar */}
      <div className="relative w-14 h-14 shrink-0">
        <div className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-colors ${
          isSelected ? 'border-orange-500/50' : 'border-border/60 group-hover:border-border'
        }`}>
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={speaker.name}
              fill
              className="object-cover"
              sizes="56px"
              unoptimized={isExternalUrl(photoUrl)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-orange-500/5 flex items-center justify-center">
              <span className="text-lg font-bold text-orange-500">
                {speaker.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 pr-6">
        <p className="font-semibold text-sm text-foreground truncate leading-tight">{speaker.name}</p>
        <p className="text-xs text-orange-500 font-medium truncate mt-0.5">{speaker.role}</p>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{speaker.affiliation}</p>
        {speaker.topic && (
          <span className="inline-block mt-1.5 text-[10px] font-semibold bg-orange-500/10 text-orange-500 rounded-full px-2 py-0.5 border border-orange-500/20 truncate max-w-full">
            {speaker.topic}
          </span>
        )}
      </div>

      {/* Action buttons — visible on hover/selected */}
      <div
        className={`absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-1.5 transition-all duration-150 ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onEdit(id, speaker.name)}
          className="p-1.5 rounded-lg bg-background border border-border/60 hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-all"
          title="Edit"
        >
          <Edit className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => { onSelect(id); onDeleteClick(id); }}
          className="p-1.5 rounded-lg bg-background border border-border/60 hover:border-red-500/40 hover:bg-red-500/5 text-muted-foreground hover:text-red-500 transition-all"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Drag handle — far right */}
      <div
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground/40 hover:text-muted-foreground cursor-grab active:cursor-grabbing transition-colors"
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        title="Drag to reorder"
      >
        <GripVertical className="w-4 h-4" />
      </div>
    </div>
  );
}
