export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: 'MALE' | 'FEMALE';
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  gender: 'MALE' | 'FEMALE';
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export type GenderFormValue = 'MALE' | 'FEMALE' | string;

export interface RegisterFormState {
  firstName: string;
  lastName: string;
  email: string;
  gender: GenderFormValue;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface RegisterFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  gender?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterFormData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: 'USER' | 'MODEL';
  content: string;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  isActive: boolean;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: Array<{
    text?: string;
    fileData?: {
      fileUri: string;
      mimeType: string;
    };
  }>;
}

export interface GeminiRequest {
  contents: GeminiMessage[];
  systemInstruction?: {
    parts: Array<{
      text: string;
    }>;
  };
  generationConfig: {
    temperature: number;
    maxOutputTokens: number;
  };
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export interface ChatState {
  conversation: Conversation | null;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}