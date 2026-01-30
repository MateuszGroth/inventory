import { ReactNode } from 'react'
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
  Box,
} from '@mui/material'

export type SortDirection = 'asc' | 'desc'

export type TableColumn<T> = {
  header: string
  field: string
  renderValue?: (rowData: T) => ReactNode
  sortable?: boolean
  width?: number | string
  align?: 'left' | 'center' | 'right'
}

type PaginationProps = {
  page: number
  pageSize: number
  totalCount: number
  onPageChange: (page: number) => void
}

type TableProps<T> = {
  data: T[]
  columns: NoInfer<TableColumn<T>[]>
  orderBy?: string
  orderDir?: SortDirection
  onSortChange?: (orderBy: string, orderDir: SortDirection) => void
  getRowKey?: (row: T, index: number) => string | number
  emptyMessage?: string
  pagination?: PaginationProps
}

export const Table = <T,>({
  data,
  columns,
  orderBy,
  orderDir = 'asc',
  onSortChange,
  getRowKey,
  emptyMessage = 'No data available',
  pagination,
}: TableProps<T>) => {
  const handleSort = (field: string) => {
    if (!onSortChange) return
    const newDirection = orderBy === field && orderDir === 'asc' ? 'desc' : 'asc'
    onSortChange(field, newDirection)
  }

  const getCellValue = (row: T, column: TableColumn<T>): ReactNode => {
    if (column.renderValue) {
      return column.renderValue(row)
    }
    const value = (row as Record<string, unknown>)[column.field]
    if (value == null) {
      return '-'
    }
    return String(value)
  }

  const defaultGetRowKey = (_row: T, index: number) => index
  const rowKeyFn = getRowKey ?? defaultGetRowKey

  return (
    <TableContainer component={Paper} variant="outlined">
      <MuiTable>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.field}
                align={column.align ?? 'left'}
                sx={{ fontWeight: 600, width: column.width }}
              >
                {column.sortable && onSortChange ? (
                  <TableSortLabel
                    active={orderBy === column.field}
                    direction={orderBy === column.field ? orderDir : 'asc'}
                    onClick={() => handleSort(column.field)}
                  >
                    {column.header}
                  </TableSortLabel>
                ) : (
                  column.header
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                <Box sx={{ py: 4, color: 'text.secondary' }}>{emptyMessage}</Box>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow key={rowKeyFn(row, index)} hover>
                {columns.map((column) => (
                  <TableCell key={column.field} align={column.align ?? 'left'}>
                    {getCellValue(row, column)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </MuiTable>
      {pagination && (
        <TablePagination
          component="div"
          count={pagination.totalCount}
          page={pagination.page - 1}
          rowsPerPage={pagination.pageSize}
          rowsPerPageOptions={[pagination.pageSize]}
          onPageChange={(_event, newPage) => pagination.onPageChange(newPage + 1)}
        />
      )}
    </TableContainer>
  )
}
