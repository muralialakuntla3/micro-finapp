import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home";
import MainLayout from "./layouts/main-layout";
import Login from "./components/Login";
import { useLocalStorage } from "@mantine/hooks";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);

function App() {
  const [userId, setUserId] = useLocalStorage({
    key: "user-id",
    defaultValue: "",
  });

  return (
    <>
      {userId ? (
        <MainLayout setUserId={setUserId}>
          <RouterProvider router={router} />
        </MainLayout>
      ) : (
        <Login setUserId={setUserId} />
      )}
    </>
  );
}

export default App;
