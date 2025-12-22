import { useState, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Edit, Trash2 } from "lucide-react";
import speakersData from "@/data/speakers.json";
import type { SpeakersData } from "@/types/data";
import { getPhotoUrl } from "@/lib/photoMigration";
import { AddSpeakerDialog } from "./AddSpeakerDialog";
import { EditSpeakerDialog } from "./EditSpeakerDialog";
import { BulkActionsDialog } from "./BulkActionsDialog";

export const SpeakersManager = () => {
  const speakers = (speakersData as SpeakersData).root;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpeakers, setSelectedSpeakers] = useState<Set<string>>(
    new Set()
  );
  const [editingSpeaker, setEditingSpeaker] = useState<{
    index: number;
    name: string;
  } | null>(null);
  const [bulkActionsOpen, setBulkActionsOpen] = useState(false);

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
      const allIds = filteredSpeakers.map((_, idx) => String(idx));
      setSelectedSpeakers(new Set(allIds));
    }
  }, [filteredSpeakers.length, selectedSpeakers.size]);

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
          .filter((_, idx) => selectedSpeakers.has(String(idx)))
          .map((s) => s.name)}
        onActionComplete={() => {
          setSelectedSpeakers(new Set());
          setBulkActionsOpen(false);
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
        </div>
      )}

      {/* Speaker Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpeakers.map((speaker, index) => {
          const speakerId = String(index);
          const isSelected = selectedSpeakers.has(speakerId);
          return (
            <div
              key={index}
              className={`relative border rounded-lg overflow-hidden transition-all cursor-pointer ${
                isSelected
                  ? "border-orange-500/50 bg-orange-500/5 shadow-lg"
                  : "border-border hover:border-primary/40 hover:shadow-lg"
              }`}
              onClick={() => handleSelectSpeaker(speakerId)}
            >
              {/* Selection Checkbox */}
              <div className="absolute top-3 left-3 z-10">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleSelectSpeaker(speakerId)}
                  onClick={(e) => e.stopPropagation()}
                  className="rounded cursor-pointer"
                />
              </div>

              {/* Image */}
              <div className="relative h-48 bg-muted">
                {getPhotoUrl(speaker.photo) ? (
                  <img
                    src={getPhotoUrl(speaker.photo)}
                    alt={speaker.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl font-bold text-muted-foreground">
                      {speaker.name.charAt(0)}
                    </span>
                  </div>
                )}

                {speaker.topic && (
                  <div className="absolute top-12 left-2">
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
                      setEditingSpeaker({
                        index,
                        name: speaker.name,
                      });
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
                      handleSelectSpeaker(speakerId);
                      setBulkActionsOpen(true);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSpeakers.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No speakers found matching your search.
        </div>
      )}

      {/* TinaCMS Link */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" asChild>
          <a
            href="http://localhost:4001"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open TinaCMS Editor
          </a>
        </Button>
      </div>
    </div>
  );
};
