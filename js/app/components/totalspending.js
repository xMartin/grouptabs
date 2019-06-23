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
      return (
        el('div', {className: 'total-sum'}, 'Total Spending: ' + this.props.amount)
      );
    }

  });

});
