import { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('jwtToken');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setToken(null);
  };

  return (
    <>
      {token ? (
        <Dashboard handleLogout={handleLogout} />
      ) : (
        <Auth setToken={setToken} />
      )}
    </>
  );
}

export default App;