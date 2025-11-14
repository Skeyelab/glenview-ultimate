'use client';

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export function MobileMenuButton({ isOpen, onClick }: MobileMenuButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center rounded-md border border-white/30 p-2 text-white hover:bg-white/10 focus:outline-none focus-visible:ring focus-visible:ring-white/50 md:hidden"
      aria-expanded={isOpen}
      aria-controls="mobile-nav"
      onClick={onClick}
    >
      <span className="sr-only">Toggle navigation</span>
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        role="img"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M4 6h16M4 12h16M4 18h16"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}

