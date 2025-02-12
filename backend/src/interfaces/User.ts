export interface User {
    Username: string;
    Email: string;
    Password: string;
    Role: string;
};

export interface UserPayload {
    username: string;
    email: string;
    role: string;
}