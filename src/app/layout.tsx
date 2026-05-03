import type { Metadata } from 'next';
import { Roboto, Roboto_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from 'next-themes';

const roboto = Roboto({
    variable: '--font-roboto',
    subsets: ['latin'],
});

const robotoMono = Roboto_Mono({
    variable: '--font-roboto-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Lorenz Attractor Simulation',
    description: '',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${roboto.variable} ${robotoMono.variable} antialiased font-sans`}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <main className="text-body bg-neutral-100 dark:bg-neutral-800 w-full h-screen overflow-hidden">
                        {children}
                    </main>
                </ThemeProvider>
            </body>
        </html>
    );
}
