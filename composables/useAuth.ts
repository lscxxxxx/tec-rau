export interface User {
    id: number;
    email: string;
    usuario: string;
    role: 'ADMIN' | 'SUPER_ADMIN';
}

export const useAuth = () => {
    const user = useState<User | null>('user', () => null)
    return {
        user,
    }
}