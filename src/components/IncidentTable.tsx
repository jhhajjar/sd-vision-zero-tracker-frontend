import Paper from "@mui/material/Paper";
import { Incident } from "../services/incidentService";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TablePagination from "@mui/material/TablePagination";
import React from "react";

interface TableProps {
    incidents: Incident[]
}

interface Column {
    id: keyof Incident;
    label: string;
    minWidth?: number;
    align?: 'right' | 'left';
}

const columns: Column[] = [
    { id: 'full_address', label: 'Location', minWidth: 200 },
    { id: 'date_time', label: 'Date' },
    { id: 'charge_desc', label: 'Charge Description' },
    { id: 'injured', label: 'Injured', align: "right" },
    { id: 'killed', label: 'Killed', align: "right" },
]

export const IncidentTable: React.FC<TableProps> = (props: TableProps) => {
  const { incidents } = props
//   const [page, setPage] = React.useState(0);
  const [hoveredRow, setHoveredRow] = React.useState<string | null>(null);

  const cellStyling = { color: '#fff', borderColor: '#444' }

  return (
    <Paper sx={{
      width: '100%',
      backgroundColor: '#1a1a1a',
      color: '#fff'
    }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    fontWeight: 'bold',
                    fontSize: '20px',
                    backgroundColor: '#1a1a1a',
                    color: '#fff'
                }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {incidents
              .map((row) => {
                return (
                  <tr
                    key={row.id}
                    style={{
                      backgroundColor: hoveredRow === row.id ? '#3a3a3a' : '#2a2a2a',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={() => setHoveredRow(row.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => {window.open(row['link'], '_blank', 'noopener,noreferrer')}}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          sx={cellStyling}
                        >
                          {value}
                        </TableCell>
                      );
                    })}
                  </tr>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={incidents.length}
        rowsPerPage={incidents.length}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          color: '#fff',
          borderTop: '1px solid #444',
          '.MuiTablePagination-actions button': {
            color: '#fff'
          },
          '.MuiTablePagination-displayedRows': {
            color: '#fff'
          }
        }}
      /> */}
    </Paper>
  )
}