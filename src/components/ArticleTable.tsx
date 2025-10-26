import { Article } from "../services/articleService"
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

interface Column {
  id: 'title' | 'date_posted' | 'link'
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: string) => string;
}

const columns: readonly Column[] = [
  { id: 'title', label: 'Article', minWidth: 170 },
  { 
    id: 'date_posted', 
    label: 'Date', 
    minWidth: 100, 
    align: 'right',
    format: (value: string) => new Date(value).toDateString(),
  },
];


interface TableProps {
    articles: Article[]
}

export const ArticleTable: React.FC<TableProps> = (props: TableProps) => {
  const { articles } = props
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [hoveredRow, setHoveredRow] = React.useState<string | null>(null);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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
            {articles
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                          {column.format
                            ? column.format(value)
                            : value}
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
        count={articles.length}
        rowsPerPage={rowsPerPage}
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
      />
    </Paper>
  );
}