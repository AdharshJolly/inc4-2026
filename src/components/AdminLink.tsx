import { Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const AdminLink = () => {
  return (
    <Link to="/admin">
      <Button
        variant="outline"
        size="sm"
        className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
      >
        <Shield className="w-4 h-4 mr-2" />
        Admin
      </Button>
    </Link>
  );
};
