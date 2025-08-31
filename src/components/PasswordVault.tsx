import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Copy, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { PasswordEntry } from '../types/PasswordEntry';
import PasswordForm from './PasswordForm';
import PasswordCard from './PasswordCard';

interface PasswordVaultProps {
  passwords: PasswordEntry[];
  onSavePasswords: (passwords: PasswordEntry[]) => void;
  masterPassword: string;
}

const PasswordVault: React.FC<PasswordVaultProps> = ({ 
  passwords, 
  onSavePasswords, 
  masterPassword 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPassword, setEditingPassword] = useState<PasswordEntry | null>(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'title' | 'createdAt' | 'updatedAt'>('title');

  const handleAddPassword = (password: Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPassword: PasswordEntry = {
      ...password,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const updatedPasswords = [...passwords, newPassword];
    onSavePasswords(updatedPasswords);
    setShowAddForm(false);
  };

  const handleEditPassword = (password: PasswordEntry) => {
    const updatedPassword: PasswordEntry = {
      ...password,
      updatedAt: new Date(),
    };
    
    const updatedPasswords = passwords.map(p => 
      p.id === password.id ? updatedPassword : p
    );
    onSavePasswords(updatedPasswords);
    setEditingPassword(null);
  };

  const handleDeletePassword = (id: string) => {
    const updatedPasswords = passwords.filter(p => p.id !== id);
    onSavePasswords(updatedPasswords);
  };

  const handleCopyPassword = async (password: string) => {
    try {
      await navigator.clipboard.writeText(password);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy password:', error);
    }
  };

  const filteredAndSortedPasswords = passwords
    .filter(password => {
      if (filter === 'all') return true;
      return password.category === filter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'updatedAt':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        default:
          return 0;
      }
    });

  const categories = Array.from(new Set(passwords.map(p => p.category).filter(Boolean)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Passwords</h1>
          <p className="text-gray-600">
            {passwords.length} password{passwords.length !== 1 ? 's' : ''} stored
          </p>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Password
        </button>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className="flex-1">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="title">Sort by Name</option>
            <option value="createdAt">Sort by Created</option>
            <option value="updatedAt">Sort by Modified</option>
          </select>
        </div>
      </div>

      {/* Password Grid */}
      {filteredAndSortedPasswords.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {passwords.length === 0 ? 'No passwords yet' : 'No passwords found'}
          </h3>
          <p className="text-gray-600 mb-6">
            {passwords.length === 0 
              ? 'Get started by adding your first password'
              : 'Try adjusting your search or filter criteria'
            }
          </p>
          {passwords.length === 0 && (
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Password
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedPasswords.map(password => (
            <PasswordCard
              key={password.id}
              password={password}
              onEdit={() => setEditingPassword(password)}
              onDelete={() => handleDeletePassword(password.id)}
              onCopy={() => handleCopyPassword(password.password)}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Password Modal */}
      {(showAddForm || editingPassword) && (
        <PasswordForm
          password={editingPassword}
          onSave={editingPassword ? 
            (password) => handleEditPassword({...password, id: editingPassword.id, createdAt: editingPassword.createdAt, updatedAt: new Date()}) : 
            handleAddPassword
          }
          onCancel={() => {
            setShowAddForm(false);
            setEditingPassword(null);
          }}
        />
      )}
    </div>
  );
};

export default PasswordVault;
