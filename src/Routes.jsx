import {Route, Routes} from 'react-router-dom'
import Home from '@/pages/Home'
import NoMatch from '@/pages/NoMatch'
import DummyPage from '@/pages/DummyPage'

function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/dummy' element={<DummyPage />} />

      <Route path='*' element={<NoMatch />} />
    </Routes>
  )
}

export default AppRoutes
