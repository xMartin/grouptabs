define([
  'react'
],

function (React) {
  'use strict';

  var el = React.createElement;
  var PropTypes = React.PropTypes;

  return React.createClass({

    displayName: 'CollabsibleRow',

    propTypes: {
      label: PropTypes.string.isRequired,
      collapsed: PropTypes.bool.isRequired,
      handleCollapseButtonClick: PropTypes.func.isRequired,
      children: PropTypes.element.isRequired
    },

    render: function () {
      return (
        el('div', {className: 'row collapsible' + (this.props.collapsed ? ' collapsed' : '')},
          el('label', {onClick: this.props.handleCollapseButtonClick},
            this.props.label
          ),
          el('div', {className: 'inner'},
            this.props.children
          )
        )
      );
    }

  });

});
