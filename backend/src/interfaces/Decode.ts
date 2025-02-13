export interface DecodedToken {
    username: string;
    email: string;
    role: string;
    iat?: number; // Optional Issued at (timestamp)
    exp?: number; // Optional expiration time
}