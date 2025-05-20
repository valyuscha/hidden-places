export interface UserLoginData {
  id: string;
  name: string;
  email: string;
}

export interface LocationValidationResult {
  valid: boolean;
  error?: string;
  corrected?: {
    country?: string;
    city?: string;
  };
}
