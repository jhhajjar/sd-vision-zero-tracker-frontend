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
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

interface TableProps {
  incidents: Incident[];
  page: number;
  pageSize: number;
  totalIncidents: number;
  onPageChange: (event: unknown, newPage: number) => void;
  loading: boolean;
}

interface Column {
  id: keyof Incident;
  label: string;
  minWidth?: number;
  align?: "right" | "left";
}

const columns: Column[] = [
  { id: "full_address", label: "Location", minWidth: 200 },
  { id: "date_time", label: "Date" },
  { id: "charge_desc", label: "Charge Description" },
  { id: "injured", label: "Injured", align: "right" },
  { id: "killed", label: "Killed", align: "right" },
];

export const IncidentTable: React.FC<TableProps> = (props: TableProps) => {
  const { loading, incidents, page, totalIncidents, pageSize, onPageChange } = props;
  const [hoveredRow, setHoveredRow] = React.useState<string | null>(null);

  const cellStyling = { color: "#fff", borderColor: "#444" };

  const handleChangePage = async (_: unknown, newPage: number) => {
    await onPageChange(_, newPage);
  };

  const spinner = <>
    <TableCell colSpan={5} sx={{ justifyContent: 'center', alignItems: 'center', height: 200 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    </TableCell>
  </>

  return (
    <Paper
      sx={{
        width: "100%",
        backgroundColor: "#1a1a1a",
        color: "#fff",
      }}
    >
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
                    fontWeight: "bold",
                    fontSize: "20px",
                    backgroundColor: "#1a1a1a",
                    color: "#fff",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? spinner : incidents.map((row) => {
              return (
                <tr
                  key={row.report_id}
                  style={{
                    backgroundColor:
                      hoveredRow === row.report_id ? "#3a3a3a" : "#2a2a2a",
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => setHoveredRow(row.report_id)}
                  onMouseLeave={() => setHoveredRow(null)}
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
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={totalIncidents}
        rowsPerPage={pageSize}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={() => {}}
        sx={{
          color: "#fff",
          borderTop: "1px solid #444",
          ".MuiTablePagination-actions button": {
            color: "#fff",
          },
          ".MuiTablePagination-displayedRows": {
            color: "#fff",
          },
        }}
      />
    </Paper>
  );
};
