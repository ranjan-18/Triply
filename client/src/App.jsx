import AppRouter from "./routes/AppRouter";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <AppRouter />

      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,

          success: {
            style: {
              borderRadius: "12px",
            },
          },

          error: {
            style: {
              borderRadius: "12px",
            },
          },
        }}
      />
    </>
  );
}

export default App;