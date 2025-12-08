import React from "react";

export function Footer(): React.JSX.Element {
  return (
    <footer className="border-t border-white/20 mt-4">
      <div className="container py-8 text-sm text-white/70 flex justify-between items-center">
        <div>© {new Date().getFullYear()} Glenview Ultimate</div>
        <div className="text-right">made with love by <a href="https://ericdahl.dev" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">ericdahl.dev</a></div>
      </div>
    </footer>
  );
}

