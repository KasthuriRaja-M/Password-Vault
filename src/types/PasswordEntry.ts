export interface PasswordEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  url: string;
  notes?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

export interface PasswordStrength {
  score: number;
  label: 'weak' | 'medium' | 'strong' | 'very-strong';
  color: string;
  feedback: string[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

