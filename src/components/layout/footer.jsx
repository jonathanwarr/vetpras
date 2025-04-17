'use client';

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white px-4 py-6 text-center text-sm text-gray-600">
      <div className="mx-auto max-w-screen-md space-y-2">
        <p>
          Vetpras is in <strong>v0.1 Early Access</strong>. Help our mission empower pet owners like
          yourself by submitting your vet bills.
        </p>
        <p className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Amwarr Consulting LTD.
        </p>
      </div>
      <p className="text-right text-xs text-gray-400">v0.1.1</p>
    </footer>
  );
}
