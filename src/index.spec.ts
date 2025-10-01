import posthtml from "posthtml";
import externalLinks from ".";

describe("new window external link", () => {
  it("generates with default values", async () => {
    const output = await transform(
      '<a href="https://www.example.com">Example</a>',
      {},
    );

    expect(output).toEqual(
      '<a href="https://www.example.com" target="_blank" rel="noopener noreferrer">Example</a>',
    );
  });

  it("ignores tags without href attributes", async () => {
    const output = await transform("<a>Example</a>");
    expect(output).toEqual("<a>Example</a>");
  });

  it("keeps existing rel tags", async () => {
    const output = await transform(
      '<a href="https://www.example.com" rel="example">Example</a>',
      {},
    );

    expect(output).toEqual(
      '<a href="https://www.example.com" rel="example noopener noreferrer" target="_blank">Example</a>',
    );
  });

  it("marks up external links", async () => {
    const output = await transform(
      `<a href="http://www.example.com/">Example</a>`,
    );

    expect(output).toEqual(
      `<a href="http://www.example.com/" target="_blank" rel="noopener noreferrer">Example</a>`,
    );
  });

  describe("internal links", () => {
    it("skips root path", async () => {
      const output = await transform('<a href="/">innerText</a>');
      expect(output).toEqual('<a href="/">innerText</a>');
    });

    it("skips paths", async () => {
      const output = await transform('<a href="/path/">innerText</a>');
      expect(output).toEqual('<a href="/path/">innerText</a>');
    });

    it("skips files", async () => {
      const output = await transform('<a href="path.html">innerText</a>');
      expect(output).toEqual('<a href="path.html">innerText</a>');
    });
  });

  describe("protocols", () => {
    it("honors the protocol", async () => {
      const output = await transform('<a href="//www.example.com/"></a>');
      expect(output).toEqual(
        '<a href="//www.example.com/" target="_blank" rel="noopener noreferrer"></a>',
      );
    });

    it("keeps the https protocol", async () => {
      const output = await transform('<a href="https://www.example.com/"></a>');
      expect(output).toEqual(
        '<a href="https://www.example.com/" target="_blank" rel="noopener noreferrer"></a>',
      );
    });
  });

  describe("#excludeHosts", () => {
    it("ignores a single domain", async () => {
      const output = await transform('<a href="http://www.example.com/"></a>', {
        excludeHosts: ["localhost"],
      });

      expect(output).toEqual(
        '<a href="http://www.example.com/" target="_blank" rel="noopener noreferrer"></a>',
      );
    });

    it("ignores multiple domains", async () => {
      const output = await transform(
        [
          `<a href="http://localhost/"></a>`,
          `<a href="http://broadcasthost/"></a>`,
          `<a href="http://www.example.com/"></a>`,
        ].join(" "),
        { excludeHosts: ["localhost", "broadcasthost"] },
      );

      expect(output).toEqual(
        [
          `<a href="http://localhost/"></a>`,
          `<a href="http://broadcasthost/"></a>`,
          `<a href="http://www.example.com/" target="_blank" rel="noopener noreferrer"></a>`,
        ].join(" "),
      );
    });
  });

  describe("#noopener", () => {
    it("includes when true", async () => {
      const output = await transform('<a href="http://www.example.com/"></a>', {
        noopener: true,
        noreferrer: true,
      });

      expect(output).toEqual(
        '<a href="http://www.example.com/" target="_blank" rel="noopener noreferrer"></a>',
      );
    });

    it("excludes when false", async () => {
      const output = await transform('<a href="http://www.example.com/"></a>', {
        noopener: false,
        noreferrer: true,
      });

      expect(output).toEqual(
        '<a href="http://www.example.com/" target="_blank" rel="noreferrer"></a>',
      );
    });
  });

  describe("#noreferrer", () => {
    it("includes when true", async () => {
      const output = await transform('<a href="http://www.example.com/"></a>', {
        noopener: true,
        noreferrer: true,
      });

      expect(output).toEqual(
        '<a href="http://www.example.com/" target="_blank" rel="noopener noreferrer"></a>',
      );
    });

    it("excludes when false", async () => {
      const output = await transform('<a href="http://www.example.com/"></a>', {
        noopener: true,
        noreferrer: false,
      });

      expect(output).toEqual(
        '<a href="http://www.example.com/" target="_blank" rel="noopener"></a>',
      );
    });
  });
});

async function transform(input: string, options = {}) {
  const response = await posthtml().use(externalLinks(options)).process(input);
  return response.html;
}
