import {createRoot} from 'react-dom/client'
import Routes from './Routes'
import {BrowserRouter} from 'react-router-dom'
import '@/css/tailwind.css'
import '@/css/prism.css'
import '@/css/custom.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes />
  </BrowserRouter>,
)
