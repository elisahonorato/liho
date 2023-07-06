import React from 'react';
import { Box, Typography } from '@mui/material';

export const MuiBox = (props) => {
  return (
    <Box sx={{ display: 'fixed', justifyContent: 'center' }}>
        <Typography>
            {props.children}
        </Typography>

    </Box>
  );
}
