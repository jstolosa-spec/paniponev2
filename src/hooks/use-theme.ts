import { useState, useEffect } from 'react';
export function useTheme() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);
  const toggleTheme = () => setIsDark(prev => !prev);
  return { isDark, toggleTheme };
}