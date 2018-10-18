/**
 * aweza-popup
 * Copyright (C) 2018  FastAcademy
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/** @jsx h */

import { h, render, Component } from 'preact'
import tippy from 'tippy.js'

let dataUrl = 'https://tms2.aweza.co.za/api/term'
let headers = {}
let preferLang = null
let tippyInstance = null

function fetchTerm (id) {
  return fetch(`${dataUrl}/${id}`, {
    method: 'GET',
    mode: 'cors',
    headers: headers,
  }).then(response => {
    if (response.status === 404) {
      throw 'Error: Term not found'
    }
    else if (response.status === 401) {
      throw 'Error: Unauthorized. Check your credentials.'
    }
    return response.json()
  })
}

function createTemplate () {
  const appTemplate = document.createElement('div')
  appTemplate.setAttribute('id', 'aweza-popup-app')
  appTemplate.style.display = 'none'
  document.body.appendChild(appTemplate)
}

function AwezaPopup (options) {
  if (options.headers) {
    headers = options.headers
  }
  if (options.dataUrl) {
    dataUrl = options.dataUrl
  }

  if (options.preferLang) {
    preferLang = options.preferLang
  }

  createTemplate()

  tippyInstance = tippy(document.querySelectorAll('[data-aweza]'), {
    placement: 'right',
    trigger: 'click',
    interactive: true,
    animation: 'fade',
    multiple: false,
    arrow: true,
    theme: 'aweza',
    maxWidth: '320px',
    duration: [50, 50],
    html: '#aweza-popup-app',
    onShown () {
      const tooltipContents = Array.from(this.children[0].children).find((child) => child.className === 'tippy-content')

      if (tooltipContents.innerHTML == '') {
        render(<PopupContents termID={this._reference.dataset.aweza}/>, tooltipContents)
      }
    },
  })
}

class PopupContents extends Component {
  constructor (props) {
    super(props)
    this.state = {
      termID: props.termID,
      currentTranslationId: null,
      loading: true,
      term: {},
    }
  }

  componentDidMount () {
    fetchTerm(this.state.termID).then(data => this.setCurrentTerm(data)).catch(e => {
      console.error(e)
      const tooltip = tippyInstance.tooltips.find(tt => tt.reference.dataset.aweza == this.state.termID)
      const tippyContent = Array.from(tooltip.popper.firstChild.children).
        find(child => child.className === 'tippy-content')
      this.setState({
        error: 'Whoops! Aweza data could not be loaded.',
      }, () => {
        setTimeout(() => {
          tippyContent.innerHTML = ''
          tooltip.hide()
        }, 2000)
      })
    })
  }

  setCurrentTerm (data) {
    let currentTranslationId = null
    if (data.translations && data.translations.length > 0) {
      // Default to the first translation
      currentTranslationId = data.translations[0].id

      // If there is a preferred language set in options
      if (preferLang) {

        // Try to get this translation
        const translation = data.translations.find(translation => translation.to_term.language.code === preferLang)

        if (translation) {
          currentTranslationId = translation.id
        }
      }
    }
    this.setState({
      term: data,
      currentTranslationId: currentTranslationId,
    }, () => this.setState({loading: false}))
  }

  onSelectTranslation (e) {
    this.setState({
      currentTranslationId: parseInt(e.target.value),
    })
  }

  render () {
    if (this.state.error) {
      return <div>{this.state.error}</div>
    }

    if (this.state.loading) {
      return <div>Loading...</div>
    }

    const translationTerm = (this.state.term.translations && this.state.term.translations.length > 0)
      ? this.state.term.translations.find(translation => this.state.currentTranslationId === translation.id).to_term
      : null

    const categoryTitle = this.state.term.categories ?
      this.state.term.categories.reduce((a, c) => a + ' | ' + c.name, '').substr(2) : ''

    return (
      <div class="aweza-popup-content" style="display: flex; flex-direction: column;">
        <CategorySection title={categoryTitle}/>
        <DefinitionSection term={this.state.term} translationTerm={translationTerm}/>
        {this.state.term.example && <ExampleSection term={this.state.term} translationTerm={translationTerm}/>}
        {this.state.term.image && <ImageSection {...this.state.term} />}
        <Footer currentTranslationId={this.state.currentTranslationId}
                onSelectTranslation={(e) => this.onSelectTranslation(e)} {...this.state.term} />
      </div>
    )
  }
}

class CategorySection extends Component {
  render () {
    return (
      <div class="aweza-category">
        <b>{this.props.title}</b>
      </div>
    )
  }
}

class DefinitionSection extends Component {
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
    let audio_source = null

    if (this.props.tts) {
      audio_source = this.props.tts.text.length > 0 ? this.props.tts.text[0].url : null
    }

    if (this.props.audio) {
      audio_source = this.props.audio
    }

