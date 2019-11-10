import React, { PureComponent } from 'react';
import TabListButton from './tablistbutton';
import CreateForm from './createform';
import ImportForm from './importform';
import { Tab } from '../types';

var el = React.createElement;

interface Props {
  data: Tab[];
  visible?: boolean;
  checkingRemoteTab?: boolean;
  remoteTabError?: string;
  onTabClick: (id: string) => void;
  onCreateNewTab: (name: string) => void;
  onImportTab: (id: string) => void;
}

interface State {
  hideImportForm: boolean;
}

export default class Tabs extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      hideImportForm: true
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (!this.props.visible && prevProps.visible) {
      this.setState({
        hideImportForm: true
      });
    }
  }

  handleShowImportFormClick = () => {
    this.setState({
      hideImportForm: false
    });
  };

  render() {
    return (
      el('div', {className: 'scene scene-with-footer tabsScene' + (this.props.visible ? '' : ' hidden')},
        el('main', null,
          el('div', {className: 'header'},
            el('img', {id: 'logo', src: 'favicon-touch.png', alt: ''}),
            el('h2', null, 'Grouptabs')
          ),
          (
            this.props.data.length
            ?
            el('div', {className: 'row tabs'},
              this.props.data.map((tab) => {
                return el(TabListButton, {key: tab.id, data: tab, onClick: this.props.onTabClick});
              })
            )
            :
            el('div', {className: 'empty-info'},
              el('p', null,
                'Track shared expenses in a group of people.'
                + ' Every group has its own tab like "Summer roadtrip" or "Badminton".'
              ),
              el('p', null,
                'Start by creating your first tab:'
              )
            )
          ),
          el('div', {className: 'row'},
            el(CreateForm, {onSubmit: this.props.onCreateNewTab})
          ),
          el('div', {className: 'row'},
            this.state.hideImportForm
            ? el('p', {className: 'fake-link', onClick: this.handleShowImportFormClick}, 'Open shared tab')
            : el(ImportForm, {
                checkingRemoteTab: this.props.checkingRemoteTab,
                remoteTabError: this.props.remoteTabError,
                onSubmit: this.props.onImportTab
              })
          )
        ),
        el('footer', null,
          el('a', {className: 'mini-link', href: 'https://grouptabs.net/', target: '_blank'},
            'More info about Grouptabs'
          )
        )
      )
    );
  }

}
