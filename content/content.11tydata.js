export default {
  eleventyComputed: {
    permalink: (data) => (data.published === false ? false : data.permalink),
    eleventyExcludeFromCollections: (data) =>
      data.published === false ? true : data.eleventyExcludeFromCollections,
  },
};
