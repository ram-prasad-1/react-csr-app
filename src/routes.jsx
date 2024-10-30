import {createBrowserRouter} from 'react-router-dom'
import Home from '@/pages/Home'
import ClassComp from '@/pages/react/class-comp'
import DummyPage from '@/pages/DummyPage'
import NoMatch from '@/pages/NoMatch'

export const router = createBrowserRouter([
  {path: '/', element: <Home />, errorElement: <NoMatch />},
  {path: '/dummy', element: <DummyPage />},

  {path: '/react/class-comp', element: <ClassComp />},
])
