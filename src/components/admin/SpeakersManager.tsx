import { useState, useCallback, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users } from "lucide-react";
import { AddSpeakerDialog } from "./AddSpeakerDialog";
import { EditSpeakerDialog } from "./EditSpeakerDialog";
import { BulkActionsDialog } from "./BulkActionsDialog";
import { SortableSpeakerCard } from "./SortableSpeakerCard";
import { SkeletonList } from "./Skeleton";
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
import { ActivityLogger } from "@/lib/activityLogger";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";

export const SpeakersManager = () => {
  const [speakers, setSpeakers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpeakers, setSelectedSpeakers] = useState<Set<string>>(
    new Set()
  );
  const [editingSpeaker, setEditingSpeaker] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [bulkActionsOpen, setBulkActionsOpen] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  const fetchSpeakers = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("speakers")
      .select("*")
      .order("order_index", { ascending: true });

    if (data && !error) {
      const mapped = data.map((s: any) => ({
        ...s,
        photo: { url: s.photo_url },
        originalIndex: s.order_index,
      }));
      setSpeakers(mapped);
    }
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchSpeakers();
  }, [fetchSpeakers]);

  const filteredSpeakers = useMemo(
    () =>
      speakers.filter(
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
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = speakers.findIndex((s) => s.id === active.id);
      const newIndex = speakers.findIndex((s) => s.id === over.id);

      const newSpeakers = arrayMove(speakers, oldIndex, newIndex);
      
      // Optimistic update
      setSpeakers(newSpeakers.map((s, idx) => ({ ...s, order_index: idx, originalIndex: idx })));

      // Update in Supabase
      const updates = newSpeakers.map((speaker, index) => ({
        id: speaker.id,
        order_index: index,
      }));

      for (const update of updates) {
        await supabase
          .from("speakers")
          .update({ order_index: update.order_index })
          .eq("id", update.id);
      }

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
      const allIds = filteredSpeakers.map((fs) => fs.id);
      setSelectedSpeakers(new Set(allIds));
    }
  }, [filteredSpeakers, selectedSpeakers.size]);

  const isSearchActive = searchTerm.trim().length > 0;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, affiliation or topic…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <AddSpeakerDialog onSpeakerAdded={fetchSpeakers} />
      </div>

      {/* Selection bar */}
      {selectedSpeakers.size > 0 && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-orange-500/30 bg-orange-500/5">
          <p className="text-sm font-medium">
            {selectedSpeakers.size} speaker{selectedSpeakers.size !== 1 ? "s" : ""} selected
          </p>
          <Button
            size="sm"
            onClick={() => setBulkActionsOpen(true)}
            className="h-8 text-xs bg-primary hover:bg-primary/90"
          >
            Bulk Actions
          </Button>
        </div>
      )}

      <BulkActionsDialog
        open={bulkActionsOpen}
        onOpenChange={setBulkActionsOpen}
        type="speakers"
        selectedIds={Array.from(selectedSpeakers)}
        selectedNames={filteredSpeakers
          .filter((s) => selectedSpeakers.has(s.id))
          .map((s) => s.name)}
        onActionComplete={() => {
          setSelectedSpeakers(new Set());
          setBulkActionsOpen(false);
          fetchSpeakers();
        }}
      />

      {editingSpeaker && (
        <EditSpeakerDialog
          open={!!editingSpeaker}
          onOpenChange={(open) => { if (!open) setEditingSpeaker(null); }}
          speakerId={editingSpeaker.id}
          speakerName={editingSpeaker.name}
          onSpeakerUpdated={() => { setEditingSpeaker(null); fetchSpeakers(); }}
        />
      )}

      {/* Select-all row */}
      {filteredSpeakers.length > 0 && (
        <div className="flex items-center gap-2 px-1">
          <input
            type="checkbox"
            checked={filteredSpeakers.length > 0 && selectedSpeakers.size === filteredSpeakers.length}
            onChange={handleSelectAll}
            className="w-3.5 h-3.5 rounded cursor-pointer accent-orange-500"
            id="select-all-speakers"
          />
          <label htmlFor="select-all-speakers" className="text-xs text-muted-foreground cursor-pointer select-none">
            Select all ({filteredSpeakers.length})
          </label>
          {!isSearchActive && (
            <span className="ml-auto text-xs text-muted-foreground/60 italic">
              Drag to reorder
            </span>
          )}
        </div>
      )}

      {/* Speaker list */}
      {isLoading ? (
        <SkeletonList count={4} />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filteredSpeakers.map((s) => s.id)} strategy={rectSortingStrategy}>
            <div className="space-y-2">
              {filteredSpeakers.map((speaker) => (
                <SortableSpeakerCard
                  key={speaker.id}
                  speaker={speaker}
                  id={speaker.id}
                  isSelected={selectedSpeakers.has(speaker.id)}
                  onSelect={handleSelectSpeaker}
                  onEdit={(id, name) => setEditingSpeaker({ id, name })}
                  onDeleteClick={(id) => {
                    handleSelectSpeaker(id);
                    setBulkActionsOpen(true);
                  }}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {!isLoading && filteredSpeakers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">
            {searchTerm ? "No speakers match your search" : "No speakers yet"}
          </p>
          <p className="text-xs text-muted-foreground">
            {searchTerm ? "Try adjusting your search terms" : "Add your first speaker to get started"}
          </p>
        </div>
      )}
    </div>
  );
};

