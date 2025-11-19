import { Link } from "react-router-dom";
import { MainLayout } from "./main-layout";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout>
      <div className="flex flex-col min-h-screen">
        <header className="bg-background border-b">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="text-2xl font-bold">
                MelodyMentor
              </Link>
              <nav>{/* Add navigation links here */}</nav>
            </div>
          </div>
        </header>
        <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
        <footer className="bg-background border-t">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center h-16">
              <p className="text-muted-foreground">
                © {new Date().getFullYear()} MelodyMentor. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </MainLayout>
  );
}
