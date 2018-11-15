import { h, Component } from 'preact'
import { createAudioBlobUrl } from '../util'
import Speaker from './Speaker'

export default class ExampleSection extends Component {
  render () {
    return (
      <div class="aweza-example">
        <div class="aweza-section-title">
          <b>{this.props.term.language.example_label}</b>
        </div>
        <div class="aweza-section-content">
          <ExampleText {...this.props.term}/>
          <hr/>
          <ExampleText {...this.props.translationTerm}/>
        </div>
      </div>
    )
  }
}

class ExampleText extends Component {
  render () {
    if (!this.props.example) {
      return
    }
    let audioUrl = null

    if (this.props.example_audio) {
      audioUrl = this.props.example_audio
    }
    else if (this.props.tts.example) {
      audioUrl = createAudioBlobUrl(this.props.tts.example)
    }

    return (
      <div class="aweza-example-text aweza-section-content-text">
        <Speaker uniqueId={`aweza-term-${this.props.id}-example-audio`} audioUrl={audioUrl}/>
        <div class="aweza-example-content-text-text">
          <div dangerouslySetInnerHTML={{__html: this.props.example}}/>
        </div>
        <div>
          <div class="aweza-example-content-text-right language-code">
            {this.props.language.code.toUpperCase()}
          </div>
        </div>
      </div>
    )
  }
}
