import PostHTML from "posthtml";

export type ExternalLinksOptions = {
  excludeHosts: Array<string>;
  noopener: boolean;
  noreferrer: boolean;
};

export default function externalLinks(
  options: Partial<ExternalLinksOptions> = {},
) {
  const useOptions: ExternalLinksOptions = {
    excludeHosts: [],
    noopener: true,
    noreferrer: true,
    ...options,
  };

  return function (tree: PostHTML.Node) {
    tree.match({ tag: "a" }, function (node: PostHTML.Node) {
      node.attrs = node.attrs || {};

      if (!node.attrs["href"]) {
        return node;
      }

      const link = new URL(node.attrs["href"], "http://posthtml");

      // Must change hosts
      if (link.hostname === "posthtml") {
        return node;
      }

      if (useOptions.excludeHosts) {
        const shouldExclude = useOptions.excludeHosts.some(
          (hostname) => hostname == link.hostname,
        );

        // Exclude certain domains
        if (shouldExclude) {
          return node;
        }
      }

      node.attrs["target"] = "_blank";

      const rel = [];

      if (node.attrs["rel"]) {
        rel.push(node.attrs["rel"]);
      }

      if (useOptions.noopener) {
        rel.push("noopener");
      }

      if (useOptions.noreferrer) {
        rel.push("noreferrer");
      }

      node.attrs["rel"] = rel.join(" ");

      return node;
    });
  };
}
