// src/api/interfaces/auth.interface.ts
export interface CreateUserPayload {
    user_name: string;
    first_name?: string;
    last_name?: string;
    email: string;
    password: string;
    is_admin?: boolean;
    is_superuser?: boolean;
    is_active?: boolean;
}

export interface CreateUserDTO {
    user_name: string;
    first_name?: string;
    last_name?: string;
    email: string;
    password: string;
    is_admin?: boolean;
    organization_id?: number;
    role_id?: string;
    role?: string;
    is_active?: boolean;
    
}

export interface verifyOtpPayload {
    userId: string;
    otp: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}
export interface LoginResponse {
    access_token: string;
    refresh_token: string;
}

export interface UpdateUserPayload {
    user_name?: string;
    email?: string;
    full_name?:string;
    first_name?: string;
    last_name?: string;
    password?: string;
    is_admin?: boolean;
    is_superuser?: boolean;
    dob?:string;
    orle?: string;
    is_active?: boolean;
    country_code?:string;
    gender?:string;
    phone_no?:string;
}

export interface UpdateUserDTO {
    user_name?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
    is_admin?: boolean;
    organization_id?: number;
    role_id?: string;
    role?: string;
    is_active?: boolean;
    dob?:string;
    country_code?:string;
    gender?:string;
    phone_no?:string;
    full_name?:string;
}

export interface GetAllUserPayload{
    is_admin?:boolean,
    is_superuser?:boolean,
    offset: number,
    limit: number,
    is_deleted?:boolean,
    status?: string;
    search?: string;
}

export type UserStatusType = 
  | "new"
  | "active"
  | "converted"
  | "contacted"
  | "not_interested"
  | "just_enquiry"
  | "pending";

export interface UpdateUserStatus {
  status: UserStatusType;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  email: string;
  new_password: string;
}