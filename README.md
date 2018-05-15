# posthtml-external-link-target-blank

[![npm version][img:npm]][url:npm]
[![build status][img:build-status]][url:build-status]

> Adds HTML so external links will open in a new window

## Installation

```
npm install posthtml posthtml-external-link-target-blank
```

### Example

```javascript
const posthtml = require('posthtml');
const externalLinks = require('posthtml-external-link-target-blank');

const inputHTML = ;
const outputHTML = posthtml()
  .use(externalLinks())
  .process('<a href="http://www.example.com/">lorem ipsum dolar sit a met</div>', { sync: true })
  .html;

// <a href="http://www.example.com/" target="_blank" rel="noopener">lorem ipsum dolar sit a met</div>
```

### Options

#### excludeHosts

An array of hosts which should be excluded from opening new windows.

* Since: `1.0.0`
* Property is `Optional`
* Default value is: `[]`

Example:

```javascript
const posthtml = require('posthtml');
const externalLinks = require('posthtml-external-link-target-blank');

const inputHTML = '<a href="http://www.example.com/">lorem ipsum dolar sit a met</div>';
const outputHTML = posthtml()
  .use(externalLinks({ excludeHosts: [ 'example.com', 'www.example.com' ] }))
  .process(inputHTML, { sync: true })
  .html;


```

[url:posthtml]: https://github.com/posthtml/posthtml

[img:build-status]: https://travis-ci.org/bashaus/posthtml-external-link-target-blank.svg
[url:build-status]: https://travis-ci.org/bashaus/posthtml-external-link-target-blank

[img:npm]: https://img.shields.io/npm/v/posthtml-external-link-target-blank.svg
[url:npm]: https://www.npmjs.com/package/posthtml-external-link-target-blank
