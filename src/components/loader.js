import React from 'react';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'pure-render-mixin';
import PropTypes from 'prop-types';

var el = React.createElement;

export default createReactClass({
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
