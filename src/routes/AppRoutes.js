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
import ProgramarClaseA1 from "../pages/PagesStudents/Niveles/A1/ProgramarClaseA1";
import ProgramarExamenA1 from "../pages/PagesStudents/Niveles/A1/ProgramarExamenA1";
import ProgramarClaseA2 from "../pages/PagesStudents/Niveles/A2/ProgramarClaseA2";
import ProgramarExamenA2 from "../pages/PagesStudents/Niveles/A2/ProgramarExamenA2";
import ProgramarClaseB1 from "../pages/PagesStudents/Niveles/B1/ProgramarClaseB1";
import ProgramarExamenB1 from "../pages/PagesStudents/Niveles/B1/ProgramarExamenB1";
import ProgramarClaseB2 from "../pages/PagesStudents/Niveles/B2/ProgramarClaseB2";
import ProgramarExamenB2 from "../pages/PagesStudents/Niveles/B2/ProgramarExamenB2";
import ProgramarClaseC1 from "../pages/PagesStudents/Niveles/C1/ProgramarClaseC1";
import ProgramarExamenC1 from "../pages/PagesStudents/Niveles/C1/ProgramarExamenC1";
import HorarioA1 from "../pages/PagesStudents/Niveles/A1/HorarioA1";
import PrincipalSuperAdmin from "../pages/PagesSuperAdmin/PrincipalSuperAdmin";
import GestionarAdmin from "../pages/PagesSuperAdmin/GestionarAdmin";
import GestionarNiveles from "../pages/PagesSuperAdmin/GestionarNiveles";
import CreateAdmin from "../pages/PagesSuperAdmin/CreateAdmin";
import ActionsAdmin from "../pages/PagesSuperAdmin/ActionsAdmin";
import GestionarA1 from "../pages/PagesSuperAdmin/Niveles/A1/GestionarA1";
import GestionarExamenA1 from "../pages/PagesSuperAdmin/Niveles/A1/GestionarExamenA1";
import VerExamenA1 from "../pages/PagesSuperAdmin/Niveles/A1/VerExamenA1";
import VerClaseA1 from "../pages/PagesSuperAdmin/Niveles/A1/VerClaseA1";
import CrearExamenA1 from "../pages/PagesSuperAdmin/Niveles/A1/CrearExamenA1";
import VerExamenEscritoA1 from "../pages/PagesSuperAdmin/Niveles/A1/VerExamenEscritoA1";
import NivelesCulminados from "../pages/PagesStudents/NivelesCulminados";
import NavPage from "../pages/PagesStudents/Niveles/A1/NavPage";
import ProgramacionTeacher from "../pages/PagesTeachers/ProgramacionTeacher";
import CalificarExamen from "../pages/PagesTeachers/CalificarExamen";
import Solicitudes from "../pages/Solicitudes";
import GestionarSolicitudes from "../pages/GestionarSolicitudes";
import CulminarA1 from "../pages/PagesStudents/NivelesCulminados/CulminarA1";
import CulminarA2 from "../pages/PagesStudents/NivelesCulminados/CulminarA2";
import CulminarB1 from "../pages/PagesStudents/NivelesCulminados/CulminarB1";
import CulminarB2 from "../pages/PagesStudents/NivelesCulminados/CulminarB2";
import CulminarC1 from "../pages/PagesStudents/NivelesCulminados/CulminarC1";
import NavPageA2 from "../pages/PagesStudents/Niveles/A2/NavPageA2";
import HorarioA2 from "../pages/PagesStudents/Niveles/A2/HorarioA2";
import NavPageB1 from "../pages/PagesStudents/Niveles/B1/NavPageB1";
import NavPageB2 from "../pages/PagesStudents/Niveles/B2/NavPageB2";
import NavPageC1 from "../pages/PagesStudents/Niveles/C1/NavPageC1";
import HorarioB1 from "../pages/PagesStudents/Niveles/B1/HorarioB1";
import HorarioB2 from "../pages/PagesStudents/Niveles/B2/HorarioB2";
import HorarioC1 from "../pages/PagesStudents/Niveles/C1/HorarioC1";
import GestionarA2 from "../pages/PagesSuperAdmin/Niveles/A2/GestionarA2";
import VerClaseA2 from "../pages/PagesSuperAdmin/Niveles/A2/VerClaseA2";
import GestionarExamenA2 from "../pages/PagesSuperAdmin/Niveles/A2/GestionarExamenA2";
import CrearExamenA2 from "../pages/PagesSuperAdmin/Niveles/A2/CrearExamenA2";
import VerExamenA2 from "../pages/PagesSuperAdmin/Niveles/A2/VerExamenA2";
import VerExamenEscritoA2 from "../pages/PagesSuperAdmin/Niveles/A2/VerExamenEscritoA2";
import GestionarB1 from "../pages/PagesSuperAdmin/Niveles/B1/GestionarB1";
import VerClaseB1 from "../pages/PagesSuperAdmin/Niveles/B1/VerClaseB1";
import GestionarExamenB1 from "../pages/PagesSuperAdmin/Niveles/B1/GestionarExamenB1";
import CrearExamenB1 from "../pages/PagesSuperAdmin/Niveles/B1/CrearExamenB1";
import VerExamenB1 from "../pages/PagesSuperAdmin/Niveles/B1/VerExamenB1";
import VerExamenEscritoB1 from "../pages/PagesSuperAdmin/Niveles/B1/VerExamenEscritoB1";
import GestionarB2 from "../pages/PagesSuperAdmin/Niveles/B2/GestionarB2";
import VerClaseB2 from "../pages/PagesSuperAdmin/Niveles/B2/VerClaseB2";
import GestionarExamenB2 from "../pages/PagesSuperAdmin/Niveles/B2/GestionarExamenB2";
import CrearExamenB2 from "../pages/PagesSuperAdmin/Niveles/B2/CrearExamenB2";
import VerExamenB2 from "../pages/PagesSuperAdmin/Niveles/B2/VerExamenB2";
import VerExamenEscritoB2 from "../pages/PagesSuperAdmin/Niveles/B2/VerExamenEscritoB2";
import GestionarC1 from "../pages/PagesSuperAdmin/Niveles/C1/GestionarC1";
import VerClaseC1 from "../pages/PagesSuperAdmin/Niveles/C1/VerClaseC1";
import GestionarExamenC1 from "../pages/PagesSuperAdmin/Niveles/C1/GestionarExamenC1";
import CrearExamenC1 from "../pages/PagesSuperAdmin/Niveles/C1/CrearExamenC1";
import VerExamenC1 from "../pages/PagesSuperAdmin/Niveles/C1/VerExamenC1";
import VerExamenEscritoC1 from "../pages/PagesSuperAdmin/Niveles/C1/VerExamenEscritoC1";
import HorarioExamenA1 from "../pages/PagesStudents/Niveles/A1/HorarioExamenA1";
import HorarioExamenA2 from "../pages/PagesStudents/Niveles/A2/HorarioExamenA2";
import HorarioExamenB1 from "../pages/PagesStudents/Niveles/B1/HorarioExamenB1";
import HorarioExamenB2 from "../pages/PagesStudents/Niveles/B2/HorarioExamenB2";
import HorarioExamenC1 from "../pages/PagesStudents/Niveles/C1/HorarioExamenC1";
import Reportes from "../pages/Reportes";
import GraficaIntentos from "../pages/GraficaIntentos";

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
                <Route exact path="/Solicitudes" element={<Solicitudes></Solicitudes>}></Route>
                <Route exact path="/GestionarSolicitudes" element={<GestionarSolicitudes></GestionarSolicitudes>}></Route>
                <Route exact path="/Reportes" element={<Reportes></Reportes>}></Route>
                <Route exact path="/GraficaIntentos" element={<GraficaIntentos></GraficaIntentos>}></Route>

                <Route exact path="/Administrador" element={<PrincipalSuperAdmin></PrincipalSuperAdmin>}></Route>
                <Route exact path="/GestionarAdmins" element={<GestionarAdmin></GestionarAdmin>}></Route>
                <Route exact path="/CreateAdmin" element={<CreateAdmin></CreateAdmin>}></Route>
                <Route exact path="/ActionsAdmin" element={<ActionsAdmin></ActionsAdmin>}></Route>
                <Route exact path="/GestionarNiveles" element={<GestionarNiveles></GestionarNiveles>}></Route>

                <Route exact path="/GestionarA1" element={<GestionarA1></GestionarA1>}></Route>
                <Route exact path="/VerClasesA1" element={<VerClaseA1></VerClaseA1>}></Route>
                <Route exact path="/GestionarExamenA1" element={<GestionarExamenA1></GestionarExamenA1>}></Route>
                <Route exact path="/CrearExamenA1" element={<CrearExamenA1></CrearExamenA1>}></Route>
                <Route exact path="/VerExamenA1" element={<VerExamenA1></VerExamenA1>}></Route>
                <Route exact path="/VerExamenEscritoA1" element={<VerExamenEscritoA1></VerExamenEscritoA1>}></Route>

                <Route exact path="/GestionarA2" element={<GestionarA2></GestionarA2>}></Route>
                <Route exact path="/VerClasesA2" element={<VerClaseA2></VerClaseA2>}></Route>
                <Route exact path="/GestionarExamenA2" element={<GestionarExamenA2></GestionarExamenA2>}></Route>
                <Route exact path="/CrearExamenA2" element={<CrearExamenA2></CrearExamenA2>}></Route>
                <Route exact path="/VerExamenA2" element={<VerExamenA2></VerExamenA2>}></Route>
                <Route exact path="/VerExamenEscritoA2" element={<VerExamenEscritoA2></VerExamenEscritoA2>}></Route>

                <Route exact path="/GestionarB1" element={<GestionarB1></GestionarB1>}></Route>
                <Route exact path="/VerClasesB1" element={<VerClaseB1></VerClaseB1>}></Route>
                <Route exact path="/GestionarExamenB1" element={<GestionarExamenB1></GestionarExamenB1>}></Route>
                <Route exact path="/CrearExamenB1" element={<CrearExamenB1></CrearExamenB1>}></Route>
                <Route exact path="/VerExamenB1" element={<VerExamenB1></VerExamenB1>}></Route>
                <Route exact path="/VerExamenEscritoB1" element={<VerExamenEscritoB1></VerExamenEscritoB1>}></Route>

                <Route exact path="/GestionarB2" element={<GestionarB2></GestionarB2>}></Route>
                <Route exact path="/VerClasesB2" element={<VerClaseB2></VerClaseB2>}></Route>
                <Route exact path="/GestionarExamenB2" element={<GestionarExamenB2></GestionarExamenB2>}></Route>
                <Route exact path="/CrearExamenB2" element={<CrearExamenB2></CrearExamenB2>}></Route>
                <Route exact path="/VerExamenB2" element={<VerExamenB2></VerExamenB2>}></Route>
                <Route exact path="/VerExamenEscritoB2" element={<VerExamenEscritoB2></VerExamenEscritoB2>}></Route>
                
                <Route exact path="/GestionarC1" element={<GestionarC1></GestionarC1>}></Route>
                <Route exact path="/VerClasesC1" element={<VerClaseC1></VerClaseC1>}></Route>
                <Route exact path="/GestionarExamenC1" element={<GestionarExamenC1></GestionarExamenC1>}></Route>
                <Route exact path="/CrearExamenC1" element={<CrearExamenC1></CrearExamenC1>}></Route>
                <Route exact path="/VerExamenC1" element={<VerExamenC1></VerExamenC1>}></Route>
                <Route exact path="/VerExamenEscritoC1" element={<VerExamenEscritoC1></VerExamenEscritoC1>}></Route>

                <Route exact path="/Teacher" element={<Teacher></Teacher>}></Route>
                <Route exact path="/ProgramacionTeacher" element={<ProgramacionTeacher></ProgramacionTeacher>}></Route>
                <Route exact path="/CalificarExamen" element={<CalificarExamen></CalificarExamen>}></Route>

                <Route exact path="/Student" element={<Student></Student>}></Route>

                <Route exact path="/NivelesCulminados" element={<NivelesCulminados></NivelesCulminados>}></Route>
                <Route exact path="/CulminarA1" element={<CulminarA1></CulminarA1>}></Route>
                <Route exact path="/CulminarA2" element={<CulminarA2></CulminarA2>}></Route>
                <Route exact path="/CulminarB1" element={<CulminarB1></CulminarB1>}></Route>
                <Route exact path="/CulminarB2" element={<CulminarB2></CulminarB2>}></Route>
                <Route exact path="/CulminarC1" element={<CulminarC1></CulminarC1>}></Route>

                <Route exact path="/A1" element={<A1></A1>}></Route>
                <Route exact path="/ProgramarA1" element={<Programar></Programar>}></Route>
                <Route exact path="/ExamenEscritoA1" element={<ExamenEscrito></ExamenEscrito>}></Route>
                <Route exact path="/NavPage" element={<NavPage></NavPage>}></Route>
                <Route exact path="/NotasA1" element={<NotasA1></NotasA1>}></Route>
                <Route exact path="/ProgramarClaseA1" element={<ProgramarClaseA1></ProgramarClaseA1>}></Route>
                <Route exact path="/ProgramarExamenA1" element={<ProgramarExamenA1></ProgramarExamenA1>}></Route>
                <Route exact path="/HorarioA1" element={<HorarioA1></HorarioA1>}></Route>
                <Route exact path="/HorarioExamenA1" element={<HorarioExamenA1></HorarioExamenA1>}></Route>

                <Route exact path="/A2" element={<A2></A2>}></Route>
                <Route exact path="/ProgramarA2" element={<ProgramarA2></ProgramarA2>}></Route>
                <Route exact path="/ExamenEscritoA2" element={<ExamenEscritoA2></ExamenEscritoA2>}></Route>
                <Route exact path="/NavPageA2" element={<NavPageA2></NavPageA2>}></Route>
                <Route exact path="/NotasA2" element={<NotasA2></NotasA2>}></Route>
                <Route exact path="/ProgramarClaseA2" element={<ProgramarClaseA2></ProgramarClaseA2>}></Route>
                <Route exact path="/ProgramarExamenA2" element={<ProgramarExamenA2></ProgramarExamenA2>}></Route>
                <Route exact path="/HorarioA2" element={<HorarioA2></HorarioA2>}></Route>
                <Route exact path="/HorarioExamenA2" element={<HorarioExamenA2></HorarioExamenA2>}></Route>

                <Route exact path="/B1" element={<B1></B1>}></Route>
                <Route exact path="/ProgramarB1" element={<ProgramarB1></ProgramarB1>}></Route>
                <Route exact path="/ExamenEscritoB1" element={<ExamenEscritoB1></ExamenEscritoB1>}></Route>
                <Route exact path="/NavPageB1" element={<NavPageB1></NavPageB1>}></Route>
                <Route exact path="/NotasB1" element={<NotasB1></NotasB1>}></Route>
                <Route exact path="/ProgramarClaseB1" element={<ProgramarClaseB1></ProgramarClaseB1>}></Route>
                <Route exact path="/ProgramarExamenB1" element={<ProgramarExamenB1></ProgramarExamenB1>}></Route>
                <Route exact path="/HorarioB1" element={<HorarioB1></HorarioB1>}></Route>
                <Route exact path="/HorarioExamenB1" element={<HorarioExamenB1></HorarioExamenB1>}></Route>

                <Route exact path="/B2" element={<B2></B2>}></Route>
                <Route exact path="/ProgramarB2" element={<ProgramarB2></ProgramarB2>}></Route>
                <Route exact path="/ExamenEscritoB2" element={<ExamenEscritoB2></ExamenEscritoB2>}></Route>
                <Route exact path="/NavPageB2" element={<NavPageB2></NavPageB2>}></Route>
                <Route exact path="/NotasB2" element={<NotasB2></NotasB2>}></Route>
                <Route exact path="/ProgramarClaseB2" element={<ProgramarClaseB2></ProgramarClaseB2>}></Route>
                <Route exact path="/ProgramarExamenB2" element={<ProgramarExamenB2></ProgramarExamenB2>}></Route>
                <Route exact path="/HorarioB2" element={<HorarioB2></HorarioB2>}></Route>
                <Route exact path="/HorarioExamenB2" element={<HorarioExamenB2></HorarioExamenB2>}></Route>

                <Route exact path="/C1" element={<C1></C1>}></Route>
                <Route exact path="/ProgramarC1" element={<ProgramarC1></ProgramarC1>}></Route>
                <Route exact path="/ExamenEscritoC1" element={<ExamenEscritoC1></ExamenEscritoC1>}></Route>
                <Route exact path="/NavPageC1" element={<NavPageC1></NavPageC1>}></Route>
                <Route exact path="/NotasC1" element={<NotasC1></NotasC1>}></Route>
                <Route exact path="/ProgramarClaseC1" element={<ProgramarClaseC1></ProgramarClaseC1>}></Route>
                <Route exact path="/ProgramarExamenC1" element={<ProgramarExamenC1></ProgramarExamenC1>}></Route>
                <Route exact path="/HorarioC1" element={<HorarioC1></HorarioC1>}></Route>
                <Route exact path="/HorarioExamenC1" element={<HorarioExamenC1></HorarioExamenC1>}></Route>
            </Routes>
        </AnimatePresence>
    </>
    
  )
}

export default AppRoutes