import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  {
    name: "Home",
    href: "/",
    submenu: [
      { name: "About", href: "/about" },
      { name: "Committee", href: "/committee" },
    ],
  },
  {
    name: "Author Information",
    href: "#",
    submenu: [
      { name: "CRC Submissions", href: "/crc-submissions" },
      { name: "Call for Papers", href: "/call-for-papers" },
      { name: "Registration fees", href: "/registration" },
      { name: "Important Dates", href: "/important-dates" },
    ],
  },
  { name: "Schedule", href: "/schedule" },
  { name: "Speakers", href: "/speakers" },
  { name: "Contact Us", href: "/contact" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const isLanding = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isLanding
          ? isScrolled || isMobileMenuOpen
            ? "bg-background/95 backdrop-blur-md shadow-lg py-4"
            : "bg-transparent py-6"
          : "bg-background shadow-md py-4"
      } ${!isLanding && !isScrolled ? "min-h-[96px]" : ""}`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Left Logos */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/images/ieee_cs_bc.png"
              alt="IEEE CS Bangalore Chapter"
              className={`h-[4.5rem] w-auto transition-all duration-500 hidden lg:block ${
                isLanding && !isScrolled
                  ? "filter brightness-0 invert opacity-90"
                  : ""
              }`}
            />
            <img
              src="/images/ieee_cs_cu.png"
              alt="IEEE CS CHRIST University"
              className={`h-[4.5rem] w-auto transition-all duration-500 ${
                isLanding && !isScrolled && !isMobileMenuOpen
                  ? "filter brightness-0 invert opacity-90"
                  : ""
              }`}
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <div
              key={link.name}
              onMouseEnter={() => link.submenu && setOpenDropdown(link.name)}
              onMouseLeave={() => setOpenDropdown(null)}
              className="relative"
            >
              {link.submenu ? (
                <>
                  <button
                    className={`font-medium text-lg transition-colors hover:text-primary flex items-center gap-1 ${
                      isLanding && !isScrolled
                        ? "text-primary-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {link.name}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {openDropdown === link.name && (
                    <div className="absolute top-full left-0 bg-background rounded-md shadow-lg border py-2 min-w-48 mt-1">
                      <div className="absolute -top-2 left-0 right-0 h-2" />
                      {link.submenu.map((sublink) => (
                        <Link
                          key={sublink.name}
                          to={sublink.href}
                          className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          {sublink.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={link.href}
                  className={`font-medium text-lg transition-colors hover:text-primary ${
                    isLanding && !isScrolled
                      ? "text-primary-foreground"
                      : "text-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Right Section - CTA Button & CHRIST Logo */}
        <div className="hidden lg:flex items-center gap-6">
          <Button
            variant={isLanding && !isScrolled ? "hero" : "default"}
            size="default"
            asChild
          >
            <Link to="/">Register Now</Link>
          </Button>
          <img
            src="/images/cu_color.png"
            alt="CHRIST University"
            className={`h-[4.5rem] w-auto transition-all duration-500 ${
              isLanding && !isScrolled
                ? "filter brightness-0 invert opacity-90"
                : ""
            }`}
          />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X
              className={`w-6 h-6 ${
                !isLanding || isScrolled || isMobileMenuOpen
                  ? "text-foreground"
                  : "text-primary-foreground"
              }`}
            />
          ) : (
            <Menu
              className={`w-6 h-6 ${
                !isLanding || isScrolled || isMobileMenuOpen
                  ? "text-foreground"
                  : "text-primary-foreground"
              }`}
            />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 w-full bg-background shadow-xl border-t max-h-[calc(100vh-120px)] overflow-y-auto z-50">
          <div className="flex flex-col items-center justify-center py-8 px-4 gap-6">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="w-full flex flex-col items-center"
              >
                {link.submenu ? (
                  <details className="cursor-pointer w-full flex flex-col items-center">
                    <summary className="font-medium text-lg text-foreground hover:text-primary transition-colors py-2 flex items-center gap-2 list-none">
                      {link.name}
                      <ChevronDown className="w-5 h-5" />
                    </summary>
                    <div className="mt-4 flex flex-col gap-3 items-center">
                      {link.submenu.map((sublink) => (
                        <Link
                          key={sublink.name}
                          to={sublink.href}
                          className="font-medium text-base text-foreground hover:text-primary transition-colors py-1"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {sublink.name}
                        </Link>
                      ))}
                    </div>
                  </details>
                ) : (
                  <Link
                    to={link.href}
                    className="font-medium text-lg text-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
            <Button variant="default" size="lg" className="mt-6 px-8" asChild>
              <Link to="/registration">Register</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};
