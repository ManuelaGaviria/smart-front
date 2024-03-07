import {Route,Routes, useLocation} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Login from "../pages/Login";
import ResetPassword from "../pages/ResetPassword";
import PrincipalAdmin from "../pages/PrincipalAdmin";


function AppRoutes() {
    const location = useLocation();
  return (
    <>
        <AnimatePresence mode='wait'>
            <Routes location={location} key={location.pathname}>
                <Route exact path="/" element={<Login></Login>}></Route>
                <Route exact path="/Recuperar" element={<ResetPassword></ResetPassword>}></Route>
                <Route exact path="/Admin" element={<PrincipalAdmin></PrincipalAdmin>}></Route>
            </Routes>
        </AnimatePresence>
    </>
    
  )
}

export default AppRoutes