define([
  'react'
],

function (React) {
  'use strict';

  var el = React.createElement;

  return React.createClass({

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
