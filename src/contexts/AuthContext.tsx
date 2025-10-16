import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    // Check localStorage on initial load
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const authToken = localStorage.getItem("auth_token");
        return authToken === "true";
    });

    const login = () => {
        setIsAuthenticated(true);
        localStorage.setItem("auth_token", "true");
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_email");
    };

    const value = {
        isAuthenticated,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
