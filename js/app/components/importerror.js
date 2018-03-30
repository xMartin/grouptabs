define([
  'react',
  'create-react-class',
  'pure-render-mixin',
  'prop-types'
],

function (React, createReactClass, PureRenderMixin, PropTypes) {
  'use strict';

  var el = React.createElement;

  return createReactClass({
    mixins: [PureRenderMixin],

    displayName: 'ImportError',

    propTypes: {
      remoteTabError: PropTypes.string.isRequired,
      onOkClick: PropTypes.func.isRequired
    },

    handleButtonClick: function () {
      if (this.props.remoteTabError === 'Error: unable to import tab. Please try again.') {
        window.location.reload();
      } else {
        this.props.onOkClick();
      }
    },

    render: function () {
      return (
        el('div', {className: 'import-error'},
          el('img', {src: 'images/favicon-touch.png'}),
          el('h2', null, 'Grouptabs'),
          el('p', null, this.props.remoteTabError),
          el('button', {className: 'create', onClick: this.handleButtonClick}, 'OK')
        )
      );
    }

  });

});
