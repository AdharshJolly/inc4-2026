import { Metadata } from "next";
import SpeakersClient from "./SpeakersClient";

export const metadata: Metadata = {
  title: "Keynote Speakers | InC4 2026",
  description: "Meet the distinguished keynote speakers at InC4 2026. Renowned researchers and industry experts sharing insights on computing and communications.",
  keywords: "keynote speakers, InC4, conference speakers, IEEE, research experts, industry leaders, computing",
  openGraph: {
    title: "Keynote Speakers | InC4 2026",
    description: "Meet the distinguished keynote speakers at InC4 2026. Renowned researchers and industry experts sharing insights on computing and communications.",
    type: "website",
    url: "https://ic4.co.in/speakers",
  },
  alternates: {
    canonical: "https://ic4.co.in/speakers",
  },
};

export default function SpeakersPage() {
  return <SpeakersClient />;
}
