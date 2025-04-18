
import { useContext } from "react";
import Swal from 'sweetalert2';
import { motion} from 'framer-motion';
import ContenedorForms from '../components/ContenedorForms';
import LabelInputEdit from "../components/LabelInputEdit";
import Button from '../components/Button';
import ButtonLink from '../components/ButtonLink';
import RadioButton from '../components/RadioButton';
import { fetchBody } from '../utils/fetch';
import GeneralContext from "../context/GeneralContext";
import React, { useEffect,  useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from "../components/Select";

function CreateStudent() {
  const navigate = useNavigate();
    useEffect(() => {
        const verificar = async () => {
            const respuesta = await fetchBody('/usuarios/', 'POST', {rol: "administrador"});
            if (respuesta.exito === false) {
                navigate("/")
            }
        }
        verificar();
    }, [])

  const { name, changeName, apellido, changeApellido, tipoDocumento, changeTipoDocumento, documento, changeDocumento, correo, changeCorreo, genero, changeGenero, nacimiento, changeNacimiento } = useContext(GeneralContext);

  const opcionesDocumento = [
    { nombre: 'TI', id: 1 },
    { nombre: 'CC', id: 2 },
    { nombre: 'CE', id: 3 }
  ];

  const opcionesGenero = [
    { nombre: 'Femenino', id: 1 },
    { nombre: 'Masculino', id: 2 }
  ];

  async function validate() {
    if (name === "" || apellido === "" || tipoDocumento === "" || documento === "" || correo === "" || genero === "" || nacimiento === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor llena todos los campos.",
        customClass: {
          confirmButton: 'btn-color'
        },
        buttonsStyling: false
      });
    } else if (correo.indexOf('@') === -1) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El correo electrónico debe contener un arroba (@).",
        customClass: {
          confirmButton: 'btn-color'
        },
        buttonsStyling: false
      });
    } else if (!/^\d+$/.test(documento) || parseInt(documento) < 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El documento debe contener solo números positivos y sin puntos ni comas.",
        customClass: {
          confirmButton: 'btn-color'
        },
        buttonsStyling: false
      });
    } else {
      var fechaNacimiento = new Date(nacimiento);
      var edadMinima = new Date();
      edadMinima.setFullYear(edadMinima.getFullYear() - 8); // Restar 8 años a la fecha actual
      
      if (fechaNacimiento >= new Date() || fechaNacimiento > edadMinima) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "La fecha de nacimiento no puede ser posterior a la fecha actual y el estudiante debe tener al menos 8 años.",
          customClass: {
            confirmButton: 'btn-color'
          },
          buttonsStyling: false
        });
      } else {
        const data = {
          nombre: name,
          apellido: apellido,
          tipoDocumento: tipoDocumento,
          documento: documento,
          correo: correo,
          genero: genero,
          nacimiento: nacimiento,
          rol: "estudiante",
          niveles: selectedLevels
        };
        try {
          const respuesta = await fetchBody('/usuarios/agregar', 'POST', data);
          if (respuesta.exito) {
            changeName({ target: { value: '' } });
            changeApellido({ target: { value: '' } });
            changeDocumento({ target: { value: '' } });
            changeCorreo({ target: { value: '' } });
            changeNacimiento({ target: { value: '' } });
            document.getElementById("idNameStudent").value = "";
            document.getElementById("idApellidoStudent").value = "";
            document.getElementById("idDocumentStudent").value = "";
            document.getElementById("idMailStudent").value = "";
            document.getElementById("idDateStudent").value = "";
            Swal.fire({
              icon: "success",
              title: "Estudiante creado con éxito!",
              customClass: {
                confirmButton: 'btn-color'
              },
              buttonsStyling: false
            });
            navigate("/PrincipalStudent");
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: respuesta.error,
              customClass: {
                confirmButton: 'btn-color'
              },
              buttonsStyling: false
            });
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: 'Error al procesar la solicitud para crear un estudiante',
            customClass: {
              confirmButton: 'btn-color'
            },
            buttonsStyling: false
          });
        }
      }
    }
  }

  const [selectedLevels, setSelectedLevels] = useState([]);

  const handleLevelChange = (id) => {
    if (selectedLevels.includes(id)) {
      setSelectedLevels(selectedLevels.filter(levelId => levelId !== id));
    } else {
      setSelectedLevels([...selectedLevels, id]);
    }
  };

  return (
    <motion.div className="login-container"
    initial={{ opacity: 0, x: -1000 }} // Inicia desde la izquierda
    animate={{ opacity: 1, x: 0 }} // Animación hacia la derecha
    exit={{ opacity: 0, x: 1000 }} // Sale hacia la derecha
    transition={{ duration: 1 }}>
        <ContenedorForms>
            <h1>Crear Estudiante</h1>
          <div className="InputContainer">
            <LabelInputEdit id="idNameStudent" eventoCambio={changeName} texto="Nombre *"></LabelInputEdit>
            <LabelInputEdit id="idApellidoStudent" eventoCambio={changeApellido} texto="Apellidos *"></LabelInputEdit>
            <Select id="idTipoDocumentoStudent" titulo="Tipo Documento *" opciones={opcionesDocumento} eventoCambio={changeTipoDocumento}></Select>
            <LabelInputEdit id="idDocumentStudent" eventoCambio={changeDocumento} tipo="number" texto="Documento *"></LabelInputEdit>
            <Select id="idGeneroStudent" titulo="Género *" opciones={opcionesGenero} eventoCambio={changeGenero}></Select>
            <LabelInputEdit id="idMailStudent" eventoCambio={changeCorreo} tipo="email" texto="Correo *"></LabelInputEdit>
            <LabelInputEdit id="idDateStudent" eventoCambio={changeNacimiento} tipo="date" texto="Fecha Nacimiento *"></LabelInputEdit>
            <div>
                <label>Niveles Matriculados *</label>
                <div className='niveles'>
                    <RadioButton id="A1" label="A1" onChange={handleLevelChange} checked={selectedLevels.includes("A1")}/>
                    <RadioButton id="A2" label="A2" onChange={handleLevelChange} checked={selectedLevels.includes("A2")}/>
                    <RadioButton id="B1" label="B1" onChange={handleLevelChange} checked={selectedLevels.includes("B1")}/>
                    <RadioButton id="B2" label="B2" onChange={handleLevelChange} checked={selectedLevels.includes("B2")}/>
                    <RadioButton id="C1" label="C1" onChange={handleLevelChange} checked={selectedLevels.includes("C1")}/>
                </div> 
            </div>
          </div>
          <br />
          <div className="mallaBotones">
            <Button eventoClick={validate} clase="Button">Crear</Button>
            <ButtonLink destino="/PrincipalStudent" clase="Button">Regresar</ButtonLink>
          </div>
          
        </ContenedorForms>
    </motion.div>
  )
}

export default CreateStudent