import { ProductExternal } from '@org/models'
import { LoadingSpinner } from '../../../components/loading-spinner/loading-spinner'
import { Table, TableColumn } from '../../../components/table/table'
import { useGetProducts } from '../hooks/use-get-products'
import { useProductsFilters } from '../hooks/use-products-filters'
import { GetProductsParams } from '../services/products'
import { ErrorMessage } from '../../../components/error-message/error-message'
import {
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { useState } from 'react'
import { useGetCategories } from '../hooks/use-get-categories'
import { useDeleteProduct } from '../hooks/use-delete-product'

const columns: TableColumn<ProductExternal>[] = [
  { field: 'id', header: 'ID' },
  { field: 'name', header: 'Product name', sortable: true },
  { field: 'category', header: 'Product category', sortable: true },
  { field: 'storesCount', header: 'Number of stores with product' },
  { field: 'action', header: '', renderValue: (product) => <DeleteProductButton productId={product.id} /> },
]

const DeleteProductButton = ({ productId }: { productId: string }) => {
  const { mutate, isPending } = useDeleteProduct()

  return (
    <IconButton onClick={() => mutate(productId)} disabled={isPending}>
      <DeleteForeverIcon />
    </IconButton>
  )
}

export const ProductsPage = () => {
  const { filters, changeFilters } = useProductsFilters()
  const { data: response, isLoading, isError, isFetching } = useGetProducts(filters)
  const { data: categoriesResponse, isLoading: isLoadingCategories } = useGetCategories()

  const [nameFilter, setNameFilter] = useState(filters?.name ?? '')
  const [categoryFilter, setCategoryFilter] = useState(filters?.category ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    changeFilters({
      name: nameFilter || undefined,
      category: categoryFilter || undefined,
      page: 1,
    })
  }

  const handleReset = () => {
    setNameFilter('')
    setCategoryFilter('')
    changeFilters({
      name: undefined,
      category: undefined,
      page: 1,
    })
  }

  if (!response || isLoading || isLoadingCategories) {
    return <LoadingSpinner />
  }
  if (isError || !response.success) {
    return <ErrorMessage />
  }

  const { data } = response
  const categories = categoriesResponse?.data ?? []

  return (
    <Stack>
      <Typography component="h1" variant="h4" sx={{ color: 'primary.main', mb: 4 }}>
        Products
        {isFetching && <CircularProgress size={20} sx={{ ml: 1.5 }} />}
      </Typography>
      <Stack
        component="form"
        direction="row"
        onSubmit={handleSubmit}
        sx={{ gap: 2, flexWrap: 'wrap', mb: 3, alignItems: 'flex-end' }}
      >
        <TextField
          label="Product name"
          value={nameFilter}
          onChange={(e) => setNameFilter((e.target as unknown as { value: string }).value)}
          size="small"
          sx={{ minWidth: 200 }}
          variant="outlined"
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="category-filter-label">Category</InputLabel>
          <Select
            labelId="category-filter-label"
            value={categoryFilter}
            label="Category"
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" size="medium">
          Apply Filters
        </Button>
        <Button type="button" variant="outlined" size="medium" onClick={handleReset}>
          Reset
        </Button>
      </Stack>
      <Table
        columns={columns}
        data={data.results}
        onSortChange={(orderBy, orderDir) => {
          changeFilters({ orderBy, orderDir } as Partial<GetProductsParams>)
        }}
        orderBy={filters?.orderBy}
        orderDir={filters?.orderDir}
        pagination={{
          page: filters?.page || 1,
          pageSize: data.pageSize,
          totalCount: data.total,
          onPageChange: (newPage: number) => {
            changeFilters({ page: newPage })
          },
        }}
      />
    </Stack>
  )
}
