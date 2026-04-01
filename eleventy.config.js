import fs from "node:fs";
import { DateTime } from "luxon";
import pluginRss from "@11ty/eleventy-plugin-rss";

const pkg = JSON.parse(fs.readFileSync(new URL("./package.json", import.meta.url), "utf8"));
const configuredEleventyVersion = String(pkg?.devDependencies?.["@11ty/eleventy"] || "").replace(/^[^\d]*/, "");

const toDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export default function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPassthroughCopy({ static: "/" });

  eleventyConfig.addGlobalData("build", {
    eleventyVersion: configuredEleventyVersion,
  });

  eleventyConfig.addFilter("readableDate", (value, format = "dd LLL yyyy") => {
    const date = toDate(value);
    if (!date) return "";
    return DateTime.fromJSDate(date, { zone: "utc" }).toFormat(format);
  });

  eleventyConfig.addFilter("htmlDateString", (value) => {
    const date = toDate(value);
    if (!date) return "";
    return DateTime.fromJSDate(date, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  eleventyConfig.addFilter("isoDate", (value) => {
    const date = toDate(value) || new Date();
    return DateTime.fromJSDate(date, { zone: "utc" }).toUTC().toISO();
  });

  eleventyConfig.addFilter("rfc822Date", (value) => {
    const date = toDate(value) || new Date();
    return DateTime.fromJSDate(date, { zone: "utc" }).toUTC().toRFC2822();
  });

  eleventyConfig.addFilter("slugify", (value) =>
    String(value || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
  );

  eleventyConfig.addFilter("absoluteUrl", (url, base = "http://localhost:8080") => {
    if (!url) return base;
    return new URL(url, base).toString();
  });

  eleventyConfig.addFilter("postNav", (posts, currentUrl) => {
    if (!Array.isArray(posts) || !currentUrl) {
      return { newer: null, older: null };
    }
    const idx = posts.findIndex((post) => post?.url === currentUrl);
    if (idx === -1) {
      return { newer: null, older: null };
    }
    return {
      newer: idx > 0 ? posts[idx - 1] : null,
      older: idx < posts.length - 1 ? posts[idx + 1] : null,
    };
  });

  eleventyConfig.addFilter("postsWithTag", (posts, tag) => {
    if (!Array.isArray(posts)) return [];
    return posts.filter((item) => Array.isArray(item?.data?.tags) && item.data.tags.includes(tag));
  });

  eleventyConfig.addCollection("posts", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("content/blog/*.md")
      .filter((item) => item.data.published !== false && item.data.draft !== true)
      .sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const tags = new Set();
    for (const item of collectionApi.getFilteredByGlob("content/blog/*.md")) {
      if (item.data.published === false || item.data.draft === true) continue;
      for (const tag of item.data.tags || []) {
        if (["all", "posts"].includes(tag)) continue;
        tags.add(tag);
      }
    }
    return [...tags].sort((a, b) => a.localeCompare(b));
  });

  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html", "xml", "txt", "xsl", "json"],
    dir: {
      input: "content",
      includes: "../_includes",
      data: "../_data",
      output: "_site",
    },
  };
}
