define([
  'react',
  '../components/summary'
],

function (React, SummaryClass) {
  'use strict';

  var Summary = React.createFactory(SummaryClass);

  return React.createClass({

    getInitialState: function () {
      return {
        data: []
      };
    },

    render: function () {
      return React.createElement('div', null,
        React.createElement('div', {className: 'header'},
          React.createElement('button', null,
            React.createElement('svg', {height: 15, width: 15, style: {opacity: 0.5}},
              React.createElement('path', {d: 'm0 0v3h15v-3h-15zm0 6v3h15v-3h-15zm0 6v3h15v-3h-15z'})
            )
          ),
          React.createElement('h2', null, this.state.tabName)
        ),
        React.createElement('div', {className: 'row'},
          React.createElement('button', {className: 'full-width-margin create', onClick: this._onNewEntryClick},
            'Add transaction'
          )
        ),
        React.createElement('div', {className: 'row toggle'},
          React.createElement('button', {disabled: 'disabled'}, 'People'),
          React.createElement('button', {onClick: this._onListClick}, 'Transactions')
        ),
        React.createElement('div', {className: 'row'},
          Summary({data: this.state.data})
        )
      );
    },

    _onChangeTabClick: function () {
      this.props.view._onChangeTabClick();
    },

    _onNewEntryClick: function () {
      this.props.view._onNewEntryClick();
    },

    _onListClick: function () {
      this.props.view._onListClick();
    },

    _setEmpty: function(isEmpty){
      // if(isEmpty){
      //  this.contentNode.style.display = 'none'
      //  this.emptyNode.style.display = ''
      // }else{
      //  this.contentNode.style.display = ''
      //  this.emptyNode.style.display = 'none'
      // }
    }

  })

})
