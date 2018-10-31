import { h, Component } from 'preact'
import speakerImage from '../../lib/speakerImage'

export default class Speaker extends Component {

  onClickSpeaker () {
    const audio = new Audio()
    audio.src = this.props.audioUrl

    audio.addEventListener('ended', () => speakerImg.style.filter = 'brightness(100%)')
    const speakerImg = document.getElementById(this.props.uniqueId + '-img')
    if (audio.paused) {
      speakerImg.style.filter = 'brightness(85%)'
      audio.play()
    }
    else {
      audio.pause()
      audio.currentTime = 0
      speakerImg.style.filter = 'brightness(100%)'
    }
  }

  render () {
    if (!this.props.audioUrl) {
      return
    }
    return (
      <div class="aweza-audio" onClick={() => this.onClickSpeaker()}>
        <img id={this.props.uniqueId + '-img'} src={speakerImage}/>
      </div>
    )
  }
}