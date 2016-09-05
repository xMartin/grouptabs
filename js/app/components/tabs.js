define([
  'react',
  './tablistbutton',
  './importform'
],

function (React, TabListButton, ImportForm) {
  'use strict';

  var el = React.createElement;

  return function (props) {
    return (
      el('div', {className: 'scene tabsScene' + (props.visible ? '' : ' hidden')},
        el('div', {className: 'header'},
          el('img', {id: 'logo', src: 'images/favicon-touch.png'}),
          el('h2', null, 'Grouptabs')
        ),
        el('div', {className: 'row tabs'},
          props.data.map(function (tab) {
            return el(TabListButton, {key: tab, name: tab, onClick: props.handleTabClick});
          })
        ),
        el('div', {className: 'row'},
          el('button', {onClick: props.handleCreateNewTab, className: 'create full-width-margin'}, 'Create new tab')
        ),
        el('div', {className: 'row'},
          el(ImportForm, {handleSubmit: props.handleTabClick})
        )
      )
    );
  };

});
