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

    displayName: 'TotalSpending',

    propTypes: {
      amount: PropTypes.number.isRequired
    },

    render: function () {
      var amount = Math.round(this.props.amount * 100) / 100;

      return (
        el('div', {className: 'total-sum'}, 'Total Spending: ' + amount)
      );
    }

  });

});
