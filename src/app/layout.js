import './globals.css';

export const metadata = {
  title: 'FinSight AI — Smart Personal Finance Dashboard',
  description: 'AI-powered personal finance dashboard with expense tracking, budget planning, stock predictions, and smart financial insights.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
