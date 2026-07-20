import { useState, useMemo, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, Users } from "lucide-react";
import { isExternalUrl } from "@/lib/utils";
import { AddMemberDialog } from "./AddMemberDialog";
import { AddCategoryDialog } from "./AddCategoryDialog";
import { EditMemberDialog } from "./EditMemberDialog";
import { BulkActionsDialog } from "./BulkActionsDialog";
import { SkeletonList } from "./Skeleton";
import { createClient } from "@/utils/supabase/client";

export const CommitteeManager = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchCommittee = useCallback(async () => {
    setIsLoading(true);
    const [categoriesResult, membersResult] = await Promise.all([
      supabase.from("committee_categories").select("*"),
      supabase.from("committee_members").select("*").order("order_index", { ascending: true })
    ]);
    if (categoriesResult.data) {
      setCategories(categoriesResult.data);
    }
    if (membersResult.data) {
      setMembers(membersResult.data);
    }
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchCommittee();
  }, [fetchCommittee]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(
    new Set()
  );
  const [editingMember, setEditingMember] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [bulkActionsOpen, setBulkActionsOpen] = useState(false);

  const allMembers = useMemo(() => {
    return members.map((member) => {
      const cat = categories.find(c => c.id === member.category_id);
      return {
        ...member,
        categoryId: member.category_id,
        categoryLabel: cat?.label || "Unknown",
        memberIndex: member.id, // using member.id for consistency
        photo: { url: member.photo_url },
      };
    });
  }, [categories, members]);

  const uniqueRoles = useMemo(() => {
    const roles = new Set(allMembers.map((m) => m.role).filter(Boolean));
    return Array.from(roles).sort();
  }, [allMembers]);

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
      const allIds = filteredMembers.map((m) => m.id);
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
          m.photo.url || "",
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
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.label}
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

      <div className="flex flex-wrap gap-2">
        <AddMemberDialog categories={categories} onMemberAdded={fetchCommittee} />
        <AddCategoryDialog onCategoryAdded={fetchCommittee} />
        <Button onClick={handleExportCSV} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

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
            className="bg-primary hover:bg-primary/90"
          >
            Bulk Actions
          </Button>
        </div>
      )}

      <BulkActionsDialog
        open={bulkActionsOpen}
        onOpenChange={setBulkActionsOpen}
        type="members"
        selectedIds={Array.from(selectedMembers)}
        selectedNames={filteredMembers
          .filter((m) => selectedMembers.has(m.id))
          .map((m) => m.name)}
        onActionComplete={() => {
          setSelectedMembers(new Set());
          setBulkActionsOpen(false);
          fetchCommittee();
        }}
      />

      {editingMember && (
        <EditMemberDialog
          open={!!editingMember}
          onOpenChange={(open) => {
            if (!open) setEditingMember(null);
          }}
          memberId={editingMember.id}
          memberName={editingMember.name}
          categories={categories}
          onMemberUpdated={() => {
            setEditingMember(null);
            fetchCommittee();
          }}
        />
      )}

      <div className="border border-border rounded-lg p-4">
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filteredMembers.length} of {allMembers.length} members
        </p>

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
          {isLoading ? (
            <SkeletonList count={4} />
          ) : filteredMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                {searchTerm || selectedCategory !== "all" || selectedRole !== "all" ? "No members match your filters" : "No committee members yet"}
              </p>
              <p className="text-xs text-muted-foreground">
                {searchTerm || selectedCategory !== "all" || selectedRole !== "all" ? "Try adjusting your search or filters" : "Add your first committee member to get started"}
              </p>
            </div>
          ) : (
            filteredMembers.map((member) => {
              const memberId = member.id;
              const isSelected = selectedMembers.has(memberId);
              return (
                <div
                  key={memberId}
                  className={`flex items-center gap-4 p-3 rounded-xl border shadow-sm transition-all duration-200 cursor-pointer ${
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

                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-border flex-shrink-0">
                    {member.photo.url ? (
                      <Image
                        src={member.photo.url}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                        unoptimized={isExternalUrl(member.photo.url)}
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-lg font-bold text-muted-foreground">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {member.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {member.role || "No role specified"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate opacity-70">
                      {member.categoryLabel}
                    </p>
                  </div>

                  <div className="text-right hidden sm:block">
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
                        id: member.id,
                        name: member.name,
                      });
                    }}
                  >
                    Edit
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
