define([
  'react'
],

function (React) {
  'use strict';

  var el = React.createElement;

  return React.createClass({

    displayName: 'TabListButton',

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
