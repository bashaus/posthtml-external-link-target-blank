const expect = require('expect');

const posthtml = require('posthtml');
const externalLinks = require('..');

describe('new window external link', () => {
  it('ignores tags without href attributes', () => {
    expect(transform('<a>Example</a>'))
      .toEqual('<a>Example</a>');

    expect(transform('<a rel="noopener">Example</a>'))
      .toEqual('<a rel="noopener">Example</a>');
  });

  it('marks up external links', () => {
    expect(transform(`
      <a href="http://www.example.com/">Example</a>
    `)).toEqual(`
      <a href="http://www.example.com/" target="_blank" rel="noopener">Example</a>
    `);
  });

  it('skips internal links', () => {
    expect(transform('<a href="/">innerText</a>'))
      .toEqual('<a href="/">innerText</a>');

    expect(transform('<a href="/path/">innerText</a>'))
      .toEqual('<a href="/path/">innerText</a>');

    expect(transform('<a href="path.html">innerText</a>'))
      .toEqual('<a href="path.html">innerText</a>');
  });

  it('honors the same protocol', () => {
    expect(transform('<a href="//www.example.com/"></a>'))
      .toEqual('<a href="//www.example.com/" target="_blank" rel="noopener"></a>');
  });

  describe('options#exclude', () => {
    it('ignores a single domain', () => {
      expect(transform('<a href="http://localhost/"></a>', { excludeHosts: [ 'localhost' ] }))
        .toEqual('<a href="http://localhost/"></a>');

      expect(transform('<a href="http://www.example.com/"></a>', { excludeHosts: [ 'localhost' ] }))
        .toEqual('<a href="http://www.example.com/" target="_blank" rel="noopener"></a>');
    });

    it('ignores multiple domains', () => {
      expect(transform(`
        <a href="http://localhost/"></a>
        <a href="http://broadcasthost/"></a>
        <a href="http://www.example.com/"></a>
      `, { excludeHosts: [ 'localhost', 'broadcasthost' ] })).toEqual(`
        <a href="http://localhost/"></a>
        <a href="http://broadcasthost/"></a>
        <a href="http://www.example.com/" target="_blank" rel="noopener"></a>
      `);
    });
  });
});

function transform(input, options = {}) {
  return posthtml()
    .use(externalLinks(options))
    .process(input, { sync: true })
    .html;
}
