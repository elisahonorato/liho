import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';



export default function MuiTable() {
  // Here you can define your data state
  const [data, setData] = useState([
    { id: "Muestra 1", name: 'John Doe', age: 30 },
    { id: "Muestra 2", name: 'Jane Smith', age: 25 },
    { id: "Muestra 3", name: 'Bob Johnson', age: 40 },
  ]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Map through the data to create a row for each object */}
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.age}</TableCell>
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
