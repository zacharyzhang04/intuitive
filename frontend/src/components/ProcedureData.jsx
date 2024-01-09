import React, { useState, useEffect } from 'react';
import { default as address }  from '../config/serverconfig'

const ProcedureDetails = ({ procedureId }) => {
  const [procedureData, setProcedureData] = useState(null);
  const [visible, setVisible] = useState(false);

  // request the procedure data upon button click
  useEffect(() => {
    if (!procedureId) return;
    const fetchProcedureData = async () => {
      try {
        const response = await fetch(`${address}/procedures/${procedureId}`);
        if (response.ok) {
          const data = await response.json();
          setProcedureData(data);
        } else {
          console.log("ERROR")
        }
      } catch (error) {
        console.log("ERROR")
      }
    };

    fetchProcedureData();
  }, [procedureId]);

  const handleClick = () => {
    setVisible(!visible);
  }


  return (
    <div>
        {visible && procedureData?<div>{<pre>{JSON.stringify(procedureData, null, 2)}</pre>}</div> : 
        procedureId? <button onClick={handleClick}> See Procedure Information </button> 
        : <div/>}
      
    </div>
  );
};

export default ProcedureDetails;