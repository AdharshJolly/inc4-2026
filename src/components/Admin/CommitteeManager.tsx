import { useState, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download } from "lucide-react";
import committeeData from "@/data/committee.json";
import type { CommitteeData } from "@/types/data";
import { getPhotoUrl } from "@/lib/photoMigration";
import { AddMemberDialog } from "./AddMemberDialog";
import { AddCategoryDialog } from "./AddCategoryDialog";
import { EditMemberDialog } from "./EditMemberDialog";
import { BulkActionsDialog } from "./BulkActionsDialog";

export const CommitteeManager = () => {
  const committee = (committeeData as CommitteeData).root;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(
    new Set()
  );
  const [editingMember, setEditingMember] = useState<{
    categoryId: string;
    index: number;
    name: string;
  } | null>(null);
  const [bulkActionsOpen, setBulkActionsOpen] = useState(false);

  // Flatten all members for filtering
  const allMembers = useMemo(() => {
    return committee.flatMap((cat) =>
      cat.members.map((member, memberIndex) => ({
        ...member,
        categoryId: cat.id,
        categoryLabel: cat.label,
        memberIndex,
      }))
    );
  }, [committee]);

  // Get unique roles
  const uniqueRoles = useMemo(() => {
    const roles = new Set(allMembers.map((m) => m.role).filter(Boolean));
    return Array.from(roles).sort();
  }, [allMembers]);

  // Filter members
  const filteredMembers = useMemo(() => {
    return allMembers.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.affiliation.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || member.categoryId === selectedCategory;
      const matchesRole =
        selectedRole === "all" || member.role === selectedRole;

      return matchesSearch && matchesCategory && matchesRole;
    });
  }, [allMembers, searchTerm, selectedCategory, selectedRole]);

  const handleSelectMember = useCallback((memberId: string) => {
    setSelectedMembers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(memberId)) {
        newSet.delete(memberId);
      } else {
        newSet.add(memberId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedMembers.size === filteredMembers.length) {
      setSelectedMembers(new Set());
    } else {
      const allIds = filteredMembers.map((m, idx) => `${m.categoryId}-${idx}`);
      setSelectedMembers(new Set(allIds));
    }
  }, [filteredMembers, selectedMembers.size]);

  const handleExportCSV = () => {
    const csv = [
      ["Name", "Role", "Affiliation", "Category", "Photo URL"].join(","),
      ...filteredMembers.map((m) =>
        [
          m.name,
          m.role,
          m.affiliation,
          m.categoryLabel,
          getPhotoUrl(m.photo),
        ]
          .map((field) => `"${field}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `committee-members-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or affiliation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {committee.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.label} ({cat.members.length})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {uniqueRoles.map((role) => (
              <SelectItem key={role} value={role}>
                {role || "(No Role)"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <AddMemberDialog />
        <AddCategoryDialog />
        <Button onClick={handleExportCSV} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
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

      {/* Bulk Actions Section */}
      {selectedMembers.size > 0 && (
        <div className="p-4 rounded-lg border border-orange-500/30 bg-orange-500/5 flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">
              {selectedMembers.size} member{selectedMembers.size !== 1 ? "s" : ""} selected
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Use the bulk actions button to manage selected members
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
        type="members"
        selectedIds={Array.from(selectedMembers)}
        selectedNames={filteredMembers
          .filter((m, idx) => selectedMembers.has(`${m.categoryId}-${idx}`))
          .map((m) => m.name)}
        onActionComplete={() => {
          setSelectedMembers(new Set());
          setBulkActionsOpen(false);
        }}
      />

      {/* Edit Member Dialog */}
      {editingMember && (
        <EditMemberDialog
          open={!!editingMember}
          onOpenChange={(open) => {
            if (!open) setEditingMember(null);
          }}
          categoryId={editingMember.categoryId}
          memberIndex={editingMember.index}
          memberName={editingMember.name}
          onMemberUpdated={() => {
            setEditingMember(null);
          }}
        />
      )}

      {/* Results */}
      <div className="border border-border rounded-lg p-4">
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filteredMembers.length} of {allMembers.length} members
        </p>

        {/* Select All Checkbox */}
        {filteredMembers.length > 0 && (
          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              checked={
                filteredMembers.length > 0 &&
                selectedMembers.size === filteredMembers.length
              }
              onChange={handleSelectAll}
              className="rounded cursor-pointer"
              id="select-all-members"
            />
            <label
              htmlFor="select-all-members"
              className="text-sm cursor-pointer"
            >
              Select all shown ({filteredMembers.length})
            </label>
          </div>
        )}

        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filteredMembers.map((member, index) => {
            const memberId = `${member.categoryId}-${index}`;
            const isSelected = selectedMembers.has(memberId);
            return (
              <div
                key={memberId}
                className={`flex items-center gap-4 p-3 rounded-lg border transition-colors cursor-pointer ${
                  isSelected
                    ? "border-orange-500/50 bg-orange-500/10"
                    : "border-border hover:border-primary/40 hover:bg-primary/5"
                }`}
                onClick={() => handleSelectMember(memberId)}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleSelectMember(memberId)}
                  onClick={(e) => e.stopPropagation()}
                  className="rounded cursor-pointer"
                />

                {getPhotoUrl(member.photo) ? (
                  <img
                    src={getPhotoUrl(member.photo)}
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-border"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                    <span className="text-lg font-bold text-muted-foreground">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {member.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {member.role || "No role specified"}
                  </p>
                  <p className="text-xs text-blue-500 truncate">
                    {member.categoryLabel}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-muted-foreground line-clamp-2 max-w-[200px]">
                    {member.affiliation}
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingMember({
                      categoryId: member.categoryId,
                      index,
                      name: member.name,
                    });
                  }}
                >
                  Edit
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
