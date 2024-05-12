// Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header/Header';
import Footer from './footer/Footer';

function Layout() {
    return (
        <div>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
            <div style={{ width: "100%", height: "75px" }}></div>
        </div>
    );
}

export default Layout;