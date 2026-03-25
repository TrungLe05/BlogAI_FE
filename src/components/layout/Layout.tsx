import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Header />

      <Outlet />
      {/* <div className="h-100"></div> */}
      <Footer />
    </div>
  );
}
export default Layout;
