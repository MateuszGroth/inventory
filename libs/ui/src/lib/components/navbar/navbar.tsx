import { AppBar, Tab, Tabs, Toolbar, Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'

export const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const currentTab = location.pathname.startsWith('/products') ? '/products' : '/stores'

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ mr: 4 }}>
          Inventory
        </Typography>
        <Tabs
          value={currentTab}
          textColor="inherit"
          indicatorColor="secondary"
          sx={{
            '& .MuiTab-root': {
              color: 'rgba(255, 255, 255, 0.7)',
              '&.Mui-selected': {
                color: '#fff',
              },
            },
          }}
        >
          <Tab label="Stores" value="/stores" onClick={() => navigate('/stores')} />
          <Tab label="Products" value="/products" onClick={() => navigate('/products')} />
        </Tabs>
      </Toolbar>
    </AppBar>
  )
}
