import {PureComponent} from 'react'

class Clock extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {ans: 42, found: false}
  }
  componentDidMount() {}
  tick = () => this.setState({found: true})

  render = () => <button onClick={this.tick}>click me</button>
}

export default Clock
