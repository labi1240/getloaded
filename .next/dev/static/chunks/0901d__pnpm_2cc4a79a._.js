(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Downloads/getLoaded/node_modules/.pnpm/fuse.js@7.0.0/node_modules/fuse.js/dist/fuse.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Fuse.js v7.0.0 - Lightweight fuzzy-search (http://fusejs.io)
 *
 * Copyright (c) 2023 Kiro Risk (http://kiro.me)
 * All Rights Reserved. Apache Software License 2.0
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */ __turbopack_context__.s([
    "default",
    ()=>Fuse
]);
function isArray(value) {
    return !Array.isArray ? getTag(value) === '[object Array]' : Array.isArray(value);
}
// Adapted from: https://github.com/lodash/lodash/blob/master/.internal/baseToString.js
const INFINITY = 1 / 0;
function baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
        return value;
    }
    let result = value + '';
    return result == '0' && 1 / value == -INFINITY ? '-0' : result;
}
function toString(value) {
    return value == null ? '' : baseToString(value);
}
function isString(value) {
    return typeof value === 'string';
}
function isNumber(value) {
    return typeof value === 'number';
}
// Adapted from: https://github.com/lodash/lodash/blob/master/isBoolean.js
function isBoolean(value) {
    return value === true || value === false || isObjectLike(value) && getTag(value) == '[object Boolean]';
}
function isObject(value) {
    return typeof value === 'object';
}
// Checks if `value` is object-like.
function isObjectLike(value) {
    return isObject(value) && value !== null;
}
function isDefined(value) {
    return value !== undefined && value !== null;
}
function isBlank(value) {
    return !value.trim().length;
}
// Gets the `toStringTag` of `value`.
// Adapted from: https://github.com/lodash/lodash/blob/master/.internal/getTag.js
function getTag(value) {
    return value == null ? value === undefined ? '[object Undefined]' : '[object Null]' : Object.prototype.toString.call(value);
}
const EXTENDED_SEARCH_UNAVAILABLE = 'Extended search is not available';
const INCORRECT_INDEX_TYPE = "Incorrect 'index' type";
const LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY = (key)=>`Invalid value for key ${key}`;
const PATTERN_LENGTH_TOO_LARGE = (max)=>`Pattern length exceeds max of ${max}.`;
const MISSING_KEY_PROPERTY = (name)=>`Missing ${name} property in key`;
const INVALID_KEY_WEIGHT_VALUE = (key)=>`Property 'weight' in key '${key}' must be a positive integer`;
const hasOwn = Object.prototype.hasOwnProperty;
class KeyStore {
    constructor(keys){
        this._keys = [];
        this._keyMap = {};
        let totalWeight = 0;
        keys.forEach((key)=>{
            let obj = createKey(key);
            this._keys.push(obj);
            this._keyMap[obj.id] = obj;
            totalWeight += obj.weight;
        });
        // Normalize weights so that their sum is equal to 1
        this._keys.forEach((key)=>{
            key.weight /= totalWeight;
        });
    }
    get(keyId) {
        return this._keyMap[keyId];
    }
    keys() {
        return this._keys;
    }
    toJSON() {
        return JSON.stringify(this._keys);
    }
}
function createKey(key) {
    let path = null;
    let id = null;
    let src = null;
    let weight = 1;
    let getFn = null;
    if (isString(key) || isArray(key)) {
        src = key;
        path = createKeyPath(key);
        id = createKeyId(key);
    } else {
        if (!hasOwn.call(key, 'name')) {
            throw new Error(MISSING_KEY_PROPERTY('name'));
        }
        const name = key.name;
        src = name;
        if (hasOwn.call(key, 'weight')) {
            weight = key.weight;
            if (weight <= 0) {
                throw new Error(INVALID_KEY_WEIGHT_VALUE(name));
            }
        }
        path = createKeyPath(name);
        id = createKeyId(name);
        getFn = key.getFn;
    }
    return {
        path,
        id,
        weight,
        src,
        getFn
    };
}
function createKeyPath(key) {
    return isArray(key) ? key : key.split('.');
}
function createKeyId(key) {
    return isArray(key) ? key.join('.') : key;
}
function get(obj, path) {
    let list = [];
    let arr = false;
    const deepGet = (obj, path, index)=>{
        if (!isDefined(obj)) {
            return;
        }
        if (!path[index]) {
            // If there's no path left, we've arrived at the object we care about.
            list.push(obj);
        } else {
            let key = path[index];
            const value = obj[key];
            if (!isDefined(value)) {
                return;
            }
            // If we're at the last value in the path, and if it's a string/number/bool,
            // add it to the list
            if (index === path.length - 1 && (isString(value) || isNumber(value) || isBoolean(value))) {
                list.push(toString(value));
            } else if (isArray(value)) {
                arr = true;
                // Search each item in the array.
                for(let i = 0, len = value.length; i < len; i += 1){
                    deepGet(value[i], path, index + 1);
                }
            } else if (path.length) {
                // An object. Recurse further.
                deepGet(value, path, index + 1);
            }
        }
    };
    // Backwards compatibility (since path used to be a string)
    deepGet(obj, isString(path) ? path.split('.') : path, 0);
    return arr ? list : list[0];
}
const MatchOptions = {
    // Whether the matches should be included in the result set. When `true`, each record in the result
    // set will include the indices of the matched characters.
    // These can consequently be used for highlighting purposes.
    includeMatches: false,
    // When `true`, the matching function will continue to the end of a search pattern even if
    // a perfect match has already been located in the string.
    findAllMatches: false,
    // Minimum number of characters that must be matched before a result is considered a match
    minMatchCharLength: 1
};
const BasicOptions = {
    // When `true`, the algorithm continues searching to the end of the input even if a perfect
    // match is found before the end of the same input.
    isCaseSensitive: false,
    // When true, the matching function will continue to the end of a search pattern even if
    includeScore: false,
    // List of properties that will be searched. This also supports nested properties.
    keys: [],
    // Whether to sort the result list, by score
    shouldSort: true,
    // Default sort function: sort by ascending score, ascending index
    sortFn: (a, b)=>a.score === b.score ? a.idx < b.idx ? -1 : 1 : a.score < b.score ? -1 : 1
};
const FuzzyOptions = {
    // Approximately where in the text is the pattern expected to be found?
    location: 0,
    // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
    // (of both letters and location), a threshold of '1.0' would match anything.
    threshold: 0.6,
    // Determines how close the match must be to the fuzzy location (specified above).
    // An exact letter match which is 'distance' characters away from the fuzzy location
    // would score as a complete mismatch. A distance of '0' requires the match be at
    // the exact location specified, a threshold of '1000' would require a perfect match
    // to be within 800 characters of the fuzzy location to be found using a 0.8 threshold.
    distance: 100
};
const AdvancedOptions = {
    // When `true`, it enables the use of unix-like search commands
    useExtendedSearch: false,
    // The get function to use when fetching an object's properties.
    // The default will search nested paths *ie foo.bar.baz*
    getFn: get,
    // When `true`, search will ignore `location` and `distance`, so it won't matter
    // where in the string the pattern appears.
    // More info: https://fusejs.io/concepts/scoring-theory.html#fuzziness-score
    ignoreLocation: false,
    // When `true`, the calculation for the relevance score (used for sorting) will
    // ignore the field-length norm.
    // More info: https://fusejs.io/concepts/scoring-theory.html#field-length-norm
    ignoreFieldNorm: false,
    // The weight to determine how much field length norm effects scoring.
    fieldNormWeight: 1
};
var Config = {
    ...BasicOptions,
    ...MatchOptions,
    ...FuzzyOptions,
    ...AdvancedOptions
};
const SPACE = /[^ ]+/g;
// Field-length norm: the shorter the field, the higher the weight.
// Set to 3 decimals to reduce index size.
function norm(weight = 1, mantissa = 3) {
    const cache = new Map();
    const m = Math.pow(10, mantissa);
    return {
        get (value) {
            const numTokens = value.match(SPACE).length;
            if (cache.has(numTokens)) {
                return cache.get(numTokens);
            }
            // Default function is 1/sqrt(x), weight makes that variable
            const norm = 1 / Math.pow(numTokens, 0.5 * weight);
            // In place of `toFixed(mantissa)`, for faster computation
            const n = parseFloat(Math.round(norm * m) / m);
            cache.set(numTokens, n);
            return n;
        },
        clear () {
            cache.clear();
        }
    };
}
class FuseIndex {
    constructor({ getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}){
        this.norm = norm(fieldNormWeight, 3);
        this.getFn = getFn;
        this.isCreated = false;
        this.setIndexRecords();
    }
    setSources(docs = []) {
        this.docs = docs;
    }
    setIndexRecords(records = []) {
        this.records = records;
    }
    setKeys(keys = []) {
        this.keys = keys;
        this._keysMap = {};
        keys.forEach((key, idx)=>{
            this._keysMap[key.id] = idx;
        });
    }
    create() {
        if (this.isCreated || !this.docs.length) {
            return;
        }
        this.isCreated = true;
        // List is Array<String>
        if (isString(this.docs[0])) {
            this.docs.forEach((doc, docIndex)=>{
                this._addString(doc, docIndex);
            });
        } else {
            // List is Array<Object>
            this.docs.forEach((doc, docIndex)=>{
                this._addObject(doc, docIndex);
            });
        }
        this.norm.clear();
    }
    // Adds a doc to the end of the index
    add(doc) {
        const idx = this.size();
        if (isString(doc)) {
            this._addString(doc, idx);
        } else {
            this._addObject(doc, idx);
        }
    }
    // Removes the doc at the specified index of the index
    removeAt(idx) {
        this.records.splice(idx, 1);
        // Change ref index of every subsquent doc
        for(let i = idx, len = this.size(); i < len; i += 1){
            this.records[i].i -= 1;
        }
    }
    getValueForItemAtKeyId(item, keyId) {
        return item[this._keysMap[keyId]];
    }
    size() {
        return this.records.length;
    }
    _addString(doc, docIndex) {
        if (!isDefined(doc) || isBlank(doc)) {
            return;
        }
        let record = {
            v: doc,
            i: docIndex,
            n: this.norm.get(doc)
        };
        this.records.push(record);
    }
    _addObject(doc, docIndex) {
        let record = {
            i: docIndex,
            $: {}
        };
        // Iterate over every key (i.e, path), and fetch the value at that key
        this.keys.forEach((key, keyIndex)=>{
            let value = key.getFn ? key.getFn(doc) : this.getFn(doc, key.path);
            if (!isDefined(value)) {
                return;
            }
            if (isArray(value)) {
                let subRecords = [];
                const stack = [
                    {
                        nestedArrIndex: -1,
                        value
                    }
                ];
                while(stack.length){
                    const { nestedArrIndex, value } = stack.pop();
                    if (!isDefined(value)) {
                        continue;
                    }
                    if (isString(value) && !isBlank(value)) {
                        let subRecord = {
                            v: value,
                            i: nestedArrIndex,
                            n: this.norm.get(value)
                        };
                        subRecords.push(subRecord);
                    } else if (isArray(value)) {
                        value.forEach((item, k)=>{
                            stack.push({
                                nestedArrIndex: k,
                                value: item
                            });
                        });
                    } else ;
                }
                record.$[keyIndex] = subRecords;
            } else if (isString(value) && !isBlank(value)) {
                let subRecord = {
                    v: value,
                    n: this.norm.get(value)
                };
                record.$[keyIndex] = subRecord;
            }
        });
        this.records.push(record);
    }
    toJSON() {
        return {
            keys: this.keys,
            records: this.records
        };
    }
}
function createIndex(keys, docs, { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}) {
    const myIndex = new FuseIndex({
        getFn,
        fieldNormWeight
    });
    myIndex.setKeys(keys.map(createKey));
    myIndex.setSources(docs);
    myIndex.create();
    return myIndex;
}
function parseIndex(data, { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}) {
    const { keys, records } = data;
    const myIndex = new FuseIndex({
        getFn,
        fieldNormWeight
    });
    myIndex.setKeys(keys);
    myIndex.setIndexRecords(records);
    return myIndex;
}
function computeScore$1(pattern, { errors = 0, currentLocation = 0, expectedLocation = 0, distance = Config.distance, ignoreLocation = Config.ignoreLocation } = {}) {
    const accuracy = errors / pattern.length;
    if (ignoreLocation) {
        return accuracy;
    }
    const proximity = Math.abs(expectedLocation - currentLocation);
    if (!distance) {
        // Dodge divide by zero error.
        return proximity ? 1.0 : accuracy;
    }
    return accuracy + proximity / distance;
}
function convertMaskToIndices(matchmask = [], minMatchCharLength = Config.minMatchCharLength) {
    let indices = [];
    let start = -1;
    let end = -1;
    let i = 0;
    for(let len = matchmask.length; i < len; i += 1){
        let match = matchmask[i];
        if (match && start === -1) {
            start = i;
        } else if (!match && start !== -1) {
            end = i - 1;
            if (end - start + 1 >= minMatchCharLength) {
                indices.push([
                    start,
                    end
                ]);
            }
            start = -1;
        }
    }
    // (i-1 - start) + 1 => i - start
    if (matchmask[i - 1] && i - start >= minMatchCharLength) {
        indices.push([
            start,
            i - 1
        ]);
    }
    return indices;
}
// Machine word size
const MAX_BITS = 32;
function search(text, pattern, patternAlphabet, { location = Config.location, distance = Config.distance, threshold = Config.threshold, findAllMatches = Config.findAllMatches, minMatchCharLength = Config.minMatchCharLength, includeMatches = Config.includeMatches, ignoreLocation = Config.ignoreLocation } = {}) {
    if (pattern.length > MAX_BITS) {
        throw new Error(PATTERN_LENGTH_TOO_LARGE(MAX_BITS));
    }
    const patternLen = pattern.length;
    // Set starting location at beginning text and initialize the alphabet.
    const textLen = text.length;
    // Handle the case when location > text.length
    const expectedLocation = Math.max(0, Math.min(location, textLen));
    // Highest score beyond which we give up.
    let currentThreshold = threshold;
    // Is there a nearby exact match? (speedup)
    let bestLocation = expectedLocation;
    // Performance: only computer matches when the minMatchCharLength > 1
    // OR if `includeMatches` is true.
    const computeMatches = minMatchCharLength > 1 || includeMatches;
    // A mask of the matches, used for building the indices
    const matchMask = computeMatches ? Array(textLen) : [];
    let index;
    // Get all exact matches, here for speed up
    while((index = text.indexOf(pattern, bestLocation)) > -1){
        let score = computeScore$1(pattern, {
            currentLocation: index,
            expectedLocation,
            distance,
            ignoreLocation
        });
        currentThreshold = Math.min(score, currentThreshold);
        bestLocation = index + patternLen;
        if (computeMatches) {
            let i = 0;
            while(i < patternLen){
                matchMask[index + i] = 1;
                i += 1;
            }
        }
    }
    // Reset the best location
    bestLocation = -1;
    let lastBitArr = [];
    let finalScore = 1;
    let binMax = patternLen + textLen;
    const mask = 1 << patternLen - 1;
    for(let i = 0; i < patternLen; i += 1){
        // Scan for the best match; each iteration allows for one more error.
        // Run a binary search to determine how far from the match location we can stray
        // at this error level.
        let binMin = 0;
        let binMid = binMax;
        while(binMin < binMid){
            const score = computeScore$1(pattern, {
                errors: i,
                currentLocation: expectedLocation + binMid,
                expectedLocation,
                distance,
                ignoreLocation
            });
            if (score <= currentThreshold) {
                binMin = binMid;
            } else {
                binMax = binMid;
            }
            binMid = Math.floor((binMax - binMin) / 2 + binMin);
        }
        // Use the result from this iteration as the maximum for the next.
        binMax = binMid;
        let start = Math.max(1, expectedLocation - binMid + 1);
        let finish = findAllMatches ? textLen : Math.min(expectedLocation + binMid, textLen) + patternLen;
        // Initialize the bit array
        let bitArr = Array(finish + 2);
        bitArr[finish + 1] = (1 << i) - 1;
        for(let j = finish; j >= start; j -= 1){
            let currentLocation = j - 1;
            let charMatch = patternAlphabet[text.charAt(currentLocation)];
            if (computeMatches) {
                // Speed up: quick bool to int conversion (i.e, `charMatch ? 1 : 0`)
                matchMask[currentLocation] = +!!charMatch;
            }
            // First pass: exact match
            bitArr[j] = (bitArr[j + 1] << 1 | 1) & charMatch;
            // Subsequent passes: fuzzy match
            if (i) {
                bitArr[j] |= (lastBitArr[j + 1] | lastBitArr[j]) << 1 | 1 | lastBitArr[j + 1];
            }
            if (bitArr[j] & mask) {
                finalScore = computeScore$1(pattern, {
                    errors: i,
                    currentLocation,
                    expectedLocation,
                    distance,
                    ignoreLocation
                });
                // This match will almost certainly be better than any existing match.
                // But check anyway.
                if (finalScore <= currentThreshold) {
                    // Indeed it is
                    currentThreshold = finalScore;
                    bestLocation = currentLocation;
                    // Already passed `loc`, downhill from here on in.
                    if (bestLocation <= expectedLocation) {
                        break;
                    }
                    // When passing `bestLocation`, don't exceed our current distance from `expectedLocation`.
                    start = Math.max(1, 2 * expectedLocation - bestLocation);
                }
            }
        }
        // No hope for a (better) match at greater error levels.
        const score = computeScore$1(pattern, {
            errors: i + 1,
            currentLocation: expectedLocation,
            expectedLocation,
            distance,
            ignoreLocation
        });
        if (score > currentThreshold) {
            break;
        }
        lastBitArr = bitArr;
    }
    const result = {
        isMatch: bestLocation >= 0,
        // Count exact matches (those with a score of 0) to be "almost" exact
        score: Math.max(0.001, finalScore)
    };
    if (computeMatches) {
        const indices = convertMaskToIndices(matchMask, minMatchCharLength);
        if (!indices.length) {
            result.isMatch = false;
        } else if (includeMatches) {
            result.indices = indices;
        }
    }
    return result;
}
function createPatternAlphabet(pattern) {
    let mask = {};
    for(let i = 0, len = pattern.length; i < len; i += 1){
        const char = pattern.charAt(i);
        mask[char] = (mask[char] || 0) | 1 << len - i - 1;
    }
    return mask;
}
class BitapSearch {
    constructor(pattern, { location = Config.location, threshold = Config.threshold, distance = Config.distance, includeMatches = Config.includeMatches, findAllMatches = Config.findAllMatches, minMatchCharLength = Config.minMatchCharLength, isCaseSensitive = Config.isCaseSensitive, ignoreLocation = Config.ignoreLocation } = {}){
        this.options = {
            location,
            threshold,
            distance,
            includeMatches,
            findAllMatches,
            minMatchCharLength,
            isCaseSensitive,
            ignoreLocation
        };
        this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
        this.chunks = [];
        if (!this.pattern.length) {
            return;
        }
        const addChunk = (pattern, startIndex)=>{
            this.chunks.push({
                pattern,
                alphabet: createPatternAlphabet(pattern),
                startIndex
            });
        };
        const len = this.pattern.length;
        if (len > MAX_BITS) {
            let i = 0;
            const remainder = len % MAX_BITS;
            const end = len - remainder;
            while(i < end){
                addChunk(this.pattern.substr(i, MAX_BITS), i);
                i += MAX_BITS;
            }
            if (remainder) {
                const startIndex = len - MAX_BITS;
                addChunk(this.pattern.substr(startIndex), startIndex);
            }
        } else {
            addChunk(this.pattern, 0);
        }
    }
    searchIn(text) {
        const { isCaseSensitive, includeMatches } = this.options;
        if (!isCaseSensitive) {
            text = text.toLowerCase();
        }
        // Exact match
        if (this.pattern === text) {
            let result = {
                isMatch: true,
                score: 0
            };
            if (includeMatches) {
                result.indices = [
                    [
                        0,
                        text.length - 1
                    ]
                ];
            }
            return result;
        }
        // Otherwise, use Bitap algorithm
        const { location, distance, threshold, findAllMatches, minMatchCharLength, ignoreLocation } = this.options;
        let allIndices = [];
        let totalScore = 0;
        let hasMatches = false;
        this.chunks.forEach(({ pattern, alphabet, startIndex })=>{
            const { isMatch, score, indices } = search(text, pattern, alphabet, {
                location: location + startIndex,
                distance,
                threshold,
                findAllMatches,
                minMatchCharLength,
                includeMatches,
                ignoreLocation
            });
            if (isMatch) {
                hasMatches = true;
            }
            totalScore += score;
            if (isMatch && indices) {
                allIndices = [
                    ...allIndices,
                    ...indices
                ];
            }
        });
        let result = {
            isMatch: hasMatches,
            score: hasMatches ? totalScore / this.chunks.length : 1
        };
        if (hasMatches && includeMatches) {
            result.indices = allIndices;
        }
        return result;
    }
}
class BaseMatch {
    constructor(pattern){
        this.pattern = pattern;
    }
    static isMultiMatch(pattern) {
        return getMatch(pattern, this.multiRegex);
    }
    static isSingleMatch(pattern) {
        return getMatch(pattern, this.singleRegex);
    }
    search() {}
}
function getMatch(pattern, exp) {
    const matches = pattern.match(exp);
    return matches ? matches[1] : null;
}
// Token: 'file
class ExactMatch extends BaseMatch {
    constructor(pattern){
        super(pattern);
    }
    static get type() {
        return 'exact';
    }
    static get multiRegex() {
        return /^="(.*)"$/;
    }
    static get singleRegex() {
        return /^=(.*)$/;
    }
    search(text) {
        const isMatch = text === this.pattern;
        return {
            isMatch,
            score: isMatch ? 0 : 1,
            indices: [
                0,
                this.pattern.length - 1
            ]
        };
    }
}
// Token: !fire
class InverseExactMatch extends BaseMatch {
    constructor(pattern){
        super(pattern);
    }
    static get type() {
        return 'inverse-exact';
    }
    static get multiRegex() {
        return /^!"(.*)"$/;
    }
    static get singleRegex() {
        return /^!(.*)$/;
    }
    search(text) {
        const index = text.indexOf(this.pattern);
        const isMatch = index === -1;
        return {
            isMatch,
            score: isMatch ? 0 : 1,
            indices: [
                0,
                text.length - 1
            ]
        };
    }
}
// Token: ^file
class PrefixExactMatch extends BaseMatch {
    constructor(pattern){
        super(pattern);
    }
    static get type() {
        return 'prefix-exact';
    }
    static get multiRegex() {
        return /^\^"(.*)"$/;
    }
    static get singleRegex() {
        return /^\^(.*)$/;
    }
    search(text) {
        const isMatch = text.startsWith(this.pattern);
        return {
            isMatch,
            score: isMatch ? 0 : 1,
            indices: [
                0,
                this.pattern.length - 1
            ]
        };
    }
}
// Token: !^fire
class InversePrefixExactMatch extends BaseMatch {
    constructor(pattern){
        super(pattern);
    }
    static get type() {
        return 'inverse-prefix-exact';
    }
    static get multiRegex() {
        return /^!\^"(.*)"$/;
    }
    static get singleRegex() {
        return /^!\^(.*)$/;
    }
    search(text) {
        const isMatch = !text.startsWith(this.pattern);
        return {
            isMatch,
            score: isMatch ? 0 : 1,
            indices: [
                0,
                text.length - 1
            ]
        };
    }
}
// Token: .file$
class SuffixExactMatch extends BaseMatch {
    constructor(pattern){
        super(pattern);
    }
    static get type() {
        return 'suffix-exact';
    }
    static get multiRegex() {
        return /^"(.*)"\$$/;
    }
    static get singleRegex() {
        return /^(.*)\$$/;
    }
    search(text) {
        const isMatch = text.endsWith(this.pattern);
        return {
            isMatch,
            score: isMatch ? 0 : 1,
            indices: [
                text.length - this.pattern.length,
                text.length - 1
            ]
        };
    }
}
// Token: !.file$
class InverseSuffixExactMatch extends BaseMatch {
    constructor(pattern){
        super(pattern);
    }
    static get type() {
        return 'inverse-suffix-exact';
    }
    static get multiRegex() {
        return /^!"(.*)"\$$/;
    }
    static get singleRegex() {
        return /^!(.*)\$$/;
    }
    search(text) {
        const isMatch = !text.endsWith(this.pattern);
        return {
            isMatch,
            score: isMatch ? 0 : 1,
            indices: [
                0,
                text.length - 1
            ]
        };
    }
}
class FuzzyMatch extends BaseMatch {
    constructor(pattern, { location = Config.location, threshold = Config.threshold, distance = Config.distance, includeMatches = Config.includeMatches, findAllMatches = Config.findAllMatches, minMatchCharLength = Config.minMatchCharLength, isCaseSensitive = Config.isCaseSensitive, ignoreLocation = Config.ignoreLocation } = {}){
        super(pattern);
        this._bitapSearch = new BitapSearch(pattern, {
            location,
            threshold,
            distance,
            includeMatches,
            findAllMatches,
            minMatchCharLength,
            isCaseSensitive,
            ignoreLocation
        });
    }
    static get type() {
        return 'fuzzy';
    }
    static get multiRegex() {
        return /^"(.*)"$/;
    }
    static get singleRegex() {
        return /^(.*)$/;
    }
    search(text) {
        return this._bitapSearch.searchIn(text);
    }
}
// Token: 'file
class IncludeMatch extends BaseMatch {
    constructor(pattern){
        super(pattern);
    }
    static get type() {
        return 'include';
    }
    static get multiRegex() {
        return /^'"(.*)"$/;
    }
    static get singleRegex() {
        return /^'(.*)$/;
    }
    search(text) {
        let location = 0;
        let index;
        const indices = [];
        const patternLen = this.pattern.length;
        // Get all exact matches
        while((index = text.indexOf(this.pattern, location)) > -1){
            location = index + patternLen;
            indices.push([
                index,
                location - 1
            ]);
        }
        const isMatch = !!indices.length;
        return {
            isMatch,
            score: isMatch ? 0 : 1,
            indices
        };
    }
}
// ❗Order is important. DO NOT CHANGE.
const searchers = [
    ExactMatch,
    IncludeMatch,
    PrefixExactMatch,
    InversePrefixExactMatch,
    InverseSuffixExactMatch,
    SuffixExactMatch,
    InverseExactMatch,
    FuzzyMatch
];
const searchersLen = searchers.length;
// Regex to split by spaces, but keep anything in quotes together
const SPACE_RE = / +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/;
const OR_TOKEN = '|';
// Return a 2D array representation of the query, for simpler parsing.
// Example:
// "^core go$ | rb$ | py$ xy$" => [["^core", "go$"], ["rb$"], ["py$", "xy$"]]
function parseQuery(pattern, options = {}) {
    return pattern.split(OR_TOKEN).map((item)=>{
        let query = item.trim().split(SPACE_RE).filter((item)=>item && !!item.trim());
        let results = [];
        for(let i = 0, len = query.length; i < len; i += 1){
            const queryItem = query[i];
            // 1. Handle multiple query match (i.e, once that are quoted, like `"hello world"`)
            let found = false;
            let idx = -1;
            while(!found && ++idx < searchersLen){
                const searcher = searchers[idx];
                let token = searcher.isMultiMatch(queryItem);
                if (token) {
                    results.push(new searcher(token, options));
                    found = true;
                }
            }
            if (found) {
                continue;
            }
            // 2. Handle single query matches (i.e, once that are *not* quoted)
            idx = -1;
            while(++idx < searchersLen){
                const searcher = searchers[idx];
                let token = searcher.isSingleMatch(queryItem);
                if (token) {
                    results.push(new searcher(token, options));
                    break;
                }
            }
        }
        return results;
    });
}
// These extended matchers can return an array of matches, as opposed
// to a singl match
const MultiMatchSet = new Set([
    FuzzyMatch.type,
    IncludeMatch.type
]);
/**
 * Command-like searching
 * ======================
 *
 * Given multiple search terms delimited by spaces.e.g. `^jscript .python$ ruby !java`,
 * search in a given text.
 *
 * Search syntax:
 *
 * | Token       | Match type                 | Description                            |
 * | ----------- | -------------------------- | -------------------------------------- |
 * | `jscript`   | fuzzy-match                | Items that fuzzy match `jscript`       |
 * | `=scheme`   | exact-match                | Items that are `scheme`                |
 * | `'python`   | include-match              | Items that include `python`            |
 * | `!ruby`     | inverse-exact-match        | Items that do not include `ruby`       |
 * | `^java`     | prefix-exact-match         | Items that start with `java`           |
 * | `!^earlang` | inverse-prefix-exact-match | Items that do not start with `earlang` |
 * | `.js$`      | suffix-exact-match         | Items that end with `.js`              |
 * | `!.go$`     | inverse-suffix-exact-match | Items that do not end with `.go`       |
 *
 * A single pipe character acts as an OR operator. For example, the following
 * query matches entries that start with `core` and end with either`go`, `rb`,
 * or`py`.
 *
 * ```
 * ^core go$ | rb$ | py$
 * ```
 */ class ExtendedSearch {
    constructor(pattern, { isCaseSensitive = Config.isCaseSensitive, includeMatches = Config.includeMatches, minMatchCharLength = Config.minMatchCharLength, ignoreLocation = Config.ignoreLocation, findAllMatches = Config.findAllMatches, location = Config.location, threshold = Config.threshold, distance = Config.distance } = {}){
        this.query = null;
        this.options = {
            isCaseSensitive,
            includeMatches,
            minMatchCharLength,
            findAllMatches,
            ignoreLocation,
            location,
            threshold,
            distance
        };
        this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
        this.query = parseQuery(this.pattern, this.options);
    }
    static condition(_, options) {
        return options.useExtendedSearch;
    }
    searchIn(text) {
        const query = this.query;
        if (!query) {
            return {
                isMatch: false,
                score: 1
            };
        }
        const { includeMatches, isCaseSensitive } = this.options;
        text = isCaseSensitive ? text : text.toLowerCase();
        let numMatches = 0;
        let allIndices = [];
        let totalScore = 0;
        // ORs
        for(let i = 0, qLen = query.length; i < qLen; i += 1){
            const searchers = query[i];
            // Reset indices
            allIndices.length = 0;
            numMatches = 0;
            // ANDs
            for(let j = 0, pLen = searchers.length; j < pLen; j += 1){
                const searcher = searchers[j];
                const { isMatch, indices, score } = searcher.search(text);
                if (isMatch) {
                    numMatches += 1;
                    totalScore += score;
                    if (includeMatches) {
                        const type = searcher.constructor.type;
                        if (MultiMatchSet.has(type)) {
                            allIndices = [
                                ...allIndices,
                                ...indices
                            ];
                        } else {
                            allIndices.push(indices);
                        }
                    }
                } else {
                    totalScore = 0;
                    numMatches = 0;
                    allIndices.length = 0;
                    break;
                }
            }
            // OR condition, so if TRUE, return
            if (numMatches) {
                let result = {
                    isMatch: true,
                    score: totalScore / numMatches
                };
                if (includeMatches) {
                    result.indices = allIndices;
                }
                return result;
            }
        }
        // Nothing was matched
        return {
            isMatch: false,
            score: 1
        };
    }
}
const registeredSearchers = [];
function register(...args) {
    registeredSearchers.push(...args);
}
function createSearcher(pattern, options) {
    for(let i = 0, len = registeredSearchers.length; i < len; i += 1){
        let searcherClass = registeredSearchers[i];
        if (searcherClass.condition(pattern, options)) {
            return new searcherClass(pattern, options);
        }
    }
    return new BitapSearch(pattern, options);
}
const LogicalOperator = {
    AND: '$and',
    OR: '$or'
};
const KeyType = {
    PATH: '$path',
    PATTERN: '$val'
};
const isExpression = (query)=>!!(query[LogicalOperator.AND] || query[LogicalOperator.OR]);
const isPath = (query)=>!!query[KeyType.PATH];
const isLeaf = (query)=>!isArray(query) && isObject(query) && !isExpression(query);
const convertToExplicit = (query)=>({
        [LogicalOperator.AND]: Object.keys(query).map((key)=>({
                [key]: query[key]
            }))
    });
// When `auto` is `true`, the parse function will infer and initialize and add
// the appropriate `Searcher` instance
function parse(query, options, { auto = true } = {}) {
    const next = (query)=>{
        let keys = Object.keys(query);
        const isQueryPath = isPath(query);
        if (!isQueryPath && keys.length > 1 && !isExpression(query)) {
            return next(convertToExplicit(query));
        }
        if (isLeaf(query)) {
            const key = isQueryPath ? query[KeyType.PATH] : keys[0];
            const pattern = isQueryPath ? query[KeyType.PATTERN] : query[key];
            if (!isString(pattern)) {
                throw new Error(LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY(key));
            }
            const obj = {
                keyId: createKeyId(key),
                pattern
            };
            if (auto) {
                obj.searcher = createSearcher(pattern, options);
            }
            return obj;
        }
        let node = {
            children: [],
            operator: keys[0]
        };
        keys.forEach((key)=>{
            const value = query[key];
            if (isArray(value)) {
                value.forEach((item)=>{
                    node.children.push(next(item));
                });
            }
        });
        return node;
    };
    if (!isExpression(query)) {
        query = convertToExplicit(query);
    }
    return next(query);
}
// Practical scoring function
function computeScore(results, { ignoreFieldNorm = Config.ignoreFieldNorm }) {
    results.forEach((result)=>{
        let totalScore = 1;
        result.matches.forEach(({ key, norm, score })=>{
            const weight = key ? key.weight : null;
            totalScore *= Math.pow(score === 0 && weight ? Number.EPSILON : score, (weight || 1) * (ignoreFieldNorm ? 1 : norm));
        });
        result.score = totalScore;
    });
}
function transformMatches(result, data) {
    const matches = result.matches;
    data.matches = [];
    if (!isDefined(matches)) {
        return;
    }
    matches.forEach((match)=>{
        if (!isDefined(match.indices) || !match.indices.length) {
            return;
        }
        const { indices, value } = match;
        let obj = {
            indices,
            value
        };
        if (match.key) {
            obj.key = match.key.src;
        }
        if (match.idx > -1) {
            obj.refIndex = match.idx;
        }
        data.matches.push(obj);
    });
}
function transformScore(result, data) {
    data.score = result.score;
}
function format(results, docs, { includeMatches = Config.includeMatches, includeScore = Config.includeScore } = {}) {
    const transformers = [];
    if (includeMatches) transformers.push(transformMatches);
    if (includeScore) transformers.push(transformScore);
    return results.map((result)=>{
        const { idx } = result;
        const data = {
            item: docs[idx],
            refIndex: idx
        };
        if (transformers.length) {
            transformers.forEach((transformer)=>{
                transformer(result, data);
            });
        }
        return data;
    });
}
class Fuse {
    constructor(docs, options = {}, index){
        this.options = {
            ...Config,
            ...options
        };
        if (this.options.useExtendedSearch && !true) //TURBOPACK unreachable
        ;
        this._keyStore = new KeyStore(this.options.keys);
        this.setCollection(docs, index);
    }
    setCollection(docs, index) {
        this._docs = docs;
        if (index && !(index instanceof FuseIndex)) {
            throw new Error(INCORRECT_INDEX_TYPE);
        }
        this._myIndex = index || createIndex(this.options.keys, this._docs, {
            getFn: this.options.getFn,
            fieldNormWeight: this.options.fieldNormWeight
        });
    }
    add(doc) {
        if (!isDefined(doc)) {
            return;
        }
        this._docs.push(doc);
        this._myIndex.add(doc);
    }
    remove(predicate = ()=>false) {
        const results = [];
        for(let i = 0, len = this._docs.length; i < len; i += 1){
            const doc = this._docs[i];
            if (predicate(doc, i)) {
                this.removeAt(i);
                i -= 1;
                len -= 1;
                results.push(doc);
            }
        }
        return results;
    }
    removeAt(idx) {
        this._docs.splice(idx, 1);
        this._myIndex.removeAt(idx);
    }
    getIndex() {
        return this._myIndex;
    }
    search(query, { limit = -1 } = {}) {
        const { includeMatches, includeScore, shouldSort, sortFn, ignoreFieldNorm } = this.options;
        let results = isString(query) ? isString(this._docs[0]) ? this._searchStringList(query) : this._searchObjectList(query) : this._searchLogical(query);
        computeScore(results, {
            ignoreFieldNorm
        });
        if (shouldSort) {
            results.sort(sortFn);
        }
        if (isNumber(limit) && limit > -1) {
            results = results.slice(0, limit);
        }
        return format(results, this._docs, {
            includeMatches,
            includeScore
        });
    }
    _searchStringList(query) {
        const searcher = createSearcher(query, this.options);
        const { records } = this._myIndex;
        const results = [];
        // Iterate over every string in the index
        records.forEach(({ v: text, i: idx, n: norm })=>{
            if (!isDefined(text)) {
                return;
            }
            const { isMatch, score, indices } = searcher.searchIn(text);
            if (isMatch) {
                results.push({
                    item: text,
                    idx,
                    matches: [
                        {
                            score,
                            value: text,
                            norm,
                            indices
                        }
                    ]
                });
            }
        });
        return results;
    }
    _searchLogical(query) {
        const expression = parse(query, this.options);
        const evaluate = (node, item, idx)=>{
            if (!node.children) {
                const { keyId, searcher } = node;
                const matches = this._findMatches({
                    key: this._keyStore.get(keyId),
                    value: this._myIndex.getValueForItemAtKeyId(item, keyId),
                    searcher
                });
                if (matches && matches.length) {
                    return [
                        {
                            idx,
                            item,
                            matches
                        }
                    ];
                }
                return [];
            }
            const res = [];
            for(let i = 0, len = node.children.length; i < len; i += 1){
                const child = node.children[i];
                const result = evaluate(child, item, idx);
                if (result.length) {
                    res.push(...result);
                } else if (node.operator === LogicalOperator.AND) {
                    return [];
                }
            }
            return res;
        };
        const records = this._myIndex.records;
        const resultMap = {};
        const results = [];
        records.forEach(({ $: item, i: idx })=>{
            if (isDefined(item)) {
                let expResults = evaluate(expression, item, idx);
                if (expResults.length) {
                    // Dedupe when adding
                    if (!resultMap[idx]) {
                        resultMap[idx] = {
                            idx,
                            item,
                            matches: []
                        };
                        results.push(resultMap[idx]);
                    }
                    expResults.forEach(({ matches })=>{
                        resultMap[idx].matches.push(...matches);
                    });
                }
            }
        });
        return results;
    }
    _searchObjectList(query) {
        const searcher = createSearcher(query, this.options);
        const { keys, records } = this._myIndex;
        const results = [];
        // List is Array<Object>
        records.forEach(({ $: item, i: idx })=>{
            if (!isDefined(item)) {
                return;
            }
            let matches = [];
            // Iterate over every key (i.e, path), and fetch the value at that key
            keys.forEach((key, keyIndex)=>{
                matches.push(...this._findMatches({
                    key,
                    value: item[keyIndex],
                    searcher
                }));
            });
            if (matches.length) {
                results.push({
                    idx,
                    item,
                    matches
                });
            }
        });
        return results;
    }
    _findMatches({ key, value, searcher }) {
        if (!isDefined(value)) {
            return [];
        }
        let matches = [];
        if (isArray(value)) {
            value.forEach(({ v: text, i: idx, n: norm })=>{
                if (!isDefined(text)) {
                    return;
                }
                const { isMatch, score, indices } = searcher.searchIn(text);
                if (isMatch) {
                    matches.push({
                        score,
                        key,
                        value: text,
                        idx,
                        norm,
                        indices
                    });
                }
            });
        } else {
            const { v: text, n: norm } = value;
            const { isMatch, score, indices } = searcher.searchIn(text);
            if (isMatch) {
                matches.push({
                    score,
                    key,
                    value: text,
                    norm,
                    indices
                });
            }
        }
        return matches;
    }
}
Fuse.version = '7.0.0';
Fuse.createIndex = createIndex;
Fuse.parseIndex = parseIndex;
Fuse.config = Config;
{
    Fuse.parseQuery = parse;
}{
    register(ExtendedSearch);
};
}),
"[project]/Downloads/getLoaded/node_modules/.pnpm/nuqs@2.8.5_next@16.0.10_@babel+core@7.28.5_react-dom@19.2.3_react@19.2.3__react@19.2.3__react_odpkywasxd6ly4zy7jkuhlwj5a/node_modules/nuqs/dist/compare-Br3z3FUS.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

