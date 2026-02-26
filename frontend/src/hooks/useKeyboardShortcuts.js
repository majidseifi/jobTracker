import { useEffect } from 'react';

export default function useKeyboardShortcuts(shortcutMap) {
  useEffect(() => {
    const handler = (e) => {
      const tag = e.target.tagName.toLowerCase();
      const isInput = tag === 'input' || tag === 'textarea' || tag === 'select';

      if (isInput && e.key !== 'Escape') return;

      const fn = shortcutMap[e.key];
      if (fn) {
        e.preventDefault();
        fn(e);
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [shortcutMap]);
}
