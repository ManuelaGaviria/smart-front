import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo3 from '../../../../components/Logo3';
import { motion } from 'framer-motion';
import FullscreenCard from '../../../../components/FullScreenCard';
import ButtonLink from '../../../../components/ButtonLink';
import { fetchBody, fetchFormData, fetchGet } from '../../../../utils/fetch';
import ContenedorForms from '../../../../components/ContenedorForms';
import { MdModeEdit, MdDelete } from "react-icons/md";
import { IoCloudUpload } from "react-icons/io5";
import GeneralContext from '../../../../context/GeneralContext';
import Swal from 'sweetalert2';
import SelectEdit from '../../../../components/SelectEdit';
import LabelInputEdit from '../../../../components/LabelInputEdit';
import Button from '../../../../components/Button';
import ButtonLinkState from '../../../../components/ButtonLinkState';
const FormData = require('form-data');


function VerExamenA1() {
  const navigate = useNavigate();

  useEffect(() => {
    const verificar = async () => {
      const respuesta = await fetchBody('/usuarios/', 'POST', { rol: "superadministrador" });
      if (respuesta.exito === false) {
        navigate("/");
      }
    }
    verificar();
  }, [navigate]);

  const [clases, setClases] = useState([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState("");

  useEffect(() => {
    const listClases = async () => {
      try {
        const respuesta = await fetchBody('/niveles/obtenerClase', 'POST', { nivel: "A1" });
        if (respuesta.exito) {
          const clasesFormateadas = respuesta.lista.map(clase => ({
            nombre: clase.id,
            id: clase.id
          }));
          setClases(clasesFormateadas);
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
          text: 'Error al procesar la solicitud para listar las clases',
          customClass: {
            confirmButton: 'btn-color'
          },
          buttonsStyling: false
        });
      }
    }
    listClases();
  }, []);

  const handleChange = (e) => {
    setClaseSeleccionada(e.target.value); // Actualizar el estado con la clase seleccionada
    console.log('Clase seleccionada:', e.target.value);
  };

  const { changeNumero, changeDescripcion, changeUnidades } = useContext(GeneralContext);
  const [examenes, setExamen] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadEditModalOpen, setUploadEditModalOpen] = useState(false);
  const [editUploadModalOpen, setEditUploadModalOpen] = useState(false);

  const [selectedExamen, setSelectedExamen] = useState(null);
  const [backgroundOpacity] = useState(0.5);

  useEffect(() => {
    listExamenes();
  }, []);

  const openEditModal = (examen) => {
    setSelectedExamen(examen);
    setEditModalOpen(true);
  };

  const openUploadModal = (examen) => {
    setSelectedExamen(examen);
    setUploadModalOpen(true);
  };

  const openUploadEditModal = (examen) => {
    console.log("Examen en openUploadEditModal:", examen);
    setSelectedExamen(examen);
    setUploadEditModalOpen(true);
  }

  const openEditUploadModal = (examen) => {
    console.log("Examen en openEditUploadModal:", examen);
    setSelectedExamen(examen);
    setEditUploadModalOpen(true);
    setUploadEditModalOpen(false);
  }

  const handleCloseModal = () => {
    setEditModalOpen(false);
    setUploadModalOpen(false);
    setUploadEditModalOpen(false);
    setEditUploadModalOpen(false);
  };

  async function listExamenes() {
    try {
      const respuesta = await fetchBody('/niveles/listarExamen', 'POST', { nivel: "A1" });
      if (respuesta.exito) {
        setExamen(respuesta.lista);
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
        text: 'Error al procesar la solicitud para listar los examenes',
        customClass: {
          confirmButton: 'btn-color'
        },
        buttonsStyling: false
      });
    }
  }

  async function handleUpload(id) {
    const examenToEdit = examenes.find(examen => examen.id === id);
    if (examenToEdit) {
      openUploadModal(examenToEdit);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: 'Examen no encontrado',
        customClass: {
          confirmButton: 'btn-color'
        },
        buttonsStyling: false
      });
    }
  }

  const [fileUpload, setFileUpload] = useState(null);

  async function uploadExamen(id) {
    if (fileUpload === null) {
      console.log("Archivo vacío");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('archivo', fileUpload);
      formData.append('id', id); // Agregar el ID
      formData.append('nivel', "A1"); // Agregar el nivel
      console.log(formData);

      const respuesta = await fetchFormData('/niveles/agregarExamenOral', 'POST', formData);

      if (respuesta.exito) {
        Swal.fire({
          icon: "success",
          title: "Se subió el examen con éxito!",
          customClass: {
            confirmButton: 'btn-color'
          },
          buttonsStyling: false
        });
        handleCloseModal();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error subiendo el archivo",
          customClass: {
            confirmButton: 'btn-color'
          },
          buttonsStyling: false
        });
      }
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al subir el archivo",
        customClass: {
          confirmButton: 'btn-color'
        },
        buttonsStyling: false
      });
    }
  }

  async function uploadEditExamen(id) {
    console.log("ID en uploadEditExamen" + id);
    if (fileUpload === null) {
      console.log("Archivo vacío");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('nuevoArchivo', fileUpload);
      formData.append('id', id); // Agregar el ID
      formData.append('nivel', "A1"); // Agregar el nivel
      console.log(formData);

      const respuesta = await fetchFormData('/niveles/editarExamenOral', 'PUT', formData);
      console.log(respuesta);
      if (respuesta.exito) {
        Swal.fire({
          icon: "success",
          title: "Se editó el examen con éxito!",
          customClass: {
            confirmButton: 'btn-color'
          },
          buttonsStyling: false
        });
        handleCloseModal();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error subiendo el archivo",
          customClass: {
            confirmButton: 'btn-color'
          },
          buttonsStyling: false
        });
      }
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al subir el archivo",
        customClass: {
          confirmButton: 'btn-color'
        },
        buttonsStyling: false
      });
    }
  }


  async function handleUploadModal(id) {
    const examenToEdit = examenes.find(examen => examen.id === id);
    if (examenToEdit) {
      openUploadEditModal(examenToEdit);
    }
  }



  async function handleEdit(id) {
    const examenToEdit = examenes.find(examen => examen.id === id);
    if (examenToEdit) {
      openEditModal(examenToEdit);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: 'Examen no encontrado',
        customClass: {
          confirmButton: 'btn-color'
        },
        buttonsStyling: false
      });
    }
  }

  async function editExamen(id) {
    const numero = document.getElementById('idExamen').value;
    const unidades = document.getElementById('idUnidades').value;
    const tematica = document.getElementById('idTematica').value;
    if (numero === "" || unidades === "" || tematica === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor llena todos los campos.",
        customClass: {
          confirmButton: 'btn-color'
        },
        buttonsStyling: false
      });
    } else {
      const data = {
        id: id,
        examen: numero,
        unidades: unidades,
        tematica: tematica,
        clase: claseSeleccionada,
        nivel: "A1"
      };
      console.log(data);
      try {
        const respuesta = await fetchBody('/niveles/editarExamen', 'PUT', data);
        if (respuesta.exito) {
          Swal.fire({
            icon: "success",
            title: "Se actualizó el examen con éxito!",
            customClass: {
              confirmButton: 'btn-color'
            },
            buttonsStyling: false
          });
          handleCloseModal();
          await listExamenes();
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
          text: 'Error al procesar la solicitud para editar un administrador',
          customClass: {
            confirmButton: 'btn-color'
          },
          buttonsStyling: false
        });
      }
    }
  }

  async function handleDelete(id) {
    // Mostrar una alerta de confirmación antes de eliminar al profesor
    const confirmacion = await Swal.fire({
      title: '¿Estás seguro de eliminar este examen?',
      text: "Esta acción no se puede revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      customClass: {
        confirmButton: 'btn-color',
        cancelButton: 'btn-color-cancel'
      },
      buttonsStyling: false
    });

    // Verificar si el usuario confirmó la eliminación
    if (confirmacion.isConfirmed) {
      const data = { id: id, nivel: "A1" };
      try {
        const respuesta = await fetchBody('/niveles/eliminarExamen', 'DELETE', data);
        if (respuesta.exito) {
          Swal.fire({
            icon: "success",
            title: "Examen eliminado con éxito!",
            customClass: {
              confirmButton: 'btn-color'
            },
            buttonsStyling: false
          });
          await listExamenes();
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
          text: 'Error al procesar la solicitud para eliminar un examen',
          customClass: {
            confirmButton: 'btn-color'
          },
          buttonsStyling: false
        });
      }
    }
  }

  async function handleDeleteUpload(id) {
    // Mostrar una alerta de confirmación antes de eliminar al profesor
    const confirmacion = await Swal.fire({
      title: '¿Estás seguro de eliminar este archivo?',
      text: "Esta acción no se puede revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      customClass: {
        confirmButton: 'btn-color',
        cancelButton: 'btn-color-cancel'
      },
      buttonsStyling: false
    });

    // Verificar si el usuario confirmó la eliminación
    if (confirmacion.isConfirmed) {
      const data = { id: id, nivel: "A1" };
      try {
        const respuesta = await fetchBody('/niveles/eliminarExamenOral', 'DELETE', data);
        if (respuesta.exito) {
          Swal.fire({
            icon: "success",
            title: "Examen eliminado con éxito!",
            customClass: {
              confirmButton: 'btn-color'
            },
            buttonsStyling: false
          });
          await listExamenes();
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
          text: 'Error al procesar la solicitud para eliminar un examen',
          customClass: {
            confirmButton: 'btn-color'
          },
          buttonsStyling: false
        });
      }
    }
  }

  const descargarExamenOral = async (id, nivel) => {
    try {
      const response = await fetch('http://localhost:5000/niveles/obtenerExamenOral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, nivel }),
      });

      if (!response.ok) {
        throw new Error('Error al obtener el examen oral');
      }

      const blob = await response.blob();
      const urlBlob = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = urlBlob;
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition ? contentDisposition.split('filename=')[1] : 'downloaded_file.pdf';
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
      console.error('Error al descargar el examen oral:', error);
    }
  };

  const downloadExamen = async (id) => {
    const data = {
      id: id,
      nivel: "A1"
    }
    try {
      const respuestaBD = await fetchGet('/niveles/obtenerBD');
      console.log(respuestaBD);
      if (respuestaBD.exito) {
        console.log("holiwi");
        if (respuestaBD.bd === 'oracle') {
          console.log("holi");
          try {
            const response = await fetch('http://localhost:5000/niveles/obtenerExamenOral', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });
            console.log(response);
            if (!response.ok) {
              throw new Error('Error al obtener el examen oral');
            }

            const blob = await response.blob();
            const urlBlob = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = urlBlob;
            const contentDisposition = response.headers.get('Content-Disposition');
            const filename = contentDisposition ? contentDisposition.split('filename=')[1] : 'downloaded.pdf';
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(urlBlob);
          } catch (error) {
            console.error('Error al descargar el examen oral:', error);
          }
        } else {
          const respuesta = await fetchBody('/niveles/obtenerExamenOral', 'POST', data);
          if (respuesta.exito){
            const url = respuesta.archivoUrl;
            window.open(url, '_blank');
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
        }
      } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error",
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
      text: 'Error al procesar la solicitud para descargar el examen oral',
      customClass: {
        confirmButton: 'btn-color'
      },
      buttonsStyling: false
    });
  }
}

