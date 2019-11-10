import React from 'react';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'pure-render-mixin';
import PropTypes from 'prop-types';
import TabListButton from './tablistbutton';
import CreateForm from './createform';
import ImportForm from './importform';

var el = React.createElement;

export default createReactClass({
  mixins: [PureRenderMixin],

  displayName: 'Tabs',

  propTypes: {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    visible: PropTypes.bool,
    checkingRemoteTab: PropTypes.bool,
    remoteTabError: PropTypes.string,
    onTabClick: PropTypes.func.isRequired,
    onCreateNewTab: PropTypes.func.isRequired,
    onImportTab: PropTypes.func.isRequired
  },

  getInitialState: function () {
    return {
      hideImportForm: true
    };
  },

  componentDidUpdate: function (prevProps) {
    if (!this.props.visible && prevProps.visible) {
      this.setState({
        hideImportForm: true
      });
    }
  },

  handleShowImportFormClick: function () {
    this.setState({
      hideImportForm: false
    });
  },

  render: function () {
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
              this.props.data.map(function (tab) {
                return el(TabListButton, {key: tab.id, data: tab, onClick: this.props.onTabClick});
              }.bind(this))
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

});
