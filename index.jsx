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

import {h, render, Component} from 'preact';
import tippy from 'tippy.js'

let dataUrl = 'https://tms2.aweza.co.za/api/term'
let headers = {}
let preferLang = null
let tippyInstance = null

function fetchTerm(id) {
    return fetch(`${dataUrl}/${id}`, {
        method: "GET",
        mode: "cors",
        headers: headers
    }).then(response => {
        if (response.status === 404) {
            throw 'Error: Term not found'
        }
        console.log(response)
        return response.json()
    })
}

function createTemplate() {
    const appTemplate = document.createElement('div')
    appTemplate.setAttribute('id', 'aweza-popup-app')
    appTemplate.style.display = "none"
    document.body.appendChild(appTemplate)
}

function AwezaPopup(options) {
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
        maxWidth: '250px',
        duration: [50, 50],
        html: '#aweza-popup-app',
        onShown() {
            const tooltipContents = Array.from(this.children[0].children)
                .find((child) => child.className === 'tippy-content')

            console.log(tooltipContents)
            if (tooltipContents.innerHTML == '') {
                console.log('innasd')
                render(<PopupContents termID={this._reference.dataset.aweza}/>, tooltipContents);
            }
        }
    })
}

class PopupContents extends Component {
    constructor(props) {
        super(props)
        this.state = {
            termID: props.termID,
            currentTranslationId: null,
            loading: true,
            term: {},
        }
    }

    componentDidMount() {

        fetchTerm(this.state.termID)
            .then(data => this.setCurrentTerm(data))
            .catch(e => {
                console.error(e)
                const tooltip = tippyInstance.tooltips
                    .find(tt => tt.reference.dataset.aweza == this.state.termID)
                const tippyContent = Array.from(tooltip.popper.firstChild.children)
                    .find(child => child.className === 'tippy-content')
                this.setState({
                    error: 'Whoops! Aweza data could not be loaded.'
                },() => {
                    setTimeout(() => {
                        tippyContent.innerHTML = ''
                        tooltip.hide()
                    },2000)
                })
            })
    }

    setCurrentTerm(data) {
        console.log(data)
        let currentTranslationId = null
        if (data.translations && data.translations.length > 0) {
            // Default to the first translation
            currentTranslationId = data.translations[0].id

            // If there is a preferred language set in options
            if (preferLang) {

                // Try to get this translation
                const translation = data.translations
                    .find(translation => translation.to_term.language.code === preferLang);

                if (translation) {
                    currentTranslationId = translation.id
                }
            }
        }
        this.setState({
            term: data,
            currentTranslationId: currentTranslationId
        }, () => this.setState({loading: false}))
    }

    onSelectTranslation(e) {
        this.setState({
            currentTranslationId: parseInt(e.target.value)
        })
    }

    render() {
        if (this.state.error) {
            return <div>{this.state.error}</div>
        }

        if (this.state.loading) {
            return <div>Loading...</div>
        }
        const translationTerm = this.state.term.translations.length > 0 ? this.state.term.translations
            .find(translation => this.state.currentTranslationId === translation.id).to_term : null

        const categoryTitle = this.state.term.categories ?
            this.state.term.categories.reduce((a,c) => a + ' | ' + c.name,'').substr(2) : ''

        return (
            <div class="aweza-popup-content" style="display: flex; flex-direction: column;">
                <CategorySection title={categoryTitle} />
                <DefinitionSection term={this.state.term} translationTerm={translationTerm} />
                { this.state.term.example && <ExampleSection term={this.state.term} translationTerm={translationTerm} />}
                { this.state.term.image && <ImageSection {...this.state.term} />}
                <Footer currentTranslationId={this.state.currentTranslationId}
                        onSelectTranslation={(e) => this.onSelectTranslation(e)} {...this.state.term} />
            </div>
        )
    }
}

class CategorySection extends Component {
    render() {
        return (
            <div class="aweza-category">
                <b>{this.props.title}</b>
            </div>
        )
    }
}

class DefinitionSection extends Component {
    render() {
        return (
            <div class="aweza-definition">
                <div class="aweza-section-title">
                    <b>Definition</b>
                </div>
                <div class="aweza-section-content">
                    <DefinitionText {...this.props.term}/>
                    <DefinitionDescription {...this.props.term}/>
                    {this.props.translationTerm &&
                        [<hr/>,
                        < DefinitionText {...this.props.translationTerm}/>,
                        <DefinitionDescription {...this.props.translationTerm}/>]
                    }
                </div>
            </div>
        )
    }
}

class DefinitionText extends Component {
    render() {
        const audio_source = this.props.audio ?
            this.props.audio
            :
            this.props.tts.text.length > 0 ?
                this.props.tts.text[0].url
                :
                null

        const audio_player_id = `aweza-term-${this.props.id}-text-audio`;
        return (
            <div class="aweza-definition-text">
                <div class="aweza-definition-text-left">
                    <Speaker uniqueId={audio_player_id} audio_source={audio_source} />
                    <div class="aweza-definition-content-text-text">
                        <b>{this.props.text}</b>
                    </div>
                </div>
                <div class="aweza-definition-content-text-right">
                    {this.props.language.code.toUpperCase()}
                </div>
            </div>
        )
    }
}

class DefinitionDescription extends Component {
    render() {
        const audio_source = this.props.description_audio ?
            this.props.description_audio
            :
            this.props.tts.description.length > 0 ?
                this.props.tts.description[0].url
                :
                null

        const audio_player_id = `aweza-term-${this.props.id}-definition-audio`;
        return (
            <div class="aweza-definition-description">
                <Speaker uniqueId={audio_player_id} audio_source={audio_source} />
                <div class="aweza-definition-description">
                    {this.props.description}
                </div>
            </div>
        )
    }
}

class ExampleSection extends Component {
    render() {
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
    render() {
        const audio_source = this.props.example_audio ?
            this.props.example_audio
            :
            this.props.tts.example.length > 0 ?
                this.props.tts.example[0].url
                :
                null

        const audio_player_id = `aweza-term-${this.props.id}-example-audio`;
        return (
            <div class="aweza-example-text">
                <div class="aweza-example-text-left">
                    <Speaker uniqueId={audio_player_id} audio_source={audio_source} />
                    <div>
                        {this.props.example}
                    </div>
                </div>

                <div>
                    {this.props.language.code.toUpperCase()}
                </div>
            </div>
        )
    }
}

class Speaker extends Component {
    onClickSpeaker() {
        const audio = document.getElementById(this.props.uniqueId)
        audio.play()
    }
    render() {
        return (
            <div class="aweza-audio" onClick={() => this.onClickSpeaker()}>
                <img src="http://tms2.aweza.co.za/static/img/speaker.png"/>
                {this.props.audio_source &&
                <audio id={this.props.uniqueId} src={this.props.audio_source}/>
                }
            </div>
        )
    }
}

class ImageSection extends Component {
    render() {
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
    render() {

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
                              <option value={trans.id}>{trans.to_term.language.name}</option>
                          )}
                      </select>
                    </div>
                    }
                </div>
                <div>
                    <img class="aweza-footer-logo" src="http://tms2.aweza.co.za/static/img/aweza-logo.png"/>
                </div>
            </div>
        )
    }
}

window.AwezaPopup = AwezaPopup
export default AwezaPopup