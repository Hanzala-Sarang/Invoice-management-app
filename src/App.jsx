import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Dashboard from "./components/dashboard/Dashboard";
import Home from "./components/dashboard/Home";
import Invoices from "./components/dashboard/Invoices";
import NewInvoice from "./components/dashboard/NewInvoice";
import InvoiceDetail from "./components/dashboard/InvoiceDetail";

function App() {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "home",
          element: <Home />,
        },
        {
          path: "invoices",
          element: <Invoices />,
        },
        {
          path: "invoice-detail",
          element: <InvoiceDetail />,
        },
        {
          path: "new-invoice",
          element: <NewInvoice />,
        }
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={appRouter}></RouterProvider>
    </>
  );
}

export default App;
