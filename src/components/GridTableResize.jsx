import { useMemo } from 'react';
import './index.css';

import {
  getCoreRowModel,
  flexRender,
  useReactTable,
} from '@tanstack/react-table';
import { makeData } from './makeData';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  makeStyles,
} from '@material-ui/core';

const columns = [
  {
    accessorKey: 'firstName',
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
  },
  {
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => <span>Last Name</span>,
    footer: (props) => props.column.id,
  },
  {
    accessorKey: 'age',
    header: () => 'Age',
    footer: (props) => props.column.id,
  },
  {
    accessorKey: 'visits',
    header: () => <span>Visits</span>,
    footer: (props) => props.column.id,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    footer: (props) => props.column.id,
  },
  {
    accessorKey: 'progress',
    header: 'Profile Progress',
    footer: (props) => props.column.id,
  },
];

export default function GridTableResize() {
  const data = useMemo(() => makeData(20), []);
  const classes = useStyles();

  const table = useReactTable({
    data,
    columns,
    enableColumnResizing: true,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  return (
    <div className="p-2 block max-w-full overflow-x-scroll overflow-y-hidden">
      <div className="h-2" />
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table component="div" className={classes.tableContainer}>
            <TableHead component="div">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow component="div" key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableCell
                        component="div"
                        key={header.id}
                        colSpan={header.colSpan}
                        className={classes.thCell}
                        style={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {header.column.getCanResize() && (
                          <div
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            className={`resizer ${
                              header.column.getIsResizing() ? 'isResizing' : ''
                            }`}
                          ></div>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableHead>
            <TableBody component="div">
              {table.getRowModel().rows.map((row) => {
                return (
                  <TableRow component="div" key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell
                          component="div"
                          key={cell.id}
                          className={classes.tdCell}
                          style={{ width: cell.column.getSize() }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <div className="h-4" />
    </div>
  );
}

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
  tableContainer: {
    '& .MuiTableHead-root': {
      position: 'sticky',
      top: 0,
      zIndex: 2,
    },
    '& .MuiTableRow-root': {
      display: 'flex'
    }
  },
  thCell: {
    background: 'white',
    '&:first-child': {
      position: 'sticky',
      zIndex: 2,
      left: 0,
      top: 0,
      background: 'white',
    },
    '&:last-child': {
      position: 'sticky',
      zIndex: 2,
      right: 0,
      top: 0,
      background: 'white',
    },
  },
  tdCell: {
    '&:first-child': {
      position: 'sticky',
      zIndex: 1,
      left: 0,
      background: 'white',
    },
    '&:last-child': {
      position: 'sticky',
      zIndex: 1,
      right: 0,
      background: 'white',
    },
  },
});
