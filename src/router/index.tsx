import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Detail from "../pages/Detail";
import Auth from "../pages/Auth";
import Layout from "../components/Layout";
import ErrorPage from "../pages/Error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <App />,
      },
    ],
  },
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "detail/:id",
        element: <Detail />,
      },
    ],
  },
  {
    path: "/auth",
    errorElement: <ErrorPage />,
    element: <Auth />,
  },
]);

export default router;
