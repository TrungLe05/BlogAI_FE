
import { Toaster } from "sonner";

import { BrowserRouter } from "react-router-dom";
import Router from "./router";
export default function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </>
  );
}
