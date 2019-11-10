import React from 'react';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'pure-render-mixin';
import PropTypes from 'prop-types';

var el = React.createElement;

export default createReactClass({
  mixins: [PureRenderMixin],

  displayName: 'TabListButton',

  propTypes: {
    data: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
  },

  handleClick: function () {
    this.props.onClick(this.props.data.id);
  },

  render: function () {
    return (
      el('button', {
        className: 'full-width',
        onClick: this.handleClick
      },
        this.props.data.name
      )
    );
  }

});
