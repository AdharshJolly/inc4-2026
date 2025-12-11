import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Phone, Mail } from "lucide-react";

export const VenueSection = () => {
  return (
    <section id="venue" className="py-20 md:py-32 gradient-dark relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pattern-grid opacity-20" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
            Conference Location
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mt-3 mb-4">
            The <span className="text-gradient-secondary">Venue</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Map/Image */}
          <div className="relative rounded-3xl overflow-hidden border border-dark-border">
            <div className="aspect-video bg-dark-card">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.0084815088584!2d77.51715731482292!3d12.869741190925095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3f8a7a0bce45%3A0x4e0f1c1e!2sCHRIST%20(Deemed%20to%20be%20University)%20Kengeri%20Campus!5e0!3m2!1sen!2sin!4v1699123456789!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="CHRIST University Location"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-display text-3xl font-bold text-primary-foreground mb-6">
              CHRIST (Deemed to be University)
            </h3>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="font-semibold text-primary-foreground mb-1">Address</p>
                  <p className="text-primary-foreground/60">
                    Kengeri Campus, Kanminike,
                    <br />
                    Kumbalgodu, Bengaluru,
                    <br />
                    Karnataka 560074, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="font-semibold text-primary-foreground mb-1">Phone</p>
                  <p className="text-primary-foreground/60">+91 80 4012 9100</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="font-semibold text-primary-foreground mb-1">Email</p>
                  <p className="text-primary-foreground/60">inc4@christuniversity.in</p>
                </div>
              </div>
            </div>

            <Button variant="heroSecondary" size="lg">
              <Navigation className="w-4 h-4" />
              Get Directions
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
