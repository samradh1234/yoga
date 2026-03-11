import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        // Check local storage first
        const savedTheme = localStorage.getItem('yoga-theme');
        if (savedTheme) {
            setTheme(savedTheme);
            updateDocumentElement(savedTheme);
        } else {
            // Fetch from backend API as fallback/primary source if applicable
            fetch('http://localhost:5000/api/theme')
                .then(res => res.json())
                .then(data => {
                    if (data && data.theme) {
                        setTheme(data.theme);
                        updateDocumentElement(data.theme);
                    }
                })
                .catch(err => console.error("Could not fetch theme from backend", err));
        }
    }, []);

    const updateDocumentElement = (newTheme) => {
        const root = window.document.documentElement;
        if (newTheme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('yoga-theme', newTheme);
        updateDocumentElement(newTheme);

        // Save choice to backend
        fetch('http://localhost:5000/api/theme', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ theme: newTheme })
        }).catch(err => console.error("Failed to save theme to backend", err));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
