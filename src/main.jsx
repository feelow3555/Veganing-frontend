import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './components/auth/AuthContext';
// ★ 추가
import { CartProvider } from './context/CartContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
        <AuthProvider>
            <CartProvider>       {/* ★ App 전체를 CartProvider로 감싸기 */}
                <App />
            </CartProvider>
        </AuthProvider>
    </StrictMode>
)
