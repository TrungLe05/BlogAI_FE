import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#ebf4f5] dark:bg-zinc-900">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
export default Layout;
