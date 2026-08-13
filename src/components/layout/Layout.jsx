// src/components/layout/Layout.jsx
import React, { useState } from 'react'; //추가
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function Layout() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default Layout;