    const audio_player_id = `aweza-term-${this.props.id}-text-audio`
    return (
      <div class="aweza-definition-text aweza-section-content-text">
        <div class="aweza-definition-text-left">
          <Speaker uniqueId={audio_player_id} audio_source={audio_source}/>
          <div class="aweza-definition-content-text-text">
            <div dangerouslySetInnerHTML={{__html: this.props.text}}/>
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
    let audio_source = null

    if (this.props.tts) {
      audio_source = this.props.tts.description.length > 0 ? this.props.tts.description[0].url : null
    }

    if (this.props.description_audio) {
      audio_source = this.props.description_audio
    }

    const audio_player_id = `aweza-term-${this.props.id}-definition-audio`
    return (
      <div class="aweza-definition-description aweza-section-content-text">
        <Speaker uniqueId={audio_player_id} audio_source={audio_source}/>
        <div class="aweza-definition-description">
          <div dangerouslySetInnerHTML={{__html: this.props.description}}/>
        </div>
      </div>
    )
  }
}

class ExampleSection extends Component {
  render () {
    return (
      <div class="aweza-example">
        <div class="aweza-section-title">
          <b>Example</b>
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
    if (this.props.example) {
      let audio_source = null

      if (this.props.tts) {
        audio_source = this.props.tts.example.length > 0 ? this.props.tts.description[0].url : null
      }

      if (this.props.example_audio) {
        audio_source = this.props.example_audio
      }

      const audio_player_id = `aweza-term-${this.props.id}-example-audio`
      return (
        <div class="aweza-example-text aweza-section-content-text">
          <Speaker uniqueId={audio_player_id} audio_source={audio_source}/>
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
}

class Speaker extends Component {

  onClickSpeaker () {
    const audio = document.getElementById(this.props.uniqueId)
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
    if (!this.props.audio_source) {
      return
    }
    return (
      <div class="aweza-audio" onClick={() => this.onClickSpeaker()}>
        <img id={this.props.uniqueId + '-img'} src={speakerImage}/>
        {this.props.audio_source &&
        <audio id={this.props.uniqueId} src={this.props.audio_source}/>
        }
      </div>
    )
  }
}

class ImageSection extends Component {
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

class Footer extends Component {
  render () {

    return (
      <div class="aweza-footer">
        <div class="aweza-footer-left">
          <div>
            {this.props.language.name} |
          </div>
          {this.props.translations.length > 0 &&
          <div>
            <select class="aweza-select-translation" value={this.props.currentTranslationId}
                    onChange={e => this.props.onSelectTranslation(e)}>
              {this.props.translations.map(trans =>
                <option value={trans.id}>{trans.to_term.language.name}</option>,
              )}
            </select>
          </div>
          }
        </div>
        <div>
          <img class="aweza-footer-logo" src={awezaLogo}/>
        </div>
      </div>
    )
  }
}

const speakerImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAALCAIAAADEEvsIAAAAGXRFWHRTb2Z0d2FyZQBBZG9' +
  'iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6' +
  'cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExID' +
  'Y2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAy' +
  'LzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC' +
  '8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20v' +
  'eGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5' +
  'zdGFuY2VJRD0ieG1wLmlpZDo2OTRDMjdGOTZENzUxMUU4QTU5REMyNjMxMjcwMjZERCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2OTRDMjdGQT' +
  'ZENzUxMUU4QTU5REMyNjMxMjcwMjZERCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjY5NEMyN0Y3NkQ3NTExR' +
  'ThBNTlEQzI2MzEyNzAyNkREIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjY5NEMyN0Y4NkQ3NTExRThBNTlEQzI2MzEyNzAyNkREIi8+IDwvcmRm' +
  'OkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+5ZEBHQAAARJJREFUeNpcUK3Kg2AYlVcXLKbdghc' +
  'gWEyCJpGBdWltzSswGrwGcWAyWV0Uk2UaRONYGWbFP0Scft/jLM4TXs57nsPzc9DfL8qytCxrHEfg9/t9nmcgCPuFruu2bSO06FEUua67qGBsmiaO4' +
  'zRNVVUlSVJRlLZtr9fr6/USBMHzPOz9ft9ut20zWZanacqyTNO0PM95nkeGYRAEsTWtX5qmYbPj8UhRFAqCYN1gh8PhgOM4lIAgx3H6vt+WoQG8cOb' +
  'n84F1i6LATdMEL6gcxz0ej3XQ+QtJkpIk6bpuuQ7CmL54Pp8Mw5xOp6qqfN+HCERRhJbYLswwDFmWhUHAL5dLXddA9qZhGCCzNXG4fxX/BRgAdj/Uv' +
  'cFg5pIAAAAASUVORK5CYII='

const awezaLogo = 'data:image/png;base64,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'

window.AwezaPopup = AwezaPopup
export default AwezaPopup
