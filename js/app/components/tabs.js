define([
  'react',
  './tablistbutton',
  './importform'
],

function (React, TabListButtonClass, ImportFormClass) {
  'use strict';

  var TabListButton = React.createFactory(TabListButtonClass);
  var ImportForm = React.createFactory(ImportFormClass);

  return React.createClass({

    render: function () {
      return (
        React.createElement('div', {className: 'scene tabsScene' + (this.props.visible ? '' : ' hidden')},
          React.createElement('div', {className: 'header'},
            React.createElement('img', {id: 'logo', src: 'images/favicon-touch.png'}),
            React.createElement('h2', null, 'Grouptabs')
          ),
          React.createElement('div', {className: 'row tabs'},
            this.props.data.map(function (tab) {
              return new TabListButton({key: tab, name: tab, onClick: this.props.handleTabClick})
            }.bind(this))
          ),
          React.createElement('div', {className: 'row'},
            React.createElement('button', {onClick: this.props.handleCreateNewTab, className: 'create full-width-margin'}, 'Create new tab')
          ),
          React.createElement('div', {className: 'row'},
            new ImportForm({handleSubmit: this.props.handleTabClick})
          )
        )
      );
    }

  });

});
