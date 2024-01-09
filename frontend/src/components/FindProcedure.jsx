import React, { useState, useEffect } from 'react';
import ProcedureDetails from './ProcedureData';
import ProcedureVideo from './Video';
import { default as address }  from '../config/serverconfig'

const FindProcedure = () => {
  const [procedureIds, setProcedureIds] = useState([]);
  const [selectedProcedureId, setSelectedProcedureId] = useState('');
  const [taskName, setTaskName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [stopTime, setStopTime] = useState('');
  const [description, setDescription] = useState('');


  const handleClear = () => {
    setSelectedProcedureId('');
    setTaskName('');
    setStartTime('');
    setStopTime('');
    setDescription('');
  }
  // fetch all of the procedure IDs from the backend
  useEffect(() => {
    const fetchProcedureIds = async () => {
      try {
        const response = await fetch(address + '/procedures');
        if (response.ok) {
          const data = await response.json();
          setProcedureIds(data.procedureIds);
        } else {
          console.error('Error fetching procedure IDs:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching procedure IDs:', error);
      }
    };

    fetchProcedureIds();
  }, []);

  const handleProcedureSelect = (event) => {
    setSelectedProcedureId(event.target.value);
  };
  const handleAddTask = async () => {
    const taskData = {
      description: description,
      name: taskName,
      procedureId: selectedProcedureId,
      start: startTime,
      stop: stopTime,
    };
  
    try {
      const response = await fetch(`${address}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
  
      if (response.ok) {
        console.log('Task added successfully!');
        handleClear();
      } else {
        console.error('Error adding task:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  

  return (
    <div>
      <h2>Find Procedure</h2>
      <label>
        Select Procedure:
        <select value={selectedProcedureId} onChange={handleProcedureSelect}>
          <option value="">Select...</option>
          {procedureIds.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
      </label>
      <br />
      {selectedProcedureId && (
        <div>
          <h3>Add Task to Procedure "{selectedProcedureId}"</h3>
          <label>
            Task Name:
            <input type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
          </label>
          <br />
          <label>
            Start Time:
            <input type="text" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </label>
          <br />
          <label>
            Stop Time:
            <input type="text" value={stopTime} onChange={(e) => setStopTime(e.target.value)} />
          </label>
          <br />
          <label>
            Description:
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <br />
          <button onClick={handleAddTask}>Add Task</button>
        </div>
      )}
      <ProcedureVideo procedureId={selectedProcedureId}/>
      <ProcedureDetails procedureId={selectedProcedureId}/>
    </div>
  );
};

export default FindProcedure;
