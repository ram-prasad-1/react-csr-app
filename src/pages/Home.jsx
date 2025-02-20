import {Link} from 'react-router-dom'

const Home = () => {
  const routes = [
    {path: '/dummy', name: 'Dummy Page'},
    {path: '/react/class-comp', name: 'Class Components'},
    {path: '/react/useCallback', name: 'useCallback Hook'},
    {path: '/redux/counter', name: 'Redux Counter'},
  ]

  return (
    <div className='container mx-auto my-6 min-h-96 bg-stone-200 p-6'>
      <h1 className='mb-6 text-3xl font-bold'>React Examples</h1>

      <nav className='space-y-4'>
        {routes.map((route) => (
          <div key={route.path}>
            <Link
              to={route.path}
              className='text-blue-600 hover:text-blue-800 hover:underline'
            >
              {route.name}
            </Link>
          </div>
        ))}
      </nav>
    </div>
  )
}

export default Home
