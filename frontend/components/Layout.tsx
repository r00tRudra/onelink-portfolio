'use client';

import { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />
      <main className="container-custom py-8">
        {children}
      </main>
      <footer className="bg-white dark:bg-slate-800 border-t mt-12">
        <div className="container-custom py-8 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 OneLink Portfolio. Built with ❤️</p>
        </div>
      </footer>
    </div>
  );
}
