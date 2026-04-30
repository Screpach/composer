import { ReactNode } from 'react';
export const AppShell = ({children}:{children:ReactNode}) => <div className="mx-auto mt-4 max-w-[1400px] rounded-3xl border border-white/40 bg-gradient-to-br from-cyan-100/70 to-indigo-100/60 p-4 shadow-2xl backdrop-blur-xl">{children}</div>;
