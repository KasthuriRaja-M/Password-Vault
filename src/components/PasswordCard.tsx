import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Edit, Trash2, MoreVertical, Globe, User, Calendar } from 'lucide-react';
import { PasswordEntry } from '../types/PasswordEntry';
import { checkPasswordStrength } from '../utils/encryption';

interface PasswordCardProps {
  password: PasswordEntry;
  onEdit: () => void;
  onDelete: () => void;
  onCopy: () => void;
}

const PasswordCard: React.FC<PasswordCardProps> = ({
  password,
  onEdit,
  onDelete,
  onCopy
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const strength = checkPasswordStrength(password.password);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopy();
    } catch (error) {
      console.error('Failed to copy password:', error);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {password.title}
            </h3>
            {password.category && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                {password.category}
              </span>
            )}
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onEdit();
                      setShowMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Edit className="w-4 h-4 mr-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      onDelete();
                      setShowMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-3" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Username */}
        <div className="mb-4">
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <User className="w-4 h-4 mr-2" />
            <span className="font-medium">Username</span>
          </div>
          <p className="text-gray-900 font-mono text-sm break-all">
            {password.username}
          </p>
        </div>

        {/* Password */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <div className="flex items-center">
              <span className="font-medium">Password</span>
            </div>
            <div className="flex items-center space-x-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: strength.color }}
              />
              <span className="text-xs" style={{ color: strength.color }}>
                {strength.label}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password.password}
                readOnly
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm"
              />
            </div>
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={handleCopy}
              className={`p-2 rounded-lg transition-colors ${
                copied 
                  ? 'bg-green-100 text-green-600' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          {copied && (
            <p className="text-xs text-green-600 mt-1">Copied to clipboard!</p>
          )}
        </div>

        {/* URL */}
        {password.url && (
          <div className="mb-4">
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <Globe className="w-4 h-4 mr-2" />
              <span className="font-medium">Website</span>
            </div>
            <a
              href={password.url.startsWith('http') ? password.url : `https://${password.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 text-sm break-all"
            >
              {password.url}
            </a>
          </div>
        )}

        {/* Notes */}
        {password.notes && (
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Notes</span>
            </div>
            <p className="text-gray-900 text-sm break-words">
              {password.notes}
            </p>
          </div>
        )}

        {/* Tags */}
        {password.tags && password.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {password.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            <span>Updated {formatDate(password.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordCard;
