import { h, Component } from 'preact'

export default class Header extends Component {
  render () {
    return (
      <div class="aweza-category">
        <b>{this.props.title}</b>
      </div>
    )
  }
}
