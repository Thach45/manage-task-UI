import React from 'react';
import Header from '../components/Header/Header.tsx';
import Footer from '../components/Footer/Footer.tsx';
import Main from './main.tsx';

const Layout: React.FC = () => {
    return (
        <>
            <Header/>
                <main className="py-5">
                    <Main/>
                </ main>
            <Footer/>
        </>
        
  );
}

export default Layout;