import React from 'react';
import ReactDropzone from 'react-dropzone';

function UploadData() {
  const onDrop = (acceptedFiles) => {
    console.log(acceptedFiles)
  }

  return (
    <ReactDropzone onDrop={onDrop}>
      {({ getRootProps, getInputProps }) => (
        <section>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
        </section>
      )}
    </ReactDropzone>
  );
}
export default UploadData;






