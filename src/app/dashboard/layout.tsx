import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/ui/TopBar";
import { NavigationProvider } from "@/context/NavigationContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { UserProvider } from "@/context/UserContext";

export const metadata = {
  title: "Dashboard",
  description: "SEO Title",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavigationProvider>
      <ThemeProvider>
        <UserProvider>
          <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
            <Sidebar />
            <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
              <TopBar />
              {children}
            </main>
          </div>
        </UserProvider>
      </ThemeProvider>
    </NavigationProvider>
  );
}
