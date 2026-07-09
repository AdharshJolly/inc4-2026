import { useState, useCallback, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
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
import { ActivityLogger } from "@/lib/activityLogger";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";

export const SpeakersManager = () => {
  const [speakers, setSpeakers] = useState<any[]>([]);
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
    <div className="space-y-6">
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
        <AddSpeakerDialog onSpeakerAdded={fetchSpeakers} />
      </div>

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
          onOpenChange={(open) => {
            if (!open) setEditingSpeaker(null);
          }}
          speakerId={editingSpeaker.id}
          speakerName={editingSpeaker.name}
          onSpeakerUpdated={() => {
            setEditingSpeaker(null);
            fetchSpeakers();
          }}
        />
      )}

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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredSpeakers.map((s) => s.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {filteredSpeakers.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No speakers found matching your search.
        </div>
      )}
    </div>
  );
};
