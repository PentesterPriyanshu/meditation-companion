import localFont from "next/font/local";
import "./globals.css";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
import { ThemeProvider } from "@/components/theme-provider";

// Load local fonts and define CSS variables for each
const geistSans = localFont({
  src: "./fonts/GeistVF.woff", // Adjusted path to point correctly to the fonts folder
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff", // Adjusted path to point correctly to the fonts folder
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Define metadata for SEO and browser title
export const metadata = {
  title: "Daily Quotes",
  description: "Powered by CopilotKit",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`} // Apply custom fonts and anti-aliasing
      >
        {/* Wrap with ThemeProvider for theme support */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange={true}
        >
          {/* CopilotKit wrapper for app-wide CopilotKit functionalities */}
          <CopilotKit runtimeUrl="/api/copilotkit">
            {children}
          </CopilotKit>
        </ThemeProvider>
      </body>
    </html>
  );
}
