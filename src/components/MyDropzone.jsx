// MyDropzone.js
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const MyDropzone = () => {
  const [fileName, setFileName] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    // Aquí puedes manejar los archivos aceptados
    if (acceptedFiles.length > 0) {
      setFileName(acceptedFiles[0].name);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} style={styles.dropzone}>
      <input {...getInputProps()} />
      {
        fileName ?
          <p>Archivo subido: {fileName}</p> :
          (isDragActive ?
            <p>Suelta los archivos aquí...</p> :
            <p>Arrastra y suelta algunos archivos aquí, o haz clic para seleccionar archivos</p>
          )
      }
    </div>
  );
};

const styles = {
  dropzone: {
    border: '2px dashed #cccccc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer'
  }
};

export default MyDropzone;
