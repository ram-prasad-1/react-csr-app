import {Provider} from 'react-redux'
import store from './store'
import {Counter} from '@/pages/redux/counter/Counter'

const CounterPage = () => {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  )
}

export default CounterPage
