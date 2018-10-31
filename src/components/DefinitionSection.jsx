import { h, Component } from 'preact'
import { createAudioBlobUrl } from '../util'
import Speaker from './Speaker'

export default class DefinitionSection extends Component {
  render () {
    return (
      <div class="aweza-definition">
        <div class="aweza-section-title">
          <b>Definition</b>
        </div>
        <div class="aweza-section-content">
          <DefinitionText {...this.props.term}/>
          <DefinitionDescription {...this.props.term}/>
          {this.props.translationTerm &&
          [
            <hr/>,
            <DefinitionText {...this.props.translationTerm}/>,
            <DefinitionDescription {...this.props.translationTerm}/>]
          }
        </div>
      </div>
    )
  }
}

class DefinitionText extends Component {
  render () {
    let audioUrl = null
    if (this.props.audio) {
      audioUrl = this.props.audio
    }
    else if (this.props.tts.text) {
      audioUrl = createAudioBlobUrl(this.props.tts.text)
    }
    return (
      <div class="aweza-definition-text aweza-section-content-text">
        <div class="aweza-definition-text-left">
          <Speaker uniqueId={`aweza-term-${this.props.id}-text-audio`} audioUrl={audioUrl}/>
          <div class="aweza-definition-content-text-text">
            <div style={{fontSize: 15}}>{this.props.text}</div>
          </div>
        </div>
        <div class="aweza-definition-content-text-right language-code">
          {this.props.language.code.toUpperCase()}
        </div>
      </div>
    )
  }
}

class DefinitionDescription extends Component {
  render () {
    let audioUrl = null
    if (this.props.description_audio) {
      audioUrl = this.props.description_audio
    }
    else if (this.props.tts.description) {
      audioUrl = createAudioBlobUrl(this.props.tts.description)
    }
    return (
      <div class="aweza-definition-description aweza-section-content-text">
        <Speaker uniqueId={`aweza-term-${this.props.id}-definition-audio`} audioUrl={audioUrl}/>
        <div class="aweza-definition-description">
          <div dangerouslySetInnerHTML={{__html: this.props.description}}/>
        </div>
      </div>
    )
  }
}