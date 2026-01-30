import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { Button, CircularProgress, IconButton, Modal, Stack, TextField, Typography } from '@mui/material'
import { StoreExternal } from '@org/models'
import { useMemo, useState } from 'react'
import { ErrorMessage } from '../../../components/error-message/error-message'
import { LoadingSpinner } from '../../../components/loading-spinner/loading-spinner'
import { Table, TableColumn } from '../../../components/table/table'
import { useDeleteStore } from '../hooks/use-delete-store'
import { useGetStores } from '../hooks/use-get-stores'
import { GetStoresParams } from '../services/stores'
import { useStoresFilters } from '../hooks/use-stores-filters'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import { StoreModal } from './store-modal'
import { Link } from 'react-router-dom'
import { useTransferStoreProduct } from '../hooks/use-transfer-store-products'
import ImportExportIcon from '@mui/icons-material/ImportExport'

const DeleteStoreButton = ({ storeId }: { storeId: string }) => {
  const { mutate, isPending } = useDeleteStore()

  return (
    <IconButton onClick={() => mutate(storeId)} disabled={isPending}>
      <DeleteForeverIcon />
    </IconButton>
  )
}

const columns: TableColumn<StoreExternal>[] = [
  {
    field: 'id',
    header: 'ID',
    renderValue: (store) => (
      <Typography component={Link} to={`/stores/${store.id}`} sx={{ textDecoration: 'underline' }}>
        {store.id}
      </Typography>
    ),
  },
  { field: 'name', header: 'Product name', sortable: true },
  { field: 'location', header: 'Store location', sortable: true },
  { field: 'productsQuantity', header: 'Products quantity' },
]

export const StoresPage = () => {
  const { filters, changeFilters } = useStoresFilters()
  const { data: response, isLoading, isError, isFetching } = useGetStores(filters)

  const [transferFrom, setTransferFrom] = useState<string>()
  const { mutate: transfer, isPending } = useTransferStoreProduct()
  const [storeToEdit, setStoreToEdit] = useState<StoreExternal | null>(null)
  const [open, setOpen] = useState(false)
  const [nameFilter, setNameFilter] = useState(filters?.name ?? '')
  const [locationFilter, setLocationFilter] = useState(filters?.location ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    changeFilters({
      name: nameFilter || undefined,
      location: locationFilter || undefined,
      page: 1,
    })
  }

  const handleReset = () => {
    setNameFilter('')
    setLocationFilter('')
    changeFilters({
      name: undefined,
      location: undefined,
      page: 1,
    })
  }

  const storeColumns = useMemo(() => {
    return [
      ...columns,
      {
        field: 'action',
        header: '',
        renderValue: (store) => (
          <Stack direction="row" sx={{ gap: 1 }}>
            {!!transferFrom && transferFrom !== store.id && (
              <Button
                disabled={isPending}
                onClick={() => {
                  transfer(
                    { storeId: transferFrom, payload: { destinationStoreId: store.id } },
                    {
                      onSettled: () => {
                        setTransferFrom(undefined)
                      },
                    }
                  )
                }}
              >
                Transfer Products Here
              </Button>
            )}
            {!transferFrom && !!store.productsQuantity && (
              <IconButton
                onClick={() => {
                  setTransferFrom(store.id)
                }}
              >
                <ImportExportIcon />
              </IconButton>
            )}
            <IconButton
              onClick={() => {
                setStoreToEdit(store)
                setOpen(true)
              }}
            >
              <EditIcon />
            </IconButton>
            <DeleteStoreButton storeId={store.id} />
          </Stack>
        ),
      },
    ]
  }, [transferFrom])

  if (!response || isLoading) {
    return <LoadingSpinner />
  }
  if (isError || !response.success) {
    return <ErrorMessage />
  }

  const { data } = response

  return (
    <Stack>
      <Modal open={open} onClose={() => setOpen(false)}>
        <StoreModal
          open={open}
          storeData={storeToEdit ?? undefined}
          closeModal={() => {
            setOpen(false)
            setStoreToEdit(null)
          }}
        />
      </Modal>
      <Typography component="h1" variant="h4" sx={{ color: 'primary.main', mb: 4 }}>
        Stores
        <IconButton onClick={() => setOpen(true)} sx={{ ml: 1 }}>
          <AddIcon />
        </IconButton>
        {isFetching && <CircularProgress size={20} sx={{ ml: 1.5 }} />}
      </Typography>
      <Stack
        component="form"
        direction="row"
        onSubmit={handleSubmit}
        sx={{ gap: 2, flexWrap: 'wrap', mb: 3, alignItems: 'flex-end' }}
      >
        <TextField
          label="Store name"
          value={nameFilter}
          onChange={(e) => setNameFilter((e.target as unknown as { value: string }).value)}
          size="small"
          sx={{ minWidth: 200 }}
          variant="outlined"
        />
        <TextField
          label="Store location"
          value={locationFilter}
          onChange={(e) => setLocationFilter((e.target as unknown as { value: string }).value)}
          size="small"
          sx={{ minWidth: 200 }}
          variant="outlined"
        />
        <Button type="submit" variant="contained" size="medium">
          Apply Filters
        </Button>
        <Button type="button" variant="outlined" size="medium" onClick={handleReset}>
          Reset
        </Button>
      </Stack>
      <Table
        columns={storeColumns}
        data={data.results}
        onSortChange={(orderBy, orderDir) => {
          changeFilters({ orderBy, orderDir } as Partial<GetStoresParams>)
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
