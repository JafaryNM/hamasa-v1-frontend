export type UserRole =
  | "super_admin"
  | "reviewer"
  | "data_clerk"
  | "org_admin"
  | "org_user";

export interface Client {
  uid?: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  name_of_organisation: string;
  country: string;
  sector: string;
  plain_password: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}
