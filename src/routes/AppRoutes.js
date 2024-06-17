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
import ActionsStudent from "../pages/ActionsStudent";
import Teacher from "../pages/PagesTeachers/Teacher";
import Student from "../pages/PagesStudents/Student";
import A1 from "../pages/PagesStudents/Niveles/A1/A1";
import Programar from "../pages/PagesStudents/Niveles/A1/Programar";
import ExamenEscrito from "../pages/PagesStudents/Niveles/A1/ExamenEscrito";
import NotasA1 from "../pages/PagesStudents/Niveles/A1/NotasA1";
import A2 from "../pages/PagesStudents/Niveles/A2/A2";
import ProgramarA2 from "../pages/PagesStudents/Niveles/A2/ProgramarA2";
import ExamenEscritoA2 from "../pages/PagesStudents/Niveles/A2/ExamenEscritoA2";
import NotasA2 from "../pages/PagesStudents/Niveles/A2/NotasA2";
import B1 from "../pages/PagesStudents/Niveles/B1/B1";
import ProgramarB1 from "../pages/PagesStudents/Niveles/B1/ProgramarB1";
import ExamenEscritoB1 from "../pages/PagesStudents/Niveles/B1/ExamenEscritoB1";
import NotasB1 from "../pages/PagesStudents/Niveles/B1/NotasB1";
import B2 from "../pages/PagesStudents/Niveles/B2/B2";
import ProgramarB2 from "../pages/PagesStudents/Niveles/B2/ProgramarB2";
import ExamenEscritoB2 from "../pages/PagesStudents/Niveles/B2/ExamenEscritoB2";
import NotasB2 from "../pages/PagesStudents/Niveles/B2/NotasB2";
import C1 from "../pages/PagesStudents/Niveles/C1/C1";
import ProgramarC1 from "../pages/PagesStudents/Niveles/C1/ProgramarC1";
import ExamenEscritoC1 from "../pages/PagesStudents/Niveles/C1/ExamenEscritoC1";
import NotasC1 from "../pages/PagesStudents/Niveles/C1/NotasC1";


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
                
                <Route exact path="/Teacher" element={<Teacher></Teacher>}></Route>

                <Route exact path="/Student" element={<Student></Student>}></Route>
                <Route exact path="/A1" element={<A1></A1>}></Route>
                <Route exact path="/ProgramarA1" element={<Programar></Programar>}></Route>
                <Route exact path="/ExamenEscritoA1" element={<ExamenEscrito></ExamenEscrito>}></Route>
                <Route exact path="/NotasA1" element={<NotasA1></NotasA1>}></Route>
                <Route exact path="/A2" element={<A2></A2>}></Route>
                <Route exact path="/ProgramarA2" element={<ProgramarA2></ProgramarA2>}></Route>
                <Route exact path="/ExamenEscritoA2" element={<ExamenEscritoA2></ExamenEscritoA2>}></Route>
                <Route exact path="/NotasA2" element={<NotasA2></NotasA2>}></Route>
                <Route exact path="/B1" element={<B1></B1>}></Route>
                <Route exact path="/ProgramarB1" element={<ProgramarB1></ProgramarB1>}></Route>
                <Route exact path="/ExamenEscritoB1" element={<ExamenEscritoB1></ExamenEscritoB1>}></Route>
                <Route exact path="/NotasB1" element={<NotasB1></NotasB1>}></Route>
                <Route exact path="/B2" element={<B2></B2>}></Route>
                <Route exact path="/ProgramarB2" element={<ProgramarB2></ProgramarB2>}></Route>
                <Route exact path="/ExamenEscritoB2" element={<ExamenEscritoB2></ExamenEscritoB2>}></Route>
                <Route exact path="/NotasB2" element={<NotasB2></NotasB2>}></Route>
                <Route exact path="/C1" element={<C1></C1>}></Route>
                <Route exact path="/ProgramarC1" element={<ProgramarC1></ProgramarC1>}></Route>
                <Route exact path="/ExamenEscritoC1" element={<ExamenEscritoC1></ExamenEscritoC1>}></Route>
                <Route exact path="/NotasC1" element={<NotasC1></NotasC1>}></Route>
            </Routes>
        </AnimatePresence>
    </>
    
  )
}

export default AppRoutes