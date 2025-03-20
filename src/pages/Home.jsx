import {Link} from 'react-router-dom'

const Home = () => {
  const routes = [
    {path: '/dummy', name: 'Dummy Page'},
    {path: '/react/class-comp', name: 'Class Components'},
    {path: '/react/useCallback', name: 'useCallback Hook'},
    {path: '/redux/counter', name: 'Redux Counter'},
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6'>
      <div className='container mx-auto'>
        <h1 className='mb-12 text-4xl font-bold text-slate-800'>
          React Examples
        </h1>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className='group rounded-xl bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:transform hover:shadow-md'
            >
              <div className='flex items-center justify-between'>
                <span className='text-lg font-medium text-slate-700 group-hover:text-blue-600'>
                  {route.name}
                </span>
                <svg
                  className='h-5 w-5 text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-blue-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
