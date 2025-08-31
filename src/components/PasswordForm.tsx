import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, RefreshCw, Globe, User, Lock, FileText, Tag } from 'lucide-react';
import { PasswordEntry } from '../types/PasswordEntry';
import { generatePassword, checkPasswordStrength } from '../utils/encryption';

interface PasswordFormProps {
  password?: PasswordEntry | null;
  onSave: (password: Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const PasswordForm: React.FC<PasswordFormProps> = ({ password, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    username: '',
    password: '',
    url: '',
    notes: '',
    category: '',
    tags: [] as string[]
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordGenerator, setShowPasswordGenerator] = useState(false);
  const [passwordLength, setPasswordLength] = useState(16);
  const [passwordOptions, setPasswordOptions] = useState({
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (password) {
      setFormData({
        title: password.title,
        username: password.username,
        password: password.password,
        url: password.url,
        notes: password.notes || '',
        category: password.category || '',
        tags: password.tags || []
      });
    }
  }, [password]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.username || !formData.password) {
      alert('Please fill in all required fields');
      return;
    }

    onSave(formData);
  };

  const generateNewPassword = () => {
    try {
      const newPassword = generatePassword(passwordLength, passwordOptions);
      setFormData(prev => ({ ...prev, password: newPassword }));
    } catch (error) {
      alert('Please select at least one character type');
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const strength = checkPasswordStrength(formData.password);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {password ? 'Edit Password' : 'Add New Password'}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Gmail, GitHub, Bank Account"
                required
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username/Email *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter username or email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="block w-full pl-10 pr-20 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
                    placeholder="Enter password"
                    required
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPasswordGenerator(!showPasswordGenerator)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Password Strength */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Strength:</span>
                      <span style={{ color: strength.color }} className="font-medium">
                        {strength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(strength.score / 8) * 100}%`,
                          backgroundColor: strength.color
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Password Generator */}
                {showPasswordGenerator && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        Password Length: {passwordLength}
                      </label>
                      <input
                        type="range"
                        min="8"
                        max="64"
                        value={passwordLength}
                        onChange={(e) => setPasswordLength(Number(e.target.value))}
                        className="w-32"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={passwordOptions.includeUppercase}
                          onChange={(e) => setPasswordOptions(prev => ({
                            ...prev,
                            includeUppercase: e.target.checked
                          }))}
                          className="mr-2"
                        />
                        <span className="text-sm">Uppercase (A-Z)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={passwordOptions.includeLowercase}
                          onChange={(e) => setPasswordOptions(prev => ({
                            ...prev,
                            includeLowercase: e.target.checked
                          }))}
                          className="mr-2"
                        />
                        <span className="text-sm">Lowercase (a-z)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={passwordOptions.includeNumbers}
                          onChange={(e) => setPasswordOptions(prev => ({
                            ...prev,
                            includeNumbers: e.target.checked
                          }))}
                          className="mr-2"
                        />
                        <span className="text-sm">Numbers (0-9)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={passwordOptions.includeSymbols}
                          onChange={(e) => setPasswordOptions(prev => ({
                            ...prev,
                            includeSymbols: e.target.checked
                          }))}
                          className="mr-2"
                        />
                        <span className="text-sm">Symbols (!@#$%)</span>
                      </label>
                    </div>
                    
                    <button
                      type="button"
                      onClick={generateNewPassword}
                      className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Generate Password
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                <option value="Social Media">Social Media</option>
                <option value="Email">Email</option>
                <option value="Banking">Banking</option>
                <option value="Shopping">Shopping</option>
                <option value="Work">Work</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Add any additional notes..."
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Add a tag and press Enter"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-primary-600 hover:text-primary-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                {password ? 'Update Password' : 'Add Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordForm;
