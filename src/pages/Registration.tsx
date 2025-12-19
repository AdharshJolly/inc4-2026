import { PageTitle } from "@/components/PageTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { Reveal } from "@/components/Reveal";

export default function Registration() {
  useSEO({
    title: "Registration | InC4 2026",
    description:
      "Register for InC4 2026. View registration fees, categories, and payment details for the International Conference on Contemporary Computing and Communications at CHRIST University.",
    keywords:
      "InC4 registration, conference registration, registration fees, early bird, IEEE, 2026 conference",
    ogType: "website",
    canonicalUrl: "https://ic4.co.in/registration",
  });

  return (
    <div className="min-h-screen bg-background">
      <PageTitle title="Registration" />

      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Pricing Table */}
          <Reveal width="100%">
            <div className="overflow-x-auto rounded-xl border border-primary/20">
              <table className="w-full text-sm md:text-base">
                <thead>
                  <tr className="bg-primary/10 text-primary">
                    <th className="p-4 text-left border-b border-r border-primary/20 min-w-[200px]">
                      AUTHOR CATEGORY
                    </th>
                    <th
                      colSpan={2}
                      className="p-4 text-center border-b border-r border-primary/20"
                    >
                      INDIAN DELEGATES (INR)
                    </th>
                    <th
                      colSpan={2}
                      className="p-4 text-center border-b border-primary/20"
                    >
                      INTERNATIONAL DELEGATES (USD)
                    </th>
                  </tr>
                  <tr className="bg-primary/5 text-foreground font-semibold">
                    <th className="p-4 border-b border-r border-primary/20"></th>
                    <th className="p-4 border-b border-r border-primary/20 w-[15%]">
                      EARLY BIRD
                    </th>
                    <th className="p-4 border-b border-r border-primary/20 w-[15%]">
                      REGULAR
                    </th>
                    <th className="p-4 border-b border-r border-primary/20 w-[15%]">
                      EARLY BIRD
                    </th>
                    <th className="p-4 border-b border-primary/20 w-[15%]">
                      REGULAR
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card/50 backdrop-blur-sm">
                  {[
                    {
                      category: "IEEE Student Member",
                      inrEarly: "₹ 6000",
                      inrReg: "₹ 7500",
                      usdEarly: "$ 125",
                      usdReg: "$ 150",
                    },
                    {
                      category: "Non-IEEE Student Member",
                      inrEarly: "₹ 8000",
                      inrReg: "₹ 9500",
                      usdEarly: "$ 175",
                      usdReg: "$ 225",
                    },
                    {
                      category: "IEEE Professional Member",
                      inrEarly: "₹ 9500",
                      inrReg: "₹ 11000",
                      usdEarly: "$ 225",
                      usdReg: "$ 275",
                    },
                    {
                      category: "Non-IEEE Professional Member",
                      inrEarly: "₹ 13000",
                      inrReg: "₹ 15000",
                      usdEarly: "$ 275",
                      usdReg: "$ 350",
                    },
                    {
                      category: "Only Attending",
                      inrEarly: "₹ 1500",
                      inrReg: "₹ 2500",
                      usdEarly: "$ 70",
                      usdReg: "$ 100",
                    },
                  ].map((row, index) => (
                    <tr
                      key={index}
                      className="border-b border-primary/10 hover:bg-primary/5 transition-colors"
                    >
                      <td className="p-4 font-medium border-r border-primary/10">
                        {row.category}
                      </td>
                      <td className="p-4 text-center border-r border-primary/10 font-mono text-primary">
                        {row.inrEarly}
                      </td>
                      <td className="p-4 text-center border-r border-primary/10 font-mono">
                        {row.inrReg}
                      </td>
                      <td className="p-4 text-center border-r border-primary/10 font-mono text-primary">
                        {row.usdEarly}
                      </td>
                      <td className="p-4 text-center font-mono">
                        {row.usdReg}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-primary/5 font-semibold">
                    <td className="p-4 border-r border-primary/20">Workshop</td>
                    <td
                      colSpan={4}
                      className="p-4 text-center text-lg text-primary"
                    >
                      ₹ 1500
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Reveal>

          {/* Notes Section */}
          <Reveal width="100%">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Info className="w-6 h-6 text-primary" />
                Note
              </h2>
              <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
                <CardContent className="p-8">
                  <ol className="space-y-4 text-muted-foreground list-decimal list-inside">
                    <li>Registration Fee is inclusive of GST.</li>
                    <li>
                      Participants are encouraged to join the IEEE Computer
                      Society to avail of the subsidized registration fees.
                    </li>
                    <li>
                      Registration Fee covers entry to pre-conference workshops
                      and sessions, including keynote, parallel sessions.
                      Registration Fee covers breakfast and working lunch during
                      conference days (August 7-8, 2026).
                    </li>
                    <li>
                      Registered offline/In-person participants will be entitled
                      to a conference kit and certificate of
                      presentation/participation (as applicable).
                    </li>
                    <li>
                      All the offline participants have to manage their stay and
                      travel on their own. Conference organizers are not
                      responsible for the travel and accommodation of the
                      participants. However, accommodation in the University
                      guest house may be provided upon request and availability.
                    </li>
                    <li>
                      Refund and Cancellation Policy: Once registered and paid
                      the registration fee, a candidate cannot cancel the
                      registration. The registration fee for the conference,
                      once paid, is not refundable.
                    </li>
                    <li>
                      Registered online participants will be entitled to an
                      E-certificate of presentation/participation (as
                      applicable) only.
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </Reveal>

          <Reveal width="100%">
            <div className="flex justify-center">
              <Link
                to="https://cmt3.research.microsoft.com/InC42026"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="px-8 text-lg h-12">
                  Submit Paper
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
