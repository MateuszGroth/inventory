import { StoreExternal } from '@org/models'
import { useCreateStore } from '../hooks/use-create-store'
import { useUpdateStore } from '../hooks/use-update-store'
import { FormEvent, useState } from 'react'
import { Stack, Typography, Button, TextField, CircularProgress, Modal } from '@mui/material'

type StoreModalProps = {
  storeData?: StoreExternal
  closeModal: () => void
  open: boolean
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
}

export const StoreModal = ({ storeData, closeModal }: StoreModalProps) => {
  const [name, setName] = useState(storeData?.name ?? '')
  const [location, setLocation] = useState(storeData?.location ?? '')
  const { mutate: create, isPending: isCreatePending } = useCreateStore()
  const { mutate: update, isPending: isUpdatePending } = useUpdateStore()

  const isPending = isCreatePending || isUpdatePending

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const isUpdate = !!storeData
    if (isUpdate) {
      update({ id: storeData.id, payload: { name, location } }, { onSettled: () => closeModal() })
    } else {
      create({ name, location }, { onSettled: () => closeModal() })
    }
  }

  return (
    <Stack component="form" onSubmit={handleSubmit} sx={style}>
      <Typography component="h2" variant="h5" sx={{ mb: 4 }}>
        {storeData ? 'Update' : 'Create'} Store
      </Typography>

      <TextField
        label="Store name"
        value={name}
        onChange={(e) => setName((e.target as unknown as { value: string }).value)}
        size="small"
        sx={{ minWidth: 200, mb: 2 }}
        variant="standard"
      />
      <TextField
        label="Store location"
        value={location}
        onChange={(e) => setLocation((e.target as unknown as { value: string }).value)}
        size="small"
        sx={{ minWidth: 200, mb: 4 }}
        variant="standard"
      />
      <Stack direction="row" sx={{ justifyContent: 'end', gap: 1 }}>
        <Button type="button" onClick={() => closeModal()}>
          Close
        </Button>
        <Button disabled={isPending} type="submit" endIcon={isPending ? <CircularProgress size={20} /> : undefined}>
          Submit
        </Button>
      </Stack>
    </Stack>
  )
}
