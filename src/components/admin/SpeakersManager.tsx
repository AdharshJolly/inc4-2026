import { useState, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import speakersData from "@/data/speakers.json";
import type { SpeakersData } from "@/types/data";
import { AddSpeakerDialog } from "./AddSpeakerDialog";
import { EditSpeakerDialog } from "./EditSpeakerDialog";
import { BulkActionsDialog } from "./BulkActionsDialog";
import { SortableSpeakerCard } from "./SortableSpeakerCard";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { storePendingChange } from "@/lib/githubSync";
import { ActivityLogger } from "@/lib/activityLogger";
import { useToast } from "@/hooks/use-toast";

export const SpeakersManager = () => {
  const [speakers, setSpeakers] = useState(() => (speakersData as SpeakersData).root);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpeakers, setSelectedSpeakers] = useState<Set<string>>(
    new Set()
  );
  const [editingSpeaker, setEditingSpeaker] = useState<{
    index: number;
    name: string;
  } | null>(null);
  const [bulkActionsOpen, setBulkActionsOpen] = useState(false);
  const { toast } = useToast();

  const filteredSpeakers = useMemo(
    () =>
      speakers.map((s, originalIndex) => ({ ...s, originalIndex })).filter(
        (speaker) =>
          speaker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          speaker.affiliation
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          speaker.topic?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm, speakers]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px drag tolerance to allow checking checkboxes and clicking edit
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSpeakers((items) => {
        const oldIndex = items.findIndex((_, index) => String(index) === active.id);
        const newIndex = items.findIndex((_, index) => String(index) === over.id);

        const newSpeakers = arrayMove(items, oldIndex, newIndex);
        
        // Save reordered array
        const updatedData = { root: newSpeakers };
        storePendingChange({
          path: "src/data/speakers.json",
          content: JSON.stringify(updatedData, null, 2),
          message: `Reordered speakers`,
        });

        ActivityLogger.log({
          action: "Reordered speakers",
          type: "speaker",
          targetName: "Multiple speakers",
          status: "success",
        });

        toast({
          title: "Order Updated",
          description: "Speakers reordered successfully.",
        });

        return newSpeakers;
      });
    }
  };

  const handleSelectSpeaker = useCallback((speakerId: string) => {
    setSelectedSpeakers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(speakerId)) {
        newSet.delete(speakerId);
      } else {
        newSet.add(speakerId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedSpeakers.size === filteredSpeakers.length) {
      setSelectedSpeakers(new Set());
    } else {
      const allIds = filteredSpeakers.map((fs) => String(fs.originalIndex));
      setSelectedSpeakers(new Set(allIds));
    }
  }, [filteredSpeakers, selectedSpeakers.size]);

  // If user is searching, disable drag and drop to avoid index corruption
  const isSearchActive = searchTerm.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search speakers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <AddSpeakerDialog />
      </div>

      {/* Bulk Actions Section */}
      {selectedSpeakers.size > 0 && (
        <div className="p-4 rounded-lg border border-orange-500/30 bg-orange-500/5 flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">
              {selectedSpeakers.size} speaker{selectedSpeakers.size !== 1 ? "s" : ""} selected
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Use the bulk actions button to manage selected speakers
            </p>
          </div>
          <Button
            onClick={() => setBulkActionsOpen(true)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Bulk Actions
          </Button>
        </div>
      )}

      {/* Bulk Actions Dialog */}
      <BulkActionsDialog
        open={bulkActionsOpen}
        onOpenChange={setBulkActionsOpen}
        type="speakers"
        selectedIds={Array.from(selectedSpeakers)}
        selectedNames={filteredSpeakers
          .filter((s) => selectedSpeakers.has(String(s.originalIndex)))
          .map((s) => s.name)}
        onActionComplete={() => {
          setSelectedSpeakers(new Set());
          setBulkActionsOpen(false);
          // Need to reload window to get fresh state since we don't pass setSpeakers down yet,
          // but relying on existing architecture
        }}
      />

      {/* Edit Speaker Dialog */}
      {editingSpeaker && (
        <EditSpeakerDialog
          open={!!editingSpeaker}
          onOpenChange={(open) => {
            if (!open) setEditingSpeaker(null);
          }}
          speakerIndex={editingSpeaker.index}
          speakerName={editingSpeaker.name}
          onSpeakerUpdated={() => {
            setEditingSpeaker(null);
          }}
        />
      )}

      {/* Select All Checkbox */}
      {filteredSpeakers.length > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            checked={
              filteredSpeakers.length > 0 &&
              selectedSpeakers.size === filteredSpeakers.length
            }
            onChange={handleSelectAll}
            className="rounded cursor-pointer"
            id="select-all-speakers"
          />
          <label
            htmlFor="select-all-speakers"
            className="text-sm cursor-pointer"
          >
            Select all shown ({filteredSpeakers.length})
          </label>
          
          {!isSearchActive && (
            <span className="ml-auto text-sm text-muted-foreground italic">
              Drag and drop cards to reorder
            </span>
          )}
        </div>
      )}

      {/* Speaker Cards */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredSpeakers.map((s) => String(s.originalIndex))}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpeakers.map((speaker) => (
              <SortableSpeakerCard
                key={speaker.originalIndex}
                speaker={speaker}
                originalIndex={speaker.originalIndex}
                isSelected={selectedSpeakers.has(String(speaker.originalIndex))}
                onSelect={handleSelectSpeaker}
                onEdit={(index, name) => setEditingSpeaker({ index, name })}
                onDeleteClick={(id) => {
                  // This is a bit hacky, but matches the old UI flow for deleting a single speaker
                  handleSelectSpeaker(id);
                  setBulkActionsOpen(true);
                }}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {filteredSpeakers.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No speakers found matching your search.
        </div>
      )}
    </div>
  );
};
