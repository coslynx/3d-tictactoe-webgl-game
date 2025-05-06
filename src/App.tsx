import React, { useState, useEffect } from 'react';
import Home from '@/src/pages/Home';
import './styles/index.css';
import './styles/tailwind.css';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(loadingTimer);
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <React.StrictMode>
      <div className={`${theme === 'dark' ? 'dark' : ''} min-h-screen bg-primary text-white font-body`}>
        <div className="container mx-auto p-4 flex justify-center items-center">
          {isLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-secondary border-solid mx-auto mb-4"></div>
              <p>Loading...</p>
            </div>
          ) : error ? (
            <div className="text-red-500 font-body p-4">
              Error: {error.message}. Please check the console for details.
            </div>
          ) : (
            <Home toggleTheme={toggleTheme} theme={theme} />
          )}
        </div>
      </div>
    </React.StrictMode>
  );
}

export default App;