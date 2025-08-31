import React, { useState, useEffect } from 'react';
import { Lock, Shield, Eye, EyeOff, Plus, Search, Settings, LogOut } from 'lucide-react';
import PasswordVault from './components/PasswordVault';
import Login from './components/Login';
import { PasswordEntry } from './types/PasswordEntry';
import { encryptData, decryptData } from './utils/encryption';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [masterPassword, setMasterPassword] = useState('');
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Check if user is already authenticated
    const storedAuth = localStorage.getItem('passwordVaultAuth');
    if (storedAuth) {
      setIsAuthenticated(true);
      loadPasswords();
    }
  }, []);

  const loadPasswords = () => {
    try {
      const storedPasswords = localStorage.getItem('encryptedPasswords');
      if (storedPasswords && masterPassword) {
        const decrypted = decryptData(storedPasswords, masterPassword);
        setPasswords(JSON.parse(decrypted));
      }
    } catch (error) {
      console.error('Error loading passwords:', error);
    }
  };

  const savePasswords = (newPasswords: PasswordEntry[]) => {
    try {
      if (masterPassword) {
        const encrypted = encryptData(JSON.stringify(newPasswords), masterPassword);
        localStorage.setItem('encryptedPasswords', encrypted);
        setPasswords(newPasswords);
      }
    } catch (error) {
      console.error('Error saving passwords:', error);
    }
  };

  const handleLogin = (password: string) => {
    setMasterPassword(password);
    setIsAuthenticated(true);
    localStorage.setItem('passwordVaultAuth', 'true');
    loadPasswords();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setMasterPassword('');
    setPasswords([]);
    localStorage.removeItem('passwordVaultAuth');
  };

  const filteredPasswords = passwords.filter(password =>
    password.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    password.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    password.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Password Vault</h1>
                <p className="text-sm text-gray-500">Secure password management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search passwords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
                />
              </div>
              
              {/* Settings */}
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              
              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PasswordVault
          passwords={filteredPasswords}
          onSavePasswords={savePasswords}
          masterPassword={masterPassword}
        />
      </main>
    </div>
  );
}

export default App;

