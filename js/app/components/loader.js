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

    displayName: 'Loader',

    propTypes: {
      show: PropTypes.bool
    },

    render: function () {
      if (this.props.show) {
        return (
          el('div', {className: 'loader tab-loader'},
            el('div')
          )
        );
      }

      return el('div', null, this.props.children);
    }

  });

});
