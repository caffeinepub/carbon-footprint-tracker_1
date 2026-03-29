import { Button } from "@/components/ui/button";
import { Leaf, Plus } from "lucide-react";

interface HeaderProps {
  onLogNewTrip: () => void;
}

export default function Header({ onLogNewTrip }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-eco-navy font-display tracking-tight">
            EcoSteps
          </span>
        </div>

        {/* Nav */}
        <nav
          className="hidden md:flex items-center gap-6"
          aria-label="Main navigation"
        >
          {[
            { label: "Dashboard", href: "#log-trip" },
            { label: "Log Trip", href: "#log-trip" },
            { label: "Impact", href: "#impact" },
            { label: "Tips", href: "#tips" },
            { label: "History", href: "#history" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              data-ocid={`nav.${item.label.toLowerCase().replace(" ", "_")}.link`}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
            >
              {item.label}
              <span className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform" />
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Button
            onClick={onLogNewTrip}
            data-ocid="header.log_trip.primary_button"
            className="bg-primary hover:bg-primary/90 text-white font-semibold gap-1.5"
            size="sm"
          >
            <Plus className="w-4 h-4" />
            Log New Trip
          </Button>
          <div className="w-8 h-8 rounded-full bg-eco-green/20 flex items-center justify-center">
            <span className="text-xs font-bold text-eco-green">SM</span>
          </div>
        </div>
      </div>
    </header>
  );
}
