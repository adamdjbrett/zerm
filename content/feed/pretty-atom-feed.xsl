---
permalink: /feed/pretty-atom-feed.xsl
eleventyExcludeFromCollections: true
published: true
---
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html>
      <head>
        <title><xsl:value-of select="atom:feed/atom:title"/> - Feed</title>
        <style>
          body { font-family: sans-serif; max-width: 900px; margin: 2rem auto; padding: 0 1rem; }
          h1 { margin-bottom: 0.2rem; }
          .entry { margin: 1rem 0; padding: 0.8rem; border: 1px solid #ccc; }
          .meta { color: #666; font-size: 0.9rem; }
        </style>
      </head>
      <body>
        <h1><xsl:value-of select="atom:feed/atom:title"/></h1>
        <p><xsl:value-of select="atom:feed/atom:subtitle"/></p>
        <xsl:for-each select="atom:feed/atom:entry">
          <div class="entry">
            <h2><a href="{atom:link/@href}"><xsl:value-of select="atom:title"/></a></h2>
            <p class="meta"><xsl:value-of select="atom:updated"/></p>
            <p><xsl:value-of select="atom:summary"/></p>
          </div>
        </xsl:for-each>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
