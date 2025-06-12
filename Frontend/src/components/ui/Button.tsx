import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export const Button = ({ children, className = '', ...props }: ButtonProps) => (
  <button
    className={`bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition ${className}`}
    {...props}
  >
    {children}
  </button>
);
