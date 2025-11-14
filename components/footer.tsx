import React from "react";

export function Footer(): React.JSX.Element {
  return (
    <footer className="border-t border-white/20 mt-4">
      <div className="container py-8 text-sm text-white/70">
        © {new Date().getFullYear()} Glenview Ultimate
      </div>
    </footer>
  );
}

