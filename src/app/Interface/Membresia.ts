export interface User {
  id: number;
  uid?: string;
  email: string;
  password_hash?: string;
  display_name?: string;
  username?: string;
  photo_url?: string;
  provider: 'google' | 'email';
  auth_type: 'google' | 'email';
  created_at: string; // timestamp
  last_login?: string | null;
  is_active?: boolean;

  // Este campo no está en la tabla, pero se está usando en el frontend
  membership_type?: 'free' | 'premium';


}
