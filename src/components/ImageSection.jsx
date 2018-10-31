import { h, Component } from 'preact'

export default class ImageSection extends Component {
  render () {
    return (
      <div class="aweza-image">
        <div class="aweza-section-title">
          <b>Image</b>
        </div>
        <img src={this.props.image}/>
      </div>
    )
  }
}