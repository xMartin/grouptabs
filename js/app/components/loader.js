define([
  'react',
  'create-react-class'
],

function (React, createReactClass) {
  'use strict';

  var el = React.createElement;

  return createReactClass({

    displayName: 'Loader',

    propTypes: {
      show: React.PropTypes.bool
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
