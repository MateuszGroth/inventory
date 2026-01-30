import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import * as ReactDOM from 'react-dom/client'
import App from './app/app'
import './styles.css'
import { QueryClientProvider, ThemeProvider } from '@org/ui'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
)
