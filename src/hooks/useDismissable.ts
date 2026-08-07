import { useEffect } from 'react';

/**
 * Shared behaviour for overlays (modals, drawers, popovers):
 * closes on Escape and locks background scrolling while open.
 */
export function useDismissable(open: boolean, onDismiss: () => void, lockScroll = true) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onDismiss();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onDismiss]);

  useEffect(() => {
    if (!open || !lockScroll) return;

    const { overflow, paddingRight } = document.body.style;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    // Compensate for the disappearing scrollbar so the page doesn't jump.
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [open, lockScroll]);
}
