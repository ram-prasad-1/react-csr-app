import {createRoot} from 'react-dom/client'
import Routes from './Routes'
import {BrowserRouter} from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes />
  </BrowserRouter>,
)
