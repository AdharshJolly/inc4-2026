import { Metadata } from "next";
import committeeData from "@/data/committee.json";
import { CommitteeData } from "@/types/data";

export function generateStaticParams() {
  const data = committeeData as unknown as CommitteeData;
  return data.root.map((category) => ({
    category: category.id,
  }));
}

export const metadata: Metadata = {
  title: "Conference Committee | 2026 IEEE International Conference on Contemporary Computing and Communications (InC4)",
  description: "Meet the organizing committee members of InC4 2026. View the patrons, chairs, committee members, and program committee of the 2026 IEEE International Conference on Contemporary Computing and Communications - Conference#70839.",
  keywords: "InC4 committee, conference organizers, IEEE, academic committee, program committee, conference chairs",
  openGraph: {
    title: "Conference Committee | 2026 IEEE International Conference on Contemporary Computing and Communications (InC4)",
    description: "Meet the organizing committee members of InC4 2026. View the patrons, chairs, committee members, and program committee of the 2026 IEEE International Conference on Contemporary Computing and Communications - Conference#70839.",
    type: "website",
    url: "https://ic4.co.in/committee",
  },
  alternates: {
    canonical: "https://ic4.co.in/committee",
  },
};

export default function CommitteeCategoryPage() {
  return null;
}
