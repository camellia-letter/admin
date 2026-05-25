export declare enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN"
}
export interface User {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}
export interface Session {
    user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: UserRole;
    };
    expires: string;
}
export interface AuthUser {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: UserRole;
}
