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

import Header from './src/components/Header'
import Footer from './src/components/Footer'
import DefinitionSection from './src/components/DefinitionSection'
import ExampleSection from './src/components/ExampleSection'
import ImageSection from './src/components/ImageSection'

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
      // fetch term here instead and remount react component each time?
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
        const translation = data.translations.find(translation => translation.language.code === preferLang)

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

  onSelectLanguage (e) {
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

    // Get the current translation to show
    const translationTerm = (this.state.term.translations && this.state.term.translations.length > 0)
      ? this.state.term.translations.find(translation => this.state.currentTranslationId === translation.id)
      : null

    const categoryTitle = this.state.term.categories ?
      this.state.term.categories.reduce((a, c) => a + ' | ' + c.name, '').substr(2) : ''

    return (
      <div class="aweza-popup-content" style="display: flex; flex-direction: column;">
        <Header title={categoryTitle}/>
        <DefinitionSection term={this.state.term} translationTerm={translationTerm}/>
        {this.state.term.example && <ExampleSection term={this.state.term} translationTerm={translationTerm}/>}
        {this.state.term.image && <ImageSection {...this.state.term} />}
        <Footer currentTranslationId={this.state.currentTranslationId}
                onSelectLanguage={e => this.onSelectLanguage(e)} {...this.state.term} />
      </div>
    )
  }
}

window.AwezaPopup = AwezaPopup
export default AwezaPopup
