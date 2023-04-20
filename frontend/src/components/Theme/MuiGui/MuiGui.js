import React from 'react'
import { makeStyles } from '@mui/styles';


const useStyles = makeStyles((theme) => ({
  gui: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    zIndex: '9999',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
  },
  folder: {
    '& .property-name': {
      color: theme.palette.primary.main,
    },
    '& .property-value': {
      fontSize: '20px',
    },
  },
}));


export const MuiGui = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.gui}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          className: `${child.props.className} ${classes.folder}`,
        })
      )}
    </div>
  );
};
