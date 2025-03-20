import {PureComponent} from 'react'

class Clock extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {ans: 42, found: false}
  }
  componentDidMount() {}
  tick = () => {
    console.log('tick....')
    this.setState({found: true})
  }

  render = () => (
    <button onClick={this.tick} className={'p-16'}>
      click me
    </button>
  )
}

export default Clock
