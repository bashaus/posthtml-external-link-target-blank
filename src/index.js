const url = require('url');

module.exports = function (options = {}) {
  return function (tree) {
    tree.match({ tag: 'a' }, function (node) {
      node.attrs = node.attrs || {};

      if (!node.attrs.href) {
        return node;
      }

      const link = url.parse(
        node.attrs.href,
        /* parseQueryString */ false,
        /* slashesDenoteHost */ true
      );

      // Must change hosts
      if (!link.hostname) {
        return node;
      }

      if (options.excludeHosts) {
        const shouldExclude = options.excludeHosts.find(
          hostname => hostname == link.hostname
        );

        // Exclude certain domains
        if (shouldExclude) {
          return node;
        }
      }

      node.attrs.target = '_blank';
      node.attrs.rel = ((node.attrs.rel || '') + ' noopener').trim();

      return node;
    });
  };
};
