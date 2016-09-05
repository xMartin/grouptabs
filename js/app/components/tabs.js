define([
  'react',
  './tablistbutton',
  './importform'
],

function (React, TabListButton, ImportForm) {
  'use strict';

  var el = React.createElement;

  return React.createClass({

    render: function () {
      return (
        el('div', {className: 'scene tabsScene' + (this.props.visible ? '' : ' hidden')},
          el('div', {className: 'header'},
            el('img', {id: 'logo', src: 'images/favicon-touch.png'}),
            el('h2', null, 'Grouptabs')
          ),
          el('div', {className: 'row tabs'},
            this.props.data.map(function (tab) {
              return el(TabListButton, {key: tab, name: tab, onClick: this.props.handleTabClick});
            }.bind(this))
          ),
          el('div', {className: 'row'},
            el('button', {onClick: this.props.handleCreateNewTab, className: 'create full-width-margin'}, 'Create new tab')
          ),
          el('div', {className: 'row'},
            el(ImportForm, {handleSubmit: this.props.handleTabClick})
          )
        )
      );
    }

  });

});
