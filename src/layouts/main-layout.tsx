import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    handleStart();
    const timer = setTimeout(() => {
      handleComplete();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [location]);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-slate-400"></div>
        </div>
      )}
      {children}
    </>
  );
}

