import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import 'sweetalert2/dist/sweetalert2.min.css';


export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
