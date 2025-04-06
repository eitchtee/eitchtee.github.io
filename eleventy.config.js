import { EleventyI18nPlugin } from "@11ty/eleventy";
import i18n from "eleventy-plugin-i18n";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

import { DateTime } from "luxon";

import markdownIt from "markdown-it"
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

    eleventyConfig.addCollection("projects", function (collectionApi) {
        // --- Step 1: Get the items for the 'project' collection ---
        const projectItems = collectionApi.getFilteredByGlob("src/site/projects/*.md");

        // --- Step 2: Sort the retrieved items with multi-level logic ---
        const sortedProjectItems = [...projectItems].sort((a, b) => {
            const orderA = a.data.order;
            const orderB = b.data.order;

            // Use more robust checks for existence (handle order: 0 correctly)
            // Checks if the key exists and is not null/undefined
            const hasOrderA = orderA !== undefined && orderA !== null;
            const hasOrderB = orderB !== undefined && orderB !== null;

            // ** Primary Sort: Existence of 'order' **
            // Items *with* 'order' should come before items *without* 'order'.
            if (hasOrderA && !hasOrderB) {
                return -1; // a comes first
            }
            if (!hasOrderA && hasOrderB) {
                return 1;  // b comes first (so a comes after)
            }

            // ** Secondary Sort: Value of 'order' (numerical) **
            // This block only runs if *both* have 'order' or *neither* has 'order'.
            // If both have 'order', compare them numerically.
            if (hasOrderA && hasOrderB) {
                // If orders are different, sort by order value
                if (orderA !== orderB) {
                    return orderA - orderB; // Ascending numerical sort
                }
                // If orders are the same, fall through to the tie-breaker
            }

            // ** Tie-breaker Sort: Value of 'title' (alphabetical) **
            // This runs if:
            // 1) Both items have the same 'order' value.
            // 2) Neither item has an 'order' value.
            const titleA = a.data.title || ""; // Use default empty string if title is missing
            const titleB = b.data.title || ""; // Use default empty string if title is missing

            return titleA.localeCompare(titleB); // Alphabetical sort
        });

        // --- Step 3: Return the sorted array ---
        return sortedProjectItems;
    });
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