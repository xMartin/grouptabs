define([
  'react',
  'create-react-class'
],

function (React, createReactClass) {
  'use strict';

  var el = React.createElement;

  return createReactClass({

    displayName: 'TabListButton',

    propTypes: {
      data: React.PropTypes.object.isRequired,
      onClick: React.PropTypes.func.isRequired
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
