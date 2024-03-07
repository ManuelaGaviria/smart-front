import {Route,Routes, useLocation} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Login from "../pages/Login";



function AppRoutes() {
    const location = useLocation();
  return (
    <>
        <AnimatePresence mode='wait'>
            <Routes location={location} key={location.pathname}>
                <Route exact path="/" element={<Login></Login>}></Route>
            </Routes>
        </AnimatePresence>
    </>
    
  )
}

export default AppRoutes