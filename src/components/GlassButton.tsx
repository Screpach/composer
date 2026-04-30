import { ButtonHTMLAttributes } from 'react';
export function GlassButton({ className='', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={`rounded-2xl border border-white/50 bg-white/30 px-3 py-2 text-sm font-medium backdrop-blur hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${className}`} />;
}
