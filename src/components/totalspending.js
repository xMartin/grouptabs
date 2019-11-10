import React from 'react';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'pure-render-mixin';
import PropTypes from 'prop-types';

var el = React.createElement;

export default createReactClass({
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
