import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, GripVertical } from 'lucide-react';
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
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative border rounded-lg overflow-hidden transition-all bg-card ${
        isSelected
          ? "border-orange-500/50 bg-orange-500/5 shadow-lg"
          : "border-border hover:border-primary/40 hover:shadow-lg"
      } ${isDragging ? "shadow-2xl scale-[1.02]" : ""}`}
      onClick={() => onSelect(id)}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(id)}
          onClick={(e) => e.stopPropagation()}
          className="rounded cursor-pointer"
        />
      </div>

      {/* Drag Handle */}
      <div
        className="absolute top-3 right-3 z-10 p-1.5 bg-background/80 backdrop-blur-sm rounded-md shadow-sm cursor-grab active:cursor-grabbing hover:bg-background border border-border"
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Image */}
      <div className="relative h-48 bg-muted">
        {getPhotoUrl(speaker.photo) ? (
          <Image
            src={getPhotoUrl(speaker.photo)}
            alt={speaker.name}
            fill
            className="object-cover pointer-events-none"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={isExternalUrl(getPhotoUrl(speaker.photo))}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-bold text-muted-foreground">
              {speaker.name.charAt(0)}
            </span>
          </div>
        )}

        {speaker.topic && (
          <div className="absolute top-12 left-2 z-10">
            <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              {speaker.topic}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{speaker.name}</h3>
        <p className="text-sm text-orange-500 font-medium mb-2">
          {speaker.role}
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          {speaker.affiliation}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(id, speaker.name);
            }}
          >
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-500 hover:text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(id);
              onDeleteClick(id);
            }}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
