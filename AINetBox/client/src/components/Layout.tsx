import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ThreeBackground from "@/lib/three-background";

interface LayoutProps {
  children: React.ReactNode;
}

// Placeholder for authentication context (replace with actual implementation)
const useAuth = () => ({
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
  login: () => localStorage.setItem('isAuthenticated', 'true'),
  logout: () => localStorage.setItem('isAuthenticated', 'false'),
});


const Layout = ({ children }: LayoutProps) => {
  const [backgroundInitialized, setBackgroundInitialized] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Wait for DOM to be fully loaded before initializing Three.js
    const initializeBackground = () => {
      try {
        const threeBackground = new ThreeBackground("canvas-container");
        threeBackground.start();
        setBackgroundInitialized(true);

        // Cleanup on component unmount
        return () => {
          threeBackground.dispose();
        };
      } catch (error) {
        console.error("Error initializing 3D background:", error);
        return undefined;
      }
    };

    const cleanup = initializeBackground();
    return cleanup;
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Login to Continue</h1>
          <button onClick={useAuth().login} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Login (Placeholder)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* THREE.js Canvas Container */}
      <div id="canvas-container" className="fixed top-0 left-0 w-full h-full z-[-1]"></div>

      <Navbar />

      <main className="flex-grow">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;