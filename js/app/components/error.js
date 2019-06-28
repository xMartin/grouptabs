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

    displayName: 'Error',

    propTypes: {
      error: PropTypes.shape({
        error: PropTypes.object,
        info: PropTypes.object
      })
    },

    reload: function () {
      window.location.reload();
    },

    render: function () {
      return (
        el('div', {className: 'scene errorScene'},
          el('div', {className: 'header'},
            el('img', {id: 'logo', src: 'images/favicon-touch.png', alt: ''}),
            el('h2', null, 'Error')
          ),
          el('p', null, 'Oops, unfortunately an error occured.'),
          el('p', null,
            el('a', {href: '#', onClick: this.reload},
              'Try reloading'
            )
          )
        )
      );
    }

  });

});
