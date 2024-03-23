import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Detail from "../pages/Detail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/detail/:id",
    element: <Detail />,
  },
]);

export default router;
