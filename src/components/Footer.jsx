import { h, Component } from 'preact'
import awezaLogo from '../../lib/awezaLogo'

export default class Footer extends Component {
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
                    onChange={e => this.props.onSelectLanguage(e)}>
              {this.props.translations.map(trans =>
                <option value={trans.id}>{trans.language.name}</option>,
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