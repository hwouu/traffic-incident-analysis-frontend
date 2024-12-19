// src/types/admin/index.ts
export interface User {
  userID: number;
  username: string;
  email: string;
  emailVerified: boolean;
  adminVerified: boolean;
  isMaster: boolean;
  createdAt: string;
}