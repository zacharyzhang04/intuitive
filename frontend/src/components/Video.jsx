import React, { useState, useEffect } from 'react';

const ProcedureVideo = ({ procedureId }) => {
  const [videoUrl, setVideoUrl] = useState(null);

  // request the video url whenever procedure Id changes
  useEffect(() => {
    if (!procedureId) {
        setVideoUrl(null);
        return;
    }

    const fetchVideoUrl = async () => {
      try {
        const response = await fetch(`http://localhost:5002/procedure/${procedureId}/video`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.videoUrl) {
            setVideoUrl(data.videoUrl);
            console.log(data.videoUrl);
          } else {
            console.error('Video not found:', data.error);
          }
        } else {
          console.error('Error fetching video:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };
    
    fetchVideoUrl();
  }, [procedureId]);

  return (
    <div>
      {videoUrl ? (
        <video key={videoUrl} width="400" controls>
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <p/>
      )}
    </div>
  );
};

export default ProcedureVideo;
