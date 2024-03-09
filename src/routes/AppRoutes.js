import {Route,Routes, useLocation} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Login from "../pages/Login";
import ResetPassword from "../pages/ResetPassword";
import PrincipalAdmin from "../pages/PrincipalAdmin";
import PrincipalTeacher from "../pages/PrincipalTeacher";
import PrincipalStudent from "../pages/PrincipalStudent";
import CreateStudent from "../pages/CreateStudent";
import CreateTeacher from "../pages/CreateTeacher";
import ActionsTeacher from "../pages/ActionsTeacher";
import ActionsStudent from "../pages/ActionsStudent"


function AppRoutes() {
    const location = useLocation();
  return (
    <>
        <AnimatePresence mode='wait'>
            <Routes location={location} key={location.pathname}>
                <Route exact path="/" element={<Login></Login>}></Route>
                <Route exact path="/ResetPassword" element={<ResetPassword></ResetPassword>}></Route>
                <Route exact path="/Admin" element={<PrincipalAdmin></PrincipalAdmin>}></Route>
                <Route exact path="/PrincipalTeacher" element={<PrincipalTeacher></PrincipalTeacher>}></Route>
                <Route exact path="/PrincipalStudent" element={<PrincipalStudent></PrincipalStudent>}></Route>
                <Route exact path="/CreateTeacher" element={<CreateTeacher></CreateTeacher>}></Route>
                <Route exact path="/CreateStudent" element={<CreateStudent></CreateStudent>}></Route>
                <Route exact path="/ActionsTeacher" element={<ActionsTeacher></ActionsTeacher>}></Route>
                <Route exact path="/ActionsStudent" element={<ActionsStudent></ActionsStudent>}></Route>
            </Routes>
        </AnimatePresence>
    </>
    
  )
}

export default AppRoutes