import { faker } from '@faker-js/faker';
import './index.css';

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { makeData } from './makeData';
import { useState } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  makeStyles,
} from '@material-ui/core';

const defaultColumns = [
  {
    header: 'Name',
    footer: (props) => props.column.id,
    columns: [
      {
        accessorKey: 'firstName',
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
        width: 500,
      },
      {
        accessorFn: (row) => row.lastName,
        id: 'lastName',
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: (props) => props.column.id,
        width: 500,
      },
    ],
  },
  {
    header: 'Info',
    footer: (props) => props.column.id,
    columns: [
      {
        accessorKey: 'age',
        header: () => 'Age',
        footer: (props) => props.column.id,
        width: 500,
      },
      {
        header: 'More Info',
        columns: [
          {
            accessorKey: 'visits',
            header: () => <span>Visits</span>,
            footer: (props) => props.column.id,
            width: 500,
          },
          {
            accessorKey: 'status',
            header: 'Status',
            footer: (props) => props.column.id,
            width: 500,
          },
          {
            accessorKey: 'progress',
            header: 'Profile Progress',
            footer: (props) => props.column.id,
            width: 500,
          },
        ],
      },
    ],
  },
];

export default function GridTable() {
  const classes = useStyles();
  const [data, setData] = useState(() => makeData(5000));
  const [columns] = useState(() => [...defaultColumns]);

  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnOrder, setColumnOrder] = useState([]);
  const [columnPinning, setColumnPinning] = useState({});

  const [isSplit, setIsSplit] = useState(false);
  const rerender = () => setData(() => makeData(5000));

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      columnOrder,
      columnPinning,
    },
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  const randomizeColumns = () => {
    table.setColumnOrder(
      faker.helpers.shuffle(table.getAllLeafColumns().map((d) => d.id))
    );
  };

  return (
    <div className="p-2">
      <div className="inline-block border border-black shadow rounded">
        <div className="px-1 border-b border-black">
          <label>
            <input
              {...{
                type: 'checkbox',
                checked: table.getIsAllColumnsVisible(),
                onChange: table.getToggleAllColumnsVisibilityHandler(),
              }}
            />{' '}
            Toggle All
          </label>
        </div>
        {table.getAllLeafColumns().map((column) => {
          return (
            <div key={column.id} className="px-1">
              <label>
                <input
                  {...{
                    type: 'checkbox',
                    checked: column.getIsVisible(),
                    onChange: column.getToggleVisibilityHandler(),
                  }}
                />{' '}
                {column.id}
              </label>
            </div>
          );
        })}
      </div>
      <div className="h-4" />
      <div className="flex flex-wrap gap-2">
        <button onClick={() => rerender()} className="border p-1">
          Regenerate
        </button>
        <button onClick={() => randomizeColumns()} className="border p-1">
          Shuffle Columns
        </button>
      </div>
      <div className="h-4" />
      <div>
        <label>
          <input
            type="checkbox"
            checked={isSplit}
            onChange={(e) => setIsSplit(e.target.checked)}
          />{' '}
          Split Mode
        </label>
      </div>
      <div className={`flex ${isSplit ? 'gap-4' : ''}`}>
        <Table className={classes.table}>
          <TableHead>
            {(isSplit
              ? table.getCenterHeaderGroups()
              : table.getHeaderGroups()
            ).map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    colSpan={header.colSpan}
                    sx={{ position: 'relative', width: header.getSize() }}
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
                    {!header.isPlaceholder && header.column.getCanPin() && (
                      <div className="flex gap-1 justify-center">
                        {header.column.getIsPinned() !== 'left' ? (
                          <Button
                            className="border rounded px-2"
                            onClick={() => {
                              header.column.pin('left');
                            }}
                          >
                            {'<='}
                          </Button>
                        ) : null}
                        {header.column.getIsPinned() ? (
                          <Button
                            className="border rounded px-2"
                            onClick={() => {
                              header.column.pin(false);
                            }}
                          >
                            X
                          </Button>
                        ) : null}
                        {header.column.getIsPinned() !== 'right' ? (
                          <Button
                            className="border rounded px-2"
                            onClick={() => {
                              header.column.pin('right');
                            }}
                          >
                            {'=>'}
                          </Button>
                        ) : null}
                      </div>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table
              .getRowModel()
              .rows.slice(0, 20)
              .map((row) => {
                return (
                  <TableRow key={row.id}>
                    {(isSplit
                      ? row.getCenterVisibleCells()
                      : row.getVisibleCells()
                    ).map((cell) => {
                      return (
                        <TableCell
                          key={cell.id}
                          sx={{ width: cell.column.getSize() }}
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
      </div>
      <pre>{JSON.stringify(table.getState().columnPinning, null, 2)}</pre>
    </div>
  );
}

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    "& .MuiTableCell-root": {
      borderLeft: "1px solid rgba(224, 224, 224, 1)"
    }
  }
});
