import AddIcon from '@mui/icons-material/Add'
import {
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { StoreProductExternal } from '@org/models'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ErrorMessage } from '../../../components/error-message/error-message'
import { LoadingSpinner } from '../../../components/loading-spinner/loading-spinner'
import { Table, TableColumn } from '../../../components/table/table'
import { useGetStore } from '../hooks/use-get-store'
import { useStoreProductsFilters } from '../hooks/use-store-products-filters'
import { StoreProductModal } from './store-product-modal'
import { useGetStoreProducts } from '../hooks/use-get-store-products'
import { useGetCategories } from '../../products'
import { GetStoreProductsParams } from '../services/stores'
import EditIcon from '@mui/icons-material/Edit'
import { useDeleteStoreProduct } from '../hooks/use-delete-store-product'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

const DeleteStoreProductButton = ({ storeId, productId }: { storeId: string; productId: string }) => {
  const { mutate, isPending } = useDeleteStoreProduct()

  return (
    <IconButton onClick={() => mutate({ storeId, id: productId })} disabled={isPending}>
      <DeleteForeverIcon />
    </IconButton>
  )
}

const columns: TableColumn<StoreProductExternal>[] = [
  {
    field: 'id',
    header: 'ID',
    renderValue: (storeProduct) => storeProduct.product.id,
  },
  { field: 'name', header: 'Product name', sortable: true, renderValue: (storeProduct) => storeProduct.product.name },
  {
    field: 'category',
    header: 'Product Category',
    sortable: true,
    renderValue: (storeProduct) => storeProduct.product.category,
  },
  {
    field: 'price',
    header: 'Product Price',
    sortable: true,
    renderValue: (storeProduct) =>
      (storeProduct.price / 100).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      }),
  },
  { field: 'quantity', header: 'Product Quantity', sortable: true },
]

export const StoreDetailsPage = () => {
  const { id } = useParams() as { id: string }
  const { data: storeResponse, isLoading: isStoreLoading, isError: isStoreError } = useGetStore(id)
  const [open, setOpen] = useState(false)
  const [storeProductToEdit, setStoreProductToEdit] = useState<StoreProductExternal | null>(null)

  const { filters, changeFilters } = useStoreProductsFilters()
  const {
    data: response,
    isLoading: isStoreProductsLoading,
    isError,
    isFetching,
  } = useGetStoreProducts({ storeId: id, params: filters })
  const { data: categoriesResponse, isLoading: isLoadingCategories } = useGetCategories()

  const isLoading = isStoreProductsLoading || isStoreLoading || isLoadingCategories
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

  const storeProductsColumns = useMemo(() => {
    return [
      ...columns,
      {
        field: 'action',
        header: '',
        renderValue: (storeProduct) => (
          <Stack direction="row" sx={{ gap: 1 }}>
            <IconButton
              onClick={() => {
                setStoreProductToEdit(storeProduct)
                setOpen(true)
              }}
            >
              <EditIcon />
            </IconButton>
            <DeleteStoreProductButton storeId={id} productId={storeProduct.product.id} />
          </Stack>
        ),
      },
    ]
  }, [])

  if (!response || !storeResponse || isLoading) {
    return <LoadingSpinner />
  }
  if (isError || !response.success || isStoreError || !storeResponse.success) {
    return <ErrorMessage />
  }

  const { data: store } = storeResponse
  const { data } = response
  const categories = categoriesResponse?.data ?? []

  return (
    <Stack>
      <Modal open={open} onClose={() => setOpen(false)}>
        <StoreProductModal
          open={open}
          storeId={id}
          storeProductData={storeProductToEdit ?? undefined}
          closeModal={() => {
            setOpen(false)
            setStoreProductToEdit(null)
          }}
        />
      </Modal>

      <Typography component="h1" variant="h4" sx={{ color: 'primary.main', mb: 4 }}>
        Store {store.name}{' '}
        <Typography component="span" variant="h5" sx={{ color: 'grey.600', display: 'inline-block' }}>
          ({store.id})
        </Typography>
        <Button onClick={() => setOpen(true)} sx={{ ml: 1 }} endIcon={<AddIcon />}>
          Add Product
        </Button>
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
        columns={storeProductsColumns}
        data={data.results}
        onSortChange={(orderBy, orderDir) => {
          changeFilters({ orderBy, orderDir } as Partial<GetStoreProductsParams>)
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
