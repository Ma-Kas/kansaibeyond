'use client';

import { useEffect } from 'react';

export default function ScrollToTop() {
  // Blog Post View takes time to construct and fully load, so Next.js link
  // scroll to top is sometimes too early
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);
  return null;
}
