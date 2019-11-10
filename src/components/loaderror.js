import React from 'react';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'pure-render-mixin';
import PropTypes from 'prop-types';

var el = React.createElement;

export default createReactClass({
  mixins: [PureRenderMixin],

  displayName: 'LoadError',

  propTypes: {
    message: PropTypes.string.isRequired,
    onOkClick: PropTypes.func.isRequired
  },

  handleButtonClick: function () {
    if (this.props.message === 'Error: unable to import tab. Please try again.') {
      window.location.reload();
    } else {
      this.props.onOkClick();
    }
  },

  render: function () {
    return (
      el('div', {className: 'load-error'},
        el('img', {src: 'images/favicon-touch.png', alt: ''}),
        el('h2', null, 'Grouptabs'),
        el('p', null, this.props.message),
        el('button', {className: 'create', onClick: this.handleButtonClick}, 'OK')
      )
    );
  }

});
