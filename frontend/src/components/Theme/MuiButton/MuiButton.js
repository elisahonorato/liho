import React from 'react'
import { makeStyles } from '@mui/styles';
import { Button } from '@mui/material';


const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.primary.light,

      '&:hover': {
        backgroundColor: theme.palette.primary,
      },
    },
  }));


export const MuiButton = (props) => {
    const classes = useStyles();
    return (
        <Button className={classes.root} {...props} />
    )
}

