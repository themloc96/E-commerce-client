/* eslint-disable no-unused-expressions */
import { useEffect, useState } from 'react';

export default function useTogglePortal(id) {
  const [isPortalOpen, setIsPortalOpen] = useState(false);

  useEffect(() => {
    if (isPortalOpen) {
      document.getElementById('footer')
        ? (document.getElementById('footer').style.display = 'none')
        : null;
      document.getElementById('mobile-header')
        ? (document.getElementById('mobile-header').style.display = 'none')
        : null;
      document.getElementById(id)
        ? (document.getElementById(id).style.display = 'none')
        : null;
    } else {
      document.getElementById('footer')
        ? (document.getElementById('footer').style.display = 'block')
        : null;
      document.getElementById('mobile-header')
        ? (document.getElementById('mobile-header').style.display = 'block')
        : null;
      document.getElementById(id)
        ? (document.getElementById(id).style.display = 'block')
        : null;
    }

    return () => {
      document.getElementById('footer')
        ? (document.getElementById('footer').style.display = 'block')
        : null;
      document.getElementById('mobile-header')
        ? (document.getElementById('mobile-header').style.display = 'block')
        : null;
      document.getElementById(id)
        ? (document.getElementById(id).style.display = 'block')
        : null;
    };
  }, [isPortalOpen]);

  const togglePortal = () => setIsPortalOpen(prev => !prev);

  return { isPortalOpen, togglePortal };
}
