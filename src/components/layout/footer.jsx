export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-6 md:flex md:items-center md:justify-between lg:px-8">
        {/* Left Column */}
        <div className="text-center md:w-1/3 md:text-left">
          <p className="text-xs text-gray-400">&copy; © 2025 by Pawcker</p>
        </div>

        {/* Middle Column */}
        <div className="mt-8 flex justify-center space-x-6 md:mt-0 md:w-1/3 md:justify-center">
          <a
            href="/submit-feedback"
            className="hover:text-primary text-sm text-gray-700 transition"
          >
            Submit Feedback
          </a>
          <a href="/privacy-policy" className="hover:text-primary text-sm text-gray-700 transition">
            Privacy Policy
          </a>
          <a
            href="/terms-and-conditions"
            className="hover:text-primary text-sm text-gray-700 transition"
          >
            Terms and Conditions
          </a>
        </div>

        {/* Right Column */}
        <div className="mt-8 flex justify-center md:mt-0 md:w-1/3 md:justify-end">
          <p className="text-xs text-gray-400">v0.6.2</p>
        </div>
      </div>
    </footer>
  );
}
