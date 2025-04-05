import { EleventyI18nPlugin } from "@11ty/eleventy";
import i18n from "eleventy-plugin-i18n";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import markdownIt from "markdown-it"
import { DateTime } from "luxon";
import MarkdownItGitHubAlerts from "markdown-it-github-alerts";
import markdownItAbbr from "markdown-it-abbr/dist/markdown-it-abbr.js";

import { translations } from "./src/site/_data/i18n.js";


export default async function (eleventyConfig) {
    eleventyConfig.addPlugin(EleventyI18nPlugin, {
        // any valid BCP 47-compatible language tag is supported
        defaultLanguage: "pt-BR", // Required, this site uses "en"

        // Rename the default universal filter names
        filters: {
            // transform a URL with the current page’s locale code
            url: "locale_url",

            // find the other localized content for a specific input file
            links: "locale_links",
        },

        // When to throw errors for missing localized content files
        errorMode: "allow-fallback", // throw an error if content is missing at /en/slug
        // errorMode: "allow-fallback", // only throw an error when the content is missing at both /en/slug and /slug
        // errorMode: "never", // don’t throw errors for missing content
    });

    eleventyConfig.addPlugin(i18n, {
        translations: translations,
        fallbackLocales: {
            '*': 'en'
        }
    });

    eleventyConfig.addPlugin(syntaxHighlight);

    eleventyConfig.amendLibrary("md", (mdLib) => mdLib.use(MarkdownItGitHubAlerts).use(markdownItAbbr))

    eleventyConfig.addPassthroughCopy({ "src/_static": "static" });
    eleventyConfig.addPassthroughCopy({ "src/site/_assets": "assets" });

    eleventyConfig.addGlobalData("today", () => DateTime.now());

    eleventyConfig.addFilter("date", function (dateString) {
        // Parse the date
        if (!dateString) {
            return null;
        }

        return DateTime.fromISO(dateString);
    });

    eleventyConfig.addFilter("format_date", function (date, format) {
        // Parse the date
        if (format === null || format === undefined) {
            return "";
        }

        if (date === null || date === undefined) {
            return "";
        }

        if (date instanceof Date) {
            // If date is a Date object, convert it to Luxon DateTime
            date = DateTime.fromJSDate(date);
        } else if (typeof date === 'string' || date instanceof String) {
            // If date is a string, convert it to Luxon DateTime
            date = DateTime.fromISO(date);
        }

        // Get language from directory data
        const lang = this.page?.lang || "en-US";

        return date.setLocale(lang).toFormat(format)
    });

    eleventyConfig.addFilter("format_date_as_locale_string", function (date, format) {
        // Parse the date
        if (!format) {
            return "";
        }

        if (date === null || date === undefined) {
            return "";
        }

        if (date instanceof Date) {
            // If date is a Date object, convert it to Luxon DateTime
            date = DateTime.fromJSDate(date);
        } else if (typeof date === 'string' || date instanceof String) {
            // If date is a string, convert it to Luxon DateTime
            date = DateTime.fromISO(date);
        }

        // Get language from directory data
        const lang = this.page?.lang || "en-US";

        return date.setLocale(lang).toLocaleString(format)
    });

    eleventyConfig.addFilter("markdown_inline", function (content) {
        const md = new markdownIt("commonmark", { html: true });
        return md.renderInline(content);
    })

    eleventyConfig.addFilter("debug", (content) => `<pre>${content}</pre>`);
};

export const config = {
    dir: {
        // These are both relative to your input directory!
        input: "src/site",
        output: "dist",
        includes: "_includes",
        layouts: "_layouts"
    }
};