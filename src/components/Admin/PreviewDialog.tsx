import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { getPhotoUrl } from "@/lib/photoMigration";

interface PreviewableContent {
  type: "member" | "speaker" | "category" | "date";
  data: Record<string, any>;
  changes?: Record<string, { old: any; new: any }>;
}

interface PreviewDialogProps {
  content: PreviewableContent;
  trigger?: React.ReactNode;
}

export const PreviewDialog = ({ content, trigger }: PreviewDialogProps) => {
  const renderMemberPreview = (member: any) => (
    <div className="space-y-4">
      <div className="flex gap-4">
        {getPhotoUrl(member.photo) || member.photoUrl ? (
          <img
            src={getPhotoUrl(member.photo) || member.photoUrl}
            alt={member.name}
            className="w-32 h-32 rounded-lg object-cover border border-border"
          />
        ) : (
          <div className="w-32 h-32 rounded-lg bg-muted flex items-center justify-center border border-border">
            <span className="text-3xl font-bold text-muted-foreground">
              {member.name?.charAt(0)}
            </span>
          </div>
        )}
        <div className="flex-1 space-y-2">
          <div>
            <p className="text-xs text-muted-foreground">Name</p>
            <p className="text-lg font-bold">{member.name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Role</p>
            <p className="text-sm">{member.role || "(No role)"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Affiliation</p>
            <p className="text-sm">{member.affiliation}</p>
          </div>
          {member.categoryLabel && (
            <div>
              <p className="text-xs text-muted-foreground">Category</p>
              <p className="text-sm font-medium text-blue-500">
                {member.categoryLabel}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSpeakerPreview = (speaker: any) => (
    <div className="space-y-4">
      <div className="flex gap-4">
        {getPhotoUrl(speaker.photo) ? (
          <img
            src={getPhotoUrl(speaker.photo)}
            alt={speaker.name}
            className="w-32 h-32 rounded-lg object-cover border border-border"
          />
        ) : (
          <div className="w-32 h-32 rounded-lg bg-muted flex items-center justify-center border border-border">
            <span className="text-3xl font-bold text-muted-foreground">
              {speaker.name?.charAt(0)}
            </span>
          </div>
        )}
        <div className="flex-1 space-y-2">
          <div>
            <p className="text-xs text-muted-foreground">Name</p>
            <p className="text-lg font-bold">{speaker.name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Role</p>
            <p className="text-sm">{speaker.role}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Topic</p>
            <p className="text-sm font-medium text-orange-500">
              {speaker.topic}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Affiliation</p>
            <p className="text-sm">{speaker.affiliation}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDatePreview = (date: any) => (
    <div className="space-y-4">
      <div className="border border-border rounded-lg p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Event</p>
            <h3 className="text-lg font-bold">{date.event}</h3>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              date.status === "highlight"
                ? "bg-orange-500/10 text-orange-500"
                : date.status === "upcoming"
                ? "bg-blue-500/10 text-blue-500"
                : "bg-green-500/10 text-green-500"
            }`}
          >
            {date.status}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{date.date}</p>
      </div>
    </div>
  );

  const renderPreview = () => {
    switch (content.type) {
      case "member":
        return renderMemberPreview(content.data);
      case "speaker":
        return renderSpeakerPreview(content.data);
      case "date":
        return renderDatePreview(content.data);
      default:
        return <p className="text-muted-foreground">Unknown content type</p>;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline">
            <Eye className="w-3 h-3 mr-1" />
            Preview
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Preview {content.type}</DialogTitle>
          <DialogDescription>
            This is how your {content.type} will appear on the site.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">{renderPreview()}</div>

        {content.changes && Object.keys(content.changes).length > 0 && (
          <Card className="border-orange-500/20 bg-orange-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-orange-600">
                Changes to be applied:
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {Object.entries(content.changes).map(([key, change]) => (
                  <div key={key} className="border-l-2 border-orange-500 pl-2">
                    <p className="font-medium text-muted-foreground">{key}</p>
                    <p className="text-xs line-through text-red-600">
                      {String(change.old)}
                    </p>
                    <p className="text-xs text-green-600">
                      {String(change.new)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
};
