import {createRoot} from 'react-dom/client'
import {RouterProvider} from 'react-router-dom'
import '@/css/tailwind.css'
import '@/css/custom.css'

import {router} from '@/routes'

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />,
)