//#region src/lib/compare.ts
__turbopack_context__.s([
    "t",
    ()=>compareQuery
]);
function compareQuery(a, b) {
    if (a === b) return true;
    if (a === null || b === null) return false;
    if (typeof a === "string" || typeof b === "string") return false;
    if (a.length !== b.length) return false;
    return a.every((value, index)=>value === b[index]);
}
;
 //# sourceMappingURL=compare-Br3z3FUS.js.map
}),
"[project]/Downloads/getLoaded/node_modules/.pnpm/nuqs@2.8.5_next@16.0.10_@babel+core@7.28.5_react-dom@19.2.3_react@19.2.3__react@19.2.3__react_odpkywasxd6ly4zy7jkuhlwj5a/node_modules/nuqs/dist/index.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createLoader",
    ()=>createLoader,
    "createMultiParser",
    ()=>createMultiParser,
    "createParser",
    ()=>createParser,
    "createSerializer",
    ()=>createSerializer,
    "createStandardSchemaV1",
    ()=>createStandardSchemaV1,
    "parseAsArrayOf",
    ()=>parseAsArrayOf,
    "parseAsBoolean",
    ()=>parseAsBoolean,
    "parseAsFloat",
    ()=>parseAsFloat,
    "parseAsHex",
    ()=>parseAsHex,
    "parseAsIndex",
    ()=>parseAsIndex,
    "parseAsInteger",
    ()=>parseAsInteger,
    "parseAsIsoDate",
    ()=>parseAsIsoDate,
    "parseAsIsoDateTime",
    ()=>parseAsIsoDateTime,
    "parseAsJson",
    ()=>parseAsJson,
    "parseAsNativeArrayOf",
    ()=>parseAsNativeArrayOf,
    "parseAsNumberLiteral",
    ()=>parseAsNumberLiteral,
    "parseAsString",
    ()=>parseAsString,
    "parseAsStringEnum",
    ()=>parseAsStringEnum,
    "parseAsStringLiteral",
    ()=>parseAsStringLiteral,
    "parseAsTimestamp",
    ()=>parseAsTimestamp,
    "useQueryState",
    ()=>useQueryState,
    "useQueryStates",
    ()=>useQueryStates
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$nuqs$40$2$2e$8$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_$5f$react_odpkywasxd6ly4zy7jkuhlwj5a$2f$node_modules$2f$nuqs$2f$dist$2f$debounce$2d$BI0MC054$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/getLoaded/node_modules/.pnpm/nuqs@2.8.5_next@16.0.10_@babel+core@7.28.5_react-dom@19.2.3_react@19.2.3__react@19.2.3__react_odpkywasxd6ly4zy7jkuhlwj5a/node_modules/nuqs/dist/debounce-BI0MC054.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$nuqs$40$2$2e$8$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_$5f$react_odpkywasxd6ly4zy7jkuhlwj5a$2f$node_modules$2f$nuqs$2f$dist$2f$context$2d$DRdo5A2P$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/getLoaded/node_modules/.pnpm/nuqs@2.8.5_next@16.0.10_@babel+core@7.28.5_react-dom@19.2.3_react@19.2.3__react@19.2.3__react_odpkywasxd6ly4zy7jkuhlwj5a/node_modules/nuqs/dist/context-DRdo5A2P.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$nuqs$40$2$2e$8$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_$5f$react_odpkywasxd6ly4zy7jkuhlwj5a$2f$node_modules$2f$nuqs$2f$dist$2f$compare$2d$Br3z3FUS$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/getLoaded/node_modules/.pnpm/nuqs@2.8.5_next@16.0.10_@babel+core@7.28.5_react-dom@19.2.3_react@19.2.3__react@19.2.3__react_odpkywasxd6ly4zy7jkuhlwj5a/node_modules/nuqs/dist/compare-Br3z3FUS.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/getLoaded/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
;
;
//#region src/loader.ts
function createLoader(parsers, { urlKeys = {} } = {}) {
    function loadSearchParams(input, { strict = false } = {}) {
        if (input instanceof Promise) return input.then((i)=>loadSearchParams(i, {
                strict
            }));
        const searchParams = extractSearchParams(input);
        const result = {};
        for (const [key, parser] of Object.entries(parsers)){
            const urlKey = urlKeys[key] ?? key;
            const query = parser.type === "multi" ? searchParams.getAll(urlKey) : searchParams.get(urlKey);
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$nuqs$40$2$2e$8$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_$5f$react_odpkywasxd6ly4zy7jkuhlwj5a$2f$node_modules$2f$nuqs$2f$dist$2f$debounce$2d$BI0MC054$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(query)) {
                result[key] = parser.defaultValue ?? null;
                continue;
            }
            let parsedValue;
            try {
                parsedValue = parser.parse(query);
            } catch (error$1) {
                if (strict) throw new Error(`[nuqs] Error while parsing query \`${query}\` for key \`${key}\`: ${error$1}`);
                parsedValue = null;
            }
            if (strict && query && parsedValue === null) throw new Error(`[nuqs] Failed to parse query \`${query}\` for key \`${key}\` (got null)`);
            result[key] = parsedValue ?? parser.defaultValue ?? null;
        }
        return result;
    }
    return loadSearchParams;
}
function extractSearchParams(input) {
    try {
        if (input instanceof Request) return input.url ? new URL(input.url).searchParams : new URLSearchParams();
        if (input instanceof URL) return input.searchParams;
        if (input instanceof URLSearchParams) return input;
        if (typeof input === "object") {
            const searchParams = new URLSearchParams();
            for (const [key, value] of Object.entries(input))if (Array.isArray(value)) for (const v of value)searchParams.append(key, v);
            else if (value !== void 0) searchParams.set(key, value);
            return searchParams;
        }
        if (typeof input === "string") {
            if (URL.hasOwnProperty("canParse") && URL.canParse(input)) return new URL(input).searchParams;
            return new URLSearchParams(input);
        }
    } catch  {}
    return new URLSearchParams();
}
//#endregion
//#region src/lib/safe-parse.ts
function safeParse(parser, value, key) {
    try {
        return parser(value);
    } catch (error$1) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$nuqs$40$2$2e$8$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_$5f$react_odpkywasxd6ly4zy7jkuhlwj5a$2f$node_modules$2f$nuqs$2f$dist$2f$context$2d$DRdo5A2P$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["l"])("[nuqs] Error while parsing value `%s`: %O" + (key ? " (for key `%s`)" : ""), value, error$1, key);
        return null;
    }
}
//#endregion
//#region src/parsers.ts
/**
* Wrap a set of parse/serialize functions into a builder pattern parser
* you can pass to one of the hooks, making its default value type safe.
*/ function createParser(parser) {
    function parseServerSideNullable(value) {
        if (typeof value === "undefined") return null;
        let str = "";
        if (Array.isArray(value)) {
            if (value[0] === void 0) return null;
            str = value[0];
        }
        if (typeof value === "string") str = value;
        return safeParse(parser.parse, str);
    }
    return {
        type: "single",
        eq: (a, b)=>a === b,
        ...parser,
        parseServerSide: parseServerSideNullable,
        withDefault (defaultValue) {
            return {
                ...this,
                defaultValue,
                parseServerSide (value) {
                    return parseServerSideNullable(value) ?? defaultValue;
                }
            };
        },
        withOptions (options) {
            return {
                ...this,
                ...options
            };
        }
    };
}
function createMultiParser(parser) {
    function parseServerSideNullable(value) {
        if (typeof value === "undefined") return null;
        return safeParse(parser.parse, Array.isArray(value) ? value : [
            value
        ]);
    }
    return {
        type: "multi",
        eq: (a, b)=>a === b,
        ...parser,
        parseServerSide: parseServerSideNullable,
        withDefault (defaultValue) {
            return {
                ...this,
                defaultValue,
                parseServerSide (value) {
                    return parseServerSideNullable(value) ?? defaultValue;
                }
            };
        },
        withOptions (options) {
            return {
                ...this,
                ...options
            };
        }
    };
}
const parseAsString = createParser({
    parse: (v)=>v,
    serialize: String
});
const parseAsInteger = createParser({
    parse: (v)=>{
        const int = parseInt(v);
        return int == int ? int : null;
    },
    serialize: (v)=>"" + Math.round(v)
});
const parseAsIndex = createParser({
    parse: (v)=>{
        const int = parseInt(v);
        return int == int ? int - 1 : null;
    },
    serialize: (v)=>"" + Math.round(v + 1)
});
const parseAsHex = createParser({
    parse: (v)=>{
        const int = parseInt(v, 16);
        return int == int ? int : null;
    },
    serialize: (v)=>{
        const hex = Math.round(v).toString(16);
        return (hex.length & 1 ? "0" : "") + hex;
    }
});
const parseAsFloat = createParser({
    parse: (v)=>{
        const float = parseFloat(v);
        return float == float ? float : null;
    },
    serialize: String
});
const parseAsBoolean = createParser({
    parse: (v)=>v.toLowerCase() === "true",
    serialize: String
});
function compareDates(a, b) {
    return a.valueOf() === b.valueOf();
}
/**
* Querystring encoded as the number of milliseconds since epoch,
* and returned as a Date object.
*/ const parseAsTimestamp = createParser({
    parse: (v)=>{
        const ms = parseInt(v);
        return ms == ms ? new Date(ms) : null;
    },
    serialize: (v)=>"" + v.valueOf(),
    eq: compareDates
});
/**
* Querystring encoded as an ISO-8601 string (UTC),
* and returned as a Date object.
*/ const parseAsIsoDateTime = createParser({
    parse: (v)=>{
        const date = new Date(v);
        return date.valueOf() == date.valueOf() ? date : null;
    },
    serialize: (v)=>v.toISOString(),
    eq: compareDates
});
/**
* Querystring encoded as an ISO-8601 string (UTC)
* without the time zone offset, and returned as
* a Date object.
*
* The Date is parsed without the time zone offset,
* making it at 00:00:00 UTC.
*/ const parseAsIsoDate = createParser({
    parse: (v)=>{
        const date = new Date(v.slice(0, 10));
        return date.valueOf() == date.valueOf() ? date : null;
    },
    serialize: (v)=>v.toISOString().slice(0, 10),
    eq: compareDates
});
/**
* String-based enums provide better type-safety for known sets of values.
* You will need to pass the parseAsStringEnum function a list of your enum values
* in order to validate the query string. Anything else will return `null`,
* or your default value if specified.
*
* Example:
* ```ts
* enum Direction {
*   up = 'UP',
*   down = 'DOWN',
*   left = 'LEFT',
*   right = 'RIGHT'
* }
*
* const [direction, setDirection] = useQueryState(
*   'direction',
*    parseAsStringEnum<Direction>(Object.values(Direction)) // pass a list of allowed values
*      .withDefault(Direction.up)
* )
* ```
*
* Note: the query string value will be the value of the enum, not its name
* (example above: `direction=UP`).
*
* @param validValues The values you want to accept
*/ function parseAsStringEnum(validValues) {
    return parseAsStringLiteral(validValues);
}
/**
* String-based literals provide better type-safety for known sets of values.
* You will need to pass the parseAsStringLiteral function a list of your string values
* in order to validate the query string. Anything else will return `null`,
* or your default value if specified.
*
* Example:
* ```ts
* const colors = ["red", "green", "blue"] as const
*
* const [color, setColor] = useQueryState(
*   'color',
*    parseAsStringLiteral(colors) // pass a readonly list of allowed values
*      .withDefault("red")
* )
* ```
*
* @param validValues The values you want to accept
*/ function parseAsStringLiteral(validValues) {
    return createParser({
        parse: (query)=>{
            const asConst = query;
            return validValues.includes(asConst) ? asConst : null;
        },
        serialize: String
    });
}
/**
* Number-based literals provide better type-safety for known sets of values.
* You will need to pass the parseAsNumberLiteral function a list of your number values
* in order to validate the query string. Anything else will return `null`,
* or your default value if specified.
*
* Example:
* ```ts
* const diceSides = [1, 2, 3, 4, 5, 6] as const
*
* const [side, setSide] = useQueryState(
*   'side',
*    parseAsNumberLiteral(diceSides) // pass a readonly list of allowed values
*      .withDefault(4)
* )
* ```
*
* @param validValues The values you want to accept
*/ function parseAsNumberLiteral(validValues) {
    return createParser({
        parse: (query)=>{
            const asConst = parseFloat(query);
            if (validValues.includes(asConst)) return asConst;
            return null;
        },
        serialize: String
    });
}
/**
* Encode any object shape into the querystring value as JSON.
* Note: you may want to use `useQueryStates` for finer control over
* multiple related query keys.
*
* @param runtimeParser Runtime parser (eg: Zod schema or Standard Schema) to validate after JSON.parse
*/ function parseAsJson(validator) {
    return createParser({
        parse: (query)=>{
            try {
                const obj = JSON.parse(query);
                if ("~standard" in validator) {
                    const result = validator["~standard"].validate(obj);
                    if (result instanceof Promise) throw new Error("[nuqs] Only synchronous Standard Schemas are supported in parseAsJson.");
                    return result.issues ? null : result.value;
                }
                return validator(obj);
            } catch  {
                return null;
            }
        },
        serialize: (value)=>JSON.stringify(value),
        eq (a, b) {
            return a === b || JSON.stringify(a) === JSON.stringify(b);
        }
    });
}
/**
* A comma-separated list of items.
* Items are URI-encoded for safety, so they may not look nice in the URL.
*
* @param itemParser Parser for each individual item in the array
* @param separator The character to use to separate items (default ',')
*/ function parseAsArrayOf(itemParser, separator = ",") {
    const itemEq = itemParser.eq ?? ((a, b)=>a === b);
    const encodedSeparator = encodeURIComponent(separator);
    return createParser({
        parse: (query)=>{
            if (query === "") return [];
            return query.split(separator).map((item, index)=>safeParse(itemParser.parse, item.replaceAll(encodedSeparator, separator), `[${index}]`)).filter((value)=>value !== null && value !== void 0);
        },
        serialize: (values)=>values.map((value)=>{
                return (itemParser.serialize ? itemParser.serialize(value) : String(value)).replaceAll(separator, encodedSeparator);
            }).join(separator),
        eq (a, b) {
            if (a === b) return true;
            if (a.length !== b.length) return false;
            return a.every((value, index)=>itemEq(value, b[index]));
        }
    });
}
function parseAsNativeArrayOf(itemParser) {
    const itemEq = itemParser.eq ?? ((a, b)=>a === b);
    return createMultiParser({
        parse: (query)=>{
            const parsed = query.map((item, index)=>safeParse(itemParser.parse, item, `[${index}]`)).filter((value)=>value !== null && value !== void 0);
            return parsed.length === 0 ? null : parsed;
        },
        serialize: (values)=>{
            return (Array.isArray(values) ? values : [
                values
            ]).flatMap((value)=>{
                const serialized = itemParser.serialize?.(value) ?? String(value);
                return typeof serialized === "string" ? [
                    serialized
                ] : [
                    ...serialized
                ];
            });
        },
        eq (a, b) {
            if (a === b) return true;
            if (a.length !== b.length) return false;
            return a.every((value, index)=>itemEq(value, b[index]));
        }
    }).withDefault([]);
}
//#endregion
//#region src/serializer.ts
function createSerializer(parsers, { clearOnDefault = true, urlKeys = {}, processUrlSearchParams } = {}) {
    function serialize(arg1BaseOrValues, arg2values = {}) {
        let [base, search] = isBase(arg1BaseOrValues) ? splitBase(arg1BaseOrValues) : [
            "",
            new URLSearchParams()
        ];
        const values = isBase(arg1BaseOrValues) ? arg2values : arg1BaseOrValues;
        if (values === null) {
            for(const key in parsers){
                const urlKey = urlKeys[key] ?? key;
                search.delete(urlKey);
            }
            if (processUrlSearchParams) search = processUrlSearchParams(search);
            return base + (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$nuqs$40$2$2e$8$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_$5f$react_odpkywasxd6ly4zy7jkuhlwj5a$2f$node_modules$2f$nuqs$2f$dist$2f$context$2d$DRdo5A2P$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["o"])(search);
        }
        for(const key in parsers){
            const parser = parsers[key];
            const value = values[key];
            if (!parser || value === void 0) continue;
            const urlKey = urlKeys[key] ?? key;
            const isMatchingDefault = parser.defaultValue !== void 0 && value !== null && (parser.eq ?? ((a, b)=>a === b))(value, parser.defaultValue);
            if (value === null || (parser.clearOnDefault ?? clearOnDefault ?? true) && isMatchingDefault) search.delete(urlKey);
            else search = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$nuqs$40$2$2e$8$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_$5f$react_odpkywasxd6ly4zy7jkuhlwj5a$2f$node_modules$2f$nuqs$2f$dist$2f$debounce$2d$BI0MC054$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a"])(parser.serialize(value), urlKey, search);
        }
        if (processUrlSearchParams) search = processUrlSearchParams(search);
        return base + (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$nuqs$40$2$2e$8$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_$5f$react_odpkywasxd6ly4zy7jkuhlwj5a$2f$node_modules$2f$nuqs$2f$dist$2f$context$2d$DRdo5A2P$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["o"])(search);
    }
    return serialize;
}
function isBase(base) {
    return typeof base === "string" || base instanceof URLSearchParams || base instanceof URL;
}
function splitBase(base) {
    if (typeof base === "string") {
        const [path = "", ...search] = base.split("?");
        return [
            path,
            new URLSearchParams(search.join("?"))
        ];
    } else if (base instanceof URLSearchParams) return [
        "",
        new URLSearchParams(base)
    ];
    else return [
        base.origin + base.pathname,
        new URLSearchParams(base.searchParams)
    ];
}
//#endregion
//#region src/standard-schema.ts
function createStandardSchemaV1(parsers, { urlKeys, partialOutput = false } = {}) {
    const serialize = createSerializer(parsers, {
        urlKeys
    });
    const load = createLoader(parsers, {
        urlKeys
    });
    return {
        "~standard": {
            version: 1,
            vendor: "nuqs",
            validate (input) {
                try {
                    const value = load(serialize(input), {
                        strict: true
                    });
                    if (partialOutput) {
                        for(const key in value)if (!(key in input)) delete value[key];
                    }
                    return {
                        value
                    };
                } catch (error$1) {
                    return {
                        issues: [
                            {
                                message: error$1 instanceof Error ? error$1.message : String(error$1)
                            }
                        ]
                    };
                }
            }
        }
    };
}
//#endregion
//#region src/lib/sync.ts
const emitter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$nuqs$40$2$2e$8$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_$5f$react_odpkywasxd6ly4zy7jkuhlwj5a$2f$node_modules$2f$nuqs$2f$dist$2f$debounce$2d$BI0MC054$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["r"])();
//#endregion
//#region src/useQueryStates.ts
const defaultUrlKeys = {};
/**
* Synchronise multiple query string arguments to React state in Next.js
*
* @param keys - An object describing the keys to synchronise and how to
*               serialise and parse them.
*               Use `parseAs(String|Integer|Float|...)` for quick shorthands.
* @param options - Optional history mode, shallow routing and scroll restoration options.
*/ function useQueryStates(keyMap, options = {}) {
    const hookId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const defaultOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$nuqs$40$2$2e$8$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_$5f$react_odpkywasxd6ly4zy7jkuhlwj5a$2f$node_modules$2f$nuqs$2f$dist$2f$context$2d$DRdo5A2P$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])();
    const processUrlSearchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$nuqs$40$2$2e$8$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_$5f$react_odpkywasxd6ly4zy7jkuhlwj5a$2f$node_modules$2f$nuqs$2f$dist$2f$context$2d$DRdo5A2P$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["a"])();
    const { history = "replace", scroll = defaultOptions?.scroll ?? false, shallow = defaultOptions?.shallow ?? true, throttleMs = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$nuqs$40$2$2e$8$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_$5f$react_odpkywasxd6ly4zy7jkuhlwj5a$2f$node_modules$2f$nuqs$2f$dist$2f$debounce$2d$BI0MC054$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["s"].timeMs, limitUrlUpdates = defaultOptions?.limitUrlUpdates, clearOnDefault = defaultOptions?.clearOnDefault ?? true, startTransition: startTransition$1, urlKeys = defaultUrlKeys } = options;
    const stateKeys = Object.keys(keyMap).join(",");
    const resolvedUrlKeys = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useQueryStates.useMemo[resolvedUrlKeys]": ()=>Object.fromEntries(Object.keys(keyMap).map({
                "useQueryStates.useMemo[resolvedUrlKeys]": (key)=>[
                        key,
                        urlKeys[key] ?? key
                    ]
            }["useQueryStates.useMemo[resolvedUrlKeys]"]))
    }["useQueryStates.useMemo[resolvedUrlKeys]"], [
        stateKeys,
        JSON.stringify(urlKeys)
    ]);
    const adapter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$nuqs$40$2$2e$8$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_$5f$react_odpkywasxd6ly4zy7jkuhlwj5a$2f$node_modules$2f$nuqs$2f$dist$2f$context$2d$DRdo5A2P$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["r"])(Object.values(resolvedUrlKeys));
    const initialSearchParams = adapter.searchParams;
    const queryRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    const defaultValues = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useQueryStates.useMemo[defaultValues]": ()=>Object.fromEntries(Object.keys(keyMap).map({
                "useQueryStates.useMemo[defaultValues]": (key)=>[
                        key,
                        keyMap[key].defaultValue ?? null
                    ]
            }["useQueryStates.useMemo[defaultValues]"]))
    }["useQueryStates.useMemo[defaultValues]"], [
        Object.values(keyMap).map({
            "useQueryStates.useMemo[defaultValues]": ({ defaultValue })=>defaultValue
        }["useQueryStates.useMemo[defaultValues]"]).join(",")
    ]);
    const queuedQueries = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$nuqs$40$2$2e$8$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_$5f$react_odpkywasxd6ly4zy7jkuhlwj5a$2f$node_modules$2f$nuqs$2f$dist$2f$debounce$2d$BI0MC054$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].useQueuedQueries(Object.values(resolvedUrlKeys));
    const [internalState, setInternalState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "useQueryStates.useState": ()=>{
            return parseMap(keyMap, urlKeys, initialSearchParams ?? new URLSearchParams(), queuedQueries).state;
        }
    }["useQueryStates.useState"]);
    const stateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(internalState);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$nuqs$40$2$2e$8$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_$5f$react_odpkywasxd6ly4zy7jkuhlwj5a$2f$node_modules$2f$nuqs$2f$dist$2f$context$2d$DRdo5A2P$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])("[nuq+ %s `%s`] render - state: %O, iSP: %s", hookId, stateKeys, internalState, initialSearchParams);
    if (Object.keys(queryRef.current).join("&") !== Object.values(resolvedUrlKeys).join("&")) {
        const { state, hasChanged } = parseMap(keyMap, urlKeys, initialSearchParams, queuedQueries, queryRef.current, stateRef.current);
        if (hasChanged) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$nuqs$40$2$2e$8$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_$5f$react_odpkywasxd6ly4zy7jkuhlwj5a$2f$node_modules$2f$nuqs$2f$dist$2f$context$2d$DRdo5A2P$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])("[nuq+ %s `%s`] State changed: %O", hookId, stateKeys, {
                state,
                initialSearchParams,
                queuedQueries,
                queryRef: queryRef.current,
                stateRef: stateRef.current
            });
            stateRef.current = state;
            setInternalState(state);
        }
        queryRef.current = Object.fromEntries(Object.entries(resolvedUrlKeys).map(([key, urlKey])=>{
            return [
                urlKey,
                keyMap[key]?.type === "multi" ? initialSearchParams?.getAll(urlKey) : initialSearchParams?.get(urlKey) ?? null
            ];
        }));
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useQueryStates.useEffect": ()=>{
            const { state, hasChanged } = parseMap(keyMap, urlKeys, initialSearchParams, queuedQueries, queryRef.current, stateRef.current);
            if (hasChanged) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$nuqs$40$2$2e$8$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_$5f$react_odpkywasxd6ly4zy7jkuhlwj5a$2f$node_modules$2f$nuqs$2f$dist$2f$context$2d$DRdo5A2P$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])("[nuq+ %s `%s`] State changed: %O", hookId, stateKeys, {
                    state,
                    initialSearchParams,
                    queuedQueries,
                    queryRef: queryRef.current,
                    stateRef: stateRef.current
                });
                stateRef.current = state;
                setInternalState(state);
            }
        }
    }["useQueryStates.useEffect"], [
        Object.values(resolvedUrlKeys).map({
            "useQueryStates.useEffect": (key)=>`${key}=${initialSearchParams?.getAll(key)}`
        }["useQueryStates.useEffect"]).join("&"),
        JSON.stringify(queuedQueries)
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useQueryStates.useEffect": ()=>{
            const handlers = Object.keys(keyMap).reduce({
                "useQueryStates.useEffect.handlers": (handlers$1, stateKey)=>{
                    handlers$1[stateKey] = ({
                        "useQueryStates.useEffect.handlers": ({ state, query })=>{
                            setInternalState({
                                "useQueryStates.useEffect.handlers": (currentState)=>{
                                    const { defaultValue } = keyMap[stateKey];
                                    const urlKey = resolvedUrlKeys[stateKey];
                                    const nextValue = state ?? defaultValue ?? null;
                                    const currentValue = currentState[stateKey] ?? defaultValue ?? null;
                                    if (Object.is(currentValue, nextValue)) {
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$nuqs$40$2$2e$8$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_$5f$react_odpkywasxd6ly4zy7jkuhlwj5a$2f$node_modules$2f$nuqs$2f$dist$2f$context$2d$DRdo5A2P$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])("[nuq+ %s `%s`] Cross-hook key sync %s: %O (default: %O). no change, skipping, resolved: %O", hookId, stateKeys, urlKey, state, defaultValue, stateRef.current);
                                        return currentState;
                                    }
                                    stateRef.current = {
                                        ...stateRef.current,
                                        [stateKey]: nextValue
                                    };
                                    queryRef.current[urlKey] = query;
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$nuqs$40$2$2e$8$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_$5f$react_odpkywasxd6ly4zy7jkuhlwj5a$2f$node_modules$2f$nuqs$2f$dist$2f$context$2d$DRdo5A2P$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])("[nuq+ %s `%s`] Cross-hook key sync %s: %O (default: %O). updateInternalState, resolved: %O", hookId, stateKeys, urlKey, state, defaultValue, stateRef.current);
                                    return stateRef.current;
                                }
                            }["useQueryStates.useEffect.handlers"]);
                        }
                    })["useQueryStates.useEffect.handlers"];
                    return handlers$1;
                }
            }["useQueryStates.useEffect.handlers"], {});
            for (const stateKey of Object.keys(keyMap)){
                const urlKey = resolvedUrlKeys[stateKey];
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$nuqs$40$2$2e$8$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_$5f$react_odpkywasxd6ly4zy7jkuhlwj5a$2f$node_modules$2f$nuqs$2f$dist$2f$context$2d$DRdo5A2P$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])("[nuq+ %s `%s`] Subscribing to sync for `%s`", hookId, urlKey, stateKeys);
                emitter.on(urlKey, handlers[stateKey]);
            }
            return ({
                "useQueryStates.useEffect": ()=>{
                    for (const stateKey of Object.keys(keyMap)){
                        const urlKey = resolvedUrlKeys[stateKey];
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$nuqs$40$2$2e$8$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_$5f$react_odpkywasxd6ly4zy7jkuhlwj5a$2f$node_modules$2f$nuqs$2f$dist$2f$context$2d$DRdo5A2P$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])("[nuq+ %s `%s`] Unsubscribing to sync for `%s`", hookId, urlKey, stateKeys);
                        emitter.off(urlKey, handlers[stateKey]);
                    }
                }
            })["useQueryStates.useEffect"];
        }
    }["useQueryStates.useEffect"], [
        stateKeys,
        resolvedUrlKeys
    ]);
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useQueryStates.useCallback[update]": (stateUpdater, callOptions = {})=>{
            const nullMap = Object.fromEntries(Object.keys(keyMap).map({
                "useQueryStates.useCallback[update].nullMap": (key)=>[
                        key,
                        null
                    ]
            }["useQueryStates.useCallback[update].nullMap"]));
            const newState = typeof stateUpdater === "function" ? stateUpdater(applyDefaultValues(stateRef.current, defaultValues)) ?? nullMap : stateUpdater ?? nullMap;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$nuqs$40$2$2e$8$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_$5f$react_odpkywasxd6ly4zy7jkuhlwj5a$2f$node_modules$2f$nuqs$2f$dist$2f$context$2d$DRdo5A2P$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])("[nuq+ %s `%s`] setState: %O", hookId, stateKeys, newState);
            let returnedPromise = void 0;
            let maxDebounceTime = 0;
            let doFlush = false;
            const debounceAborts = [];
            for (let [stateKey, value] of Object.entries(newState)){
                const parser = keyMap[stateKey];
                const urlKey = resolvedUrlKeys[stateKey];
                if (!parser || value === void 0) continue;
                if ((callOptions.clearOnDefault ?? parser.clearOnDefault ?? clearOnDefault) && value !== null && parser.defaultValue !== void 0 && (parser.eq ?? ({
                    "useQueryStates.useCallback[update]": (a, b)=>a === b
                })["useQueryStates.useCallback[update]"])(value, parser.defaultValue)) value = null;
                const query = value === null ? null : (parser.serialize ?? String)(value);
                emitter.emit(urlKey, {
                    state: value,
                    query
                });
                const update$1 = {
                    key: urlKey,
                    query,
                    options: {
                        history: callOptions.history ?? parser.history ?? history,
                        shallow: callOptions.shallow ?? parser.shallow ?? shallow,
                        scroll: callOptions.scroll ?? parser.scroll ?? scroll,
                        startTransition: callOptions.startTransition ?? parser.startTransition ?? startTransition$1
                    }
                };
                if (callOptions?.limitUrlUpdates?.method === "debounce" || limitUrlUpdates?.method === "debounce" || parser.limitUrlUpdates?.method === "debounce") {
                    if (update$1.options.shallow === true) console.warn((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$nuqs$40$2$2e$8$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_$5f$react_odpkywasxd6ly4zy7jkuhlwj5a$2f$node_modules$2f$nuqs$2f$dist$2f$context$2d$DRdo5A2P$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["s"])(422));
                    const timeMs = callOptions?.limitUrlUpdates?.timeMs ?? limitUrlUpdates?.timeMs ?? parser.limitUrlUpdates?.timeMs ?? __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$nuqs$40$2$2e$8$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_$5f$react_odpkywasxd6ly4zy7jkuhlwj5a$2f$node_modules$2f$nuqs$2f$dist$2f$debounce$2d$BI0MC054$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["s"].timeMs;
                    const debouncedPromise = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$nuqs$40$2$2e$8$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_$5f$react_odpkywasxd6ly4zy7jkuhlwj5a$2f$node_modules$2f$nuqs$2f$dist$2f$debounce$2d$BI0MC054$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].push(update$1, timeMs, adapter, processUrlSearchParams);
                    if (maxDebounceTime < timeMs) {
                        returnedPromise = debouncedPromise;
                        maxDebounceTime = timeMs;
                    }
                } else {
                    const timeMs = callOptions?.limitUrlUpdates?.timeMs ?? parser?.limitUrlUpdates?.timeMs ?? limitUrlUpdates?.timeMs ?? callOptions.throttleMs ?? parser.throttleMs ?? throttleMs;
                    debounceAborts.push(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$nuqs$40$2$2e$8$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_$5f$react_odpkywasxd6ly4zy7jkuhlwj5a$2f$node_modules$2f$nuqs$2f$dist$2f$debounce$2d$BI0MC054$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"].abort(urlKey));
                    __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$nuqs$40$2$2e$8$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_$5f$react_odpkywasxd6ly4zy7jkuhlwj5a$2f$node_modules$2f$nuqs$2f$dist$2f$debounce$2d$BI0MC054$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["n"].push(update$1, timeMs);
                    doFlush = true;
                }
            }
            const globalPromise = debounceAborts.reduce({
                "useQueryStates.useCallback[update].globalPromise": (previous, fn)=>fn(previous)
            }["useQueryStates.useCallback[update].globalPromise"], doFlush ? __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$nuqs$40$2$2e$8$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_$5f$react_odpkywasxd6ly4zy7jkuhlwj5a$2f$node_modules$2f$nuqs$2f$dist$2f$debounce$2d$BI0MC054$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["n"].flush(adapter, processUrlSearchParams) : __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$nuqs$40$2$2e$8$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_$5f$react_odpkywasxd6ly4zy7jkuhlwj5a$2f$node_modules$2f$nuqs$2f$dist$2f$debounce$2d$BI0MC054$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["n"].getPendingPromise(adapter));
            return returnedPromise ?? globalPromise;
        }
    }["useQueryStates.useCallback[update]"], [
        stateKeys,
        history,
        shallow,
        scroll,
        throttleMs,
        limitUrlUpdates?.method,
        limitUrlUpdates?.timeMs,
        startTransition$1,
        resolvedUrlKeys,
        adapter.updateUrl,
        adapter.getSearchParamsSnapshot,
        adapter.rateLimitFactor,
        processUrlSearchParams,
        defaultValues
    ]);
    return [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
            "useQueryStates.useMemo": ()=>applyDefaultValues(internalState, defaultValues)
        }["useQueryStates.useMemo"], [
            internalState,
            defaultValues
        ]),
        update
    ];
}
function parseMap(keyMap, urlKeys, searchParams, queuedQueries, cachedQuery, cachedState) {
    let hasChanged = false;
    const state = Object.entries(keyMap).reduce((out, [stateKey, parser])=>{
        const urlKey = urlKeys?.[stateKey] ?? stateKey;
        const queuedQuery = queuedQueries[urlKey];
        const fallbackValue = parser.type === "multi" ? [] : null;
        const query = queuedQuery === void 0 ? (parser.type === "multi" ? searchParams?.getAll(urlKey) : searchParams?.get(urlKey)) ?? fallbackValue : queuedQuery;
        if (cachedQuery && cachedState && (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$nuqs$40$2$2e$8$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_$5f$react_odpkywasxd6ly4zy7jkuhlwj5a$2f$node_modules$2f$nuqs$2f$dist$2f$compare$2d$Br3z3FUS$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["t"])(cachedQuery[urlKey] ?? fallbackValue, query)) {
            out[stateKey] = cachedState[stateKey] ?? null;
            return out;
        }
        hasChanged = true;
        out[stateKey] = ((0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$nuqs$40$2$2e$8$2e$5_next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3_$5f$react_odpkywasxd6ly4zy7jkuhlwj5a$2f$node_modules$2f$nuqs$2f$dist$2f$debounce$2d$BI0MC054$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["i"])(query) ? null : safeParse(parser.parse, query, urlKey)) ?? null;
        if (cachedQuery) cachedQuery[urlKey] = query;
        return out;
    }, {});
    if (!hasChanged) {
        const keyMapKeys = Object.keys(keyMap);
        const cachedStateKeys = Object.keys(cachedState ?? {});
        hasChanged = keyMapKeys.length !== cachedStateKeys.length || keyMapKeys.some((key)=>!cachedStateKeys.includes(key));
    }
    return {
        state,
        hasChanged
    };
}
function applyDefaultValues(state, defaults) {
    return Object.fromEntries(Object.keys(state).map((key)=>[
            key,
            state[key] ?? defaults[key] ?? null
        ]));
}
//#endregion
//#region src/useQueryState.ts
/**
* React state hook synchronized with a URL query string in Next.js
*
* If used without a `defaultValue` supplied in the options, and the query is
* missing in the URL, the state will be `null`.
*
* ### Behaviour with default values:
*
* _Note: the URL will **not** be updated with the default value if the query
* is missing._
*
* Setting the value to `null` will clear the query in the URL, and return
* the default value as state.
*
* Example usage:
* ```ts
*   // Blog posts filtering by tag
*   const [tag, selectTag] = useQueryState('tag')
*   const filteredPosts = posts.filter(post => tag ? post.tag === tag : true)
*   const clearTag = () => selectTag(null)
*
*   // With default values
*
*   const [count, setCount] = useQueryState(
*     'count',
*     parseAsInteger.defaultValue(0)
*   )
*
*   const increment = () => setCount(oldCount => oldCount + 1)
*   const decrement = () => setCount(oldCount => oldCount - 1)
*   const clearCountQuery = () => setCount(null)
*
*   // --
*
*   const [date, setDate] = useQueryState(
*     'date',
*     parseAsIsoDateTime.withDefault(new Date('2021-01-01'))
*   )
*
*   const setToNow = () => setDate(new Date())
*   const addOneHour = () => {
*     setDate(oldDate => new Date(oldDate.valueOf() + 3600_000))
*   }
* ```
* @param key The URL query string key to bind to
* @param options - Parser (defines the state data type), optional default value and history mode.
*/ function useQueryState(key, options = {}) {
    const { parse, type, serialize, eq, defaultValue, ...hookOptions } = options;
    const [{ [key]: state }, setState] = useQueryStates({
        [key]: {
            parse: parse ?? ({
                "useQueryState.useQueryStates": (x)=>x
            })["useQueryState.useQueryStates"],
            type,
            serialize,
            eq,
            defaultValue
        }
    }, hookOptions);
    return [
        state,
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
            "useQueryState.useCallback": (stateUpdater, callOptions = {})=>setState({
                    "useQueryState.useCallback": (old)=>({
                            [key]: typeof stateUpdater === "function" ? stateUpdater(old[key]) : stateUpdater
                        })
                }["useQueryState.useCallback"], callOptions)
        }["useQueryState.useCallback"], [
            key,
            setState
        ])
    ];
}
;
 //# sourceMappingURL=index.js.map
}),
"[project]/Downloads/getLoaded/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// This file must be bundled in the app's client layer, it shouldn't be directly
// imported by the server.
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    callServer: null,
    createServerReference: null,
    findSourceMapURL: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    callServer: function() {
        return _appcallserver.callServer;
    },
    createServerReference: function() {
        return _client.createServerReference;
    },
    findSourceMapURL: function() {
        return _appfindsourcemapurl.findSourceMapURL;
    }
});
const _appcallserver = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/client/app-call-server.js [app-client] (ecmascript)");
const _appfindsourcemapurl = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/client/app-find-source-map-url.js [app-client] (ecmascript)");
const _client = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/react-server-dom-turbopack/client.js [app-client] (ecmascript)"); //# sourceMappingURL=action-client-wrapper.js.map
}),
]);

//# sourceMappingURL=0901d__pnpm_2cc4a79a._.js.map