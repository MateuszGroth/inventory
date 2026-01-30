import { Box, Stack } from '@mui/material'
import { Navbar, ProductsPage, StoreDetailsPage, StoresPage } from '@org/ui'
import { Navigate, Route, Routes } from 'react-router-dom'
import './app.css'

export function App() {
  return (
    <Stack sx={{ minHeight: '100vh' }}>
      <Navbar />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/stores" replace />} />
          <Route path="/stores">
            <Route index element={<StoresPage />} />
            <Route path=":id">
              <Route index element={<StoreDetailsPage />} />
            </Route>
          </Route>
          <Route path="/products" element={<ProductsPage />} />
          <Route path="*" element={<Navigate to="/stores" replace />} />
        </Routes>
      </Box>
    </Stack>
  )
}

export default App
