/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#00D5BE',
                    dark: '#009689',
                    light: '#96F7E4',
                },
                secondary: {
                    DEFAULT: '#00D492',
                },
                accent: {
                    blue: '#00D3F2',
                    mint: '#96F7E4',
                    green: '#A4F4CF',
                }
            },
            fontFamily: {
                nunito: ['Nunito', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-main': 'linear-gradient(90deg, #00D5BE 0%, #00D492 50%, #00D3F2 100%)',
                'gradient-button': 'linear-gradient(90deg, #00D5BE 0%, #00D492 100%)',
                'gradient-logo': 'linear-gradient(135deg, #00D5BE 0%, #00D492 100%)',
            },
            boxShadow: {
                'glow-primary': '0px 4px 6px -4px #96F7E4',
                'btn': '0px 1px 2px -1px rgba(0, 0, 0, 0.10)',
            },
            animation: {
                'fadeIn': 'fadeIn 0.5s ease-in-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}