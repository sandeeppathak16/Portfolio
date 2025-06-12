import { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: ReactNode;
}

export const Card = ({ className = '', children, ...props }: CardProps) => (
  <div className={`rounded-2xl border bg-white shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

interface CardContentProps {
  className?: string;
  children: ReactNode;
}

export const CardContent = ({ className = '', children }: CardContentProps) => (
  <div className={`p-4 ${className}`}>{children}</div>
);
