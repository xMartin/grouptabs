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

    displayName: 'TabListButton',

    propTypes: {
      data: PropTypes.object.isRequired,
      onClick: PropTypes.func.isRequired
    },

    onClick: function () {
      this.props.onClick(this.props.data.id);
    },

    render: function () {
      return (
        el('button', {
          className: 'full-width',
          onClick: this.onClick
        },
          this.props.data.name
        )
      );
    }

  });

});
