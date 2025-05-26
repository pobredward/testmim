import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8 min-h-[80vh] bg-transparent dark:bg-transparent">
      {children}
    </main>
  );
} 