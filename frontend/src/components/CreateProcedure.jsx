import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { default as address }  from '../config/serverconfig'

const CreateProcedureForm = () => {
  const [procedureName, setProcedureName] = useState('');
  const [procedureType, setProcedureType] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [duration, setDuration] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const { user } = useAuth0();

  const clearForm = () => {
    setProcedureName('');
    setProcedureType('');
    setDateTime('');
    setDuration('');
    setSelectedFile(null);
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!procedureName || !procedureType || !dateTime || !duration || !selectedFile) {
      console.log("ERROR: MISSING DATA");
      return;
    }
    const procedureData = {
      'procedureId': procedureName,
      'procedureType': procedureType,
      'date': dateTime,
      'duration': duration,
    };
    
    // create form data
    const formData = new FormData();
    formData.append('procedureData', JSON.stringify({ procedureData, userEmail: user.email }));
    formData.append('video', selectedFile);
    
    try {
      // post request to flask server
      const response = await fetch((address + '/procedure'), {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        console.log('Procedure uploaded successfully!');
        clearForm();
      } else {
        console.error('Error uploading procedure:', response.statusText);
      }
    } catch (error) {
      console.error('Error uploading procedure:', error);
    }
  };
  
  

  return (
    <div>
      <h2>Create Procedure</h2>
      <label>
        Procedure Name
      <input type="text" value={procedureName} onChange={(e) => setProcedureName(e.target.value)} />
      (must be unique)
        <br/>
        Procedure Type:
        <input type="text" value={procedureType} onChange={(e) => setProcedureType(e.target.value)} />
      </label>
      <br />
      <label>
        Date Time:
        <input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
      </label>
      <br />
      <label>
        Duration (in minutes):
        <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
      </label>
      <br />
      <label>
        Video Upload:
        <input type="file" accept="video/*" onChange={handleFileChange} />
      </label>
      <br />
      <button onClick={handleUpload}>Upload Procedure</button>
    </div>
  );
};

export default CreateProcedureForm;
