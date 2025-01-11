export type AuthRequestBody = {
  email: string;
  password: string;
  confirmPassword?: string;
};

export type AuthResponse = {
  status: boolean;
  message: string;
  token?: string;
  profileSetup?: boolean;
  firstName?: string;
  lastName?: string;
  image?: string;
  color?: string;
  email?: string;
};

export type UpdateProfile = {
  userEmail: string;
  firstName: string;
  lastName: string;
  color: string;
};
