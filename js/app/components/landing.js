define([
  'react',
  './importform'
],

function (React, ImportForm) {
  'use strict';

  var el = React.createElement;

  return function (props) {
    return (
      el('div', {className: 'scene landingScene' + (props.visible ? '' : ' hidden')},
        el('div', {className: 'header'},
          el('img', {id: 'logo', src: 'images/favicon-touch.png'}),
          el('h2', null, 'Grouptabs')
        ),
        el('div', {className: 'empty-info'},
          el('article', null,
            el('p', null,
              'A tab consists of transactions. When you add a transaction you also define the people that are part of it, the participants.'
            )
          )
        ),
        el('div', {className: 'row'},
          el('button', {className: 'full-width-margin create', onClick: props.handleNewEntryClick},
            'Start by adding your first transaction'
          )
        ),
        el('div', {className: 'row'},
          el(ImportForm, {handleSubmit: props.handleImportSubmit})
        )
      )
    );
  };

});
