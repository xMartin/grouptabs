define([
  'react'
],

function (React) {
  'use strict';

  var el = React.createElement;

  return React.createClass({

    displayName: 'Loading',

    propTypes: {
      show: React.PropTypes.bool
    },

    render: function () {
      if (this.props.show) {
        return (
          el('div', {className: 'loading'},
            el('div')
          )
        );
      }

      return el('div', null, this.props.children);
    }

  });

});
