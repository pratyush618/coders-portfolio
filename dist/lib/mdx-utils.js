"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processMdx = processMdx;
exports.estimateReadingTime = estimateReadingTime;
exports.generateSlug = generateSlug;
exports.extractMetaFromMdx = extractMetaFromMdx;
var mdx_1 = require("@mdx-js/mdx");
var remark_gfm_1 = require("remark-gfm");
var rehype_highlight_1 = require("rehype-highlight");
var rehype_slug_1 = require("rehype-slug");
function processMdx(content_1) {
    return __awaiter(this, arguments, void 0, function (content, options) {
        var _a, rehypePlugins, _b, remarkPlugins, compiled, error_1;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = options.rehypePlugins, rehypePlugins = _a === void 0 ? [rehype_highlight_1.default, rehype_slug_1.default] : _a, _b = options.remarkPlugins, remarkPlugins = _b === void 0 ? [remark_gfm_1.default] : _b;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, mdx_1.compile)(content, {
                            outputFormat: 'function-body',
                            development: process.env.NODE_ENV === 'development',
                            remarkPlugins: remarkPlugins,
                            rehypePlugins: rehypePlugins,
                            jsx: true,
                            jsxImportSource: 'react',
                            jsxRuntime: 'automatic'
                        })];
                case 2:
                    compiled = _c.sent();
                    return [2 /*return*/, compiled.toString()];
                case 3:
                    error_1 = _c.sent();
                    console.error('MDX compilation error:', error_1);
                    throw new Error('Failed to compile MDX content');
                case 4: return [2 /*return*/];
            }
        });
    });
}
function estimateReadingTime(content) {
    // Remove MDX/HTML tags and count words
    var plainText = content
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/```[\s\S]*?```/g, '') // Remove code blocks
        .replace(/`[^`]*`/g, '') // Remove inline code
        .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
        .replace(/\[.*?\]\(.*?\)/g, '') // Remove links
        .replace(/[#*_~`]/g, '') // Remove markdown formatting
        .trim();
    var wordCount = plainText.split(/\s+/).filter(function (word) { return word.length > 0; }).length;
    var wordsPerMinute = 200; // Average reading speed
    return Math.ceil(wordCount / wordsPerMinute);
}
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}
function extractMetaFromMdx(content) {
    var frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch)
        return { content: content, meta: {} };
    var frontmatter = frontmatterMatch[1];
    var contentWithoutFrontmatter = content.replace(/^---\n([\s\S]*?)\n---\n?/, '');
    // Simple frontmatter parser
    var meta = {};
    var lines = frontmatter.split('\n');
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        var _a = line.split(':'), key = _a[0], valueParts = _a.slice(1);
        if (key && valueParts.length > 0) {
            var value = valueParts.join(':').trim();
            // Handle arrays (tags, etc.)
            if (value.startsWith('[') && value.endsWith(']')) {
                meta[key.trim()] = value
                    .slice(1, -1)
                    .split(',')
                    .map(function (item) { return item.trim().replace(/^["']|["']$/g, ''); });
            }
            // Handle booleans
            else if (value === 'true' || value === 'false') {
                meta[key.trim()] = value === 'true';
            }
            // Handle strings
            else {
                meta[key.trim()] = value.replace(/^["']|["']$/g, '');
            }
        }
    }
    return { content: contentWithoutFrontmatter, meta: meta };
}
