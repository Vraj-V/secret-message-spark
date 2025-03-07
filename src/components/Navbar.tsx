
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { PenLine, Lock } from 'lucide-react';

interface NavbarProps {
  className?: string;
}

export const Navbar = ({ className }: NavbarProps) => {
  return (
    <header className={cn('w-full py-4 px-6 flex items-center justify-between glass z-10 border-b border-white/10 fixed top-0', className)}>
      <Link to="/" className="flex items-center gap-2 transition-all hover:opacity-80">
        <span className="text-xl font-semibold tracking-tight">Whisper</span>
      </Link>
      
      <nav className="flex items-center gap-6">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-sm font-medium transition-all hover:text-primary"
        >
          <PenLine size={16} />
          <span className="hidden sm:inline">Confessions</span>
        </Link>
        
        <Link 
          to="/create" 
          className="flex items-center gap-2 text-sm font-medium transition-all hover:text-primary"
        >
          <Lock size={16} />
          <span className="hidden sm:inline">Secret Message</span>
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
