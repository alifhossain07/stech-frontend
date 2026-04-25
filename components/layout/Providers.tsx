"use client";

import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <Toaster
                position="top-center"
                containerStyle={{
                    top: '60%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
                toastOptions={{
                    className: '',
                    style: {
                        background: '#ffffff',
                        color: '#333333',
                        padding: '24px 32px',
                        borderRadius: '16px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        minWidth: '350px',
                        textAlign: 'center',
                        fontSize: '16px',
                        fontWeight: '600',
                        border: '1px solid #e5e7eb',
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: '#FF6B01',
                            secondary: '#ffffff',
                        },
                    },
                    error: {
                        duration: 5000,
                        iconTheme: {
                            primary: '#ff4b4b',
                            secondary: '#ffffff',
                        },
                    },
                }}
            />
        </>
    );
}
