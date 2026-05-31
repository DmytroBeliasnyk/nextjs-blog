import { ThemeProvider } from "@/components/ui/themeProvider";
import Navbar from "@/components/web/navbar";
import { ReactNode } from "react";

const SharedLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Navbar />
      {children}
    </ThemeProvider>
  );
};

export default SharedLayout;
