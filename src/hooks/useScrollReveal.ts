import { useEffect } from 'react';

/**
 * Adds `.is-visible` to any `.reveal` / `.reveal-stagger` element when it
 * enters the viewport. Uses a single IntersectionObserver for performance.
 * Respects prefers-reduced-motion (elements are visible immediately via CSS).
 */
export function useScrollReveal() {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>('.reveal, .reveal-stagger, .hero-enter')
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/**
 * Re-scans for reveal elements — useful after a route change renders new content.
 */
export function triggerRevealScan() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>('.reveal:not(.is-visible), .reveal-stagger:not(.is-visible), .hero-enter:not(.is-visible)')
  );
  if (elements.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}
