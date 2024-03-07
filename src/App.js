import {GeneralProvider} from "./context/GeneralContext";
import {BrowserRouter as Router} from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <GeneralProvider>
      <Router><AppRoutes></AppRoutes></Router>
    </GeneralProvider>
  );
}

export default App;
