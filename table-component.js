// src/components/common/Table.js
import React, { useMemo, useState } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import Button from './Button';

const Table = ({ 
  columns, 
  data, 
  initialSortBy = [], 
  initialPageSize = 10, 
  pageSizeOptions = [5, 10, 20, 50], 
  className = ''
}) => {
  const [pageSize, setPageSize] = useState(initialPageSize);
  
  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedData = useMemo(() => data, [data]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize: setTablePageSize,
    state: { pageIndex }
  } = useTable(
    {
      columns: memoizedColumns,
      data: memoizedData,
      initialState: { 
        pageSize: initialPageSize,
        sortBy: initialSortBy 
      },
    },
    useSortBy,
    usePagination
  );

  // Update the table's page size when our state changes
  React.useEffect(() => {
    setTablePageSize(pageSize);
  }, [pageSize, setTablePageSize]);

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table {...getTableProps()} className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="hover:bg-gray-50">
                {row.cells.map(cell => (
                  <td
                    {...cell.getCellProps()}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="py-3 flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <Button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            variant="outline"
            size="sm"
          >
            Previous
          </Button>
          <Button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            variant="outline"
            size="sm"
          >
            Next
          </Button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center gap-x-2">
            <span className="text-sm text-gray-700">
              Page <span className="font-medium">{pageIndex + 1}</span> of{' '}
              <span className="font-medium">{pageOptions.length}</span>
            </span>
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
              }}
              className="border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <Button
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
                variant="light"
                size="sm"
                className="rounded-l-md"
              >
                First
              </Button>
              <Button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                variant="light"
                size="sm"
              >
                Previous
              </Button>
              <Button
                onClick={() => nextPage()}
                disabled={!canNextPage}
                variant="light"
                size="sm"
              >
                Next
              </Button>
              <Button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                variant="light"
                size="sm"
                className="rounded-r-md"
              >
                Last
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
