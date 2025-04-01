import {createBrowserRouter} from 'react-router-dom'
import Home from '@/pages/Home'
import ClassComp from '@/pages/react/class-comp'
import DummyPage from '@/pages/DummyPage'
import NoMatch from '@/pages/NoMatch'
import UseCallback from '@/pages/react/usecallback'
import CounterPage from '@/pages/redux/counter/CounterPage'
import FuelCostCalculator from '@/pages/calculators/fuel-cost-calculator'

export const router = createBrowserRouter([
  {path: '/', element: <Home />, errorElement: <NoMatch />},
  {path: '/dummy', element: <DummyPage />},

  {path: '/react/class-comp', element: <ClassComp />},
  {path: '/react/useCallback', element: <UseCallback />},

  {path: '/redux/counter', element: <CounterPage />},

  {path: '/calculators/fuel-cost-calculator', element: <FuelCostCalculator />},
])
