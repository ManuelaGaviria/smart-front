import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import Logo3 from '../../../../components/Logo3';
import { motion } from 'framer-motion';
import FullscreenCard from '../../../../components/FullScreenCard';
import ButtonLink from '../../../../components/ButtonLink';
import { fetchBody } from '../../../../utils/fetch';
import ContenedorForms from '../../../../components/ContenedorForms';
import Swal from 'sweetalert2';
import LabelInputEdit from '../../../../components/LabelInputEdit';
import Button from '../../../../components/Button';
import GeneralContext from '../../../../context/GeneralContext';
import { MdModeEdit } from "react-icons/md";

function VerClaseA1() {
  const navigate = useNavigate();

  useEffect(() => {
    const verificar = async () => {
      const respuesta = await fetchBody('/usuarios/', 'POST', { rol: "superadministrador" });
      if (respuesta.exito === false) {
        navigate("/")
      }
    }
    verificar();
  }, [navigate]);

  const { changeDescripcion } = useContext(GeneralContext);
  const [clases, setClase] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedClase, setSelectedClase] = useState(null);
  const [backgroundOpacity] = useState(0.5);
  const [numClases, setNumClases] = useState(0); // Nueva variable para seleccionar el número de clases

  useEffect(() => {
    listClases();
  }, []);

  const openEditModal = (clase) => {
    setSelectedClase(clase);
    setEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
  };

  async function listClases() {
    try {
      const respuesta = await fetchBody('/niveles/listarClase', 'POST', { nivel: "A1" });
      if (respuesta.exito) {
        setClase(respuesta.lista);
        setNumClases(respuesta.lista.length); // Establecer el número actual de clases
        console.log(respuesta.lista);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: respuesta.error,
          customClass: { confirmButton: 'btn-color' },
          buttonsStyling: false
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: 'Error al listar las clases',
        customClass: { confirmButton: 'btn-color' },
        buttonsStyling: false
      });
    }
  }

  async function actualizarClases() {
    if (numClases < 1) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debe haber al menos 1 clase",
        customClass: { confirmButton: 'btn-color' },
        buttonsStyling: false
      });
      return;
    }

    // Comparar si el número ingresado es menor al número actual de clases
    if (numClases < clases.length) {
      const confirmacion = await Swal.fire({
        title: "¿Estás seguro?",
        text: `Actualmente hay ${clases.length} clases. Si reduces el número a ${numClases}, las clases sobrantes se eliminarán permanentemente.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, continuar",
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: 'btn-color',
          cancelButton: 'btn-color-cancel'
        },
        buttonsStyling: false
      });

      // Si el usuario cancela, detener la función
      if (!confirmacion.isConfirmed) {
        return;
      }
    }

    try {
      const respuesta = await fetchBody('/niveles/agregarClase', 'POST', {
        nivel: "A1",
        totalClases: numClases
      });

      if (respuesta.exito) {
        Swal.fire({
          icon: "success",
          title: "Clases actualizadas con éxito!",
          text: respuesta.mensaje,
          customClass: { confirmButton: 'btn-color' },
          buttonsStyling: false
        });

        listClases(); // Recargar la lista de clases después de la actualización
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: respuesta.error,
          customClass: { confirmButton: 'btn-color' },
          buttonsStyling: false
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: 'Error al actualizar las clases',
        customClass: { confirmButton: 'btn-color' },
        buttonsStyling: false
      });
    }
  }

  async function editClase(id) {
    console.log('id :>> ', id);
    const descripcion = document.getElementById('descripcion').value;

    if (descripcion.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "La descripción no puede estar vacía.",
        customClass: { confirmButton: 'btn-color' },
        buttonsStyling: false
      });
      return;
    }

    const data = {
      id: id,
      nivel: "A1",
      descripcion: descripcion
    };

    try {
      const respuesta = await fetchBody('/niveles/editarClase', 'PUT', data);

      if (respuesta.exito) {
        Swal.fire({
          icon: "success",
          title: "Clase actualizada con éxito!",
          customClass: { confirmButton: 'btn-color' },
          buttonsStyling: false
        });

        handleCloseModal(); // Cerrar el modal
        listClases(); // Recargar la lista de clases para ver la actualización
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: respuesta.error,
          customClass: { confirmButton: 'btn-color' },
          buttonsStyling: false
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al actualizar la clase",
        customClass: { confirmButton: 'btn-color' },
        buttonsStyling: false
      });
    }
  }


  return (
    <motion.div
      className='ContainerFull'
      initial={{ opacity: 0, x: 1000 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -1000 }}
      transition={{ duration: 1 }}>
      <Logo3 />
      <FullscreenCard>
        <div className='CenterTable'>
          {/* Selector para modificar el número de clases */}
          <div className="InputContainer">
            <LabelInputEdit
              id="numClases"
              tipo="number"
              texto="Número de Clases"
              eventoCambio={(e) => setNumClases(parseInt(e.target.value, 10))}
              valorInicial={numClases}
            />
            <Button clase="Button" eventoClick={actualizarClases}>Actualizar Clases</Button>
          </div>

          <table className='Table'>
            <thead>
              <tr>
                <th style={{ width: '200px' }}>Código</th>
                <th style={{ width: '200px' }}>Clase #</th>
                <th style={{ width: '200px' }}>Descripción</th>
                <th style={{ width: '200px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clases.map((clase) => (
                <tr key={clase.id}>
                  <td>{clase.codigo}</td>
                  <td>Clase {clase.numero}</td>
                  <td>{clase.descripcion}</td>
                  <td className='Actions'>
                    <button className='btn-edit' onClick={() => openEditModal(clase)}><MdModeEdit /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ButtonLink destino="/GestionarClaseA1" clase="ButtonRegresar">Regresar</ButtonLink>
      </FullscreenCard>

      {editModalOpen && (
        <>
          <div className="BackgroundOverlay" style={{ opacity: backgroundOpacity }} />
          <ContenedorForms>
            <h1>Editar Clase</h1>
            <div className="InputContainer">
              <LabelInputEdit
                id='descripcion'
                texto="Descripción"
                eventoCambio={changeDescripcion}
                valorInicial={selectedClase.descripcion}
              />
            </div>
            <br />
            <Button clase="Button" eventoClick={() => editClase(selectedClase.id)}>Editar</Button>
            <Button clase="Button" eventoClick={handleCloseModal}>Regresar</Button>
          </ContenedorForms>
        </>
      )}
    </motion.div>
  );
}

export default VerClaseA1;
