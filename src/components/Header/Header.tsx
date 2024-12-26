import React from 'react';
import { Button, DatePicker } from 'antd';
import Link from 'antd/es/typography/Link';
const Header: React.FC = () => {
    return (
        <header className="bg-primary text-primary-foreground shadow-lg">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">Task Manager</Link>
            <nav>
                <ul className="flex space-x-4">
                    <li><Link href="/" className="hover:underline">Home</Link></li>
                    <li><Link href="/about" className="hover:underline">About</Link></li>
                    <li><Button variant="link" ><Link href="/login">Login</Link></Button></li>
                </ul>
            </nav>
            </div>
      </header>
  );
}

export default Header;