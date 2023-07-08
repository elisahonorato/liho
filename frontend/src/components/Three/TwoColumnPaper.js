import React, { useEffect } from 'react';
import { Box, Paper, Typography, useMediaQuery } from '@mui/material';
import theme from '../Theme/Theme';

const ThreeColumnPaper = ({ colorLegendData, divRef, guiContainerRef }) => {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const canvasRef = divRef; // Assign the same ref object

  useEffect(() => {
    const handleResize = () => {
      const canvasHeight = canvasRef.current.clientHeight;
      divRef.current.style.height = `${canvasHeight}px`;
    };

    handleResize(); // Initial resize

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Paper elevation={0} id="canvas" sx={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row' }}>
      <Paper
        id="leyenda"
        elevation={0}
        style={{
          padding: '10px',
          justifyContent: 'flex-start',
          flex: isSmallScreen ? '1' : '0 0 auto',
          marginRight: isSmallScreen ? '0' : '10px',
          zIndex: 1,
          height: '100%',
          flexDirection: isSmallScreen ? 'row' : 'column',
          display: 'flex',
          flexWrap: 'wrap',
        }}
        className="noBorder"
      >
        {colorLegendData.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              marginBottom: isSmallScreen ? '10px' : '0',
              width: isSmallScreen ? '50%' : '100%',
            }}
          >
            <div
              style={{
                backgroundColor: item.color,
                width: '10px',
                height: '10px',
                borderRadius: '50%',
              }}
              id={item.id}
            ></div>
            <Typography variant="body2" style={{ fontSize: '12px', margin: 0 }}>
              {item.text}
            </Typography>
          </div>
        ))}
      </Paper>
      <Paper
        elevation={0}
        className="noBorder"
        style={{
          flex: '1',
          height: '100%',
          flexDirection: 'column',
          display: 'flex',
          margin: 0,
          position: 'relative',
        }}
      >
        <Box
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            zIndex: 0,
          }}
          ref={divRef}
        >
          {/* Three.js canvas */}
          <div style={{ width: '100%', height: '100%' }} ref={canvasRef}>
            {/* Render Three.js scene here */}
          </div>
        </Box>
        <Box
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
            zIndex: 2,
          }}
          ref={guiContainerRef}
        >
          {/* Contenido de la GUI */}
        </Box>
      </Paper>
    </Paper>
  );
};

export default ThreeColumnPaper;
