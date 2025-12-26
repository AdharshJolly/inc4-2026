import { Metadata } from "next";
import CommitteeClient from "./CommitteeClient";

export const metadata: Metadata = {
  title: "Conference Committee | InC4 2026",
  description: "Meet the organizing committee members of InC4 2026. View the patrons, chairs, committee members, and program committee of the International Conference on Contemporary Computing and Communications.",
  keywords: "InC4 committee, conference organizers, IEEE, academic committee, program committee, conference chairs",
  openGraph: {
    title: "Conference Committee | InC4 2026",
    description: "Meet the organizing committee members of InC4 2026. View the patrons, chairs, committee members, and program committee of the International Conference on Contemporary Computing and Communications.",
    type: "website",
    url: "https://ic4.co.in/committee",
  },
  alternates: {
    canonical: "https://ic4.co.in/committee",
  },
};

export default function CommitteePage() {
  return null;
}
