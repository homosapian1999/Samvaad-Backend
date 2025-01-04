export type AuthRequestBody = {
  email: string;
  password: string;
  confirmPassword?: string;
};

export type AuthResponse = {
  status: boolean;
  message: string;
  token?: string;
  isProfileComplete?: boolean;
  firstName?: string;
  lastName?: string;
  image?: string;
  color?: string;
};
