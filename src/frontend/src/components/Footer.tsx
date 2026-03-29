import { Leaf } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="bg-eco-footer text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/80 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold font-display tracking-tight">
              EcoSteps
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-white/60">
            <a href="#log-trip" className="hover:text-white transition-colors">
              Dashboard
            </a>
            <a href="#impact" className="hover:text-white transition-colors">
              Impact
            </a>
            <a href="#tips" className="hover:text-white transition-colors">
              Tips
            </a>
            <a href="#history" className="hover:text-white transition-colors">
              History
            </a>
          </div>

          {/* Attribution */}
          <p className="text-sm text-white/50">
            © {year}. Built with ❤️ using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-green-300 transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
