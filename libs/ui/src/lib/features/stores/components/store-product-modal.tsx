import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { ApiResponse, ProductCategory, StoreProductExternal } from '@org/models'
import { FormEvent, useState } from 'react'
import { useCreateStoreProduct } from '../hooks/use-create-store-product'
import { useUpdateStoreProduct } from '../hooks/use-update-store-product'
import { useGetCategories } from '../../products'

type StoreProductModalProps = {
  storeProductData?: StoreProductExternal
  closeModal: () => void
  open: boolean
  storeId: string
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
}

export const StoreProductModal = ({ storeProductData, storeId, closeModal }: StoreProductModalProps) => {
  const [name, setName] = useState(storeProductData?.product.name ?? '')
  const [category, setCategory] = useState(storeProductData?.product.category ?? '')
  const [quantity, setQuantity] = useState(storeProductData?.quantity ?? 1)
  const [price, setPrice] = useState(storeProductData?.price ?? 1)
  const { data: categoriesResponse } = useGetCategories()

  const categories = categoriesResponse?.data
  const { mutate: create, isPending: isCreatePending, data, error } = useCreateStoreProduct()
  const { mutate: update, isPending: isUpdatePending } = useUpdateStoreProduct()

  const isPending = isCreatePending || isUpdatePending

  const isUpdate = !!storeProductData
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!category) {
      return
    }
    if (isUpdate) {
      update(
        { id: storeProductData.product.id, storeId, payload: { quantity, price } },
        { onSuccess: () => closeModal() }
      )
    } else {
      create(
        {
          storeId,
          payload: {
            name,
            category: category as ProductCategory,
            price,
            quantity,
          },
        },
        { onSuccess: () => closeModal() }
      )
    }
  }

  if (!categories) {
    return <CircularProgress size={20} />
  }
  const errorMessage = (error as unknown as ApiResponse<null>)?.error

  return (
    <Stack component="form" onSubmit={handleSubmit} sx={style}>
      <Typography component="h2" variant="h5" sx={{ mb: 4 }}>
        {storeProductData ? 'Update' : 'Create'} Store Product
      </Typography>

      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName((e.target as unknown as { value: string }).value)}
        size="small"
        sx={{ minWidth: 200, mb: 3 }}
        disabled={isUpdate}
      />

      <FormControl size="small" sx={{ minWidth: 180, mb: 3 }}>
        <InputLabel id="category-filter-label">Category</InputLabel>
        <Select
          labelId="category-filter-label"
          label="Category"
          value={category}
          disabled={isUpdate}
          onChange={(e) => setCategory(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Quantity"
        value={quantity}
        onChange={(e) => {
          const value = (e.target as unknown as { value: string }).value
          if (/^\d*$/.test(value)) {
            setQuantity(Number(value))
          }
        }}
        size="small"
        sx={{ minWidth: 200, mb: 3 }}
      />
      <TextField
        label="Price in cents"
        value={price}
        onChange={(e) => {
          const value = (e.target as unknown as { value: string }).value
          if (/^\d*$/.test(value)) {
            setPrice(Number(value))
          }
        }}
        size="small"
        sx={{ minWidth: 200, mb: 4 }}
      />

      <Stack direction="row" sx={{ justifyContent: 'end', gap: 1 }}>
        {!!errorMessage && <Typography sx={{ color: 'error.main' }}>{errorMessage}</Typography>}
        <Button type="button" onClick={() => closeModal()}>
          Close
        </Button>
        <Button
          disabled={isPending || !category || !name || !price || !quantity}
          type="submit"
          endIcon={isPending ? <CircularProgress size={20} /> : undefined}
        >
          Submit
        </Button>
      </Stack>
    </Stack>
  )
}