return (
  <motion.div
    className='ContainerFull'
    initial={{ opacity: 0, x: 1000 }} // Inicia desde la derecha
    animate={{ opacity: 1, x: 0 }} // Animación hacia la izquierda
    exit={{ opacity: 0, x: -1000 }} // Sale hacia la izquierda
    transition={{ duration: 1 }}>
    <Logo3 />
    <FullscreenCard>
      <div className='CenterTable'>
        <table className='Table'>
          <thead>
            <tr>
              <th style={{ width: '200px' }}>Examen #</th>
              <th style={{ width: '200px' }}>Unidades</th>
              <th style={{ width: '200px' }}>Temática</th>
              <th style={{ width: '200px' }}>Clase que lo desbloquea</th>
              <th style={{ width: '200px' }}>Examen Escrito</th>
              <th style={{ width: '200px' }}>Examen Oral</th>
              <th style={{ width: '200px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {examenes.map((examen) => (
              <tr key={examen.id}>
                <td>{examen.examen}</td>
                <td>{examen.unidades}</td>
                <td>{examen.tematica}</td>
                <td>{examen.clase}</td>
                <td>
                  <ButtonLinkState clase="btn-ver" destino="/VerExamenEscritoA1" estado={{ examenId: examen.id }}>Ver</ButtonLinkState>
                </td>
                <td>
                  <button className='btn-upload' onClick={() => handleUpload(examen.id)}><IoCloudUpload /></button>
                  <button className='btn-ver' onClick={() => handleUploadModal(examen.id)}>Ver</button>

                </td>
                <td className='Actions'>
                  <button className='btn-edit' onClick={() => handleEdit(examen.id)}><MdModeEdit /></button>
                  <button className='btn-delete' onClick={() => handleDelete(examen.id)}><MdDelete /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ButtonLink destino="/GestionarExamenA1" clase="ButtonRegresar">Regresar</ButtonLink>
    </FullscreenCard>

    {editModalOpen && (
      <>
        <div
          className="BackgroundOverlay"
          style={{ opacity: backgroundOpacity }}
        />
        <ContenedorForms>
          <h1>Editar Examen</h1>
          <div className="InputContainer">
            <LabelInputEdit id="idExamen" tipo="number" texto="Examen #" eventoCambio={changeNumero} valorInicial={selectedExamen.examen}></LabelInputEdit>
            <LabelInputEdit id="idUnidades" eventoCambio={changeUnidades} texto="Unidades" valorInicial={selectedExamen.unidades}></LabelInputEdit>
            <LabelInputEdit id="idTematica" texto="Temática" eventoCambio={changeDescripcion} valorInicial={selectedExamen.tematica}></LabelInputEdit>
            <SelectEdit titulo="Clase que lo desbloquea"
              opciones={clases}
              eventoCambio={handleChange}
              valorInicial={selectedExamen.clase}>
            </SelectEdit>
          </div>
          <br />
          <Button clase="Button" eventoClick={() => editExamen(selectedExamen.id)}>Editar</Button>
          <Button clase="Button" eventoClick={handleCloseModal}>Regresar</Button>
        </ContenedorForms>
      </>
    )}

    {uploadModalOpen && (
      <>
        <div
          className="BackgroundOverlay"
          style={{ opacity: backgroundOpacity }}
        />
        <ContenedorForms>
          <h1>Subir Archivo</h1>
          <div className="InputContainer">
            <input type="file" onChange={(event) => { setFileUpload(event.target.files[0]) }} />
          </div>
          <br />
          <Button clase="Button" eventoClick={() => uploadExamen(selectedExamen.id)}>Subir</Button>
          <Button clase="Button" eventoClick={handleCloseModal}>Regresar</Button>
        </ContenedorForms>
      </>
    )}

    {editUploadModalOpen && (
      <>
        <div
          className="BackgroundOverlay"
          style={{ opacity: backgroundOpacity }}
        />
        <ContenedorForms>
          <h1>Subir Archivo</h1>
          <div className="InputContainer">
            <input type="file" onChange={(event) => { setFileUpload(event.target.files[0]) }} />
          </div>
          <br />
          <Button clase="Button" eventoClick={() => {
            console.log("selectedExamen antes de subir: ", selectedExamen);
            uploadEditExamen(selectedExamen);
          }}>Subir</Button>
          <Button clase="Button" eventoClick={handleCloseModal}>Regresar</Button>
        </ContenedorForms>
      </>
    )}

    {uploadEditModalOpen && (
      <>
        <div
          className="BackgroundOverlay"
          style={{ opacity: backgroundOpacity }}
        />
        <ContenedorForms>
          <h1>Gestionar Archivo</h1>
          <Button clase="Button" eventoClick={() => downloadExamen(selectedExamen.id)}>Descargar</Button>
          <Button clase="Button" eventoClick={() => openEditUploadModal(selectedExamen.id)}>Editar</Button>
          <Button clase="Button" eventoClick={() => handleDeleteUpload(selectedExamen.id)}>Eliminar</Button>
          <Button clase="Button" eventoClick={handleCloseModal}>Regresar</Button>
        </ContenedorForms>
      </>
    )}
  </motion.div>
);
}

export default VerExamenA1;
