import { RouterProvider } from "react-router-dom";
import router from "./routes/index.jsx";
import { AuthProvider } from "./components/auth/AuthContext"; // ★ 추가

/*
function App() {
  return <RouterProvider router={router} />;
}
*/


function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;