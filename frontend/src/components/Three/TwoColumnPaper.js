import React from 'react';
import { Paper, Typography, useMediaQuery } from '@mui/material';
import theme from '../Theme/Theme';

const TwoColumnPaper = ({ colorLegendData, divRef, guiContainerRef }) => {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper id='canvas' style={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row' }}>
      <Paper
        id='leyenda'
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
        className='noBorder'
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
        className='noBorder'
        style={{
          flex: '1',
          height: '100%',
          flexDirection: 'column',
          display: 'flex',
          margin: 0,
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', flexDirection: 'revert', left: 0 }} ref={divRef} />

        <div style={{ position: 'absolute', flexDirection: 'revert', right: 0 }} ref={guiContainerRef} />
      </Paper>
    </Paper>
  );
};

export default TwoColumnPaper;
