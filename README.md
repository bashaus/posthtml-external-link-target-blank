# posthtml-external-link-target-blank

[![npm version][img:npm]][url:npm]

Adds HTML so external links will open in a new window

## Installation

```
npm install posthtml posthtml-external-link-target-blank
```

### Example

```typescript
import posthtml from "posthtml";
import externalLinks from "posthtml-external-link-target-blank";

const inputHTML =
  '<a href="http://www.example.com/">lorem ipsum dolar sit a met</div>';

const output = await posthtml().use(externalLinks()).process(inputHTML);
const outputHTML = output.html;
// <a href="http://www.example.com/" target="_blank" rel="noopener noreferrer">lorem ipsum dolar sit a met</div>
```

### Options

#### excludeHosts

An array of hosts which should be excluded from opening new windows.

- Since: `1.0.0`
- Property is `Optional`
- Default value is: `[]`

Example:

```typescript
import posthtml from "posthtml";
import externalLinks from "posthtml-external-link-target-blank";

const inputHTML =
  '<a href="http://www.example.com/">lorem ipsum dolar sit a met</div>';

const output = await posthtml()
  .use(externalLinks({ excludeHosts: ["example.com", "www.example.com"] }))
  .process(inputHTML);
```

#### noopener

Whether or not to include `rel="noopener"` in the link tag.

- Since: `1.1.0`
- Property is `Optional`
- Default value is: `true`

#### noreferrer

Whether or not to include `rel="noreferrer"` in the link tag.

- Since: `1.1.0`
- Property is `Optional`
- Default value is: `true`

[url:posthtml]: https://github.com/posthtml/posthtml
[img:npm]: https://img.shields.io/npm/v/posthtml-external-link-target-blank.svg
[url:npm]: https://www.npmjs.com/package/posthtml-external-link-target-blank
