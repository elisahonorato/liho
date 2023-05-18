import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip } from '@mui/material';

const columns = [
  { id: 'id', label: 'Nombre Muestra', tooltip: 'Nombre de la muestra del tipo String'},
  { id: 'variable1', label: 'Variable 1', tooltip: 'Numero del 0 al 1' },
  { id: 'variable2', label: 'Variable 2', tooltip: 'Numero del 0 al 1' },
  { id: 'variable3', label: 'Variable 3', tooltip: 'Numero del 0 al 1' },
  { id: 'variable4', label: 'Variable 4', tooltip: 'Numero del 0 al 1' },
  { id: 'variable5', label: 'Variable 5', tooltip: 'Numero del 0 al 1' },
  { id: 'variable6', label: 'Variable 6', tooltip: 'Numero del 0 al 1' },
];

export default function MuiTable() {
  // Generate random data for each row of the table
  const data = [...Array(5)].map((_, i) => ({
    id: `Muestra ${i + 1}`,
    variable1: Math.random(),
    variable2: Math.random(),
    variable3: Math.random(),
    variable4: Math.random(),
    variable5: Math.random(),
    variable6: Math.random(),
  }));

  const [, setTooltipOpen] = useState(null);

  const handleTooltipOpen = (event) => {
    setTooltipOpen(event.currentTarget);
  };

  const handleTooltipClose = () => {
    setTooltipOpen(null);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id}>
                <Tooltip title={column.tooltip}>
                  <span onMouseEnter={handleTooltipOpen} onMouseLeave={handleTooltipClose}>
                    {column.label}
                  </span>
                </Tooltip>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Map through the data to create a row for each object */}
          {data.map((row) => (
            <TableRow key={row.id}>
              {columns.map((column) => (
                <TableCell key={column.id}>
                  {column.id === 'id' ? row[column.id] : row[column.id].toFixed(3)}
                </TableCell>
              ))}
              <TableCell>
                {/* Here you can add your actions buttons */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
