define([
  'react'
],

function (React) {
  'use strict';

  return React.createClass({

    displayName: 'TabListButton',

    onClick: function () {
      this.props.onClick(this.props.name);
    },

    render: function () {
      return (
        React.createElement('button', {
          className: 'full-width',
          onClick: this.onClick
        },
          this.props.name
        )
      );
    }

  });

});
