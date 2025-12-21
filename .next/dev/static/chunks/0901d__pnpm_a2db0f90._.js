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
"[project]/Downloads/getLoaded/node_modules/.pnpm/@prisma+client-runtime-utils@7.2.0/node_modules/@prisma/client-runtime-utils/dist/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames(from))if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ()=>from[key],
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toCommonJS = (mod2)=>__copyProps(__defProp({}, "__esModule", {
        value: true
    }), mod2);
// src/index.ts
var index_exports = {};
__export(index_exports, {
    AnyNull: ()=>AnyNull,
    AnyNullClass: ()=>AnyNullClass,
    DbNull: ()=>DbNull,
    DbNullClass: ()=>DbNullClass,
    Decimal: ()=>Decimal,
    JsonNull: ()=>JsonNull,
    JsonNullClass: ()=>JsonNullClass,
    NullTypes: ()=>NullTypes,
    ObjectEnumValue: ()=>ObjectEnumValue,
    PrismaClientInitializationError: ()=>PrismaClientInitializationError,
    PrismaClientKnownRequestError: ()=>PrismaClientKnownRequestError,
    PrismaClientRustError: ()=>PrismaClientRustError,
    PrismaClientRustPanicError: ()=>PrismaClientRustPanicError,
    PrismaClientUnknownRequestError: ()=>PrismaClientUnknownRequestError,
    PrismaClientValidationError: ()=>PrismaClientValidationError,
    Sql: ()=>Sql,
    empty: ()=>empty,
    hasBatchIndex: ()=>hasBatchIndex,
    isAnyNull: ()=>isAnyNull,
    isDbNull: ()=>isDbNull,
    isJsonNull: ()=>isJsonNull,
    join: ()=>join,
    raw: ()=>raw,
    sql: ()=>sql
});
module.exports = __toCommonJS(index_exports);
// src/errors/ErrorWithBatchIndex.ts
function hasBatchIndex(value) {
    return typeof value["batchRequestIdx"] === "number";
}
// src/errors/setClassName.ts
function setClassName(classObject, name) {
    Object.defineProperty(classObject, "name", {
        value: name,
        configurable: true
    });
}
// src/errors/PrismaClientInitializationError.ts
var PrismaClientInitializationError = class _PrismaClientInitializationError extends Error {
    clientVersion;
    errorCode;
    retryable;
    constructor(message, clientVersion, errorCode){
        super(message);
        this.name = "PrismaClientInitializationError";
        this.clientVersion = clientVersion;
        this.errorCode = errorCode;
        Error.captureStackTrace(_PrismaClientInitializationError);
    }
    get [Symbol.toStringTag]() {
        return "PrismaClientInitializationError";
    }
};
setClassName(PrismaClientInitializationError, "PrismaClientInitializationError");
// src/errors/PrismaClientKnownRequestError.ts
var PrismaClientKnownRequestError = class extends Error {
    code;
    meta;
    clientVersion;
    batchRequestIdx;
    constructor(message, { code, clientVersion, meta, batchRequestIdx }){
        super(message);
        this.name = "PrismaClientKnownRequestError";
        this.code = code;
        this.clientVersion = clientVersion;
        this.meta = meta;
        Object.defineProperty(this, "batchRequestIdx", {
            value: batchRequestIdx,
            enumerable: false,
            writable: true
        });
    }
    get [Symbol.toStringTag]() {
        return "PrismaClientKnownRequestError";
    }
};
setClassName(PrismaClientKnownRequestError, "PrismaClientKnownRequestError");
// src/errors/log.ts
function getBacktrace(log3) {
    if (log3.fields?.message) {
        let str = log3.fields?.message;
        if (log3.fields?.file) {
            str += ` in ${log3.fields.file}`;
            if (log3.fields?.line) {
                str += `:${log3.fields.line}`;
            }
            if (log3.fields?.column) {
                str += `:${log3.fields.column}`;
            }
        }
        if (log3.fields?.reason) {
            str += `
${log3.fields?.reason}`;
        }
        return str;
    }
    return "Unknown error";
}
function isPanic(err) {
    return err.fields?.message === "PANIC";
}
// src/errors/PrismaClientRustError.ts
var PrismaClientRustError = class extends Error {
    clientVersion;
    _isPanic;
    constructor({ clientVersion, error }){
        const backtrace = getBacktrace(error);
        super(backtrace ?? "Unknown error");
        this._isPanic = isPanic(error);
        this.clientVersion = clientVersion;
    }
    get [Symbol.toStringTag]() {
        return "PrismaClientRustError";
    }
    isPanic() {
        return this._isPanic;
    }
};
setClassName(PrismaClientRustError, "PrismaClientRustError");
// src/errors/PrismaClientRustPanicError.ts
var PrismaClientRustPanicError = class extends Error {
    clientVersion;
    constructor(message, clientVersion){
        super(message);
        this.name = "PrismaClientRustPanicError";
        this.clientVersion = clientVersion;
    }
    get [Symbol.toStringTag]() {
        return "PrismaClientRustPanicError";
    }
};
setClassName(PrismaClientRustPanicError, "PrismaClientRustPanicError");
// src/errors/PrismaClientUnknownRequestError.ts
var PrismaClientUnknownRequestError = class extends Error {
    clientVersion;
    batchRequestIdx;
    constructor(message, { clientVersion, batchRequestIdx }){
        super(message);
        this.name = "PrismaClientUnknownRequestError";
        this.clientVersion = clientVersion;
        Object.defineProperty(this, "batchRequestIdx", {
            value: batchRequestIdx,
            writable: true,
            enumerable: false
        });
    }
    get [Symbol.toStringTag]() {
        return "PrismaClientUnknownRequestError";
    }
};
setClassName(PrismaClientUnknownRequestError, "PrismaClientUnknownRequestError");
// src/errors/PrismaClientValidationError.ts
var PrismaClientValidationError = class extends Error {
    name = "PrismaClientValidationError";
    clientVersion;
    constructor(message, { clientVersion }){
        super(message);
        this.clientVersion = clientVersion;
    }
    get [Symbol.toStringTag]() {
        return "PrismaClientValidationError";
    }
};
setClassName(PrismaClientValidationError, "PrismaClientValidationError");
// src/nullTypes.ts
var secret = Symbol();
var representations = /* @__PURE__ */ new WeakMap();
var ObjectEnumValue = class {
    constructor(arg){
        if (arg === secret) {
            representations.set(this, `Prisma.${this._getName()}`);
        } else {
            representations.set(this, `new Prisma.${this._getNamespace()}.${this._getName()}()`);
        }
    }
    _getName() {
        return this.constructor.name;
    }
    toString() {
        return representations.get(this);
    }
};
function setClassName2(classObject, name) {
    Object.defineProperty(classObject, "name", {
        value: name,
        configurable: true
    });
}
var NullTypesEnumValue = class extends ObjectEnumValue {
    _getNamespace() {
        return "NullTypes";
    }
};
var DbNullClass = class extends NullTypesEnumValue {
    // Phantom private property to prevent structural type equality
    // eslint-disable-next-line no-unused-private-class-members
    #_brand_DbNull;
};
setClassName2(DbNullClass, "DbNull");
var JsonNullClass = class extends NullTypesEnumValue {
    // Phantom private property to prevent structural type equality
    // eslint-disable-next-line no-unused-private-class-members
    #_brand_JsonNull;
};
setClassName2(JsonNullClass, "JsonNull");
var AnyNullClass = class extends NullTypesEnumValue {
    // Phantom private property to prevent structural type equality
    // eslint-disable-next-line no-unused-private-class-members
    #_brand_AnyNull;
};
setClassName2(AnyNullClass, "AnyNull");
var NullTypes = {
    DbNull: DbNullClass,
    JsonNull: JsonNullClass,
    AnyNull: AnyNullClass
};
var DbNull = new DbNullClass(secret);
var JsonNull = new JsonNullClass(secret);
var AnyNull = new AnyNullClass(secret);
function isDbNull(value) {
    return value === DbNull;
}
function isJsonNull(value) {
    return value === JsonNull;
}
function isAnyNull(value) {
    return value === AnyNull;
}
// ../../node_modules/.pnpm/decimal.js@10.5.0/node_modules/decimal.js/decimal.mjs
var EXP_LIMIT = 9e15;
var MAX_DIGITS = 1e9;
var NUMERALS = "0123456789abcdef";
var LN10 = "2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058";
var PI = "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789";
var DEFAULTS = {
    // These values must be integers within the stated ranges (inclusive).
    // Most of these values can be changed at run-time using the `Decimal.config` method.
    // The maximum number of significant digits of the result of a calculation or base conversion.
    // E.g. `Decimal.config({ precision: 20 });`
    precision: 20,
    // 1 to MAX_DIGITS
    // The rounding mode used when rounding to `precision`.
    //
    // ROUND_UP         0 Away from zero.
    // ROUND_DOWN       1 Towards zero.
    // ROUND_CEIL       2 Towards +Infinity.
    // ROUND_FLOOR      3 Towards -Infinity.
    // ROUND_HALF_UP    4 Towards nearest neighbour. If equidistant, up.
    // ROUND_HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
    // ROUND_HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
    // ROUND_HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
    // ROUND_HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
    //
    // E.g.
    // `Decimal.rounding = 4;`
    // `Decimal.rounding = Decimal.ROUND_HALF_UP;`
    rounding: 4,
    // 0 to 8
    // The modulo mode used when calculating the modulus: a mod n.
    // The quotient (q = a / n) is calculated according to the corresponding rounding mode.
    // The remainder (r) is calculated as: r = a - n * q.
    //
    // UP         0 The remainder is positive if the dividend is negative, else is negative.
    // DOWN       1 The remainder has the same sign as the dividend (JavaScript %).
    // FLOOR      3 The remainder has the same sign as the divisor (Python %).
    // HALF_EVEN  6 The IEEE 754 remainder function.
    // EUCLID     9 Euclidian division. q = sign(n) * floor(a / abs(n)). Always positive.
    //
    // Truncated division (1), floored division (3), the IEEE 754 remainder (6), and Euclidian
    // division (9) are commonly used for the modulus operation. The other rounding modes can also
    // be used, but they may not give useful results.
    modulo: 1,
    // 0 to 9
    // The exponent value at and beneath which `toString` returns exponential notation.
    // JavaScript numbers: -7
    toExpNeg: -7,
    // 0 to -EXP_LIMIT
    // The exponent value at and above which `toString` returns exponential notation.
    // JavaScript numbers: 21
    toExpPos: 21,
    // 0 to EXP_LIMIT
    // The minimum exponent value, beneath which underflow to zero occurs.
    // JavaScript numbers: -324  (5e-324)
    minE: -EXP_LIMIT,
    // -1 to -EXP_LIMIT
    // The maximum exponent value, above which overflow to Infinity occurs.
    // JavaScript numbers: 308  (1.7976931348623157e+308)
    maxE: EXP_LIMIT,
    // 1 to EXP_LIMIT
    // Whether to use cryptographically-secure random number generation, if available.
    crypto: false
};
var inexact;
var quadrant;
var external = true;
var decimalError = "[DecimalError] ";
var invalidArgument = decimalError + "Invalid argument: ";
var precisionLimitExceeded = decimalError + "Precision limit exceeded";
var cryptoUnavailable = decimalError + "crypto unavailable";
var tag = "[object Decimal]";
var mathfloor = Math.floor;
var mathpow = Math.pow;
var isBinary = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i;
var isHex = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i;
var isOctal = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i;
var isDecimal = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
var BASE = 1e7;
var LOG_BASE = 7;
var MAX_SAFE_INTEGER = 9007199254740991;
var LN10_PRECISION = LN10.length - 1;
var PI_PRECISION = PI.length - 1;
var P = {
    toStringTag: tag
};
P.absoluteValue = P.abs = function() {
    var x = new this.constructor(this);
    if (x.s < 0) x.s = 1;
    return finalise(x);
};
P.ceil = function() {
    return finalise(new this.constructor(this), this.e + 1, 2);
};
P.clampedTo = P.clamp = function(min2, max2) {
    var k, x = this, Ctor = x.constructor;
    min2 = new Ctor(min2);
    max2 = new Ctor(max2);
    if (!min2.s || !max2.s) return new Ctor(NaN);
    if (min2.gt(max2)) throw Error(invalidArgument + max2);
    k = x.cmp(min2);
    return k < 0 ? min2 : x.cmp(max2) > 0 ? max2 : new Ctor(x);
};
P.comparedTo = P.cmp = function(y) {
    var i, j, xdL, ydL, x = this, xd = x.d, yd = (y = new x.constructor(y)).d, xs = x.s, ys = y.s;
    if (!xd || !yd) {
        return !xs || !ys ? NaN : xs !== ys ? xs : xd === yd ? 0 : !xd ^ xs < 0 ? 1 : -1;
    }
    if (!xd[0] || !yd[0]) return xd[0] ? xs : yd[0] ? -ys : 0;
    if (xs !== ys) return xs;
    if (x.e !== y.e) return x.e > y.e ^ xs < 0 ? 1 : -1;
    xdL = xd.length;
    ydL = yd.length;
    for(i = 0, j = xdL < ydL ? xdL : ydL; i < j; ++i){
        if (xd[i] !== yd[i]) return xd[i] > yd[i] ^ xs < 0 ? 1 : -1;
    }
    return xdL === ydL ? 0 : xdL > ydL ^ xs < 0 ? 1 : -1;
};
P.cosine = P.cos = function() {
    var pr, rm, x = this, Ctor = x.constructor;
    if (!x.d) return new Ctor(NaN);
    if (!x.d[0]) return new Ctor(1);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(x.e, x.sd()) + LOG_BASE;
    Ctor.rounding = 1;
    x = cosine(Ctor, toLessThanHalfPi(Ctor, x));
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return finalise(quadrant == 2 || quadrant == 3 ? x.neg() : x, pr, rm, true);
};
P.cubeRoot = P.cbrt = function() {
    var e, m, n, r, rep, s, sd, t, t3, t3plusx, x = this, Ctor = x.constructor;
    if (!x.isFinite() || x.isZero()) return new Ctor(x);
    external = false;
    s = x.s * mathpow(x.s * x, 1 / 3);
    if (!s || Math.abs(s) == 1 / 0) {
        n = digitsToString(x.d);
        e = x.e;
        if (s = (e - n.length + 1) % 3) n += s == 1 || s == -2 ? "0" : "00";
        s = mathpow(n, 1 / 3);
        e = mathfloor((e + 1) / 3) - (e % 3 == (e < 0 ? -1 : 2));
        if (s == 1 / 0) {
            n = "5e" + e;
        } else {
            n = s.toExponential();
            n = n.slice(0, n.indexOf("e") + 1) + e;
        }
        r = new Ctor(n);
        r.s = x.s;
    } else {
        r = new Ctor(s.toString());
    }
    sd = (e = Ctor.precision) + 3;
    for(;;){
        t = r;
        t3 = t.times(t).times(t);
        t3plusx = t3.plus(x);
        r = divide(t3plusx.plus(x).times(t), t3plusx.plus(t3), sd + 2, 1);
        if (digitsToString(t.d).slice(0, sd) === (n = digitsToString(r.d)).slice(0, sd)) {
            n = n.slice(sd - 3, sd + 1);
            if (n == "9999" || !rep && n == "4999") {
                if (!rep) {
                    finalise(t, e + 1, 0);
                    if (t.times(t).times(t).eq(x)) {
                        r = t;
                        break;
                    }
                }
                sd += 4;
                rep = 1;
            } else {
                if (!+n || !+n.slice(1) && n.charAt(0) == "5") {
                    finalise(r, e + 1, 1);
                    m = !r.times(r).times(r).eq(x);
                }
                break;
            }
        }
    }
    external = true;
    return finalise(r, e, Ctor.rounding, m);
};
P.decimalPlaces = P.dp = function() {
    var w, d = this.d, n = NaN;
    if (d) {
        w = d.length - 1;
        n = (w - mathfloor(this.e / LOG_BASE)) * LOG_BASE;
        w = d[w];
        if (w) for(; w % 10 == 0; w /= 10)n--;
        if (n < 0) n = 0;
    }
    return n;
};
P.dividedBy = P.div = function(y) {
    return divide(this, new this.constructor(y));
};
P.dividedToIntegerBy = P.divToInt = function(y) {
    var x = this, Ctor = x.constructor;
    return finalise(divide(x, new Ctor(y), 0, 1, 1), Ctor.precision, Ctor.rounding);
};
P.equals = P.eq = function(y) {
    return this.cmp(y) === 0;
};
P.floor = function() {
    return finalise(new this.constructor(this), this.e + 1, 3);
};
P.greaterThan = P.gt = function(y) {
    return this.cmp(y) > 0;
};
P.greaterThanOrEqualTo = P.gte = function(y) {
    var k = this.cmp(y);
    return k == 1 || k === 0;
};
P.hyperbolicCosine = P.cosh = function() {
    var k, n, pr, rm, len, x = this, Ctor = x.constructor, one = new Ctor(1);
    if (!x.isFinite()) return new Ctor(x.s ? 1 / 0 : NaN);
    if (x.isZero()) return one;
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
    Ctor.rounding = 1;
    len = x.d.length;
    if (len < 32) {
        k = Math.ceil(len / 3);
        n = (1 / tinyPow(4, k)).toString();
    } else {
        k = 16;
        n = "2.3283064365386962890625e-10";
    }
    x = taylorSeries(Ctor, 1, x.times(n), new Ctor(1), true);
    var cosh2_x, i = k, d8 = new Ctor(8);
    for(; i--;){
        cosh2_x = x.times(x);
        x = one.minus(cosh2_x.times(d8.minus(cosh2_x.times(d8))));
    }
    return finalise(x, Ctor.precision = pr, Ctor.rounding = rm, true);
};
P.hyperbolicSine = P.sinh = function() {
    var k, pr, rm, len, x = this, Ctor = x.constructor;
    if (!x.isFinite() || x.isZero()) return new Ctor(x);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
    Ctor.rounding = 1;
    len = x.d.length;
    if (len < 3) {
        x = taylorSeries(Ctor, 2, x, x, true);
    } else {
        k = 1.4 * Math.sqrt(len);
        k = k > 16 ? 16 : k | 0;
        x = x.times(1 / tinyPow(5, k));
        x = taylorSeries(Ctor, 2, x, x, true);
        var sinh2_x, d5 = new Ctor(5), d16 = new Ctor(16), d20 = new Ctor(20);
        for(; k--;){
            sinh2_x = x.times(x);
            x = x.times(d5.plus(sinh2_x.times(d16.times(sinh2_x).plus(d20))));
        }
    }
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return finalise(x, pr, rm, true);
};
P.hyperbolicTangent = P.tanh = function() {
    var pr, rm, x = this, Ctor = x.constructor;
    if (!x.isFinite()) return new Ctor(x.s);
    if (x.isZero()) return new Ctor(x);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + 7;
    Ctor.rounding = 1;
    return divide(x.sinh(), x.cosh(), Ctor.precision = pr, Ctor.rounding = rm);
};
P.inverseCosine = P.acos = function() {
    var x = this, Ctor = x.constructor, k = x.abs().cmp(1), pr = Ctor.precision, rm = Ctor.rounding;
    if (k !== -1) {
        return k === 0 ? x.isNeg() ? getPi(Ctor, pr, rm) : new Ctor(0) : new Ctor(NaN);
    }
    if (x.isZero()) return getPi(Ctor, pr + 4, rm).times(0.5);
    Ctor.precision = pr + 6;
    Ctor.rounding = 1;
    x = new Ctor(1).minus(x).div(x.plus(1)).sqrt().atan();
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return x.times(2);
};
P.inverseHyperbolicCosine = P.acosh = function() {
    var pr, rm, x = this, Ctor = x.constructor;
    if (x.lte(1)) return new Ctor(x.eq(1) ? 0 : NaN);
    if (!x.isFinite()) return new Ctor(x);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(Math.abs(x.e), x.sd()) + 4;
    Ctor.rounding = 1;
    external = false;
    x = x.times(x).minus(1).sqrt().plus(x);
    external = true;
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return x.ln();
};
P.inverseHyperbolicSine = P.asinh = function() {
    var pr, rm, x = this, Ctor = x.constructor;
    if (!x.isFinite() || x.isZero()) return new Ctor(x);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + 2 * Math.max(Math.abs(x.e), x.sd()) + 6;
    Ctor.rounding = 1;
    external = false;
    x = x.times(x).plus(1).sqrt().plus(x);
    external = true;
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return x.ln();
};
P.inverseHyperbolicTangent = P.atanh = function() {
    var pr, rm, wpr, xsd, x = this, Ctor = x.constructor;
    if (!x.isFinite()) return new Ctor(NaN);
    if (x.e >= 0) return new Ctor(x.abs().eq(1) ? x.s / 0 : x.isZero() ? x : NaN);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    xsd = x.sd();
    if (Math.max(xsd, pr) < 2 * -x.e - 1) return finalise(new Ctor(x), pr, rm, true);
    Ctor.precision = wpr = xsd - x.e;
    x = divide(x.plus(1), new Ctor(1).minus(x), wpr + pr, 1);
    Ctor.precision = pr + 4;
    Ctor.rounding = 1;
    x = x.ln();
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return x.times(0.5);
};
P.inverseSine = P.asin = function() {
    var halfPi, k, pr, rm, x = this, Ctor = x.constructor;
    if (x.isZero()) return new Ctor(x);
    k = x.abs().cmp(1);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    if (k !== -1) {
        if (k === 0) {
            halfPi = getPi(Ctor, pr + 4, rm).times(0.5);
            halfPi.s = x.s;
            return halfPi;
        }
        return new Ctor(NaN);
    }
    Ctor.precision = pr + 6;
    Ctor.rounding = 1;
    x = x.div(new Ctor(1).minus(x.times(x)).sqrt().plus(1)).atan();
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return x.times(2);
};
P.inverseTangent = P.atan = function() {
    var i, j, k, n, px, t, r, wpr, x2, x = this, Ctor = x.constructor, pr = Ctor.precision, rm = Ctor.rounding;
    if (!x.isFinite()) {
        if (!x.s) return new Ctor(NaN);
        if (pr + 4 <= PI_PRECISION) {
            r = getPi(Ctor, pr + 4, rm).times(0.5);
            r.s = x.s;
            return r;
        }
    } else if (x.isZero()) {
        return new Ctor(x);
    } else if (x.abs().eq(1) && pr + 4 <= PI_PRECISION) {
        r = getPi(Ctor, pr + 4, rm).times(0.25);
        r.s = x.s;
        return r;
    }
    Ctor.precision = wpr = pr + 10;
    Ctor.rounding = 1;
    k = Math.min(28, wpr / LOG_BASE + 2 | 0);
    for(i = k; i; --i)x = x.div(x.times(x).plus(1).sqrt().plus(1));
    external = false;
    j = Math.ceil(wpr / LOG_BASE);
    n = 1;
    x2 = x.times(x);
    r = new Ctor(x);
    px = x;
    for(; i !== -1;){
        px = px.times(x2);
        t = r.minus(px.div(n += 2));
        px = px.times(x2);
        r = t.plus(px.div(n += 2));
        if (r.d[j] !== void 0) for(i = j; r.d[i] === t.d[i] && i--;);
    }
    if (k) r = r.times(2 << k - 1);
    external = true;
    return finalise(r, Ctor.precision = pr, Ctor.rounding = rm, true);
};
P.isFinite = function() {
    return !!this.d;
};
P.isInteger = P.isInt = function() {
    return !!this.d && mathfloor(this.e / LOG_BASE) > this.d.length - 2;
};
P.isNaN = function() {
    return !this.s;
};
P.isNegative = P.isNeg = function() {
    return this.s < 0;
};
P.isPositive = P.isPos = function() {
    return this.s > 0;
};
P.isZero = function() {
    return !!this.d && this.d[0] === 0;
};
P.lessThan = P.lt = function(y) {
    return this.cmp(y) < 0;
};
P.lessThanOrEqualTo = P.lte = function(y) {
    return this.cmp(y) < 1;
};
P.logarithm = P.log = function(base) {
    var isBase10, d, denominator, k, inf, num, sd, r, arg = this, Ctor = arg.constructor, pr = Ctor.precision, rm = Ctor.rounding, guard = 5;
    if (base == null) {
        base = new Ctor(10);
        isBase10 = true;
    } else {
        base = new Ctor(base);
        d = base.d;
        if (base.s < 0 || !d || !d[0] || base.eq(1)) return new Ctor(NaN);
        isBase10 = base.eq(10);
    }
    d = arg.d;
    if (arg.s < 0 || !d || !d[0] || arg.eq(1)) {
        return new Ctor(d && !d[0] ? -1 / 0 : arg.s != 1 ? NaN : d ? 0 : 1 / 0);
    }
    if (isBase10) {
        if (d.length > 1) {
            inf = true;
        } else {
            for(k = d[0]; k % 10 === 0;)k /= 10;
            inf = k !== 1;
        }
    }
    external = false;
    sd = pr + guard;
    num = naturalLogarithm(arg, sd);
    denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base, sd);
    r = divide(num, denominator, sd, 1);
    if (checkRoundingDigits(r.d, k = pr, rm)) {
        do {
            sd += 10;
            num = naturalLogarithm(arg, sd);
            denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base, sd);
            r = divide(num, denominator, sd, 1);
            if (!inf) {
                if (+digitsToString(r.d).slice(k + 1, k + 15) + 1 == 1e14) {
                    r = finalise(r, pr + 1, 0);
                }
                break;
            }
        }while (checkRoundingDigits(r.d, k += 10, rm))
    }
    external = true;
    return finalise(r, pr, rm);
};
P.minus = P.sub = function(y) {
    var d, e, i, j, k, len, pr, rm, xd, xe, xLTy, yd, x = this, Ctor = x.constructor;
    y = new Ctor(y);
    if (!x.d || !y.d) {
        if (!x.s || !y.s) y = new Ctor(NaN);
        else if (x.d) y.s = -y.s;
        else y = new Ctor(y.d || x.s !== y.s ? x : NaN);
        return y;
    }
    if (x.s != y.s) {
        y.s = -y.s;
        return x.plus(y);
    }
    xd = x.d;
    yd = y.d;
    pr = Ctor.precision;
    rm = Ctor.rounding;
    if (!xd[0] || !yd[0]) {
        if (yd[0]) y.s = -y.s;
        else if (xd[0]) y = new Ctor(x);
        else return new Ctor(rm === 3 ? -0 : 0);
        return external ? finalise(y, pr, rm) : y;
    }
    e = mathfloor(y.e / LOG_BASE);
    xe = mathfloor(x.e / LOG_BASE);
    xd = xd.slice();
    k = xe - e;
    if (k) {
        xLTy = k < 0;
        if (xLTy) {
            d = xd;
            k = -k;
            len = yd.length;
        } else {
            d = yd;
            e = xe;
            len = xd.length;
        }
        i = Math.max(Math.ceil(pr / LOG_BASE), len) + 2;
        if (k > i) {
            k = i;
            d.length = 1;
        }
        d.reverse();
        for(i = k; i--;)d.push(0);
        d.reverse();
    } else {
        i = xd.length;
        len = yd.length;
        xLTy = i < len;
        if (xLTy) len = i;
        for(i = 0; i < len; i++){
            if (xd[i] != yd[i]) {
                xLTy = xd[i] < yd[i];
                break;
            }
        }
        k = 0;
    }
    if (xLTy) {
        d = xd;
        xd = yd;
        yd = d;
        y.s = -y.s;
    }
    len = xd.length;
    for(i = yd.length - len; i > 0; --i)xd[len++] = 0;
    for(i = yd.length; i > k;){
        if (xd[--i] < yd[i]) {
            for(j = i; j && xd[--j] === 0;)xd[j] = BASE - 1;
            --xd[j];
            xd[i] += BASE;
        }
        xd[i] -= yd[i];
    }
    for(; xd[--len] === 0;)xd.pop();
    for(; xd[0] === 0; xd.shift())--e;
    if (!xd[0]) return new Ctor(rm === 3 ? -0 : 0);
    y.d = xd;
    y.e = getBase10Exponent(xd, e);
    return external ? finalise(y, pr, rm) : y;
};
P.modulo = P.mod = function(y) {
    var q, x = this, Ctor = x.constructor;
    y = new Ctor(y);
    if (!x.d || !y.s || y.d && !y.d[0]) return new Ctor(NaN);
    if (!y.d || x.d && !x.d[0]) {
        return finalise(new Ctor(x), Ctor.precision, Ctor.rounding);
    }
    external = false;
    if (Ctor.modulo == 9) {
        q = divide(x, y.abs(), 0, 3, 1);
        q.s *= y.s;
    } else {
        q = divide(x, y, 0, Ctor.modulo, 1);
    }
    q = q.times(y);
    external = true;
    return x.minus(q);
};
P.naturalExponential = P.exp = function() {
    return naturalExponential(this);
};
P.naturalLogarithm = P.ln = function() {
    return naturalLogarithm(this);
};
P.negated = P.neg = function() {
    var x = new this.constructor(this);
    x.s = -x.s;
    return finalise(x);
};
P.plus = P.add = function(y) {
    var carry, d, e, i, k, len, pr, rm, xd, yd, x = this, Ctor = x.constructor;
    y = new Ctor(y);
    if (!x.d || !y.d) {
        if (!x.s || !y.s) y = new Ctor(NaN);
        else if (!x.d) y = new Ctor(y.d || x.s === y.s ? x : NaN);
        return y;
    }
    if (x.s != y.s) {
        y.s = -y.s;
        return x.minus(y);
    }
    xd = x.d;
    yd = y.d;
    pr = Ctor.precision;
    rm = Ctor.rounding;
    if (!xd[0] || !yd[0]) {
        if (!yd[0]) y = new Ctor(x);
        return external ? finalise(y, pr, rm) : y;
    }
    k = mathfloor(x.e / LOG_BASE);
    e = mathfloor(y.e / LOG_BASE);
    xd = xd.slice();
    i = k - e;
    if (i) {
        if (i < 0) {
            d = xd;
            i = -i;
            len = yd.length;
        } else {
            d = yd;
            e = k;
            len = xd.length;
        }
        k = Math.ceil(pr / LOG_BASE);
        len = k > len ? k + 1 : len + 1;
        if (i > len) {
            i = len;
            d.length = 1;
        }
        d.reverse();
        for(; i--;)d.push(0);
        d.reverse();
    }
    len = xd.length;
    i = yd.length;
    if (len - i < 0) {
        i = len;
        d = yd;
        yd = xd;
        xd = d;
    }
    for(carry = 0; i;){
        carry = (xd[--i] = xd[i] + yd[i] + carry) / BASE | 0;
        xd[i] %= BASE;
    }
    if (carry) {
        xd.unshift(carry);
        ++e;
    }
    for(len = xd.length; xd[--len] == 0;)xd.pop();
    y.d = xd;
    y.e = getBase10Exponent(xd, e);
    return external ? finalise(y, pr, rm) : y;
};
P.precision = P.sd = function(z) {
    var k, x = this;
    if (z !== void 0 && z !== !!z && z !== 1 && z !== 0) throw Error(invalidArgument + z);
    if (x.d) {
        k = getPrecision(x.d);
        if (z && x.e + 1 > k) k = x.e + 1;
    } else {
        k = NaN;
    }
    return k;
};
P.round = function() {
    var x = this, Ctor = x.constructor;
    return finalise(new Ctor(x), x.e + 1, Ctor.rounding);
};
P.sine = P.sin = function() {
    var pr, rm, x = this, Ctor = x.constructor;
    if (!x.isFinite()) return new Ctor(NaN);
    if (x.isZero()) return new Ctor(x);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + Math.max(x.e, x.sd()) + LOG_BASE;
    Ctor.rounding = 1;
    x = sine(Ctor, toLessThanHalfPi(Ctor, x));
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return finalise(quadrant > 2 ? x.neg() : x, pr, rm, true);
};
P.squareRoot = P.sqrt = function() {
    var m, n, sd, r, rep, t, x = this, d = x.d, e = x.e, s = x.s, Ctor = x.constructor;
    if (s !== 1 || !d || !d[0]) {
        return new Ctor(!s || s < 0 && (!d || d[0]) ? NaN : d ? x : 1 / 0);
    }
    external = false;
    s = Math.sqrt(+x);
    if (s == 0 || s == 1 / 0) {
        n = digitsToString(d);
        if ((n.length + e) % 2 == 0) n += "0";
        s = Math.sqrt(n);
        e = mathfloor((e + 1) / 2) - (e < 0 || e % 2);
        if (s == 1 / 0) {
            n = "5e" + e;
        } else {
            n = s.toExponential();
            n = n.slice(0, n.indexOf("e") + 1) + e;
        }
        r = new Ctor(n);
    } else {
        r = new Ctor(s.toString());
    }
    sd = (e = Ctor.precision) + 3;
    for(;;){
        t = r;
        r = t.plus(divide(x, t, sd + 2, 1)).times(0.5);
        if (digitsToString(t.d).slice(0, sd) === (n = digitsToString(r.d)).slice(0, sd)) {
            n = n.slice(sd - 3, sd + 1);
            if (n == "9999" || !rep && n == "4999") {
                if (!rep) {
                    finalise(t, e + 1, 0);
                    if (t.times(t).eq(x)) {
                        r = t;
                        break;
                    }
                }
                sd += 4;
                rep = 1;
            } else {
                if (!+n || !+n.slice(1) && n.charAt(0) == "5") {
                    finalise(r, e + 1, 1);
                    m = !r.times(r).eq(x);
                }
                break;
            }
        }
    }
    external = true;
    return finalise(r, e, Ctor.rounding, m);
};
P.tangent = P.tan = function() {
    var pr, rm, x = this, Ctor = x.constructor;
    if (!x.isFinite()) return new Ctor(NaN);
    if (x.isZero()) return new Ctor(x);
    pr = Ctor.precision;
    rm = Ctor.rounding;
    Ctor.precision = pr + 10;
    Ctor.rounding = 1;
    x = x.sin();
    x.s = 1;
    x = divide(x, new Ctor(1).minus(x.times(x)).sqrt(), pr + 10, 0);
    Ctor.precision = pr;
    Ctor.rounding = rm;
    return finalise(quadrant == 2 || quadrant == 4 ? x.neg() : x, pr, rm, true);
};
P.times = P.mul = function(y) {
    var carry, e, i, k, r, rL, t, xdL, ydL, x = this, Ctor = x.constructor, xd = x.d, yd = (y = new Ctor(y)).d;
    y.s *= x.s;
    if (!xd || !xd[0] || !yd || !yd[0]) {
        return new Ctor(!y.s || xd && !xd[0] && !yd || yd && !yd[0] && !xd ? NaN : !xd || !yd ? y.s / 0 : y.s * 0);
    }
    e = mathfloor(x.e / LOG_BASE) + mathfloor(y.e / LOG_BASE);
    xdL = xd.length;
    ydL = yd.length;
    if (xdL < ydL) {
        r = xd;
        xd = yd;
        yd = r;
        rL = xdL;
        xdL = ydL;
        ydL = rL;
    }
    r = [];
    rL = xdL + ydL;
    for(i = rL; i--;)r.push(0);
    for(i = ydL; --i >= 0;){
        carry = 0;
        for(k = xdL + i; k > i;){
            t = r[k] + yd[i] * xd[k - i - 1] + carry;
            r[k--] = t % BASE | 0;
            carry = t / BASE | 0;
        }
        r[k] = (r[k] + carry) % BASE | 0;
    }
    for(; !r[--rL];)r.pop();
    if (carry) ++e;
    else r.shift();
    y.d = r;
    y.e = getBase10Exponent(r, e);
    return external ? finalise(y, Ctor.precision, Ctor.rounding) : y;
};
P.toBinary = function(sd, rm) {
    return toStringBinary(this, 2, sd, rm);
};
P.toDecimalPlaces = P.toDP = function(dp, rm) {
    var x = this, Ctor = x.constructor;
    x = new Ctor(x);
    if (dp === void 0) return x;
    checkInt32(dp, 0, MAX_DIGITS);
    if (rm === void 0) rm = Ctor.rounding;
    else checkInt32(rm, 0, 8);
    return finalise(x, dp + x.e + 1, rm);
};
P.toExponential = function(dp, rm) {
    var str, x = this, Ctor = x.constructor;
    if (dp === void 0) {
        str = finiteToString(x, true);
    } else {
        checkInt32(dp, 0, MAX_DIGITS);
        if (rm === void 0) rm = Ctor.rounding;
        else checkInt32(rm, 0, 8);
        x = finalise(new Ctor(x), dp + 1, rm);
        str = finiteToString(x, true, dp + 1);
    }
    return x.isNeg() && !x.isZero() ? "-" + str : str;
};
P.toFixed = function(dp, rm) {
    var str, y, x = this, Ctor = x.constructor;
    if (dp === void 0) {
        str = finiteToString(x);
    } else {
        checkInt32(dp, 0, MAX_DIGITS);
        if (rm === void 0) rm = Ctor.rounding;
        else checkInt32(rm, 0, 8);
        y = finalise(new Ctor(x), dp + x.e + 1, rm);
        str = finiteToString(y, false, dp + y.e + 1);
    }
    return x.isNeg() && !x.isZero() ? "-" + str : str;
};
P.toFraction = function(maxD) {
    var d, d0, d1, d2, e, k, n, n0, n1, pr, q, r, x = this, xd = x.d, Ctor = x.constructor;
    if (!xd) return new Ctor(x);
    n1 = d0 = new Ctor(1);
    d1 = n0 = new Ctor(0);
    d = new Ctor(d1);
    e = d.e = getPrecision(xd) - x.e - 1;
    k = e % LOG_BASE;
    d.d[0] = mathpow(10, k < 0 ? LOG_BASE + k : k);
    if (maxD == null) {
        maxD = e > 0 ? d : n1;
    } else {
        n = new Ctor(maxD);
        if (!n.isInt() || n.lt(n1)) throw Error(invalidArgument + n);
        maxD = n.gt(d) ? e > 0 ? d : n1 : n;
    }
    external = false;
    n = new Ctor(digitsToString(xd));
    pr = Ctor.precision;
    Ctor.precision = e = xd.length * LOG_BASE * 2;
    for(;;){
        q = divide(n, d, 0, 1, 1);
        d2 = d0.plus(q.times(d1));
        if (d2.cmp(maxD) == 1) break;
        d0 = d1;
        d1 = d2;
        d2 = n1;
        n1 = n0.plus(q.times(d2));
        n0 = d2;
        d2 = d;
        d = n.minus(q.times(d2));
        n = d2;
    }
    d2 = divide(maxD.minus(d0), d1, 0, 1, 1);
    n0 = n0.plus(d2.times(n1));
    d0 = d0.plus(d2.times(d1));
    n0.s = n1.s = x.s;
    r = divide(n1, d1, e, 1).minus(x).abs().cmp(divide(n0, d0, e, 1).minus(x).abs()) < 1 ? [
        n1,
        d1
    ] : [
        n0,
        d0
    ];
    Ctor.precision = pr;
    external = true;
    return r;
};
P.toHexadecimal = P.toHex = function(sd, rm) {
    return toStringBinary(this, 16, sd, rm);
};
P.toNearest = function(y, rm) {
    var x = this, Ctor = x.constructor;
    x = new Ctor(x);
    if (y == null) {
        if (!x.d) return x;
        y = new Ctor(1);
        rm = Ctor.rounding;
    } else {
        y = new Ctor(y);
        if (rm === void 0) {
            rm = Ctor.rounding;
        } else {
            checkInt32(rm, 0, 8);
        }
        if (!x.d) return y.s ? x : y;
        if (!y.d) {
            if (y.s) y.s = x.s;
            return y;
        }
    }
    if (y.d[0]) {
        external = false;
        x = divide(x, y, 0, rm, 1).times(y);
        external = true;
        finalise(x);
    } else {
        y.s = x.s;
        x = y;
    }
    return x;
};
P.toNumber = function() {
    return +this;
};
P.toOctal = function(sd, rm) {
    return toStringBinary(this, 8, sd, rm);
};
P.toPower = P.pow = function(y) {
    var e, k, pr, r, rm, s, x = this, Ctor = x.constructor, yn = +(y = new Ctor(y));
    if (!x.d || !y.d || !x.d[0] || !y.d[0]) return new Ctor(mathpow(+x, yn));
    x = new Ctor(x);
    if (x.eq(1)) return x;
    pr = Ctor.precision;
    rm = Ctor.rounding;
    if (y.eq(1)) return finalise(x, pr, rm);
    e = mathfloor(y.e / LOG_BASE);
    if (e >= y.d.length - 1 && (k = yn < 0 ? -yn : yn) <= MAX_SAFE_INTEGER) {
        r = intPow(Ctor, x, k, pr);
        return y.s < 0 ? new Ctor(1).div(r) : finalise(r, pr, rm);
    }
    s = x.s;
    if (s < 0) {
        if (e < y.d.length - 1) return new Ctor(NaN);
        if ((y.d[e] & 1) == 0) s = 1;
        if (x.e == 0 && x.d[0] == 1 && x.d.length == 1) {
            x.s = s;
            return x;
        }
    }
    k = mathpow(+x, yn);
    e = k == 0 || !isFinite(k) ? mathfloor(yn * (Math.log("0." + digitsToString(x.d)) / Math.LN10 + x.e + 1)) : new Ctor(k + "").e;
    if (e > Ctor.maxE + 1 || e < Ctor.minE - 1) return new Ctor(e > 0 ? s / 0 : 0);
    external = false;
    Ctor.rounding = x.s = 1;
    k = Math.min(12, (e + "").length);
    r = naturalExponential(y.times(naturalLogarithm(x, pr + k)), pr);
    if (r.d) {
        r = finalise(r, pr + 5, 1);
        if (checkRoundingDigits(r.d, pr, rm)) {
            e = pr + 10;
            r = finalise(naturalExponential(y.times(naturalLogarithm(x, e + k)), e), e + 5, 1);
            if (+digitsToString(r.d).slice(pr + 1, pr + 15) + 1 == 1e14) {
                r = finalise(r, pr + 1, 0);
            }
        }
    }
    r.s = s;
    external = true;
    Ctor.rounding = rm;
    return finalise(r, pr, rm);
};
P.toPrecision = function(sd, rm) {
    var str, x = this, Ctor = x.constructor;
    if (sd === void 0) {
        str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
    } else {
        checkInt32(sd, 1, MAX_DIGITS);
        if (rm === void 0) rm = Ctor.rounding;
        else checkInt32(rm, 0, 8);
        x = finalise(new Ctor(x), sd, rm);
        str = finiteToString(x, sd <= x.e || x.e <= Ctor.toExpNeg, sd);
    }
    return x.isNeg() && !x.isZero() ? "-" + str : str;
};
P.toSignificantDigits = P.toSD = function(sd, rm) {
    var x = this, Ctor = x.constructor;
    if (sd === void 0) {
        sd = Ctor.precision;
        rm = Ctor.rounding;
    } else {
        checkInt32(sd, 1, MAX_DIGITS);
        if (rm === void 0) rm = Ctor.rounding;
        else checkInt32(rm, 0, 8);
    }
    return finalise(new Ctor(x), sd, rm);
};
P.toString = function() {
    var x = this, Ctor = x.constructor, str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
    return x.isNeg() && !x.isZero() ? "-" + str : str;
};
P.truncated = P.trunc = function() {
    return finalise(new this.constructor(this), this.e + 1, 1);
};
P.valueOf = P.toJSON = function() {
    var x = this, Ctor = x.constructor, str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
    return x.isNeg() ? "-" + str : str;
};
function digitsToString(d) {
    var i, k, ws, indexOfLastWord = d.length - 1, str = "", w = d[0];
    if (indexOfLastWord > 0) {
        str += w;
        for(i = 1; i < indexOfLastWord; i++){
            ws = d[i] + "";
            k = LOG_BASE - ws.length;
            if (k) str += getZeroString(k);
            str += ws;
        }
        w = d[i];
        ws = w + "";
        k = LOG_BASE - ws.length;
        if (k) str += getZeroString(k);
    } else if (w === 0) {
        return "0";
    }
    for(; w % 10 === 0;)w /= 10;
    return str + w;
}
function checkInt32(i, min2, max2) {
    if (i !== ~~i || i < min2 || i > max2) {
        throw Error(invalidArgument + i);
    }
}
function checkRoundingDigits(d, i, rm, repeating) {
    var di, k, r, rd;
    for(k = d[0]; k >= 10; k /= 10)--i;
    if (--i < 0) {
        i += LOG_BASE;
        di = 0;
    } else {
        di = Math.ceil((i + 1) / LOG_BASE);
        i %= LOG_BASE;
    }
    k = mathpow(10, LOG_BASE - i);
    rd = d[di] % k | 0;
    if (repeating == null) {
        if (i < 3) {
            if (i == 0) rd = rd / 100 | 0;
            else if (i == 1) rd = rd / 10 | 0;
            r = rm < 4 && rd == 99999 || rm > 3 && rd == 49999 || rd == 5e4 || rd == 0;
        } else {
            r = (rm < 4 && rd + 1 == k || rm > 3 && rd + 1 == k / 2) && (d[di + 1] / k / 100 | 0) == mathpow(10, i - 2) - 1 || (rd == k / 2 || rd == 0) && (d[di + 1] / k / 100 | 0) == 0;
        }
    } else {
        if (i < 4) {
            if (i == 0) rd = rd / 1e3 | 0;
            else if (i == 1) rd = rd / 100 | 0;
            else if (i == 2) rd = rd / 10 | 0;
            r = (repeating || rm < 4) && rd == 9999 || !repeating && rm > 3 && rd == 4999;
        } else {
            r = ((repeating || rm < 4) && rd + 1 == k || !repeating && rm > 3 && rd + 1 == k / 2) && (d[di + 1] / k / 1e3 | 0) == mathpow(10, i - 3) - 1;
        }
    }
    return r;
}
function convertBase(str, baseIn, baseOut) {
    var j, arr = [
        0
    ], arrL, i = 0, strL = str.length;
    for(; i < strL;){
        for(arrL = arr.length; arrL--;)arr[arrL] *= baseIn;
        arr[0] += NUMERALS.indexOf(str.charAt(i++));
        for(j = 0; j < arr.length; j++){
            if (arr[j] > baseOut - 1) {
                if (arr[j + 1] === void 0) arr[j + 1] = 0;
                arr[j + 1] += arr[j] / baseOut | 0;
                arr[j] %= baseOut;
            }
        }
    }
    return arr.reverse();
}
function cosine(Ctor, x) {
    var k, len, y;
    if (x.isZero()) return x;
    len = x.d.length;
    if (len < 32) {
        k = Math.ceil(len / 3);
        y = (1 / tinyPow(4, k)).toString();
    } else {
        k = 16;
        y = "2.3283064365386962890625e-10";
    }
    Ctor.precision += k;
    x = taylorSeries(Ctor, 1, x.times(y), new Ctor(1));
    for(var i = k; i--;){
        var cos2x = x.times(x);
        x = cos2x.times(cos2x).minus(cos2x).times(8).plus(1);
    }
    Ctor.precision -= k;
    return x;
}
var divide = /* @__PURE__ */ function() {
    function multiplyInteger(x, k, base) {
        var temp, carry = 0, i = x.length;
        for(x = x.slice(); i--;){
            temp = x[i] * k + carry;
            x[i] = temp % base | 0;
            carry = temp / base | 0;
        }
        if (carry) x.unshift(carry);
        return x;
    }
    function compare(a, b, aL, bL) {
        var i, r;
        if (aL != bL) {
            r = aL > bL ? 1 : -1;
        } else {
            for(i = r = 0; i < aL; i++){
                if (a[i] != b[i]) {
                    r = a[i] > b[i] ? 1 : -1;
                    break;
                }
            }
        }
        return r;
    }
    function subtract(a, b, aL, base) {
        var i = 0;
        for(; aL--;){
            a[aL] -= i;
            i = a[aL] < b[aL] ? 1 : 0;
            a[aL] = i * base + a[aL] - b[aL];
        }
        for(; !a[0] && a.length > 1;)a.shift();
    }
    return function(x, y, pr, rm, dp, base) {
        var cmp, e, i, k, logBase, more, prod, prodL, q, qd, rem, remL, rem0, sd, t, xi, xL, yd0, yL, yz, Ctor = x.constructor, sign2 = x.s == y.s ? 1 : -1, xd = x.d, yd = y.d;
        if (!xd || !xd[0] || !yd || !yd[0]) {
            return new Ctor(// Return NaN if either NaN, or both Infinity or 0.
            !x.s || !y.s || (xd ? yd && xd[0] == yd[0] : !yd) ? NaN : // Return ±0 if x is 0 or y is ±Infinity, or return ±Infinity as y is 0.
            xd && xd[0] == 0 || !yd ? sign2 * 0 : sign2 / 0);
        }
        if (base) {
            logBase = 1;
            e = x.e - y.e;
        } else {
            base = BASE;
            logBase = LOG_BASE;
            e = mathfloor(x.e / logBase) - mathfloor(y.e / logBase);
        }
        yL = yd.length;
        xL = xd.length;
        q = new Ctor(sign2);
        qd = q.d = [];
        for(i = 0; yd[i] == (xd[i] || 0); i++);
        if (yd[i] > (xd[i] || 0)) e--;
        if (pr == null) {
            sd = pr = Ctor.precision;
            rm = Ctor.rounding;
        } else if (dp) {
            sd = pr + (x.e - y.e) + 1;
        } else {
            sd = pr;
        }
        if (sd < 0) {
            qd.push(1);
            more = true;
        } else {
            sd = sd / logBase + 2 | 0;
            i = 0;
            if (yL == 1) {
                k = 0;
                yd = yd[0];
                sd++;
                for(; (i < xL || k) && sd--; i++){
                    t = k * base + (xd[i] || 0);
                    qd[i] = t / yd | 0;
                    k = t % yd | 0;
                }
                more = k || i < xL;
            } else {
                k = base / (yd[0] + 1) | 0;
                if (k > 1) {
                    yd = multiplyInteger(yd, k, base);
                    xd = multiplyInteger(xd, k, base);
                    yL = yd.length;
                    xL = xd.length;
                }
                xi = yL;
                rem = xd.slice(0, yL);
                remL = rem.length;
                for(; remL < yL;)rem[remL++] = 0;
                yz = yd.slice();
                yz.unshift(0);
                yd0 = yd[0];
                if (yd[1] >= base / 2) ++yd0;
                do {
                    k = 0;
                    cmp = compare(yd, rem, yL, remL);
                    if (cmp < 0) {
                        rem0 = rem[0];
                        if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);
                        k = rem0 / yd0 | 0;
                        if (k > 1) {
                            if (k >= base) k = base - 1;
                            prod = multiplyInteger(yd, k, base);
                            prodL = prod.length;
                            remL = rem.length;
                            cmp = compare(prod, rem, prodL, remL);
                            if (cmp == 1) {
                                k--;
                                subtract(prod, yL < prodL ? yz : yd, prodL, base);
                            }
                        } else {
                            if (k == 0) cmp = k = 1;
                            prod = yd.slice();
                        }
                        prodL = prod.length;
                        if (prodL < remL) prod.unshift(0);
                        subtract(rem, prod, remL, base);
                        if (cmp == -1) {
                            remL = rem.length;
                            cmp = compare(yd, rem, yL, remL);
                            if (cmp < 1) {
                                k++;
                                subtract(rem, yL < remL ? yz : yd, remL, base);
                            }
                        }
                        remL = rem.length;
                    } else if (cmp === 0) {
                        k++;
                        rem = [
                            0
                        ];
                    }
                    qd[i++] = k;
                    if (cmp && rem[0]) {
                        rem[remL++] = xd[xi] || 0;
                    } else {
                        rem = [
                            xd[xi]
                        ];
                        remL = 1;
                    }
                }while ((xi++ < xL || rem[0] !== void 0) && sd--)
                more = rem[0] !== void 0;
            }
            if (!qd[0]) qd.shift();
        }
        if (logBase == 1) {
            q.e = e;
            inexact = more;
        } else {
            for(i = 1, k = qd[0]; k >= 10; k /= 10)i++;
            q.e = i + e * logBase - 1;
            finalise(q, dp ? pr + q.e + 1 : pr, rm, more);
        }
        return q;
    };
}();
function finalise(x, sd, rm, isTruncated) {
    var digits, i, j, k, rd, roundUp, w, xd, xdi, Ctor = x.constructor;
    out: if (sd != null) {
        xd = x.d;
        if (!xd) return x;
        for(digits = 1, k = xd[0]; k >= 10; k /= 10)digits++;
        i = sd - digits;
        if (i < 0) {
            i += LOG_BASE;
            j = sd;
            w = xd[xdi = 0];
            rd = w / mathpow(10, digits - j - 1) % 10 | 0;
        } else {
            xdi = Math.ceil((i + 1) / LOG_BASE);
            k = xd.length;
            if (xdi >= k) {
                if (isTruncated) {
                    for(; k++ <= xdi;)xd.push(0);
                    w = rd = 0;
                    digits = 1;
                    i %= LOG_BASE;
                    j = i - LOG_BASE + 1;
                } else {
                    break out;
                }
            } else {
                w = k = xd[xdi];
                for(digits = 1; k >= 10; k /= 10)digits++;
                i %= LOG_BASE;
                j = i - LOG_BASE + digits;
                rd = j < 0 ? 0 : w / mathpow(10, digits - j - 1) % 10 | 0;
            }
        }
        isTruncated = isTruncated || sd < 0 || xd[xdi + 1] !== void 0 || (j < 0 ? w : w % mathpow(10, digits - j - 1));
        roundUp = rm < 4 ? (rd || isTruncated) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : rd > 5 || rd == 5 && (rm == 4 || isTruncated || rm == 6 && // Check whether the digit to the left of the rounding digit is odd.
        (i > 0 ? j > 0 ? w / mathpow(10, digits - j) : 0 : xd[xdi - 1]) % 10 & 1 || rm == (x.s < 0 ? 8 : 7));
        if (sd < 1 || !xd[0]) {
            xd.length = 0;
            if (roundUp) {
                sd -= x.e + 1;
                xd[0] = mathpow(10, (LOG_BASE - sd % LOG_BASE) % LOG_BASE);
                x.e = -sd || 0;
            } else {
                xd[0] = x.e = 0;
            }
            return x;
        }
        if (i == 0) {
            xd.length = xdi;
            k = 1;
            xdi--;
        } else {
            xd.length = xdi + 1;
            k = mathpow(10, LOG_BASE - i);
            xd[xdi] = j > 0 ? (w / mathpow(10, digits - j) % mathpow(10, j) | 0) * k : 0;
        }
        if (roundUp) {
            for(;;){
                if (xdi == 0) {
                    for(i = 1, j = xd[0]; j >= 10; j /= 10)i++;
                    j = xd[0] += k;
                    for(k = 1; j >= 10; j /= 10)k++;
                    if (i != k) {
                        x.e++;
                        if (xd[0] == BASE) xd[0] = 1;
                    }
                    break;
                } else {
                    xd[xdi] += k;
                    if (xd[xdi] != BASE) break;
                    xd[xdi--] = 0;
                    k = 1;
                }
            }
        }
        for(i = xd.length; xd[--i] === 0;)xd.pop();
    }
    if (external) {
        if (x.e > Ctor.maxE) {
            x.d = null;
            x.e = NaN;
        } else if (x.e < Ctor.minE) {
            x.e = 0;
            x.d = [
                0
            ];
        }
    }
    return x;
}
function finiteToString(x, isExp, sd) {
    if (!x.isFinite()) return nonFiniteToString(x);
    var k, e = x.e, str = digitsToString(x.d), len = str.length;
    if (isExp) {
        if (sd && (k = sd - len) > 0) {
            str = str.charAt(0) + "." + str.slice(1) + getZeroString(k);
        } else if (len > 1) {
            str = str.charAt(0) + "." + str.slice(1);
        }
        str = str + (x.e < 0 ? "e" : "e+") + x.e;
    } else if (e < 0) {
        str = "0." + getZeroString(-e - 1) + str;
        if (sd && (k = sd - len) > 0) str += getZeroString(k);
    } else if (e >= len) {
        str += getZeroString(e + 1 - len);
        if (sd && (k = sd - e - 1) > 0) str = str + "." + getZeroString(k);
    } else {
        if ((k = e + 1) < len) str = str.slice(0, k) + "." + str.slice(k);
        if (sd && (k = sd - len) > 0) {
            if (e + 1 === len) str += ".";
            str += getZeroString(k);
        }
    }
    return str;
}
function getBase10Exponent(digits, e) {
    var w = digits[0];
    for(e *= LOG_BASE; w >= 10; w /= 10)e++;
    return e;
}
function getLn10(Ctor, sd, pr) {
    if (sd > LN10_PRECISION) {
        external = true;
        if (pr) Ctor.precision = pr;
        throw Error(precisionLimitExceeded);
    }
    return finalise(new Ctor(LN10), sd, 1, true);
}
function getPi(Ctor, sd, rm) {
    if (sd > PI_PRECISION) throw Error(precisionLimitExceeded);
    return finalise(new Ctor(PI), sd, rm, true);
}
function getPrecision(digits) {
    var w = digits.length - 1, len = w * LOG_BASE + 1;
    w = digits[w];
    if (w) {
        for(; w % 10 == 0; w /= 10)len--;
        for(w = digits[0]; w >= 10; w /= 10)len++;
    }
    return len;
}
function getZeroString(k) {
    var zs = "";
    for(; k--;)zs += "0";
    return zs;
}
function intPow(Ctor, x, n, pr) {
    var isTruncated, r = new Ctor(1), k = Math.ceil(pr / LOG_BASE + 4);
    external = false;
    for(;;){
        if (n % 2) {
            r = r.times(x);
            if (truncate(r.d, k)) isTruncated = true;
        }
        n = mathfloor(n / 2);
        if (n === 0) {
            n = r.d.length - 1;
            if (isTruncated && r.d[n] === 0) ++r.d[n];
            break;
        }
        x = x.times(x);
        truncate(x.d, k);
    }
    external = true;
    return r;
}
function isOdd(n) {
    return n.d[n.d.length - 1] & 1;
}
function maxOrMin(Ctor, args, n) {
    var k, y, x = new Ctor(args[0]), i = 0;
    for(; ++i < args.length;){
        y = new Ctor(args[i]);
        if (!y.s) {
            x = y;
            break;
        }
        k = x.cmp(y);
        if (k === n || k === 0 && x.s === n) {
            x = y;
        }
    }
    return x;
}
function naturalExponential(x, sd) {
    var denominator, guard, j, pow2, sum2, t, wpr, rep = 0, i = 0, k = 0, Ctor = x.constructor, rm = Ctor.rounding, pr = Ctor.precision;
    if (!x.d || !x.d[0] || x.e > 17) {
        return new Ctor(x.d ? !x.d[0] ? 1 : x.s < 0 ? 0 : 1 / 0 : x.s ? x.s < 0 ? 0 : x : 0 / 0);
    }
    if (sd == null) {
        external = false;
        wpr = pr;
    } else {
        wpr = sd;
    }
    t = new Ctor(0.03125);
    while(x.e > -2){
        x = x.times(t);
        k += 5;
    }
    guard = Math.log(mathpow(2, k)) / Math.LN10 * 2 + 5 | 0;
    wpr += guard;
    denominator = pow2 = sum2 = new Ctor(1);
    Ctor.precision = wpr;
    for(;;){
        pow2 = finalise(pow2.times(x), wpr, 1);
        denominator = denominator.times(++i);
        t = sum2.plus(divide(pow2, denominator, wpr, 1));
        if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum2.d).slice(0, wpr)) {
            j = k;
            while(j--)sum2 = finalise(sum2.times(sum2), wpr, 1);
            if (sd == null) {
                if (rep < 3 && checkRoundingDigits(sum2.d, wpr - guard, rm, rep)) {
                    Ctor.precision = wpr += 10;
                    denominator = pow2 = t = new Ctor(1);
                    i = 0;
                    rep++;
                } else {
                    return finalise(sum2, Ctor.precision = pr, rm, external = true);
                }
            } else {
                Ctor.precision = pr;
                return sum2;
            }
        }
        sum2 = t;
    }
}
function naturalLogarithm(y, sd) {
    var c, c0, denominator, e, numerator, rep, sum2, t, wpr, x1, x2, n = 1, guard = 10, x = y, xd = x.d, Ctor = x.constructor, rm = Ctor.rounding, pr = Ctor.precision;
    if (x.s < 0 || !xd || !xd[0] || !x.e && xd[0] == 1 && xd.length == 1) {
        return new Ctor(xd && !xd[0] ? -1 / 0 : x.s != 1 ? NaN : xd ? 0 : x);
    }
    if (sd == null) {
        external = false;
        wpr = pr;
    } else {
        wpr = sd;
    }
    Ctor.precision = wpr += guard;
    c = digitsToString(xd);
    c0 = c.charAt(0);
    if (Math.abs(e = x.e) < 15e14) {
        while(c0 < 7 && c0 != 1 || c0 == 1 && c.charAt(1) > 3){
            x = x.times(y);
            c = digitsToString(x.d);
            c0 = c.charAt(0);
            n++;
        }
        e = x.e;
        if (c0 > 1) {
            x = new Ctor("0." + c);
            e++;
        } else {
            x = new Ctor(c0 + "." + c.slice(1));
        }
    } else {
        t = getLn10(Ctor, wpr + 2, pr).times(e + "");
        x = naturalLogarithm(new Ctor(c0 + "." + c.slice(1)), wpr - guard).plus(t);
        Ctor.precision = pr;
        return sd == null ? finalise(x, pr, rm, external = true) : x;
    }
    x1 = x;
    sum2 = numerator = x = divide(x.minus(1), x.plus(1), wpr, 1);
    x2 = finalise(x.times(x), wpr, 1);
    denominator = 3;
    for(;;){
        numerator = finalise(numerator.times(x2), wpr, 1);
        t = sum2.plus(divide(numerator, new Ctor(denominator), wpr, 1));
        if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum2.d).slice(0, wpr)) {
            sum2 = sum2.times(2);
            if (e !== 0) sum2 = sum2.plus(getLn10(Ctor, wpr + 2, pr).times(e + ""));
            sum2 = divide(sum2, new Ctor(n), wpr, 1);
            if (sd == null) {
                if (checkRoundingDigits(sum2.d, wpr - guard, rm, rep)) {
                    Ctor.precision = wpr += guard;
                    t = numerator = x = divide(x1.minus(1), x1.plus(1), wpr, 1);
                    x2 = finalise(x.times(x), wpr, 1);
                    denominator = rep = 1;
                } else {
                    return finalise(sum2, Ctor.precision = pr, rm, external = true);
                }
            } else {
                Ctor.precision = pr;
                return sum2;
            }
        }
        sum2 = t;
        denominator += 2;
    }
}
function nonFiniteToString(x) {
    return String(x.s * x.s / 0);
}
function parseDecimal(x, str) {
    var e, i, len;
    if ((e = str.indexOf(".")) > -1) str = str.replace(".", "");
    if ((i = str.search(/e/i)) > 0) {
        if (e < 0) e = i;
        e += +str.slice(i + 1);
        str = str.substring(0, i);
    } else if (e < 0) {
        e = str.length;
    }
    for(i = 0; str.charCodeAt(i) === 48; i++);
    for(len = str.length; str.charCodeAt(len - 1) === 48; --len);
    str = str.slice(i, len);
    if (str) {
        len -= i;
        x.e = e = e - i - 1;
        x.d = [];
        i = (e + 1) % LOG_BASE;
        if (e < 0) i += LOG_BASE;
        if (i < len) {
            if (i) x.d.push(+str.slice(0, i));
            for(len -= LOG_BASE; i < len;)x.d.push(+str.slice(i, i += LOG_BASE));
            str = str.slice(i);
            i = LOG_BASE - str.length;
        } else {
            i -= len;
        }
        for(; i--;)str += "0";
        x.d.push(+str);
        if (external) {
            if (x.e > x.constructor.maxE) {
                x.d = null;
                x.e = NaN;
            } else if (x.e < x.constructor.minE) {
                x.e = 0;
                x.d = [
                    0
                ];
            }
        }
    } else {
        x.e = 0;
        x.d = [
            0
        ];
    }
    return x;
}
function parseOther(x, str) {
    var base, Ctor, divisor, i, isFloat, len, p, xd, xe;
    if (str.indexOf("_") > -1) {
        str = str.replace(/(\d)_(?=\d)/g, "$1");
        if (isDecimal.test(str)) return parseDecimal(x, str);
    } else if (str === "Infinity" || str === "NaN") {
        if (!+str) x.s = NaN;
        x.e = NaN;
        x.d = null;
        return x;
    }
    if (isHex.test(str)) {
        base = 16;
        str = str.toLowerCase();
    } else if (isBinary.test(str)) {
        base = 2;
    } else if (isOctal.test(str)) {
        base = 8;
    } else {
        throw Error(invalidArgument + str);
    }
    i = str.search(/p/i);
    if (i > 0) {
        p = +str.slice(i + 1);
        str = str.substring(2, i);
    } else {
        str = str.slice(2);
    }
    i = str.indexOf(".");
    isFloat = i >= 0;
    Ctor = x.constructor;
    if (isFloat) {
        str = str.replace(".", "");
        len = str.length;
        i = len - i;
        divisor = intPow(Ctor, new Ctor(base), i, i * 2);
    }
    xd = convertBase(str, base, BASE);
    xe = xd.length - 1;
    for(i = xe; xd[i] === 0; --i)xd.pop();
    if (i < 0) return new Ctor(x.s * 0);
    x.e = getBase10Exponent(xd, xe);
    x.d = xd;
    external = false;
    if (isFloat) x = divide(x, divisor, len * 4);
    if (p) x = x.times(Math.abs(p) < 54 ? mathpow(2, p) : Decimal.pow(2, p));
    external = true;
    return x;
}
function sine(Ctor, x) {
    var k, len = x.d.length;
    if (len < 3) {
        return x.isZero() ? x : taylorSeries(Ctor, 2, x, x);
    }
    k = 1.4 * Math.sqrt(len);
    k = k > 16 ? 16 : k | 0;
    x = x.times(1 / tinyPow(5, k));
    x = taylorSeries(Ctor, 2, x, x);
    var sin2_x, d5 = new Ctor(5), d16 = new Ctor(16), d20 = new Ctor(20);
    for(; k--;){
        sin2_x = x.times(x);
        x = x.times(d5.plus(sin2_x.times(d16.times(sin2_x).minus(d20))));
    }
    return x;
}
function taylorSeries(Ctor, n, x, y, isHyperbolic) {
    var j, t, u, x2, i = 1, pr = Ctor.precision, k = Math.ceil(pr / LOG_BASE);
    external = false;
    x2 = x.times(x);
    u = new Ctor(y);
    for(;;){
        t = divide(u.times(x2), new Ctor(n++ * n++), pr, 1);
        u = isHyperbolic ? y.plus(t) : y.minus(t);
        y = divide(t.times(x2), new Ctor(n++ * n++), pr, 1);
        t = u.plus(y);
        if (t.d[k] !== void 0) {
            for(j = k; t.d[j] === u.d[j] && j--;);
            if (j == -1) break;
        }
        j = u;
        u = y;
        y = t;
        t = j;
        i++;
    }
    external = true;
    t.d.length = k + 1;
    return t;
}
function tinyPow(b, e) {
    var n = b;
    while(--e)n *= b;
    return n;
}
function toLessThanHalfPi(Ctor, x) {
    var t, isNeg = x.s < 0, pi = getPi(Ctor, Ctor.precision, 1), halfPi = pi.times(0.5);
    x = x.abs();
    if (x.lte(halfPi)) {
        quadrant = isNeg ? 4 : 1;
        return x;
    }
    t = x.divToInt(pi);
    if (t.isZero()) {
        quadrant = isNeg ? 3 : 2;
    } else {
        x = x.minus(t.times(pi));
        if (x.lte(halfPi)) {
            quadrant = isOdd(t) ? isNeg ? 2 : 3 : isNeg ? 4 : 1;
            return x;
        }
        quadrant = isOdd(t) ? isNeg ? 1 : 4 : isNeg ? 3 : 2;
    }
    return x.minus(pi).abs();
}
function toStringBinary(x, baseOut, sd, rm) {
    var base, e, i, k, len, roundUp, str, xd, y, Ctor = x.constructor, isExp = sd !== void 0;
    if (isExp) {
        checkInt32(sd, 1, MAX_DIGITS);
        if (rm === void 0) rm = Ctor.rounding;
        else checkInt32(rm, 0, 8);
    } else {
        sd = Ctor.precision;
        rm = Ctor.rounding;
    }
    if (!x.isFinite()) {
        str = nonFiniteToString(x);
    } else {
        str = finiteToString(x);
        i = str.indexOf(".");
        if (isExp) {
            base = 2;
            if (baseOut == 16) {
                sd = sd * 4 - 3;
            } else if (baseOut == 8) {
                sd = sd * 3 - 2;
            }
        } else {
            base = baseOut;
        }
        if (i >= 0) {
            str = str.replace(".", "");
            y = new Ctor(1);
            y.e = str.length - i;
            y.d = convertBase(finiteToString(y), 10, base);
            y.e = y.d.length;
        }
        xd = convertBase(str, 10, base);
        e = len = xd.length;
        for(; xd[--len] == 0;)xd.pop();
        if (!xd[0]) {
            str = isExp ? "0p+0" : "0";
        } else {
            if (i < 0) {
                e--;
            } else {
                x = new Ctor(x);
                x.d = xd;
                x.e = e;
                x = divide(x, y, sd, rm, 0, base);
                xd = x.d;
                e = x.e;
                roundUp = inexact;
            }
            i = xd[sd];
            k = base / 2;
            roundUp = roundUp || xd[sd + 1] !== void 0;
            roundUp = rm < 4 ? (i !== void 0 || roundUp) && (rm === 0 || rm === (x.s < 0 ? 3 : 2)) : i > k || i === k && (rm === 4 || roundUp || rm === 6 && xd[sd - 1] & 1 || rm === (x.s < 0 ? 8 : 7));
            xd.length = sd;
            if (roundUp) {
                for(; ++xd[--sd] > base - 1;){
                    xd[sd] = 0;
                    if (!sd) {
                        ++e;
                        xd.unshift(1);
                    }
                }
            }
            for(len = xd.length; !xd[len - 1]; --len);
            for(i = 0, str = ""; i < len; i++)str += NUMERALS.charAt(xd[i]);
            if (isExp) {
                if (len > 1) {
                    if (baseOut == 16 || baseOut == 8) {
                        i = baseOut == 16 ? 4 : 3;
                        for(--len; len % i; len++)str += "0";
                        xd = convertBase(str, base, baseOut);
                        for(len = xd.length; !xd[len - 1]; --len);
                        for(i = 1, str = "1."; i < len; i++)str += NUMERALS.charAt(xd[i]);
                    } else {
                        str = str.charAt(0) + "." + str.slice(1);
                    }
                }
                str = str + (e < 0 ? "p" : "p+") + e;
            } else if (e < 0) {
                for(; ++e;)str = "0" + str;
                str = "0." + str;
            } else {
                if (++e > len) for(e -= len; e--;)str += "0";
                else if (e < len) str = str.slice(0, e) + "." + str.slice(e);
            }
        }
        str = (baseOut == 16 ? "0x" : baseOut == 2 ? "0b" : baseOut == 8 ? "0o" : "") + str;
    }
    return x.s < 0 ? "-" + str : str;
}
function truncate(arr, len) {
    if (arr.length > len) {
        arr.length = len;
        return true;
    }
}
function abs(x) {
    return new this(x).abs();
}
function acos(x) {
    return new this(x).acos();
}
function acosh(x) {
    return new this(x).acosh();
}
function add(x, y) {
    return new this(x).plus(y);
}
function asin(x) {
    return new this(x).asin();
}
function asinh(x) {
    return new this(x).asinh();
}
function atan(x) {
    return new this(x).atan();
}
function atanh(x) {
    return new this(x).atanh();
}
function atan2(y, x) {
    y = new this(y);
    x = new this(x);
    var r, pr = this.precision, rm = this.rounding, wpr = pr + 4;
    if (!y.s || !x.s) {
        r = new this(NaN);
    } else if (!y.d && !x.d) {
        r = getPi(this, wpr, 1).times(x.s > 0 ? 0.25 : 0.75);
        r.s = y.s;
    } else if (!x.d || y.isZero()) {
        r = x.s < 0 ? getPi(this, pr, rm) : new this(0);
        r.s = y.s;
    } else if (!y.d || x.isZero()) {
        r = getPi(this, wpr, 1).times(0.5);
        r.s = y.s;
    } else if (x.s < 0) {
        this.precision = wpr;
        this.rounding = 1;
        r = this.atan(divide(y, x, wpr, 1));
        x = getPi(this, wpr, 1);
        this.precision = pr;
        this.rounding = rm;
        r = y.s < 0 ? r.minus(x) : r.plus(x);
    } else {
        r = this.atan(divide(y, x, wpr, 1));
    }
    return r;
}
function cbrt(x) {
    return new this(x).cbrt();
}
function ceil(x) {
    return finalise(x = new this(x), x.e + 1, 2);
}
function clamp(x, min2, max2) {
    return new this(x).clamp(min2, max2);
}
function config(obj) {
    if (!obj || typeof obj !== "object") throw Error(decimalError + "Object expected");
    var i, p, v, useDefaults = obj.defaults === true, ps = [
        "precision",
        1,
        MAX_DIGITS,
        "rounding",
        0,
        8,
        "toExpNeg",
        -EXP_LIMIT,
        0,
        "toExpPos",
        0,
        EXP_LIMIT,
        "maxE",
        0,
        EXP_LIMIT,
        "minE",
        -EXP_LIMIT,
        0,
        "modulo",
        0,
        9
    ];
    for(i = 0; i < ps.length; i += 3){
        if (p = ps[i], useDefaults) this[p] = DEFAULTS[p];
        if ((v = obj[p]) !== void 0) {
            if (mathfloor(v) === v && v >= ps[i + 1] && v <= ps[i + 2]) this[p] = v;
            else throw Error(invalidArgument + p + ": " + v);
        }
    }
    if (p = "crypto", useDefaults) this[p] = DEFAULTS[p];
    if ((v = obj[p]) !== void 0) {
        if (v === true || v === false || v === 0 || v === 1) {
            if (v) {
                if (typeof crypto != "undefined" && crypto && (crypto.getRandomValues || crypto.randomBytes)) {
                    this[p] = true;
                } else {
                    throw Error(cryptoUnavailable);
                }
            } else {
                this[p] = false;
            }
        } else {
            throw Error(invalidArgument + p + ": " + v);
        }
    }
    return this;
}
function cos(x) {
    return new this(x).cos();
}
function cosh(x) {
    return new this(x).cosh();
}
function clone(obj) {
    var i, p, ps;
    function Decimal2(v) {
        var e, i2, t, x = this;
        if (!(x instanceof Decimal2)) return new Decimal2(v);
        x.constructor = Decimal2;
        if (isDecimalInstance(v)) {
            x.s = v.s;
            if (external) {
                if (!v.d || v.e > Decimal2.maxE) {
                    x.e = NaN;
                    x.d = null;
                } else if (v.e < Decimal2.minE) {
                    x.e = 0;
                    x.d = [
                        0
                    ];
                } else {
                    x.e = v.e;
                    x.d = v.d.slice();
                }
            } else {
                x.e = v.e;
                x.d = v.d ? v.d.slice() : v.d;
            }
            return;
        }
        t = typeof v;
        if (t === "number") {
            if (v === 0) {
                x.s = 1 / v < 0 ? -1 : 1;
                x.e = 0;
                x.d = [
                    0
                ];
                return;
            }
            if (v < 0) {
                v = -v;
                x.s = -1;
            } else {
                x.s = 1;
            }
            if (v === ~~v && v < 1e7) {
                for(e = 0, i2 = v; i2 >= 10; i2 /= 10)e++;
                if (external) {
                    if (e > Decimal2.maxE) {
                        x.e = NaN;
                        x.d = null;
                    } else if (e < Decimal2.minE) {
                        x.e = 0;
                        x.d = [
                            0
                        ];
                    } else {
                        x.e = e;
                        x.d = [
                            v
                        ];
                    }
                } else {
                    x.e = e;
                    x.d = [
                        v
                    ];
                }
                return;
            }
            if (v * 0 !== 0) {
                if (!v) x.s = NaN;
                x.e = NaN;
                x.d = null;
                return;
            }
            return parseDecimal(x, v.toString());
        }
        if (t === "string") {
            if ((i2 = v.charCodeAt(0)) === 45) {
                v = v.slice(1);
                x.s = -1;
            } else {
                if (i2 === 43) v = v.slice(1);
                x.s = 1;
            }
            return isDecimal.test(v) ? parseDecimal(x, v) : parseOther(x, v);
        }
        if (t === "bigint") {
            if (v < 0) {
                v = -v;
                x.s = -1;
            } else {
                x.s = 1;
            }
            return parseDecimal(x, v.toString());
        }
        throw Error(invalidArgument + v);
    }
    Decimal2.prototype = P;
    Decimal2.ROUND_UP = 0;
    Decimal2.ROUND_DOWN = 1;
    Decimal2.ROUND_CEIL = 2;
    Decimal2.ROUND_FLOOR = 3;
    Decimal2.ROUND_HALF_UP = 4;
    Decimal2.ROUND_HALF_DOWN = 5;
    Decimal2.ROUND_HALF_EVEN = 6;
    Decimal2.ROUND_HALF_CEIL = 7;
    Decimal2.ROUND_HALF_FLOOR = 8;
    Decimal2.EUCLID = 9;
    Decimal2.config = Decimal2.set = config;
    Decimal2.clone = clone;
    Decimal2.isDecimal = isDecimalInstance;
    Decimal2.abs = abs;
    Decimal2.acos = acos;
    Decimal2.acosh = acosh;
    Decimal2.add = add;
    Decimal2.asin = asin;
    Decimal2.asinh = asinh;
    Decimal2.atan = atan;
    Decimal2.atanh = atanh;
    Decimal2.atan2 = atan2;
    Decimal2.cbrt = cbrt;
    Decimal2.ceil = ceil;
    Decimal2.clamp = clamp;
    Decimal2.cos = cos;
    Decimal2.cosh = cosh;
    Decimal2.div = div;
    Decimal2.exp = exp;
    Decimal2.floor = floor;
    Decimal2.hypot = hypot;
    Decimal2.ln = ln;
    Decimal2.log = log;
    Decimal2.log10 = log10;
    Decimal2.log2 = log2;
    Decimal2.max = max;
    Decimal2.min = min;
    Decimal2.mod = mod;
    Decimal2.mul = mul;
    Decimal2.pow = pow;
    Decimal2.random = random;
    Decimal2.round = round;
    Decimal2.sign = sign;
    Decimal2.sin = sin;
    Decimal2.sinh = sinh;
    Decimal2.sqrt = sqrt;
    Decimal2.sub = sub;
    Decimal2.sum = sum;
    Decimal2.tan = tan;
    Decimal2.tanh = tanh;
    Decimal2.trunc = trunc;
    if (obj === void 0) obj = {};
    if (obj) {
        if (obj.defaults !== true) {
            ps = [
                "precision",
                "rounding",
                "toExpNeg",
                "toExpPos",
                "maxE",
                "minE",
                "modulo",
                "crypto"
            ];
            for(i = 0; i < ps.length;)if (!obj.hasOwnProperty(p = ps[i++])) obj[p] = this[p];
        }
    }
    Decimal2.config(obj);
    return Decimal2;
}
function div(x, y) {
    return new this(x).div(y);
}
function exp(x) {
    return new this(x).exp();
}
function floor(x) {
    return finalise(x = new this(x), x.e + 1, 3);
}
function hypot() {
    var i, n, t = new this(0);
    external = false;
    for(i = 0; i < arguments.length;){
        n = new this(arguments[i++]);
        if (!n.d) {
            if (n.s) {
                external = true;
                return new this(1 / 0);
            }
            t = n;
        } else if (t.d) {
            t = t.plus(n.times(n));
        }
    }
    external = true;
    return t.sqrt();
}
function isDecimalInstance(obj) {
    return obj instanceof Decimal || obj && obj.toStringTag === tag || false;
}
function ln(x) {
    return new this(x).ln();
}
function log(x, y) {
    return new this(x).log(y);
}
function log2(x) {
    return new this(x).log(2);
}
function log10(x) {
    return new this(x).log(10);
}
function max() {
    return maxOrMin(this, arguments, -1);
}
function min() {
    return maxOrMin(this, arguments, 1);
}
function mod(x, y) {
    return new this(x).mod(y);
}
function mul(x, y) {
    return new this(x).mul(y);
}
function pow(x, y) {
    return new this(x).pow(y);
}
function random(sd) {
    var d, e, k, n, i = 0, r = new this(1), rd = [];
    if (sd === void 0) sd = this.precision;
    else checkInt32(sd, 1, MAX_DIGITS);
    k = Math.ceil(sd / LOG_BASE);
    if (!this.crypto) {
        for(; i < k;)rd[i++] = Math.random() * 1e7 | 0;
    } else if (crypto.getRandomValues) {
        d = crypto.getRandomValues(new Uint32Array(k));
        for(; i < k;){
            n = d[i];
            if (n >= 429e7) {
                d[i] = crypto.getRandomValues(new Uint32Array(1))[0];
            } else {
                rd[i++] = n % 1e7;
            }
        }
    } else if (crypto.randomBytes) {
        d = crypto.randomBytes(k *= 4);
        for(; i < k;){
            n = d[i] + (d[i + 1] << 8) + (d[i + 2] << 16) + ((d[i + 3] & 127) << 24);
            if (n >= 214e7) {
                crypto.randomBytes(4).copy(d, i);
            } else {
                rd.push(n % 1e7);
                i += 4;
            }
        }
        i = k / 4;
    } else {
        throw Error(cryptoUnavailable);
    }
    k = rd[--i];
    sd %= LOG_BASE;
    if (k && sd) {
        n = mathpow(10, LOG_BASE - sd);
        rd[i] = (k / n | 0) * n;
    }
    for(; rd[i] === 0; i--)rd.pop();
    if (i < 0) {
        e = 0;
        rd = [
            0
        ];
    } else {
        e = -1;
        for(; rd[0] === 0; e -= LOG_BASE)rd.shift();
        for(k = 1, n = rd[0]; n >= 10; n /= 10)k++;
        if (k < LOG_BASE) e -= LOG_BASE - k;
    }
    r.e = e;
    r.d = rd;
    return r;
}
function round(x) {
    return finalise(x = new this(x), x.e + 1, this.rounding);
}
function sign(x) {
    x = new this(x);
    return x.d ? x.d[0] ? x.s : 0 * x.s : x.s || NaN;
}
function sin(x) {
    return new this(x).sin();
}
function sinh(x) {
    return new this(x).sinh();
}
function sqrt(x) {
    return new this(x).sqrt();
}
function sub(x, y) {
    return new this(x).sub(y);
}
function sum() {
    var i = 0, args = arguments, x = new this(args[i]);
    external = false;
    for(; x.s && ++i < args.length;)x = x.plus(args[i]);
    external = true;
    return finalise(x, this.precision, this.rounding);
}
function tan(x) {
    return new this(x).tan();
}
function tanh(x) {
    return new this(x).tanh();
}
function trunc(x) {
    return finalise(x = new this(x), x.e + 1, 1);
}
P[Symbol.for("nodejs.util.inspect.custom")] = P.toString;
P[Symbol.toStringTag] = "Decimal";
var Decimal = P.constructor = clone(DEFAULTS);
LN10 = new Decimal(LN10);
PI = new Decimal(PI);
// ../../node_modules/.pnpm/sql-template-tag@5.2.1/node_modules/sql-template-tag/dist/index.js
var Sql = class _Sql {
    constructor(rawStrings, rawValues){
        if (rawStrings.length - 1 !== rawValues.length) {
            if (rawStrings.length === 0) {
                throw new TypeError("Expected at least 1 string");
            }
            throw new TypeError(`Expected ${rawStrings.length} strings to have ${rawStrings.length - 1} values`);
        }
        const valuesLength = rawValues.reduce((len, value)=>len + (value instanceof _Sql ? value.values.length : 1), 0);
        this.values = new Array(valuesLength);
        this.strings = new Array(valuesLength + 1);
        this.strings[0] = rawStrings[0];
        let i = 0, pos = 0;
        while(i < rawValues.length){
            const child = rawValues[i++];
            const rawString = rawStrings[i];
            if (child instanceof _Sql) {
                this.strings[pos] += child.strings[0];
                let childIndex = 0;
                while(childIndex < child.values.length){
                    this.values[pos++] = child.values[childIndex++];
                    this.strings[pos] = child.strings[childIndex];
                }
                this.strings[pos] += rawString;
            } else {
                this.values[pos++] = child;
                this.strings[pos] = rawString;
            }
        }
    }
    get sql() {
        const len = this.strings.length;
        let i = 1;
        let value = this.strings[0];
        while(i < len)value += `?${this.strings[i++]}`;
        return value;
    }
    get statement() {
        const len = this.strings.length;
        let i = 1;
        let value = this.strings[0];
        while(i < len)value += `:${i}${this.strings[i++]}`;
        return value;
    }
    get text() {
        const len = this.strings.length;
        let i = 1;
        let value = this.strings[0];
        while(i < len)value += `$${i}${this.strings[i++]}`;
        return value;
    }
    inspect() {
        return {
            sql: this.sql,
            statement: this.statement,
            text: this.text,
            values: this.values
        };
    }
};
function join(values, separator = ",", prefix = "", suffix = "") {
    if (values.length === 0) {
        throw new TypeError("Expected `join([])` to be called with an array of multiple elements, but got an empty array");
    }
    return new Sql([
        prefix,
        ...Array(values.length - 1).fill(separator),
        suffix
    ], values);
}
function raw(value) {
    return new Sql([
        value
    ], []);
}
var empty = raw("");
function sql(strings, ...values) {
    return new Sql(strings, values);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
    AnyNull,
    AnyNullClass,
    DbNull,
    DbNullClass,
    Decimal,
    JsonNull,
    JsonNullClass,
    NullTypes,
    ObjectEnumValue,
    PrismaClientInitializationError,
    PrismaClientKnownRequestError,
    PrismaClientRustError,
    PrismaClientRustPanicError,
    PrismaClientUnknownRequestError,
    PrismaClientValidationError,
    Sql,
    empty,
    hasBatchIndex,
    isAnyNull,
    isDbNull,
    isJsonNull,
    join,
    raw,
    sql
}); /*! Bundled license information:

decimal.js/decimal.mjs:
  (*!
   *  decimal.js v10.5.0
   *  An arbitrary-precision Decimal type for JavaScript.
   *  https://github.com/MikeMcl/decimal.js
   *  Copyright (c) 2025 Michael Mclaughlin <M8ch88l@gmail.com>
   *  MIT Licence
   *)
*/ 
}),
"[project]/Downloads/getLoaded/node_modules/.pnpm/@prisma+client@7.2.0_prisma@7.2.0_@types+react@19.2.7_react-dom@19.2.3_react@19.2.3__react@19_s7aeoqhw2ks66jh4fgavjryuhq/node_modules/@prisma/client/runtime/index-browser.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var s = Object.defineProperty;
var g = Object.getOwnPropertyDescriptor;
var p = Object.getOwnPropertyNames;
var f = Object.prototype.hasOwnProperty;
var a = (e, t)=>{
    for(var n in t)s(e, n, {
        get: t[n],
        enumerable: !0
    });
}, y = (e, t, n, r)=>{
    if (t && typeof t == "object" || typeof t == "function") for (let i of p(t))!f.call(e, i) && i !== n && s(e, i, {
        get: ()=>t[i],
        enumerable: !(r = g(t, i)) || r.enumerable
    });
    return e;
};
var x = (e)=>y(s({}, "__esModule", {
        value: !0
    }), e);
var O = {};
a(O, {
    AnyNull: ()=>o.AnyNull,
    DbNull: ()=>o.DbNull,
    Decimal: ()=>m.Decimal,
    JsonNull: ()=>o.JsonNull,
    NullTypes: ()=>o.NullTypes,
    Public: ()=>l,
    getRuntime: ()=>c,
    isAnyNull: ()=>o.isAnyNull,
    isDbNull: ()=>o.isDbNull,
    isJsonNull: ()=>o.isJsonNull,
    makeStrictEnum: ()=>u
});
module.exports = x(O);
var l = {};
a(l, {
    validator: ()=>d
});
function d(...e) {
    return (t)=>t;
}
var b = new Set([
    "toJSON",
    "$$typeof",
    "asymmetricMatch",
    Symbol.iterator,
    Symbol.toStringTag,
    Symbol.isConcatSpreadable,
    Symbol.toPrimitive
]);
function u(e) {
    return new Proxy(e, {
        get (t, n) {
            if (n in t) return t[n];
            if (!b.has(n)) throw new TypeError("Invalid enum value: ".concat(String(n)));
        }
    });
}
var N = ()=>{
    var e, t;
    return ((t = (e = globalThis.process) == null ? void 0 : e.release) == null ? void 0 : t.name) === "node";
}, S = ()=>{
    var e, t;
    return !!globalThis.Bun || !!((t = (e = globalThis.process) == null ? void 0 : e.versions) != null && t.bun);
}, E = ()=>!!globalThis.Deno, R = ()=>typeof globalThis.Netlify == "object", h = ()=>typeof globalThis.EdgeRuntime == "object", C = ()=>{
    var e;
    return ((e = globalThis.navigator) == null ? void 0 : e.userAgent) === "Cloudflare-Workers";
};
function k() {
    var n;
    return (n = [
        [
            R,
            "netlify"
        ],
        [
            h,
            "edge-light"
        ],
        [
            C,
            "workerd"
        ],
        [
            E,
            "deno"
        ],
        [
            S,
            "bun"
        ],
        [
            N,
            "node"
        ]
    ].flatMap((r)=>r[0]() ? [
            r[1]
        ] : []).at(0)) != null ? n : "";
}
var M = {
    node: "Node.js",
    workerd: "Cloudflare Workers",
    deno: "Deno and Deno Deploy",
    netlify: "Netlify Edge Functions",
    "edge-light": "Edge Runtime (Vercel Edge Functions, Vercel Edge Middleware, Next.js (Pages Router) Edge API Routes, Next.js (App Router) Edge Route Handlers or Next.js Middleware)"
};
function c() {
    let e = k();
    return {
        id: e,
        prettyName: M[e] || e,
        isEdge: [
            "workerd",
            "deno",
            "netlify",
            "edge-light"
        ].includes(e)
    };
}
var o = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/@prisma+client-runtime-utils@7.2.0/node_modules/@prisma/client-runtime-utils/dist/index.js [app-client] (ecmascript)"), m = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/@prisma+client-runtime-utils@7.2.0/node_modules/@prisma/client-runtime-utils/dist/index.js [app-client] (ecmascript)");
0 && (module.exports = {
    AnyNull,
    DbNull,
    Decimal,
    JsonNull,
    NullTypes,
    Public,
    getRuntime,
    isAnyNull,
    isDbNull,
    isJsonNull,
    makeStrictEnum
}); //# sourceMappingURL=index-browser.js.map
}),
"[project]/Downloads/getLoaded/node_modules/.pnpm/@prisma+client@7.2.0_prisma@7.2.0_@types+react@19.2.7_react-dom@19.2.3_react@19.2.3__react@19_s7aeoqhw2ks66jh4fgavjryuhq/node_modules/@prisma/client/index-browser.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const prisma = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/@prisma+client@7.2.0_prisma@7.2.0_@types+react@19.2.7_react-dom@19.2.3_react@19.2.3__react@19_s7aeoqhw2ks66jh4fgavjryuhq/node_modules/.prisma/client/index-browser.js [app-client] (ecmascript)");
module.exports = prisma;
}),
"[project]/Downloads/getLoaded/node_modules/.pnpm/@prisma+client@7.2.0_prisma@7.2.0_@types+react@19.2.7_react-dom@19.2.3_react@19.2.3__react@19_s7aeoqhw2ks66jh4fgavjryuhq/node_modules/.prisma/client/index-browser.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

/* !!! This is code generated by Prisma. Do not edit directly. !!!
/* eslint-disable */ // biome-ignore-all lint: generated file
Object.defineProperty(exports, "__esModule", {
    value: true
});
const { Decimal, DbNull, JsonNull, AnyNull, NullTypes, makeStrictEnum, Public, getRuntime, skip } = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/@prisma+client@7.2.0_prisma@7.2.0_@types+react@19.2.7_react-dom@19.2.3_react@19.2.3__react@19_s7aeoqhw2ks66jh4fgavjryuhq/node_modules/@prisma/client/runtime/index-browser.js [app-client] (ecmascript)");
const Prisma = {};
exports.Prisma = Prisma;
exports.$Enums = {};
/**
 * Prisma Client JS version: 7.2.0
 * Query Engine version: 0c8ef2ce45c83248ab3df073180d5eda9e8be7a3
 */ Prisma.prismaVersion = {
    client: "7.2.0",
    engine: "0c8ef2ce45c83248ab3df073180d5eda9e8be7a3"
};
Prisma.PrismaClientKnownRequestError = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientUnknownRequestError = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientRustPanicError = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientInitializationError = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientValidationError = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.Decimal = Decimal;
/**
 * Re-export of sql-template-tag
 */ Prisma.sql = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.empty = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.join = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.raw = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.validator = Public.validator;
/**
* Extensions
*/ Prisma.getExtensionContext = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.defineExtension = ()=>{
    const runtimeName = getRuntime().prettyName;
    throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
/**
 * Shorthand utilities for JSON filtering
 */ Prisma.DbNull = DbNull;
Prisma.JsonNull = JsonNull;
Prisma.AnyNull = AnyNull;
Prisma.NullTypes = NullTypes;
/**
 * Enums
 */ exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.Prisma.BrandScalarFieldEnum = {
    id: 'id',
    name: 'name',
    slug: 'slug',
    website: 'website',
    logo: 'logo',
    description: 'description'
};
exports.Prisma.CaliberScalarFieldEnum = {
    id: 'id',
    name: 'name',
    slug: 'slug',
    type: 'type'
};
exports.Prisma.OfferScalarFieldEnum = {
    id: 'id',
    itemId: 'itemId',
    retailerId: 'retailerId',
    url: 'url',
    inStock: 'inStock',
    price: 'price',
    currency: 'currency',
    shippingCost: 'shippingCost',
    total: 'total',
    freeShipping: 'freeShipping',
    shippingNote: 'shippingNote',
    shippingUpdatedAt: 'shippingUpdatedAt',
    unitsCount: 'unitsCount',
    unitLabel: 'unitLabel',
    unitPrice: 'unitPrice',
    totalUnitPrice: 'totalUnitPrice',
    retailerSku: 'retailerSku',
    isManuallyOOS: 'isManuallyOOS',
    oosReportCount: 'oosReportCount',
    lastStockChange: 'lastStockChange',
    lastSeen: 'lastSeen'
};
exports.Prisma.RetailerScalarFieldEnum = {
    id: 'id',
    name: 'name',
    domain: 'domain',
    logo: 'logo',
    rating: 'rating',
    shippingRating: 'shippingRating'
};
exports.Prisma.AccessoryFitmentScalarFieldEnum = {
    id: 'id',
    accessorySpecsId: 'accessorySpecsId',
    fitmentType: 'fitmentType',
    firearmItemId: 'firearmItemId',
    platform: 'platform',
    note: 'note'
};
exports.Prisma.AccessorySpecsScalarFieldEnum = {
    id: 'id',
    itemId: 'itemId',
    accessoryTypeId: 'accessoryTypeId',
    material: 'material',
    color: 'color',
    notes: 'notes'
};
exports.Prisma.AccessoryTypeScalarFieldEnum = {
    id: 'id',
    name: 'name',
    slug: 'slug'
};
exports.Prisma.AlertScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    type: 'type',
    calId: 'calId',
    itemId: 'itemId',
    keyword: 'keyword',
    targetCpr: 'targetCpr',
    excludeSteel: 'excludeSteel',
    excludeReman: 'excludeReman',
    lastTriggered: 'lastTriggered',
    isActive: 'isActive',
    createdAt: 'createdAt'
};
exports.Prisma.AlertDeliveryScalarFieldEnum = {
    id: 'id',
    alertId: 'alertId',
    offerId: 'offerId',
    sentAt: 'sentAt',
    fingerprint: 'fingerprint',
    userId: 'userId'
};
exports.Prisma.AmmoSpecsScalarFieldEnum = {
    id: 'id',
    itemId: 'itemId',
    caliberId: 'caliberId',
    grain: 'grain',
    gauge: 'gauge',
    velocity: 'velocity',
    energy: 'energy',
    casing: 'casing',
    bulletType: 'bulletType',
    restrictions: 'restrictions',
    pressure: 'pressure',
    isSteelCase: 'isSteelCase',
    isRemanufactured: 'isRemanufactured',
    isSubsonic: 'isSubsonic'
};
exports.Prisma.BlockedRetailerScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    retailerId: 'retailerId',
    createdAt: 'createdAt'
};
exports.Prisma.CaliberAliasScalarFieldEnum = {
    id: 'id',
    caliberId: 'caliberId',
    alias: 'alias'
};
exports.Prisma.CatalogItemScalarFieldEnum = {
    id: 'id',
    kind: 'kind',
    slug: 'slug',
    upc: 'upc',
    mpn: 'mpn',
    title: 'title',
    image: 'image',
    description: 'description',
    brandId: 'brandId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    bestPrice: 'bestPrice',
    bestRetailerId: 'bestRetailerId',
    bestRetailerName: 'bestRetailerName',
    offerCount: 'offerCount',
    bestCpr: 'bestCpr',
    bestCprShipped: 'bestCprShipped',
    upvotes: 'upvotes',
    downvotes: 'downvotes'
};
exports.Prisma.FirearmCategoryScalarFieldEnum = {
    id: 'id',
    name: 'name',
    slug: 'slug'
};
exports.Prisma.FirearmChamberScalarFieldEnum = {
    firearmSpecsId: 'firearmSpecsId',
    caliberId: 'caliberId',
    note: 'note'
};
exports.Prisma.FirearmSpecsScalarFieldEnum = {
    id: 'id',
    itemId: 'itemId',
    manufacturer: 'manufacturer',
    model: 'model',
    platform: 'platform',
    firearmCategoryId: 'firearmCategoryId',
    barrelLengthIn: 'barrelLengthIn',
    actionType: 'actionType',
    isThreaded: 'isThreaded',
    pressureRating: 'pressureRating',
    firearmType: 'firearmType',
    capacity: 'capacity',
    finish: 'finish',
    weight: 'weight',
    overallLength: 'overallLength',
    features: 'features',
    sight: 'sight',
    safety: 'safety'
};
exports.Prisma.OwnedFirearmScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    firearmItemId: 'firearmItemId',
    nickname: 'nickname',
    createdAt: 'createdAt'
};
exports.Prisma.UserScalarFieldEnum = {
    id: 'id',
    name: 'name',
    email: 'email',
    emailVerified: 'emailVerified',
    image: 'image',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.Raw_offer_ingestScalarFieldEnum = {
    time: 'time',
    bucket_5m: 'bucket_5m',
    group_id: 'group_id',
    item_url: 'item_url',
    item_type: 'item_type',
    retailer_name: 'retailer_name',
    offer_url: 'offer_url',
    price: 'price',
    shipping_text: 'shipping_text',
    shipping_cost: 'shipping_cost',
    total: 'total',
    in_stock: 'in_stock',
    source: 'source',
    offer_fingerprint: 'offer_fingerprint'
};
exports.Prisma.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.Prisma.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.Prisma.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.FitmentType = exports.$Enums.FitmentType = {
    EXACT_MODEL: 'EXACT_MODEL',
    PLATFORM: 'PLATFORM',
    UNIVERSAL: 'UNIVERSAL'
};
exports.AlertType = exports.$Enums.AlertType = {
    CALIBER: 'CALIBER',
    ITEM: 'ITEM',
    KEYWORD: 'KEYWORD'
};
exports.AmmoPressure = exports.$Enums.AmmoPressure = {
    UNKNOWN: 'UNKNOWN',
    STANDARD: 'STANDARD',
    PLUS_P: 'PLUS_P',
    PLUS_P_PLUS: 'PLUS_P_PLUS'
};
exports.CatalogKind = exports.$Enums.CatalogKind = {
    AMMO: 'AMMO',
    FIREARM: 'FIREARM',
    ACCESSORY: 'ACCESSORY'
};
exports.FirearmPressureRating = exports.$Enums.FirearmPressureRating = {
    UNKNOWN: 'UNKNOWN',
    STANDARD_ONLY: 'STANDARD_ONLY',
    PLUS_P_OK: 'PLUS_P_OK',
    PLUS_P_PLUS_OK: 'PLUS_P_PLUS_OK'
};
exports.Prisma.ModelName = {
    Brand: 'Brand',
    Caliber: 'Caliber',
    Offer: 'Offer',
    Retailer: 'Retailer',
    AccessoryFitment: 'AccessoryFitment',
    AccessorySpecs: 'AccessorySpecs',
    AccessoryType: 'AccessoryType',
    Alert: 'Alert',
    AlertDelivery: 'AlertDelivery',
    AmmoSpecs: 'AmmoSpecs',
    BlockedRetailer: 'BlockedRetailer',
    CaliberAlias: 'CaliberAlias',
    CatalogItem: 'CatalogItem',
    FirearmCategory: 'FirearmCategory',
    FirearmChamber: 'FirearmChamber',
    FirearmSpecs: 'FirearmSpecs',
    OwnedFirearm: 'OwnedFirearm',
    User: 'User',
    raw_offer_ingest: 'raw_offer_ingest'
};
/**
 * This is a stub Prisma Client that will error at runtime if called.
 */ class PrismaClient {
    constructor(){
        return new Proxy(this, {
            get (target, prop) {
                let message;
                const runtime = getRuntime();
                if (runtime.isEdge) {
                    message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
                } else {
                    message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).';
                }
                message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`;
                throw new Error(message);
            }
        });
    }
}
exports.PrismaClient = PrismaClient;
Object.assign(exports, Prisma);
}),
"[project]/Downloads/getLoaded/node_modules/.pnpm/postgres-array@2.0.0/node_modules/postgres-array/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

exports.parse = function(source, transform) {
    return new ArrayParser(source, transform).parse();
};
class ArrayParser {
    constructor(source, transform){
        this.source = source;
        this.transform = transform || identity;
        this.position = 0;
        this.entries = [];
        this.recorded = [];
        this.dimension = 0;
    }
    isEof() {
        return this.position >= this.source.length;
    }
    nextCharacter() {
        var character = this.source[this.position++];
        if (character === '\\') {
            return {
                value: this.source[this.position++],
                escaped: true
            };
        }
        return {
            value: character,
            escaped: false
        };
    }
    record(character) {
        this.recorded.push(character);
    }
    newEntry(includeEmpty) {
        var entry;
        if (this.recorded.length > 0 || includeEmpty) {
            entry = this.recorded.join('');
            if (entry === 'NULL' && !includeEmpty) {
                entry = null;
            }
            if (entry !== null) entry = this.transform(entry);
            this.entries.push(entry);
            this.recorded = [];
        }
    }
    consumeDimensions() {
        if (this.source[0] === '[') {
            while(!this.isEof()){
                var char = this.nextCharacter();
                if (char.value === '=') break;
            }
        }
    }
    parse(nested) {
        var character, parser, quote;
        this.consumeDimensions();
        while(!this.isEof()){
            character = this.nextCharacter();
            if (character.value === '{' && !quote) {
                this.dimension++;
                if (this.dimension > 1) {
                    parser = new ArrayParser(this.source.substr(this.position - 1), this.transform);
                    this.entries.push(parser.parse(true));
                    this.position += parser.position - 2;
                }
            } else if (character.value === '}' && !quote) {
                this.dimension--;
                if (!this.dimension) {
                    this.newEntry();
                    if (nested) return this.entries;
                }
            } else if (character.value === '"' && !character.escaped) {
                if (quote) this.newEntry(true);
                quote = !quote;
            } else if (character.value === ',' && !quote) {
                this.newEntry();
            } else {
                this.record(character.value);
            }
        }
        if (this.dimension !== 0) {
            throw new Error('array dimension not balanced');
        }
        return this.entries;
    }
}
function identity(value) {
    return value;
}
}),
"[project]/Downloads/getLoaded/node_modules/.pnpm/postgres-array@3.0.4/node_modules/postgres-array/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

const BACKSLASH = '\\';
const DQUOT = '"';
const LBRACE = '{';
const RBRACE = '}';
const LBRACKET = '[';
const EQUALS = '=';
const COMMA = ',';
/** When the raw value is this, it means a literal `null` */ const NULL_STRING = 'NULL';
/**
 * Parses an array according to
 * https://www.postgresql.org/docs/17/arrays.html#ARRAYS-IO
 *
 * Trusts the data (mostly), so only hook up to trusted Postgres servers.
 */ function makeParseArrayWithTransform(transform) {
    const haveTransform = transform != null;
    return function parseArray(str) {
        const rbraceIndex = str.length - 1;
        if (rbraceIndex === 1) {
            return [];
        }
        if (str[rbraceIndex] !== RBRACE) {
            throw new Error('Invalid array text - must end with }');
        }
        // If starts with `[`, it is specifying the index boundas. Skip past first `=`.
        let position = 0;
        if (str[position] === LBRACKET) {
            position = str.indexOf(EQUALS) + 1;
        }
        if (str[position++] !== LBRACE) {
            throw new Error('Invalid array text - must start with {');
        }
        const output = [];
        let current = output;
        const stack = [];
        let currentStringStart = position;
        let currentString = '';
        let expectValue = true;
        for(; position < rbraceIndex; ++position){
            let char = str[position];
            // > The array output routine will put double quotes around element values if
            // > they are empty strings, contain curly braces, delimiter characters, double
            // > quotes, backslashes, or white space, or match the word NULL. Double quotes
            // > and backslashes embedded in element values will be backslash-escaped.
            if (char === DQUOT) {
                // It's escaped
                currentStringStart = ++position;
                let dquot = str.indexOf(DQUOT, currentStringStart);
                let backSlash = str.indexOf(BACKSLASH, currentStringStart);
                while(backSlash !== -1 && backSlash < dquot){
                    position = backSlash;
                    const part = str.slice(currentStringStart, position);
                    currentString += part;
                    currentStringStart = ++position;
                    if (dquot === position++) {
                        // This was an escaped doublequote; find the next one!
                        dquot = str.indexOf(DQUOT, position);
                    }
                    // Either way, find the next backslash
                    backSlash = str.indexOf(BACKSLASH, position);
                }
                position = dquot;
                const part = str.slice(currentStringStart, position);
                currentString += part;
                current.push(haveTransform ? transform(currentString) : currentString);
                currentString = '';
                expectValue = false;
            } else if (char === LBRACE) {
                const newArray = [];
                current.push(newArray);
                stack.push(current);
                current = newArray;
                currentStringStart = position + 1;
                expectValue = true;
            } else if (char === COMMA) {
                expectValue = true;
            } else if (char === RBRACE) {
                expectValue = false;
                const arr = stack.pop();
                if (arr === undefined) {
                    throw new Error("Invalid array text - too many '}'");
                }
                current = arr;
            } else if (expectValue) {
                currentStringStart = position;
                while((char = str[position]) !== COMMA && char !== RBRACE && position < rbraceIndex){
                    ++position;
                }
                const part = str.slice(currentStringStart, position--);
                current.push(part === NULL_STRING ? null : haveTransform ? transform(part) : part);
                expectValue = false;
            } else {
                throw new Error('Was expecting delimeter');
            }
        }
        return output;
    };
}
const parseArray = makeParseArrayWithTransform();
exports.parse = (source, transform)=>transform != null ? makeParseArrayWithTransform(transform)(source) : parseArray(source);
}),
"[project]/Downloads/getLoaded/node_modules/.pnpm/pg-types@2.2.0/node_modules/pg-types/lib/arrayParser.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

var array = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/postgres-array@2.0.0/node_modules/postgres-array/index.js [app-client] (ecmascript)");
module.exports = {
    create: function(source, transform) {
        return {
            parse: function() {
                return array.parse(source, transform);
            }
        };
    }
};
}),
"[project]/Downloads/getLoaded/node_modules/.pnpm/pg-types@2.2.0/node_modules/pg-types/lib/textParsers.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

var array = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/postgres-array@2.0.0/node_modules/postgres-array/index.js [app-client] (ecmascript)");
var arrayParser = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/pg-types@2.2.0/node_modules/pg-types/lib/arrayParser.js [app-client] (ecmascript)");
var parseDate = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/postgres-date@1.0.7/node_modules/postgres-date/index.js [app-client] (ecmascript)");
var parseInterval = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/postgres-interval@1.2.0/node_modules/postgres-interval/index.js [app-client] (ecmascript)");
var parseByteA = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/postgres-bytea@1.0.1/node_modules/postgres-bytea/index.js [app-client] (ecmascript)");
function allowNull(fn) {
    return function nullAllowed(value) {
        if (value === null) return value;
        return fn(value);
    };
}
function parseBool(value) {
    if (value === null) return value;
    return value === 'TRUE' || value === 't' || value === 'true' || value === 'y' || value === 'yes' || value === 'on' || value === '1';
}
function parseBoolArray(value) {
    if (!value) return null;
    return array.parse(value, parseBool);
}
function parseBaseTenInt(string) {
    return parseInt(string, 10);
}
function parseIntegerArray(value) {
    if (!value) return null;
    return array.parse(value, allowNull(parseBaseTenInt));
}
function parseBigIntegerArray(value) {
    if (!value) return null;
    return array.parse(value, allowNull(function(entry) {
        return parseBigInteger(entry).trim();
    }));
}
var parsePointArray = function(value) {
    if (!value) {
        return null;
    }
    var p = arrayParser.create(value, function(entry) {
        if (entry !== null) {
            entry = parsePoint(entry);
        }
        return entry;
    });
    return p.parse();
};
var parseFloatArray = function(value) {
    if (!value) {
        return null;
    }
    var p = arrayParser.create(value, function(entry) {
        if (entry !== null) {
            entry = parseFloat(entry);
        }
        return entry;
    });
    return p.parse();
};
var parseStringArray = function(value) {
    if (!value) {
        return null;
    }
    var p = arrayParser.create(value);
    return p.parse();
};
var parseDateArray = function(value) {
    if (!value) {
        return null;
    }
    var p = arrayParser.create(value, function(entry) {
        if (entry !== null) {
            entry = parseDate(entry);
        }
        return entry;
    });
    return p.parse();
};
var parseIntervalArray = function(value) {
    if (!value) {
        return null;
    }
    var p = arrayParser.create(value, function(entry) {
        if (entry !== null) {
            entry = parseInterval(entry);
        }
        return entry;
    });
    return p.parse();
};
var parseByteAArray = function(value) {
    if (!value) {
        return null;
    }
    return array.parse(value, allowNull(parseByteA));
};
var parseInteger = function(value) {
    return parseInt(value, 10);
};
var parseBigInteger = function(value) {
    var valStr = String(value);
    if (/^\d+$/.test(valStr)) {
        return valStr;
    }
    return value;
};
var parseJsonArray = function(value) {
    if (!value) {
        return null;
    }
    return array.parse(value, allowNull(JSON.parse));
};
var parsePoint = function(value) {
    if (value[0] !== '(') {
        return null;
    }
    value = value.substring(1, value.length - 1).split(',');
    return {
        x: parseFloat(value[0]),
        y: parseFloat(value[1])
    };
};
var parseCircle = function(value) {
    if (value[0] !== '<' && value[1] !== '(') {
        return null;
    }
    var point = '(';
    var radius = '';
    var pointParsed = false;
    for(var i = 2; i < value.length - 1; i++){
        if (!pointParsed) {
            point += value[i];
        }
        if (value[i] === ')') {
            pointParsed = true;
            continue;
        } else if (!pointParsed) {
            continue;
        }
        if (value[i] === ',') {
            continue;
        }
        radius += value[i];
    }
    var result = parsePoint(point);
    result.radius = parseFloat(radius);
    return result;
};
var init = function(register) {
    register(20, parseBigInteger); // int8
    register(21, parseInteger); // int2
    register(23, parseInteger); // int4
    register(26, parseInteger); // oid
    register(700, parseFloat); // float4/real
    register(701, parseFloat); // float8/double
    register(16, parseBool);
    register(1082, parseDate); // date
    register(1114, parseDate); // timestamp without timezone
    register(1184, parseDate); // timestamp
    register(600, parsePoint); // point
    register(651, parseStringArray); // cidr[]
    register(718, parseCircle); // circle
    register(1000, parseBoolArray);
    register(1001, parseByteAArray);
    register(1005, parseIntegerArray); // _int2
    register(1007, parseIntegerArray); // _int4
    register(1028, parseIntegerArray); // oid[]
    register(1016, parseBigIntegerArray); // _int8
    register(1017, parsePointArray); // point[]
    register(1021, parseFloatArray); // _float4
    register(1022, parseFloatArray); // _float8
    register(1231, parseFloatArray); // _numeric
    register(1014, parseStringArray); //char
    register(1015, parseStringArray); //varchar
    register(1008, parseStringArray);
    register(1009, parseStringArray);
    register(1040, parseStringArray); // macaddr[]
    register(1041, parseStringArray); // inet[]
    register(1115, parseDateArray); // timestamp without time zone[]
    register(1182, parseDateArray); // _date
    register(1185, parseDateArray); // timestamp with time zone[]
    register(1186, parseInterval);
    register(1187, parseIntervalArray);
    register(17, parseByteA);
    register(114, JSON.parse.bind(JSON)); // json
    register(3802, JSON.parse.bind(JSON)); // jsonb
    register(199, parseJsonArray); // json[]
    register(3807, parseJsonArray); // jsonb[]
    register(3907, parseStringArray); // numrange[]
    register(2951, parseStringArray); // uuid[]
    register(791, parseStringArray); // money[]
    register(1183, parseStringArray); // time[]
    register(1270, parseStringArray); // timetz[]
};
module.exports = {
    init: init
};
}),
"[project]/Downloads/getLoaded/node_modules/.pnpm/pg-types@2.2.0/node_modules/pg-types/lib/binaryParsers.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

var parseInt64 = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/pg-int8@1.0.1/node_modules/pg-int8/index.js [app-client] (ecmascript)");
var parseBits = function(data, bits, offset, invert, callback) {
    offset = offset || 0;
    invert = invert || false;
    callback = callback || function(lastValue, newValue, bits) {
        return lastValue * Math.pow(2, bits) + newValue;
    };
    var offsetBytes = offset >> 3;
    var inv = function(value) {
        if (invert) {
            return ~value & 0xff;
        }
        return value;
    };
    // read first (maybe partial) byte
    var mask = 0xff;
    var firstBits = 8 - offset % 8;
    if (bits < firstBits) {
        mask = 0xff << 8 - bits & 0xff;
        firstBits = bits;
    }
    if (offset) {
        mask = mask >> offset % 8;
    }
    var result = 0;
    if (offset % 8 + bits >= 8) {
        result = callback(0, inv(data[offsetBytes]) & mask, firstBits);
    }
    // read bytes
    var bytes = bits + offset >> 3;
    for(var i = offsetBytes + 1; i < bytes; i++){
        result = callback(result, inv(data[i]), 8);
    }
    // bits to read, that are not a complete byte
    var lastBits = (bits + offset) % 8;
    if (lastBits > 0) {
        result = callback(result, inv(data[bytes]) >> 8 - lastBits, lastBits);
    }
    return result;
};
var parseFloatFromBits = function(data, precisionBits, exponentBits) {
    var bias = Math.pow(2, exponentBits - 1) - 1;
    var sign = parseBits(data, 1);
    var exponent = parseBits(data, exponentBits, 1);
    if (exponent === 0) {
        return 0;
    }
    // parse mantissa
    var precisionBitsCounter = 1;
    var parsePrecisionBits = function(lastValue, newValue, bits) {
        if (lastValue === 0) {
            lastValue = 1;
        }
        for(var i = 1; i <= bits; i++){
            precisionBitsCounter /= 2;
            if ((newValue & 0x1 << bits - i) > 0) {
                lastValue += precisionBitsCounter;
            }
        }
        return lastValue;
    };
    var mantissa = parseBits(data, precisionBits, exponentBits + 1, false, parsePrecisionBits);
    // special cases
    if (exponent == Math.pow(2, exponentBits + 1) - 1) {
        if (mantissa === 0) {
            return sign === 0 ? Infinity : -Infinity;
        }
        return NaN;
    }
    // normale number
    return (sign === 0 ? 1 : -1) * Math.pow(2, exponent - bias) * mantissa;
};
var parseInt16 = function(value) {
    if (parseBits(value, 1) == 1) {
        return -1 * (parseBits(value, 15, 1, true) + 1);
    }
    return parseBits(value, 15, 1);
};
var parseInt32 = function(value) {
    if (parseBits(value, 1) == 1) {
        return -1 * (parseBits(value, 31, 1, true) + 1);
    }
    return parseBits(value, 31, 1);
};
var parseFloat32 = function(value) {
    return parseFloatFromBits(value, 23, 8);
};
var parseFloat64 = function(value) {
    return parseFloatFromBits(value, 52, 11);
};
var parseNumeric = function(value) {
    var sign = parseBits(value, 16, 32);
    if (sign == 0xc000) {
        return NaN;
    }
    var weight = Math.pow(10000, parseBits(value, 16, 16));
    var result = 0;
    var digits = [];
    var ndigits = parseBits(value, 16);
    for(var i = 0; i < ndigits; i++){
        result += parseBits(value, 16, 64 + 16 * i) * weight;
        weight /= 10000;
    }
    var scale = Math.pow(10, parseBits(value, 16, 48));
    return (sign === 0 ? 1 : -1) * Math.round(result * scale) / scale;
};
var parseDate = function(isUTC, value) {
    var sign = parseBits(value, 1);
    var rawValue = parseBits(value, 63, 1);
    // discard usecs and shift from 2000 to 1970
    var result = new Date((sign === 0 ? 1 : -1) * rawValue / 1000 + 946684800000);
    if (!isUTC) {
        result.setTime(result.getTime() + result.getTimezoneOffset() * 60000);
    }
    // add microseconds to the date
    result.usec = rawValue % 1000;
    result.getMicroSeconds = function() {
        return this.usec;
    };
    result.setMicroSeconds = function(value) {
        this.usec = value;
    };
    result.getUTCMicroSeconds = function() {
        return this.usec;
    };
    return result;
};
var parseArray = function(value) {
    var dim = parseBits(value, 32);
    var flags = parseBits(value, 32, 32);
    var elementType = parseBits(value, 32, 64);
    var offset = 96;
    var dims = [];
    for(var i = 0; i < dim; i++){
        // parse dimension
        dims[i] = parseBits(value, 32, offset);
        offset += 32;
        // ignore lower bounds
        offset += 32;
    }
    var parseElement = function(elementType) {
        // parse content length
        var length = parseBits(value, 32, offset);
        offset += 32;
        // parse null values
        if (length == 0xffffffff) {
            return null;
        }
        var result;
        if (elementType == 0x17 || elementType == 0x14) {
            // int/bigint
            result = parseBits(value, length * 8, offset);
            offset += length * 8;
            return result;
        } else if (elementType == 0x19) {
            // string
            result = value.toString(this.encoding, offset >> 3, (offset += length << 3) >> 3);
            return result;
        } else {
            console.log("ERROR: ElementType not implemented: " + elementType);
        }
    };
    var parse = function(dimension, elementType) {
        var array = [];
        var i;
        if (dimension.length > 1) {
            var count = dimension.shift();
            for(i = 0; i < count; i++){
                array[i] = parse(dimension, elementType);
            }
            dimension.unshift(count);
        } else {
            for(i = 0; i < dimension[0]; i++){
                array[i] = parseElement(elementType);
            }
        }
        return array;
    };
    return parse(dims, elementType);
};
var parseText = function(value) {
    return value.toString('utf8');
};
var parseBool = function(value) {
    if (value === null) return null;
    return parseBits(value, 8) > 0;
};
var init = function(register) {
    register(20, parseInt64);
    register(21, parseInt16);
    register(23, parseInt32);
    register(26, parseInt32);
    register(1700, parseNumeric);
    register(700, parseFloat32);
    register(701, parseFloat64);
    register(16, parseBool);
    register(1114, parseDate.bind(null, false));
    register(1184, parseDate.bind(null, true));
    register(1000, parseArray);
    register(1007, parseArray);
    register(1016, parseArray);
    register(1008, parseArray);
    register(1009, parseArray);
    register(25, parseText);
};
module.exports = {
    init: init
};
}),
"[project]/Downloads/getLoaded/node_modules/.pnpm/pg-types@2.2.0/node_modules/pg-types/lib/builtins.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

/**
 * Following query was used to generate this file:

 SELECT json_object_agg(UPPER(PT.typname), PT.oid::int4 ORDER BY pt.oid)
 FROM pg_type PT
 WHERE typnamespace = (SELECT pgn.oid FROM pg_namespace pgn WHERE nspname = 'pg_catalog') -- Take only builting Postgres types with stable OID (extension types are not guaranted to be stable)
 AND typtype = 'b' -- Only basic types
 AND typelem = 0 -- Ignore aliases
 AND typisdefined -- Ignore undefined types
 */ module.exports = {
    BOOL: 16,
    BYTEA: 17,
    CHAR: 18,
    INT8: 20,
    INT2: 21,
    INT4: 23,
    REGPROC: 24,
    TEXT: 25,
    OID: 26,
    TID: 27,
    XID: 28,
    CID: 29,
    JSON: 114,
    XML: 142,
    PG_NODE_TREE: 194,
    SMGR: 210,
    PATH: 602,
    POLYGON: 604,
    CIDR: 650,
    FLOAT4: 700,
    FLOAT8: 701,
    ABSTIME: 702,
    RELTIME: 703,
    TINTERVAL: 704,
    CIRCLE: 718,
    MACADDR8: 774,
    MONEY: 790,
    MACADDR: 829,
    INET: 869,
    ACLITEM: 1033,
    BPCHAR: 1042,
    VARCHAR: 1043,
    DATE: 1082,
    TIME: 1083,
    TIMESTAMP: 1114,
    TIMESTAMPTZ: 1184,
    INTERVAL: 1186,
    TIMETZ: 1266,
    BIT: 1560,
    VARBIT: 1562,
    NUMERIC: 1700,
    REFCURSOR: 1790,
    REGPROCEDURE: 2202,
    REGOPER: 2203,
    REGOPERATOR: 2204,
    REGCLASS: 2205,
    REGTYPE: 2206,
    UUID: 2950,
    TXID_SNAPSHOT: 2970,
    PG_LSN: 3220,
    PG_NDISTINCT: 3361,
    PG_DEPENDENCIES: 3402,
    TSVECTOR: 3614,
    TSQUERY: 3615,
    GTSVECTOR: 3642,
    REGCONFIG: 3734,
    REGDICTIONARY: 3769,
    JSONB: 3802,
    REGNAMESPACE: 4089,
    REGROLE: 4096
};
}),
"[project]/Downloads/getLoaded/node_modules/.pnpm/pg-types@2.2.0/node_modules/pg-types/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

var textParsers = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/pg-types@2.2.0/node_modules/pg-types/lib/textParsers.js [app-client] (ecmascript)");
var binaryParsers = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/pg-types@2.2.0/node_modules/pg-types/lib/binaryParsers.js [app-client] (ecmascript)");
var arrayParser = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/pg-types@2.2.0/node_modules/pg-types/lib/arrayParser.js [app-client] (ecmascript)");
var builtinTypes = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/pg-types@2.2.0/node_modules/pg-types/lib/builtins.js [app-client] (ecmascript)");
exports.getTypeParser = getTypeParser;
exports.setTypeParser = setTypeParser;
exports.arrayParser = arrayParser;
exports.builtins = builtinTypes;
var typeParsers = {
    text: {},
    binary: {}
};
//the empty parse function
function noParse(val) {
    return String(val);
}
;
//returns a function used to convert a specific type (specified by
//oid) into a result javascript type
//note: the oid can be obtained via the following sql query:
//SELECT oid FROM pg_type WHERE typname = 'TYPE_NAME_HERE';
function getTypeParser(oid, format) {
    format = format || 'text';
    if (!typeParsers[format]) {
        return noParse;
    }
    return typeParsers[format][oid] || noParse;
}
;
function setTypeParser(oid, format, parseFn) {
    if (typeof format == 'function') {
        parseFn = format;
        format = 'text';
    }
    typeParsers[format][oid] = parseFn;
}
;
textParsers.init(function(oid, converter) {
    typeParsers.text[oid] = converter;
});
binaryParsers.init(function(oid, converter) {
    typeParsers.binary[oid] = converter;
});
}),
"[project]/Downloads/getLoaded/node_modules/.pnpm/postgres-date@1.0.7/node_modules/postgres-date/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var DATE_TIME = /(\d{1,})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(\.\d{1,})?.*?( BC)?$/;
var DATE = /^(\d{1,})-(\d{2})-(\d{2})( BC)?$/;
var TIME_ZONE = /([Z+-])(\d{2})?:?(\d{2})?:?(\d{2})?/;
var INFINITY = /^-?infinity$/;
module.exports = function parseDate(isoDate) {
    if (INFINITY.test(isoDate)) {
        // Capitalize to Infinity before passing to Number
        return Number(isoDate.replace('i', 'I'));
    }
    var matches = DATE_TIME.exec(isoDate);
    if (!matches) {
        // Force YYYY-MM-DD dates to be parsed as local time
        return getDate(isoDate) || null;
    }
    var isBC = !!matches[8];
    var year = parseInt(matches[1], 10);
    if (isBC) {
        year = bcYearToNegativeYear(year);
    }
    var month = parseInt(matches[2], 10) - 1;
    var day = matches[3];
    var hour = parseInt(matches[4], 10);
    var minute = parseInt(matches[5], 10);
    var second = parseInt(matches[6], 10);
    var ms = matches[7];
    ms = ms ? 1000 * parseFloat(ms) : 0;
    var date;
    var offset = timeZoneOffset(isoDate);
    if (offset != null) {
        date = new Date(Date.UTC(year, month, day, hour, minute, second, ms));
        // Account for years from 0 to 99 being interpreted as 1900-1999
        // by Date.UTC / the multi-argument form of the Date constructor
        if (is0To99(year)) {
            date.setUTCFullYear(year);
        }
        if (offset !== 0) {
            date.setTime(date.getTime() - offset);
        }
    } else {
        date = new Date(year, month, day, hour, minute, second, ms);
        if (is0To99(year)) {
            date.setFullYear(year);
        }
    }
    return date;
};
function getDate(isoDate) {
    var matches = DATE.exec(isoDate);
    if (!matches) {
        return;
    }
    var year = parseInt(matches[1], 10);
    var isBC = !!matches[4];
    if (isBC) {
        year = bcYearToNegativeYear(year);
    }
    var month = parseInt(matches[2], 10) - 1;
    var day = matches[3];
    // YYYY-MM-DD will be parsed as local time
    var date = new Date(year, month, day);
    if (is0To99(year)) {
        date.setFullYear(year);
    }
    return date;
}
// match timezones:
// Z (UTC)
// -05
// +06:30
function timeZoneOffset(isoDate) {
    if (isoDate.endsWith('+00')) {
        return 0;
    }
    var zone = TIME_ZONE.exec(isoDate.split(' ')[1]);
    if (!zone) return;
    var type = zone[1];
    if (type === 'Z') {
        return 0;
    }
    var sign = type === '-' ? -1 : 1;
    var offset = parseInt(zone[2], 10) * 3600 + parseInt(zone[3] || 0, 10) * 60 + parseInt(zone[4] || 0, 10);
    return offset * sign * 1000;
}
function bcYearToNegativeYear(year) {
    // Account for numerical difference between representations of BC years
    // See: https://github.com/bendrucker/postgres-date/issues/5
    return -(year - 1);
}
function is0To99(num) {
    return num >= 0 && num < 100;
}
}),
"[project]/Downloads/getLoaded/node_modules/.pnpm/xtend@4.0.2/node_modules/xtend/mutable.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = extend;
var hasOwnProperty = Object.prototype.hasOwnProperty;
function extend(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i];
        for(var key in source){
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
}
}),
"[project]/Downloads/getLoaded/node_modules/.pnpm/postgres-interval@1.2.0/node_modules/postgres-interval/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var extend = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/xtend@4.0.2/node_modules/xtend/mutable.js [app-client] (ecmascript)");
module.exports = PostgresInterval;
function PostgresInterval(raw) {
    if (!(this instanceof PostgresInterval)) {
        return new PostgresInterval(raw);
    }
    extend(this, parse(raw));
}
var properties = [
    'seconds',
    'minutes',
    'hours',
    'days',
    'months',
    'years'
];
PostgresInterval.prototype.toPostgres = function() {
    var filtered = properties.filter(this.hasOwnProperty, this);
    // In addition to `properties`, we need to account for fractions of seconds.
    if (this.milliseconds && filtered.indexOf('seconds') < 0) {
        filtered.push('seconds');
    }
    if (filtered.length === 0) return '0';
    return filtered.map(function(property) {
        var value = this[property] || 0;
        // Account for fractional part of seconds,
        // remove trailing zeroes.
        if (property === 'seconds' && this.milliseconds) {
            value = (value + this.milliseconds / 1000).toFixed(6).replace(/\.?0+$/, '');
        }
        return value + ' ' + property;
    }, this).join(' ');
};
var propertiesISOEquivalent = {
    years: 'Y',
    months: 'M',
    days: 'D',
    hours: 'H',
    minutes: 'M',
    seconds: 'S'
};
var dateProperties = [
    'years',
    'months',
    'days'
];
var timeProperties = [
    'hours',
    'minutes',
    'seconds'
];
// according to ISO 8601
PostgresInterval.prototype.toISOString = PostgresInterval.prototype.toISO = function() {
    var datePart = dateProperties.map(buildProperty, this).join('');
    var timePart = timeProperties.map(buildProperty, this).join('');
    return 'P' + datePart + 'T' + timePart;
    //TURBOPACK unreachable
    ;
    function buildProperty(property) {
        var value = this[property] || 0;
        // Account for fractional part of seconds,
        // remove trailing zeroes.
        if (property === 'seconds' && this.milliseconds) {
            value = (value + this.milliseconds / 1000).toFixed(6).replace(/0+$/, '');
        }
        return value + propertiesISOEquivalent[property];
    }
};
var NUMBER = '([+-]?\\d+)';
var YEAR = NUMBER + '\\s+years?';
var MONTH = NUMBER + '\\s+mons?';
var DAY = NUMBER + '\\s+days?';
var TIME = '([+-])?([\\d]*):(\\d\\d):(\\d\\d)\\.?(\\d{1,6})?';
var INTERVAL = new RegExp([
    YEAR,
    MONTH,
    DAY,
    TIME
].map(function(regexString) {
    return '(' + regexString + ')?';
}).join('\\s*'));
// Positions of values in regex match
var positions = {
    years: 2,
    months: 4,
    days: 6,
    hours: 9,
    minutes: 10,
    seconds: 11,
    milliseconds: 12
};
// We can use negative time
var negatives = [
    'hours',
    'minutes',
    'seconds',
    'milliseconds'
];
function parseMilliseconds(fraction) {
    // add omitted zeroes
    var microseconds = fraction + '000000'.slice(fraction.length);
    return parseInt(microseconds, 10) / 1000;
}
function parse(interval) {
    if (!interval) return {};
    var matches = INTERVAL.exec(interval);
    var isNegative = matches[8] === '-';
    return Object.keys(positions).reduce(function(parsed, property) {
        var position = positions[property];
        var value = matches[position];
        // no empty string
        if (!value) return parsed;
        // milliseconds are actually microseconds (up to 6 digits)
        // with omitted trailing zeroes.
        value = property === 'milliseconds' ? parseMilliseconds(value) : parseInt(value, 10);
        // no zeros
        if (!value) return parsed;
        if (isNegative && ~negatives.indexOf(property)) {
            value *= -1;
        }
        parsed[property] = value;
        return parsed;
    }, {});
}
}),
"[project]/Downloads/getLoaded/node_modules/.pnpm/postgres-bytea@1.0.1/node_modules/postgres-bytea/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Downloads/getLoaded/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
'use strict';
var bufferFrom = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from || __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"];
module.exports = function parseBytea(input) {
    if (/^\\x/.test(input)) {
        // new 'hex' style response (pg >9.0)
        return bufferFrom(input.substr(2), 'hex');
    }
    var output = '';
    var i = 0;
    while(i < input.length){
        if (input[i] !== '\\') {
            output += input[i];
            ++i;
        } else {
            if (/[0-7]{3}/.test(input.substr(i + 1, 3))) {
                output += String.fromCharCode(parseInt(input.substr(i + 1, 3), 8));
                i += 4;
            } else {
                var backslashes = 1;
                while(i + backslashes < input.length && input[i + backslashes] === '\\'){
                    backslashes++;
                }
                for(var k = 0; k < Math.floor(backslashes / 2); ++k){
                    output += '\\';
                }
                i += Math.floor(backslashes / 2) * 2;
            }
        }
    }
    return bufferFrom(output, 'binary');
};
}),
"[project]/Downloads/getLoaded/node_modules/.pnpm/pg-int8@1.0.1/node_modules/pg-int8/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// selected so (BASE - 1) * 0x100000000 + 0xffffffff is a safe integer
var BASE = 1000000;
function readInt8(buffer) {
    var high = buffer.readInt32BE(0);
    var low = buffer.readUInt32BE(4);
    var sign = '';
    if (high < 0) {
        high = ~high + (low === 0);
        low = ~low + 1 >>> 0;
        sign = '-';
    }
    var result = '';
    var carry;
    var t;
    var digits;
    var pad;
    var l;
    var i;
    {
        carry = high % BASE;
        high = high / BASE >>> 0;
        t = 0x100000000 * carry + low;
        low = t / BASE >>> 0;
        digits = '' + (t - BASE * low);
        if (low === 0 && high === 0) {
            return sign + digits + result;
        }
        pad = '';
        l = 6 - digits.length;
        for(i = 0; i < l; i++){
            pad += '0';
        }
        result = pad + digits + result;
    }
    {
        carry = high % BASE;
        high = high / BASE >>> 0;
        t = 0x100000000 * carry + low;
        low = t / BASE >>> 0;
        digits = '' + (t - BASE * low);
        if (low === 0 && high === 0) {
            return sign + digits + result;
        }
        pad = '';
        l = 6 - digits.length;
        for(i = 0; i < l; i++){
            pad += '0';
        }
        result = pad + digits + result;
    }
    {
        carry = high % BASE;
        high = high / BASE >>> 0;
        t = 0x100000000 * carry + low;
        low = t / BASE >>> 0;
        digits = '' + (t - BASE * low);
        if (low === 0 && high === 0) {
            return sign + digits + result;
        }
        pad = '';
        l = 6 - digits.length;
        for(i = 0; i < l; i++){
            pad += '0';
        }
        result = pad + digits + result;
    }
    {
        carry = high % BASE;
        t = 0x100000000 * carry + low;
        digits = '' + t % BASE;
        return sign + digits + result;
    }
}
module.exports = readInt8;
}),
"[project]/Downloads/getLoaded/node_modules/.pnpm/pg-connection-string@2.9.1/node_modules/pg-connection-string/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

//Parse method copied from https://github.com/brianc/node-postgres
//Copyright (c) 2010-2014 Brian Carlson (brian.m.carlson@gmail.com)
//MIT License
//parses a connection string
function parse(str, options = {}) {
    //unix socket
    if (str.charAt(0) === '/') {
        const config = str.split(' ');
        return {
            host: config[0],
            database: config[1]
        };
    }
    // Check for empty host in URL
    const config = {};
    let result;
    let dummyHost = false;
    if (/ |%[^a-f0-9]|%[a-f0-9][^a-f0-9]/i.test(str)) {
        // Ensure spaces are encoded as %20
        str = encodeURI(str).replace(/%25(\d\d)/g, '%$1');
    }
    try {
        try {
            result = new URL(str, 'postgres://base');
        } catch (e) {
            // The URL is invalid so try again with a dummy host
            result = new URL(str.replace('@/', '@___DUMMY___/'), 'postgres://base');
            dummyHost = true;
        }
    } catch (err) {
        // Remove the input from the error message to avoid leaking sensitive information
        err.input && (err.input = '*****REDACTED*****');
    }
    // We'd like to use Object.fromEntries() here but Node.js 10 does not support it
    for (const entry of result.searchParams.entries()){
        config[entry[0]] = entry[1];
    }
    config.user = config.user || decodeURIComponent(result.username);
    config.password = config.password || decodeURIComponent(result.password);
    if (result.protocol == 'socket:') {
        config.host = decodeURI(result.pathname);
        config.database = result.searchParams.get('db');
        config.client_encoding = result.searchParams.get('encoding');
        return config;
    }
    const hostname = dummyHost ? '' : result.hostname;
    if (!config.host) {
        // Only set the host if there is no equivalent query param.
        config.host = decodeURIComponent(hostname);
    } else if (hostname && /^%2f/i.test(hostname)) {
        // Only prepend the hostname to the pathname if it is not a URL encoded Unix socket host.
        result.pathname = hostname + result.pathname;
    }
    if (!config.port) {
        // Only set the port if there is no equivalent query param.
        config.port = result.port;
    }
    const pathname = result.pathname.slice(1) || null;
    config.database = pathname ? decodeURI(pathname) : null;
    if (config.ssl === 'true' || config.ssl === '1') {
        config.ssl = true;
    }
    if (config.ssl === '0') {
        config.ssl = false;
    }
    if (config.sslcert || config.sslkey || config.sslrootcert || config.sslmode) {
        config.ssl = {};
    }
    // Only try to load fs if we expect to read from the disk
    const fs = config.sslcert || config.sslkey || config.sslrootcert ? (()=>{
        const e = new Error("Cannot find module 'fs'");
        e.code = 'MODULE_NOT_FOUND';
        throw e;
    })() : null;
    if (config.sslcert) {
        config.ssl.cert = fs.readFileSync(config.sslcert).toString();
    }
    if (config.sslkey) {
        config.ssl.key = fs.readFileSync(config.sslkey).toString();
    }
    if (config.sslrootcert) {
        config.ssl.ca = fs.readFileSync(config.sslrootcert).toString();
    }
    if (options.useLibpqCompat && config.uselibpqcompat) {
        throw new Error('Both useLibpqCompat and uselibpqcompat are set. Please use only one of them.');
    }
    if (config.uselibpqcompat === 'true' || options.useLibpqCompat) {
        switch(config.sslmode){
            case 'disable':
                {
                    config.ssl = false;
                    break;
                }
            case 'prefer':
                {
                    config.ssl.rejectUnauthorized = false;
                    break;
                }
            case 'require':
                {
                    if (config.sslrootcert) {
                        // If a root CA is specified, behavior of `sslmode=require` will be the same as that of `verify-ca`
                        config.ssl.checkServerIdentity = function() {};
                    } else {
                        config.ssl.rejectUnauthorized = false;
                    }
                    break;
                }
            case 'verify-ca':
                {
                    if (!config.ssl.ca) {
                        throw new Error('SECURITY WARNING: Using sslmode=verify-ca requires specifying a CA with sslrootcert. If a public CA is used, verify-ca allows connections to a server that somebody else may have registered with the CA, making you vulnerable to Man-in-the-Middle attacks. Either specify a custom CA certificate with sslrootcert parameter or use sslmode=verify-full for proper security.');
                    }
                    config.ssl.checkServerIdentity = function() {};
                    break;
                }
            case 'verify-full':
                {
                    break;
                }
        }
    } else {
        switch(config.sslmode){
            case 'disable':
                {
                    config.ssl = false;
                    break;
                }
            case 'prefer':
            case 'require':
            case 'verify-ca':
            case 'verify-full':
                {
                    break;
                }
            case 'no-verify':
                {
                    config.ssl.rejectUnauthorized = false;
                    break;
                }
        }
    }
    return config;
}
// convert pg-connection-string ssl config to a ClientConfig.ConnectionOptions
function toConnectionOptions(sslConfig) {
    const connectionOptions = Object.entries(sslConfig).reduce((c, [key, value])=>{
        // we explicitly check for undefined and null instead of `if (value)` because some
        // options accept falsy values. Example: `ssl.rejectUnauthorized = false`
        if (value !== undefined && value !== null) {
            c[key] = value;
        }
        return c;
    }, {});
    return connectionOptions;
}
// convert pg-connection-string config to a ClientConfig
function toClientConfig(config) {
    const poolConfig = Object.entries(config).reduce((c, [key, value])=>{
        if (key === 'ssl') {
            const sslConfig = value;
            if (typeof sslConfig === 'boolean') {
                c[key] = sslConfig;
            }
            if (typeof sslConfig === 'object') {
                c[key] = toConnectionOptions(sslConfig);
            }
        } else if (value !== undefined && value !== null) {
            if (key === 'port') {
                // when port is not specified, it is converted into an empty string
                // we want to avoid NaN or empty string as a values in ClientConfig
                if (value !== '') {
                    const v = parseInt(value, 10);
                    if (isNaN(v)) {
                        throw new Error(`Invalid ${key}: ${value}`);
                    }
                    c[key] = v;
                }
            } else {
                c[key] = value;
            }
        }
        return c;
    }, {});
    return poolConfig;
}
// parses a connection string into ClientConfig
function parseIntoClientConfig(str) {
    return toClientConfig(parse(str));
}
module.exports = parse;
parse.parse = parse;
parse.toClientConfig = toClientConfig;
parse.parseIntoClientConfig = parseIntoClientConfig;
}),
"[project]/Downloads/getLoaded/node_modules/.pnpm/pg-protocol@1.10.3/node_modules/pg-protocol/dist/messages.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NoticeMessage = exports.DataRowMessage = exports.CommandCompleteMessage = exports.ReadyForQueryMessage = exports.NotificationResponseMessage = exports.BackendKeyDataMessage = exports.AuthenticationMD5Password = exports.ParameterStatusMessage = exports.ParameterDescriptionMessage = exports.RowDescriptionMessage = exports.Field = exports.CopyResponse = exports.CopyDataMessage = exports.DatabaseError = exports.copyDone = exports.emptyQuery = exports.replicationStart = exports.portalSuspended = exports.noData = exports.closeComplete = exports.bindComplete = exports.parseComplete = void 0;
exports.parseComplete = {
    name: 'parseComplete',
    length: 5
};
exports.bindComplete = {
    name: 'bindComplete',
    length: 5
};
exports.closeComplete = {
    name: 'closeComplete',
    length: 5
};
exports.noData = {
    name: 'noData',
    length: 5
};
exports.portalSuspended = {
    name: 'portalSuspended',
    length: 5
};
exports.replicationStart = {
    name: 'replicationStart',
    length: 4
};
exports.emptyQuery = {
    name: 'emptyQuery',
    length: 4
};
exports.copyDone = {
    name: 'copyDone',
    length: 4
};
class DatabaseError extends Error {
    constructor(message, length, name){
        super(message);
        this.length = length;
        this.name = name;
    }
}
exports.DatabaseError = DatabaseError;
class CopyDataMessage {
    constructor(length, chunk){
        this.length = length;
        this.chunk = chunk;
        this.name = 'copyData';
    }
}
exports.CopyDataMessage = CopyDataMessage;
class CopyResponse {
    constructor(length, name, binary, columnCount){
        this.length = length;
        this.name = name;
        this.binary = binary;
        this.columnTypes = new Array(columnCount);
    }
}
exports.CopyResponse = CopyResponse;
class Field {
    constructor(name, tableID, columnID, dataTypeID, dataTypeSize, dataTypeModifier, format){
        this.name = name;
        this.tableID = tableID;
        this.columnID = columnID;
        this.dataTypeID = dataTypeID;
        this.dataTypeSize = dataTypeSize;
        this.dataTypeModifier = dataTypeModifier;
        this.format = format;
    }
}
exports.Field = Field;
class RowDescriptionMessage {
    constructor(length, fieldCount){
        this.length = length;
        this.fieldCount = fieldCount;
        this.name = 'rowDescription';
        this.fields = new Array(this.fieldCount);
    }
}
exports.RowDescriptionMessage = RowDescriptionMessage;
class ParameterDescriptionMessage {
    constructor(length, parameterCount){
        this.length = length;
        this.parameterCount = parameterCount;
        this.name = 'parameterDescription';
        this.dataTypeIDs = new Array(this.parameterCount);
    }
}
exports.ParameterDescriptionMessage = ParameterDescriptionMessage;
class ParameterStatusMessage {
    constructor(length, parameterName, parameterValue){
        this.length = length;
        this.parameterName = parameterName;
        this.parameterValue = parameterValue;
        this.name = 'parameterStatus';
    }
}
exports.ParameterStatusMessage = ParameterStatusMessage;
class AuthenticationMD5Password {
    constructor(length, salt){
        this.length = length;
        this.salt = salt;
        this.name = 'authenticationMD5Password';
    }
}
exports.AuthenticationMD5Password = AuthenticationMD5Password;
class BackendKeyDataMessage {
    constructor(length, processID, secretKey){
        this.length = length;
        this.processID = processID;
        this.secretKey = secretKey;
        this.name = 'backendKeyData';
    }
}
exports.BackendKeyDataMessage = BackendKeyDataMessage;
class NotificationResponseMessage {
    constructor(length, processId, channel, payload){
        this.length = length;
        this.processId = processId;
        this.channel = channel;
        this.payload = payload;
        this.name = 'notification';
    }
}
exports.NotificationResponseMessage = NotificationResponseMessage;
class ReadyForQueryMessage {
    constructor(length, status){
        this.length = length;
        this.status = status;
        this.name = 'readyForQuery';
    }
}
exports.ReadyForQueryMessage = ReadyForQueryMessage;
class CommandCompleteMessage {
    constructor(length, text){
        this.length = length;
        this.text = text;
        this.name = 'commandComplete';
    }
}
exports.CommandCompleteMessage = CommandCompleteMessage;
class DataRowMessage {
    constructor(length, fields){
        this.length = length;
        this.fields = fields;
        this.name = 'dataRow';
        this.fieldCount = fields.length;
    }
}
exports.DataRowMessage = DataRowMessage;
class NoticeMessage {
    constructor(length, message){
        this.length = length;
        this.message = message;
        this.name = 'notice';
    }
}
exports.NoticeMessage = NoticeMessage; //# sourceMappingURL=messages.js.map
}),
"[project]/Downloads/getLoaded/node_modules/.pnpm/pg-protocol@1.10.3/node_modules/pg-protocol/dist/buffer-writer.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Downloads/getLoaded/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
"use strict";
//binary data writer tuned for encoding binary specific to the postgres binary protocol
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Writer = void 0;
class Writer {
    constructor(size = 256){
        this.size = size;
        this.offset = 5;
        this.headerPosition = 0;
        this.buffer = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].allocUnsafe(size);
    }
    ensure(size) {
        const remaining = this.buffer.length - this.offset;
        if (remaining < size) {
            const oldBuffer = this.buffer;
            // exponential growth factor of around ~ 1.5
            // https://stackoverflow.com/questions/2269063/buffer-growth-strategy
            const newSize = oldBuffer.length + (oldBuffer.length >> 1) + size;
            this.buffer = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].allocUnsafe(newSize);
            oldBuffer.copy(this.buffer);
        }
    }
    addInt32(num) {
        this.ensure(4);
        this.buffer[this.offset++] = num >>> 24 & 0xff;
        this.buffer[this.offset++] = num >>> 16 & 0xff;
        this.buffer[this.offset++] = num >>> 8 & 0xff;
        this.buffer[this.offset++] = num >>> 0 & 0xff;
        return this;
    }
    addInt16(num) {
        this.ensure(2);
        this.buffer[this.offset++] = num >>> 8 & 0xff;
        this.buffer[this.offset++] = num >>> 0 & 0xff;
        return this;
    }
    addCString(string) {
        if (!string) {
            this.ensure(1);
        } else {
            const len = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].byteLength(string);
            this.ensure(len + 1); // +1 for null terminator
            this.buffer.write(string, this.offset, 'utf-8');
            this.offset += len;
        }
        this.buffer[this.offset++] = 0; // null terminator
        return this;
    }
    addString(string = '') {
        const len = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].byteLength(string);
        this.ensure(len);
        this.buffer.write(string, this.offset);
        this.offset += len;
        return this;
    }
    add(otherBuffer) {
        this.ensure(otherBuffer.length);
        otherBuffer.copy(this.buffer, this.offset);
        this.offset += otherBuffer.length;
        return this;
    }
    join(code) {
        if (code) {
            this.buffer[this.headerPosition] = code;
            //length is everything in this packet minus the code
            const length = this.offset - (this.headerPosition + 1);
            this.buffer.writeInt32BE(length, this.headerPosition + 1);
        }
        return this.buffer.slice(code ? 0 : 5, this.offset);
    }
    flush(code) {
        const result = this.join(code);
        this.offset = 5;
        this.headerPosition = 0;
        this.buffer = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].allocUnsafe(this.size);
        return result;
    }
}
exports.Writer = Writer; //# sourceMappingURL=buffer-writer.js.map
}),
"[project]/Downloads/getLoaded/node_modules/.pnpm/pg-protocol@1.10.3/node_modules/pg-protocol/dist/serializer.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Downloads/getLoaded/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.serialize = void 0;
const buffer_writer_1 = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/pg-protocol@1.10.3/node_modules/pg-protocol/dist/buffer-writer.js [app-client] (ecmascript)");
const writer = new buffer_writer_1.Writer();
const startup = (opts)=>{
    // protocol version
    writer.addInt16(3).addInt16(0);
    for (const key of Object.keys(opts)){
        writer.addCString(key).addCString(opts[key]);
    }
    writer.addCString('client_encoding').addCString('UTF8');
    const bodyBuffer = writer.addCString('').flush();
    // this message is sent without a code
    const length = bodyBuffer.length + 4;
    return new buffer_writer_1.Writer().addInt32(length).add(bodyBuffer).flush();
};
const requestSsl = ()=>{
    const response = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].allocUnsafe(8);
    response.writeInt32BE(8, 0);
    response.writeInt32BE(80877103, 4);
    return response;
};
const password = (password)=>{
    return writer.addCString(password).flush(112 /* code.startup */ );
};
const sendSASLInitialResponseMessage = function(mechanism, initialResponse) {
    // 0x70 = 'p'
    writer.addCString(mechanism).addInt32(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].byteLength(initialResponse)).addString(initialResponse);
    return writer.flush(112 /* code.startup */ );
};
const sendSCRAMClientFinalMessage = function(additionalData) {
    return writer.addString(additionalData).flush(112 /* code.startup */ );
};
const query = (text)=>{
    return writer.addCString(text).flush(81 /* code.query */ );
};
const emptyArray = [];
const parse = (query)=>{
    // expect something like this:
    // { name: 'queryName',
    //   text: 'select * from blah',
    //   types: ['int8', 'bool'] }
    // normalize missing query names to allow for null
    const name = query.name || '';
    if (name.length > 63) {
        console.error('Warning! Postgres only supports 63 characters for query names.');
        console.error('You supplied %s (%s)', name, name.length);
        console.error('This can cause conflicts and silent errors executing queries');
    }
    const types = query.types || emptyArray;
    const len = types.length;
    const buffer = writer.addCString(name) // name of query
    .addCString(query.text) // actual query text
    .addInt16(len);
    for(let i = 0; i < len; i++){
        buffer.addInt32(types[i]);
    }
    return writer.flush(80 /* code.parse */ );
};
const paramWriter = new buffer_writer_1.Writer();
const writeValues = function(values, valueMapper) {
    for(let i = 0; i < values.length; i++){
        const mappedVal = valueMapper ? valueMapper(values[i], i) : values[i];
        if (mappedVal == null) {
            // add the param type (string) to the writer
            writer.addInt16(0 /* ParamType.STRING */ );
            // write -1 to the param writer to indicate null
            paramWriter.addInt32(-1);
        } else if (mappedVal instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"]) {
            // add the param type (binary) to the writer
            writer.addInt16(1 /* ParamType.BINARY */ );
            // add the buffer to the param writer
            paramWriter.addInt32(mappedVal.length);
            paramWriter.add(mappedVal);
        } else {
            // add the param type (string) to the writer
            writer.addInt16(0 /* ParamType.STRING */ );
            paramWriter.addInt32(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].byteLength(mappedVal));
            paramWriter.addString(mappedVal);
        }
    }
};
const bind = (config = {})=>{
    // normalize config
    const portal = config.portal || '';
    const statement = config.statement || '';
    const binary = config.binary || false;
    const values = config.values || emptyArray;
    const len = values.length;
    writer.addCString(portal).addCString(statement);
    writer.addInt16(len);
    writeValues(values, config.valueMapper);
    writer.addInt16(len);
    writer.add(paramWriter.flush());
    // all results use the same format code
    writer.addInt16(1);
    // format code
    writer.addInt16(binary ? 1 /* ParamType.BINARY */  : 0 /* ParamType.STRING */ );
    return writer.flush(66 /* code.bind */ );
};
const emptyExecute = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from([
    69 /* code.execute */ ,
    0x00,
    0x00,
    0x00,
    0x09,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00
]);
const execute = (config)=>{
    // this is the happy path for most queries
    if (!config || !config.portal && !config.rows) {
        return emptyExecute;
    }
    const portal = config.portal || '';
    const rows = config.rows || 0;
    const portalLength = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].byteLength(portal);
    const len = 4 + portalLength + 1 + 4;
    // one extra bit for code
    const buff = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].allocUnsafe(1 + len);
    buff[0] = 69 /* code.execute */ ;
    buff.writeInt32BE(len, 1);
    buff.write(portal, 5, 'utf-8');
    buff[portalLength + 5] = 0; // null terminate portal cString
    buff.writeUInt32BE(rows, buff.length - 4);
    return buff;
};
const cancel = (processID, secretKey)=>{
    const buffer = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].allocUnsafe(16);
    buffer.writeInt32BE(16, 0);
    buffer.writeInt16BE(1234, 4);
    buffer.writeInt16BE(5678, 6);
    buffer.writeInt32BE(processID, 8);
    buffer.writeInt32BE(secretKey, 12);
    return buffer;
};
const cstringMessage = (code, string)=>{
    const stringLen = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].byteLength(string);
    const len = 4 + stringLen + 1;
    // one extra bit for code
    const buffer = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].allocUnsafe(1 + len);
    buffer[0] = code;
    buffer.writeInt32BE(len, 1);
    buffer.write(string, 5, 'utf-8');
    buffer[len] = 0; // null terminate cString
    return buffer;
};
const emptyDescribePortal = writer.addCString('P').flush(68 /* code.describe */ );
const emptyDescribeStatement = writer.addCString('S').flush(68 /* code.describe */ );
const describe = (msg)=>{
    return msg.name ? cstringMessage(68 /* code.describe */ , `${msg.type}${msg.name || ''}`) : msg.type === 'P' ? emptyDescribePortal : emptyDescribeStatement;
};
const close = (msg)=>{
    const text = `${msg.type}${msg.name || ''}`;
    return cstringMessage(67 /* code.close */ , text);
};
const copyData = (chunk)=>{
    return writer.add(chunk).flush(100 /* code.copyFromChunk */ );
};
const copyFail = (message)=>{
    return cstringMessage(102 /* code.copyFail */ , message);
};
const codeOnlyBuffer = (code)=>__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from([
        code,
        0x00,
        0x00,
        0x00,
        0x04
    ]);
const flushBuffer = codeOnlyBuffer(72 /* code.flush */ );
const syncBuffer = codeOnlyBuffer(83 /* code.sync */ );
const endBuffer = codeOnlyBuffer(88 /* code.end */ );
const copyDoneBuffer = codeOnlyBuffer(99 /* code.copyDone */ );
const serialize = {
    startup,
    password,
    requestSsl,
    sendSASLInitialResponseMessage,
    sendSCRAMClientFinalMessage,
    query,
    parse,
    bind,
    execute,
    describe,
    close,
    flush: ()=>flushBuffer,
    sync: ()=>syncBuffer,
    end: ()=>endBuffer,
    copyData,
    copyDone: ()=>copyDoneBuffer,
    copyFail,
    cancel
};
exports.serialize = serialize; //# sourceMappingURL=serializer.js.map
}),
"[project]/Downloads/getLoaded/node_modules/.pnpm/pg-protocol@1.10.3/node_modules/pg-protocol/dist/buffer-reader.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Downloads/getLoaded/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BufferReader = void 0;
const emptyBuffer = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].allocUnsafe(0);
class BufferReader {
    constructor(offset = 0){
        this.offset = offset;
        this.buffer = emptyBuffer;
        // TODO(bmc): support non-utf8 encoding?
        this.encoding = 'utf-8';
    }
    setBuffer(offset, buffer) {
        this.offset = offset;
        this.buffer = buffer;
    }
    int16() {
        const result = this.buffer.readInt16BE(this.offset);
        this.offset += 2;
        return result;
    }
    byte() {
        const result = this.buffer[this.offset];
        this.offset++;
        return result;
    }
    int32() {
        const result = this.buffer.readInt32BE(this.offset);
        this.offset += 4;
        return result;
    }
    uint32() {
        const result = this.buffer.readUInt32BE(this.offset);
        this.offset += 4;
        return result;
    }
    string(length) {
        const result = this.buffer.toString(this.encoding, this.offset, this.offset + length);
        this.offset += length;
        return result;
    }
    cstring() {
        const start = this.offset;
        let end = start;
        // eslint-disable-next-line no-empty
        while(this.buffer[end++] !== 0){}
        this.offset = end;
        return this.buffer.toString(this.encoding, start, end - 1);
    }
    bytes(length) {
        const result = this.buffer.slice(this.offset, this.offset + length);
        this.offset += length;
        return result;
    }
}
exports.BufferReader = BufferReader; //# sourceMappingURL=buffer-reader.js.map
}),
"[project]/Downloads/getLoaded/node_modules/.pnpm/pg-protocol@1.10.3/node_modules/pg-protocol/dist/parser.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Downloads/getLoaded/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Parser = void 0;
const messages_1 = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/pg-protocol@1.10.3/node_modules/pg-protocol/dist/messages.js [app-client] (ecmascript)");
const buffer_reader_1 = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/pg-protocol@1.10.3/node_modules/pg-protocol/dist/buffer-reader.js [app-client] (ecmascript)");
// every message is prefixed with a single bye
const CODE_LENGTH = 1;
// every message has an int32 length which includes itself but does
// NOT include the code in the length
const LEN_LENGTH = 4;
const HEADER_LENGTH = CODE_LENGTH + LEN_LENGTH;
const emptyBuffer = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].allocUnsafe(0);
class Parser {
    constructor(opts){
        this.buffer = emptyBuffer;
        this.bufferLength = 0;
        this.bufferOffset = 0;
        this.reader = new buffer_reader_1.BufferReader();
        if ((opts === null || opts === void 0 ? void 0 : opts.mode) === 'binary') {
            throw new Error('Binary mode not supported yet');
        }
        this.mode = (opts === null || opts === void 0 ? void 0 : opts.mode) || 'text';
    }
    parse(buffer, callback) {
        this.mergeBuffer(buffer);
        const bufferFullLength = this.bufferOffset + this.bufferLength;
        let offset = this.bufferOffset;
        while(offset + HEADER_LENGTH <= bufferFullLength){
            // code is 1 byte long - it identifies the message type
            const code = this.buffer[offset];
            // length is 1 Uint32BE - it is the length of the message EXCLUDING the code
            const length = this.buffer.readUInt32BE(offset + CODE_LENGTH);
            const fullMessageLength = CODE_LENGTH + length;
            if (fullMessageLength + offset <= bufferFullLength) {
                const message = this.handlePacket(offset + HEADER_LENGTH, code, length, this.buffer);
                callback(message);
                offset += fullMessageLength;
            } else {
                break;
            }
        }
        if (offset === bufferFullLength) {
            // No more use for the buffer
            this.buffer = emptyBuffer;
            this.bufferLength = 0;
            this.bufferOffset = 0;
        } else {
            // Adjust the cursors of remainingBuffer
            this.bufferLength = bufferFullLength - offset;
            this.bufferOffset = offset;
        }
    }
    mergeBuffer(buffer) {
        if (this.bufferLength > 0) {
            const newLength = this.bufferLength + buffer.byteLength;
            const newFullLength = newLength + this.bufferOffset;
            if (newFullLength > this.buffer.byteLength) {
                // We can't concat the new buffer with the remaining one
                let newBuffer;
                if (newLength <= this.buffer.byteLength && this.bufferOffset >= this.bufferLength) {
                    // We can move the relevant part to the beginning of the buffer instead of allocating a new buffer
                    newBuffer = this.buffer;
                } else {
                    // Allocate a new larger buffer
                    let newBufferLength = this.buffer.byteLength * 2;
                    while(newLength >= newBufferLength){
                        newBufferLength *= 2;
                    }
                    newBuffer = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].allocUnsafe(newBufferLength);
                }
                // Move the remaining buffer to the new one
                this.buffer.copy(newBuffer, 0, this.bufferOffset, this.bufferOffset + this.bufferLength);
                this.buffer = newBuffer;
                this.bufferOffset = 0;
            }
            // Concat the new buffer with the remaining one
            buffer.copy(this.buffer, this.bufferOffset + this.bufferLength);
            this.bufferLength = newLength;
        } else {
            this.buffer = buffer;
            this.bufferOffset = 0;
            this.bufferLength = buffer.byteLength;
        }
    }
    handlePacket(offset, code, length, bytes) {
        switch(code){
            case 50 /* MessageCodes.BindComplete */ :
                return messages_1.bindComplete;
            case 49 /* MessageCodes.ParseComplete */ :
                return messages_1.parseComplete;
            case 51 /* MessageCodes.CloseComplete */ :
                return messages_1.closeComplete;
            case 110 /* MessageCodes.NoData */ :
                return messages_1.noData;
            case 115 /* MessageCodes.PortalSuspended */ :
                return messages_1.portalSuspended;
            case 99 /* MessageCodes.CopyDone */ :
                return messages_1.copyDone;
            case 87 /* MessageCodes.ReplicationStart */ :
                return messages_1.replicationStart;
            case 73 /* MessageCodes.EmptyQuery */ :
                return messages_1.emptyQuery;
            case 68 /* MessageCodes.DataRow */ :
                return this.parseDataRowMessage(offset, length, bytes);
            case 67 /* MessageCodes.CommandComplete */ :
                return this.parseCommandCompleteMessage(offset, length, bytes);
            case 90 /* MessageCodes.ReadyForQuery */ :
                return this.parseReadyForQueryMessage(offset, length, bytes);
            case 65 /* MessageCodes.NotificationResponse */ :
                return this.parseNotificationMessage(offset, length, bytes);
            case 82 /* MessageCodes.AuthenticationResponse */ :
                return this.parseAuthenticationResponse(offset, length, bytes);
            case 83 /* MessageCodes.ParameterStatus */ :
                return this.parseParameterStatusMessage(offset, length, bytes);
            case 75 /* MessageCodes.BackendKeyData */ :
                return this.parseBackendKeyData(offset, length, bytes);
            case 69 /* MessageCodes.ErrorMessage */ :
                return this.parseErrorMessage(offset, length, bytes, 'error');
            case 78 /* MessageCodes.NoticeMessage */ :
                return this.parseErrorMessage(offset, length, bytes, 'notice');
            case 84 /* MessageCodes.RowDescriptionMessage */ :
                return this.parseRowDescriptionMessage(offset, length, bytes);
            case 116 /* MessageCodes.ParameterDescriptionMessage */ :
                return this.parseParameterDescriptionMessage(offset, length, bytes);
            case 71 /* MessageCodes.CopyIn */ :
                return this.parseCopyInMessage(offset, length, bytes);
            case 72 /* MessageCodes.CopyOut */ :
                return this.parseCopyOutMessage(offset, length, bytes);
            case 100 /* MessageCodes.CopyData */ :
                return this.parseCopyData(offset, length, bytes);
            default:
                return new messages_1.DatabaseError('received invalid response: ' + code.toString(16), length, 'error');
        }
    }
    parseReadyForQueryMessage(offset, length, bytes) {
        this.reader.setBuffer(offset, bytes);
        const status = this.reader.string(1);
        return new messages_1.ReadyForQueryMessage(length, status);
    }
    parseCommandCompleteMessage(offset, length, bytes) {
        this.reader.setBuffer(offset, bytes);
        const text = this.reader.cstring();
        return new messages_1.CommandCompleteMessage(length, text);
    }
    parseCopyData(offset, length, bytes) {
        const chunk = bytes.slice(offset, offset + (length - 4));
        return new messages_1.CopyDataMessage(length, chunk);
    }
    parseCopyInMessage(offset, length, bytes) {
        return this.parseCopyMessage(offset, length, bytes, 'copyInResponse');
    }
    parseCopyOutMessage(offset, length, bytes) {
        return this.parseCopyMessage(offset, length, bytes, 'copyOutResponse');
    }
    parseCopyMessage(offset, length, bytes, messageName) {
        this.reader.setBuffer(offset, bytes);
        const isBinary = this.reader.byte() !== 0;
        const columnCount = this.reader.int16();
        const message = new messages_1.CopyResponse(length, messageName, isBinary, columnCount);
        for(let i = 0; i < columnCount; i++){
            message.columnTypes[i] = this.reader.int16();
        }
        return message;
    }
    parseNotificationMessage(offset, length, bytes) {
        this.reader.setBuffer(offset, bytes);
        const processId = this.reader.int32();
        const channel = this.reader.cstring();
        const payload = this.reader.cstring();
        return new messages_1.NotificationResponseMessage(length, processId, channel, payload);
    }
    parseRowDescriptionMessage(offset, length, bytes) {
        this.reader.setBuffer(offset, bytes);
        const fieldCount = this.reader.int16();
        const message = new messages_1.RowDescriptionMessage(length, fieldCount);
        for(let i = 0; i < fieldCount; i++){
            message.fields[i] = this.parseField();
        }
        return message;
    }
    parseField() {
        const name = this.reader.cstring();
        const tableID = this.reader.uint32();
        const columnID = this.reader.int16();
        const dataTypeID = this.reader.uint32();
        const dataTypeSize = this.reader.int16();
        const dataTypeModifier = this.reader.int32();
        const mode = this.reader.int16() === 0 ? 'text' : 'binary';
        return new messages_1.Field(name, tableID, columnID, dataTypeID, dataTypeSize, dataTypeModifier, mode);
    }
    parseParameterDescriptionMessage(offset, length, bytes) {
        this.reader.setBuffer(offset, bytes);
        const parameterCount = this.reader.int16();
        const message = new messages_1.ParameterDescriptionMessage(length, parameterCount);
        for(let i = 0; i < parameterCount; i++){
            message.dataTypeIDs[i] = this.reader.int32();
        }
        return message;
    }
    parseDataRowMessage(offset, length, bytes) {
        this.reader.setBuffer(offset, bytes);
        const fieldCount = this.reader.int16();
        const fields = new Array(fieldCount);
        for(let i = 0; i < fieldCount; i++){
            const len = this.reader.int32();
            // a -1 for length means the value of the field is null
            fields[i] = len === -1 ? null : this.reader.string(len);
        }
        return new messages_1.DataRowMessage(length, fields);
    }
    parseParameterStatusMessage(offset, length, bytes) {
        this.reader.setBuffer(offset, bytes);
        const name = this.reader.cstring();
        const value = this.reader.cstring();
        return new messages_1.ParameterStatusMessage(length, name, value);
    }
    parseBackendKeyData(offset, length, bytes) {
        this.reader.setBuffer(offset, bytes);
        const processID = this.reader.int32();
        const secretKey = this.reader.int32();
        return new messages_1.BackendKeyDataMessage(length, processID, secretKey);
    }
    parseAuthenticationResponse(offset, length, bytes) {
        this.reader.setBuffer(offset, bytes);
        const code = this.reader.int32();
        // TODO(bmc): maybe better types here
        const message = {
            name: 'authenticationOk',
            length
        };
        switch(code){
            case 0:
                break;
            case 3:
                if (message.length === 8) {
                    message.name = 'authenticationCleartextPassword';
                }
                break;
            case 5:
                if (message.length === 12) {
                    message.name = 'authenticationMD5Password';
                    const salt = this.reader.bytes(4);
                    return new messages_1.AuthenticationMD5Password(length, salt);
                }
                break;
            case 10:
                {
                    message.name = 'authenticationSASL';
                    message.mechanisms = [];
                    let mechanism;
                    do {
                        mechanism = this.reader.cstring();
                        if (mechanism) {
                            message.mechanisms.push(mechanism);
                        }
                    }while (mechanism)
                }
                break;
            case 11:
                message.name = 'authenticationSASLContinue';
                message.data = this.reader.string(length - 8);
                break;
            case 12:
                message.name = 'authenticationSASLFinal';
                message.data = this.reader.string(length - 8);
                break;
            default:
                throw new Error('Unknown authenticationOk message type ' + code);
        }
        return message;
    }
    parseErrorMessage(offset, length, bytes, name) {
        this.reader.setBuffer(offset, bytes);
        const fields = {};
        let fieldType = this.reader.string(1);
        while(fieldType !== '\0'){
            fields[fieldType] = this.reader.cstring();
            fieldType = this.reader.string(1);
        }
        const messageValue = fields.M;
        const message = name === 'notice' ? new messages_1.NoticeMessage(length, messageValue) : new messages_1.DatabaseError(messageValue, length, name);
        message.severity = fields.S;
        message.code = fields.C;
        message.detail = fields.D;
        message.hint = fields.H;
        message.position = fields.P;
        message.internalPosition = fields.p;
        message.internalQuery = fields.q;
        message.where = fields.W;
        message.schema = fields.s;
        message.table = fields.t;
        message.column = fields.c;
        message.dataType = fields.d;
        message.constraint = fields.n;
        message.file = fields.F;
        message.line = fields.L;
        message.routine = fields.R;
        return message;
    }
}
exports.Parser = Parser; //# sourceMappingURL=parser.js.map
}),
"[project]/Downloads/getLoaded/node_modules/.pnpm/pg-protocol@1.10.3/node_modules/pg-protocol/dist/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DatabaseError = exports.serialize = exports.parse = void 0;
const messages_1 = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/pg-protocol@1.10.3/node_modules/pg-protocol/dist/messages.js [app-client] (ecmascript)");
Object.defineProperty(exports, "DatabaseError", {
    enumerable: true,
    get: function() {
        return messages_1.DatabaseError;
    }
});
const serializer_1 = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/pg-protocol@1.10.3/node_modules/pg-protocol/dist/serializer.js [app-client] (ecmascript)");
Object.defineProperty(exports, "serialize", {
    enumerable: true,
    get: function() {
        return serializer_1.serialize;
    }
});
const parser_1 = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/pg-protocol@1.10.3/node_modules/pg-protocol/dist/parser.js [app-client] (ecmascript)");
function parse(stream, callback) {
    const parser = new parser_1.Parser();
    stream.on('data', (buffer)=>parser.parse(buffer, callback));
    return new Promise((resolve)=>stream.on('end', ()=>resolve()));
}
exports.parse = parse; //# sourceMappingURL=index.js.map
}),
"[project]/Downloads/getLoaded/node_modules/.pnpm/pg-cloudflare@1.2.7/node_modules/pg-cloudflare/dist/empty.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
// This is an empty module that is served up when outside of a workerd environment
// See the `exports` field in package.json
exports.default = {}; //# sourceMappingURL=empty.js.map
}),
"[project]/Downloads/getLoaded/node_modules/.pnpm/split2@4.2.0/node_modules/split2/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
Copyright (c) 2014-2021, Matteo Collina <hello@matteocollina.com>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR
IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/ const { Transform } = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/stream-browserify/index.js [app-client] (ecmascript)");
const { StringDecoder } = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/string_decoder/string_decoder.js [app-client] (ecmascript)");
const kLast = Symbol('last');
const kDecoder = Symbol('decoder');
function transform(chunk, enc, cb) {
    let list;
    if (this.overflow) {
        const buf = this[kDecoder].write(chunk);
        list = buf.split(this.matcher);
        if (list.length === 1) return cb() // Line ending not found. Discard entire chunk.
        ;
        // Line ending found. Discard trailing fragment of previous line and reset overflow state.
        list.shift();
        this.overflow = false;
    } else {
        this[kLast] += this[kDecoder].write(chunk);
        list = this[kLast].split(this.matcher);
    }
    this[kLast] = list.pop();
    for(let i = 0; i < list.length; i++){
        try {
            push(this, this.mapper(list[i]));
        } catch (error) {
            return cb(error);
        }
    }
    this.overflow = this[kLast].length > this.maxLength;
    if (this.overflow && !this.skipOverflow) {
        cb(new Error('maximum buffer reached'));
        return;
    }
    cb();
}
function flush(cb) {
    // forward any gibberish left in there
    this[kLast] += this[kDecoder].end();
    if (this[kLast]) {
        try {
            push(this, this.mapper(this[kLast]));
        } catch (error) {
            return cb(error);
        }
    }
    cb();
}
function push(self, val) {
    if (val !== undefined) {
        self.push(val);
    }
}
function noop(incoming) {
    return incoming;
}
function split(matcher, mapper, options) {
    // Set defaults for any arguments not supplied.
    matcher = matcher || /\r?\n/;
    mapper = mapper || noop;
    options = options || {};
    // Test arguments explicitly.
    switch(arguments.length){
        case 1:
            // If mapper is only argument.
            if (typeof matcher === 'function') {
                mapper = matcher;
                matcher = /\r?\n/;
            // If options is only argument.
            } else if (typeof matcher === 'object' && !(matcher instanceof RegExp) && !matcher[Symbol.split]) {
                options = matcher;
                matcher = /\r?\n/;
            }
            break;
        case 2:
            // If mapper and options are arguments.
            if (typeof matcher === 'function') {
                options = mapper;
                mapper = matcher;
                matcher = /\r?\n/;
            // If matcher and options are arguments.
            } else if (typeof mapper === 'object') {
                options = mapper;
                mapper = noop;
            }
    }
    options = Object.assign({}, options);
    options.autoDestroy = true;
    options.transform = transform;
    options.flush = flush;
    options.readableObjectMode = true;
    const stream = new Transform(options);
    stream[kLast] = '';
    stream[kDecoder] = new StringDecoder('utf8');
    stream.matcher = matcher;
    stream.mapper = mapper;
    stream.maxLength = options.maxLength;
    stream.skipOverflow = options.skipOverflow || false;
    stream.overflow = false;
    stream._destroy = function(err, cb) {
        // Weird Node v12 bug that we need to work around
        this._writableState.errorEmitted = false;
        cb(err);
    };
    return stream;
}
module.exports = split;
}),
"[project]/Downloads/getLoaded/node_modules/.pnpm/pgpass@1.0.5/node_modules/pgpass/lib/helper.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Downloads/getLoaded/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
var path = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/path-browserify/index.js [app-client] (ecmascript)"), Stream = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/stream-browserify/index.js [app-client] (ecmascript)").Stream, split = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/split2@4.2.0/node_modules/split2/index.js [app-client] (ecmascript)"), util = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/util/util.js [app-client] (ecmascript)"), defaultPort = 5432, isWin = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].platform === 'win32', warnStream = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].stderr;
var S_IRWXG = 56 //    00070(8)
, S_IRWXO = 7 //    00007(8)
, S_IFMT = 61440 // 00170000(8)
, S_IFREG = 32768 //  0100000(8)
;
function isRegFile(mode) {
    return (mode & S_IFMT) == S_IFREG;
}
var fieldNames = [
    'host',
    'port',
    'database',
    'user',
    'password'
];
var nrOfFields = fieldNames.length;
var passKey = fieldNames[nrOfFields - 1];
function warn() {
    var isWritable = warnStream instanceof Stream && true === warnStream.writable;
    if (isWritable) {
        var args = Array.prototype.slice.call(arguments).concat("\n");
        warnStream.write(util.format.apply(util, args));
    }
}
Object.defineProperty(module.exports, 'isWin', {
    get: function() {
        return isWin;
    },
    set: function(val) {
        isWin = val;
    }
});
module.exports.warnTo = function(stream) {
    var old = warnStream;
    warnStream = stream;
    return old;
};
module.exports.getFileName = function(rawEnv) {
    var env = rawEnv || __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env;
    var file = env.PGPASSFILE || (isWin ? path.join(env.APPDATA || './', 'postgresql', 'pgpass.conf') : path.join(env.HOME || './', '.pgpass'));
    return file;
};
module.exports.usePgPass = function(stats, fname) {
    if (Object.prototype.hasOwnProperty.call(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env, 'PGPASSWORD')) {
        return false;
    }
    if (isWin) {
        return true;
    }
    fname = fname || '<unkn>';
    if (!isRegFile(stats.mode)) {
        warn('WARNING: password file "%s" is not a plain file', fname);
        return false;
    }
    if (stats.mode & (S_IRWXG | S_IRWXO)) {
        /* If password file is insecure, alert the user and ignore it. */ warn('WARNING: password file "%s" has group or world access; permissions should be u=rw (0600) or less', fname);
        return false;
    }
    return true;
};
var matcher = module.exports.match = function(connInfo, entry) {
    return fieldNames.slice(0, -1).reduce(function(prev, field, idx) {
        if (idx == 1) {
            // the port
            if (Number(connInfo[field] || defaultPort) === Number(entry[field])) {
                return prev && true;
            }
        }
        return prev && (entry[field] === '*' || entry[field] === connInfo[field]);
    }, true);
};
module.exports.getPassword = function(connInfo, stream, cb) {
    var pass;
    var lineStream = stream.pipe(split());
    function onLine(line) {
        var entry = parseLine(line);
        if (entry && isValidEntry(entry) && matcher(connInfo, entry)) {
            pass = entry[passKey];
            lineStream.end(); // -> calls onEnd(), but pass is set now
        }
    }
    var onEnd = function() {
        stream.destroy();
        cb(pass);
    };
    var onErr = function(err) {
        stream.destroy();
        warn('WARNING: error on reading file: %s', err);
        cb(undefined);
    };
    stream.on('error', onErr);
    lineStream.on('data', onLine).on('end', onEnd).on('error', onErr);
};
var parseLine = module.exports.parseLine = function(line) {
    if (line.length < 11 || line.match(/^\s+#/)) {
        return null;
    }
    var curChar = '';
    var prevChar = '';
    var fieldIdx = 0;
    var startIdx = 0;
    var endIdx = 0;
    var obj = {};
    var isLastField = false;
    var addToObj = function(idx, i0, i1) {
        var field = line.substring(i0, i1);
        if (!Object.hasOwnProperty.call(__TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env, 'PGPASS_NO_DEESCAPE')) {
            field = field.replace(/\\([:\\])/g, '$1');
        }
        obj[fieldNames[idx]] = field;
    };
    for(var i = 0; i < line.length - 1; i += 1){
        curChar = line.charAt(i + 1);
        prevChar = line.charAt(i);
        isLastField = fieldIdx == nrOfFields - 1;
        if (isLastField) {
            addToObj(fieldIdx, startIdx);
            break;
        }
        if (i >= 0 && curChar == ':' && prevChar !== '\\') {
            addToObj(fieldIdx, startIdx, i + 1);
            startIdx = i + 2;
            fieldIdx += 1;
        }
    }
    obj = Object.keys(obj).length === nrOfFields ? obj : null;
    return obj;
};
var isValidEntry = module.exports.isValidEntry = function(entry) {
    var rules = {
        // host
        0: function(x) {
            return x.length > 0;
        },
        // port
        1: function(x) {
            if (x === '*') {
                return true;
            }
            x = Number(x);
            return isFinite(x) && x > 0 && x < 9007199254740992 && Math.floor(x) === x;
        },
        // database
        2: function(x) {
            return x.length > 0;
        },
        // username
        3: function(x) {
            return x.length > 0;
        },
        // password
        4: function(x) {
            return x.length > 0;
        }
    };
    for(var idx = 0; idx < fieldNames.length; idx += 1){
        var rule = rules[idx];
        var value = entry[fieldNames[idx]] || '';
        var res = rule(value);
        if (!res) {
            return false;
        }
    }
    return true;
};
}),
"[project]/Downloads/getLoaded/node_modules/.pnpm/pgpass@1.0.5/node_modules/pgpass/lib/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var path = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/path-browserify/index.js [app-client] (ecmascript)"), fs = (()=>{
    const e = new Error("Cannot find module 'fs'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})(), helper = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/pgpass@1.0.5/node_modules/pgpass/lib/helper.js [app-client] (ecmascript)");
module.exports = function(connInfo, cb) {
    var file = helper.getFileName();
    fs.stat(file, function(err, stat) {
        if (err || !helper.usePgPass(stat, file)) {
            return cb(undefined);
        }
        var st = fs.createReadStream(file);
        helper.getPassword(connInfo, st, cb);
    });
};
module.exports.warnTo = helper.warnTo;
}),
"[project]/Downloads/getLoaded/node_modules/.pnpm/pg-pool@3.10.1_pg@8.16.3/node_modules/pg-pool/index.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Downloads/getLoaded/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
const EventEmitter = __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/events/events.js [app-client] (ecmascript)").EventEmitter;
const NOOP = function() {};
const removeWhere = (list, predicate)=>{
    const i = list.findIndex(predicate);
    return i === -1 ? undefined : list.splice(i, 1)[0];
};
class IdleItem {
    constructor(client, idleListener, timeoutId){
        this.client = client;
        this.idleListener = idleListener;
        this.timeoutId = timeoutId;
    }
}
class PendingItem {
    constructor(callback){
        this.callback = callback;
    }
}
function throwOnDoubleRelease() {
    throw new Error('Release called on client which has already been released to the pool.');
}
function promisify(Promise, callback) {
    if (callback) {
        return {
            callback: callback,
            result: undefined
        };
    }
    let rej;
    let res;
    const cb = function(err, client) {
        err ? rej(err) : res(client);
    };
    const result = new Promise(function(resolve, reject) {
        res = resolve;
        rej = reject;
    }).catch((err)=>{
        // replace the stack trace that leads to `TCP.onStreamRead` with one that leads back to the
        // application that created the query
        Error.captureStackTrace(err);
        throw err;
    });
    return {
        callback: cb,
        result: result
    };
}
function makeIdleListener(pool, client) {
    return function idleListener(err) {
        err.client = client;
        client.removeListener('error', idleListener);
        client.on('error', ()=>{
            pool.log('additional client error after disconnection due to error', err);
        });
        pool._remove(client);
        // TODO - document that once the pool emits an error
        // the client has already been closed & purged and is unusable
        pool.emit('error', err, client);
    };
}
class Pool extends EventEmitter {
    constructor(options, Client){
        super();
        this.options = Object.assign({}, options);
        if (options != null && 'password' in options) {
            // "hiding" the password so it doesn't show up in stack traces
            // or if the client is console.logged
            Object.defineProperty(this.options, 'password', {
                configurable: true,
                enumerable: false,
                writable: true,
                value: options.password
            });
        }
        if (options != null && options.ssl && options.ssl.key) {
            // "hiding" the ssl->key so it doesn't show up in stack traces
            // or if the client is console.logged
            Object.defineProperty(this.options.ssl, 'key', {
                enumerable: false
            });
        }
        this.options.max = this.options.max || this.options.poolSize || 10;
        this.options.min = this.options.min || 0;
        this.options.maxUses = this.options.maxUses || Infinity;
        this.options.allowExitOnIdle = this.options.allowExitOnIdle || false;
        this.options.maxLifetimeSeconds = this.options.maxLifetimeSeconds || 0;
        this.log = this.options.log || function() {};
        this.Client = this.options.Client || Client || __turbopack_context__.r("[project]/Downloads/getLoaded/node_modules/.pnpm/pg@8.16.3/node_modules/pg/lib/index.js [app-client] (ecmascript)").Client;
        this.Promise = this.options.Promise || /*TURBOPACK member replacement*/ __turbopack_context__.g.Promise;
        if (typeof this.options.idleTimeoutMillis === 'undefined') {
            this.options.idleTimeoutMillis = 10000;
        }
        this._clients = [];
        this._idle = [];
        this._expired = new WeakSet();
        this._pendingQueue = [];
        this._endCallback = undefined;
        this.ending = false;
        this.ended = false;
    }
    _isFull() {
        return this._clients.length >= this.options.max;
    }
    _isAboveMin() {
        return this._clients.length > this.options.min;
    }
    _pulseQueue() {
        this.log('pulse queue');
        if (this.ended) {
            this.log('pulse queue ended');
            return;
        }
        if (this.ending) {
            this.log('pulse queue on ending');
            if (this._idle.length) {
                this._idle.slice().map((item)=>{
                    this._remove(item.client);
                });
            }
            if (!this._clients.length) {
                this.ended = true;
                this._endCallback();
            }
            return;
        }
        // if we don't have any waiting, do nothing
        if (!this._pendingQueue.length) {
            this.log('no queued requests');
            return;
        }
        // if we don't have any idle clients and we have no more room do nothing
        if (!this._idle.length && this._isFull()) {
            return;
        }
        const pendingItem = this._pendingQueue.shift();
        if (this._idle.length) {
            const idleItem = this._idle.pop();
            clearTimeout(idleItem.timeoutId);
            const client = idleItem.client;
            client.ref && client.ref();
            const idleListener = idleItem.idleListener;
            return this._acquireClient(client, pendingItem, idleListener, false);
        }
        if (!this._isFull()) {
            return this.newClient(pendingItem);
        }
        throw new Error('unexpected condition');
    }
    _remove(client, callback) {
        const removed = removeWhere(this._idle, (item)=>item.client === client);
        if (removed !== undefined) {
            clearTimeout(removed.timeoutId);
        }
        this._clients = this._clients.filter((c)=>c !== client);
        const context = this;
        client.end(()=>{
            context.emit('remove', client);
            if (typeof callback === 'function') {
                callback();
            }
        });
    }
    connect(cb) {
        if (this.ending) {
            const err = new Error('Cannot use a pool after calling end on the pool');
            return cb ? cb(err) : this.Promise.reject(err);
        }
        const response = promisify(this.Promise, cb);
        const result = response.result;
        // if we don't have to connect a new client, don't do so
        if (this._isFull() || this._idle.length) {
            // if we have idle clients schedule a pulse immediately
            if (this._idle.length) {
                __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].nextTick(()=>this._pulseQueue());
            }
            if (!this.options.connectionTimeoutMillis) {
                this._pendingQueue.push(new PendingItem(response.callback));
                return result;
            }
            const queueCallback = (err, res, done)=>{
                clearTimeout(tid);
                response.callback(err, res, done);
            };
            const pendingItem = new PendingItem(queueCallback);
            // set connection timeout on checking out an existing client
            const tid = setTimeout(()=>{
                // remove the callback from pending waiters because
                // we're going to call it with a timeout error
                removeWhere(this._pendingQueue, (i)=>i.callback === queueCallback);
                pendingItem.timedOut = true;
                response.callback(new Error('timeout exceeded when trying to connect'));
            }, this.options.connectionTimeoutMillis);
            if (tid.unref) {
                tid.unref();
            }
            this._pendingQueue.push(pendingItem);
            return result;
        }
        this.newClient(new PendingItem(response.callback));
        return result;
    }
    newClient(pendingItem) {
        const client = new this.Client(this.options);
        this._clients.push(client);
        const idleListener = makeIdleListener(this, client);
        this.log('checking client timeout');
        // connection timeout logic
        let tid;
        let timeoutHit = false;
        if (this.options.connectionTimeoutMillis) {
            tid = setTimeout(()=>{
                this.log('ending client due to timeout');
                timeoutHit = true;
                // force kill the node driver, and let libpq do its teardown
                client.connection ? client.connection.stream.destroy() : client.end();
            }, this.options.connectionTimeoutMillis);
        }
        this.log('connecting new client');
        client.connect((err)=>{
            if (tid) {
                clearTimeout(tid);
            }
            client.on('error', idleListener);
            if (err) {
                this.log('client failed to connect', err);
                // remove the dead client from our list of clients
                this._clients = this._clients.filter((c)=>c !== client);
                if (timeoutHit) {
                    err = new Error('Connection terminated due to connection timeout', {
                        cause: err
                    });
                }
                // this client won’t be released, so move on immediately
                this._pulseQueue();
                if (!pendingItem.timedOut) {
                    pendingItem.callback(err, undefined, NOOP);
                }
            } else {
                this.log('new client connected');
                if (this.options.maxLifetimeSeconds !== 0) {
                    const maxLifetimeTimeout = setTimeout(()=>{
                        this.log('ending client due to expired lifetime');
                        this._expired.add(client);
                        const idleIndex = this._idle.findIndex((idleItem)=>idleItem.client === client);
                        if (idleIndex !== -1) {
                            this._acquireClient(client, new PendingItem((err, client, clientRelease)=>clientRelease()), idleListener, false);
                        }
                    }, this.options.maxLifetimeSeconds * 1000);
                    maxLifetimeTimeout.unref();
                    client.once('end', ()=>clearTimeout(maxLifetimeTimeout));
                }
                return this._acquireClient(client, pendingItem, idleListener, true);
            }
        });
    }
    // acquire a client for a pending work item
    _acquireClient(client, pendingItem, idleListener, isNew) {
        if (isNew) {
            this.emit('connect', client);
        }
        this.emit('acquire', client);
        client.release = this._releaseOnce(client, idleListener);
        client.removeListener('error', idleListener);
        if (!pendingItem.timedOut) {
            if (isNew && this.options.verify) {
                this.options.verify(client, (err)=>{
                    if (err) {
                        client.release(err);
                        return pendingItem.callback(err, undefined, NOOP);
                    }
                    pendingItem.callback(undefined, client, client.release);
                });
            } else {
                pendingItem.callback(undefined, client, client.release);
            }
        } else {
            if (isNew && this.options.verify) {
                this.options.verify(client, client.release);
            } else {
                client.release();
            }
        }
    }
    // returns a function that wraps _release and throws if called more than once
    _releaseOnce(client, idleListener) {
        let released = false;
        return (err)=>{
            if (released) {
                throwOnDoubleRelease();
            }
            released = true;
            this._release(client, idleListener, err);
        };
    }
    // release a client back to the poll, include an error
    // to remove it from the pool
    _release(client, idleListener, err) {
        client.on('error', idleListener);
        client._poolUseCount = (client._poolUseCount || 0) + 1;
        this.emit('release', err, client);
        // TODO(bmc): expose a proper, public interface _queryable and _ending
        if (err || this.ending || !client._queryable || client._ending || client._poolUseCount >= this.options.maxUses) {
            if (client._poolUseCount >= this.options.maxUses) {
                this.log('remove expended client');
            }
            return this._remove(client, this._pulseQueue.bind(this));
        }
        const isExpired = this._expired.has(client);
        if (isExpired) {
            this.log('remove expired client');
            this._expired.delete(client);
            return this._remove(client, this._pulseQueue.bind(this));
        }
        // idle timeout
        let tid;
        if (this.options.idleTimeoutMillis && this._isAboveMin()) {
            tid = setTimeout(()=>{
                this.log('remove idle client');
                this._remove(client, this._pulseQueue.bind(this));
            }, this.options.idleTimeoutMillis);
            if (this.options.allowExitOnIdle) {
                // allow Node to exit if this is all that's left
                tid.unref();
            }
        }
        if (this.options.allowExitOnIdle) {
            client.unref();
        }
        this._idle.push(new IdleItem(client, idleListener, tid));
        this._pulseQueue();
    }
    query(text, values, cb) {
        // guard clause against passing a function as the first parameter
        if (typeof text === 'function') {
            const response = promisify(this.Promise, text);
            setImmediate(function() {
                return response.callback(new Error('Passing a function as the first parameter to pool.query is not supported'));
            });
            return response.result;
        }
        // allow plain text query without values
        if (typeof values === 'function') {
            cb = values;
            values = undefined;
        }
        const response = promisify(this.Promise, cb);
        cb = response.callback;
        this.connect((err, client)=>{
            if (err) {
                return cb(err);
            }
            let clientReleased = false;
            const onError = (err)=>{
                if (clientReleased) {
                    return;
                }
                clientReleased = true;
                client.release(err);
                cb(err);
            };
            client.once('error', onError);
            this.log('dispatching query');
            try {
                client.query(text, values, (err, res)=>{
                    this.log('query dispatched');
                    client.removeListener('error', onError);
                    if (clientReleased) {
                        return;
                    }
                    clientReleased = true;
                    client.release(err);
                    if (err) {
                        return cb(err);
                    }
                    return cb(undefined, res);
                });
            } catch (err) {
                client.release(err);
                return cb(err);
            }
        });
        return response.result;
    }
    end(cb) {
        this.log('ending');
        if (this.ending) {
            const err = new Error('Called end on pool more than once');
            return cb ? cb(err) : this.Promise.reject(err);
        }
        this.ending = true;
        const promised = promisify(this.Promise, cb);
        this._endCallback = promised.callback;
        this._pulseQueue();
        return promised.result;
    }
    get waitingCount() {
        return this._pendingQueue.length;
    }
    get idleCount() {
        return this._idle.length;
    }
    get expiredCount() {
        return this._clients.reduce((acc, client)=>acc + (this._expired.has(client) ? 1 : 0), 0);
    }
    get totalCount() {
        return this._clients.length;
    }
}
module.exports = Pool;
}),
"[project]/Downloads/getLoaded/node_modules/.pnpm/@prisma+debug@7.2.0/node_modules/@prisma/debug/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Debug",
    ()=>Debug,
    "clearLogs",
    ()=>clearLogs,
    "default",
    ()=>index_default,
    "getLogs",
    ()=>getLogs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Downloads/getLoaded/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __defProp = Object.defineProperty;
var __export = (target, all)=>{
    for(var name in all)__defProp(target, name, {
        get: all[name],
        enumerable: true
    });
};
// ../../node_modules/.pnpm/kleur@4.1.5/node_modules/kleur/colors.mjs
var colors_exports = {};
__export(colors_exports, {
    $: ()=>$,
    bgBlack: ()=>bgBlack,
    bgBlue: ()=>bgBlue,
    bgCyan: ()=>bgCyan,
    bgGreen: ()=>bgGreen,
    bgMagenta: ()=>bgMagenta,
    bgRed: ()=>bgRed,
    bgWhite: ()=>bgWhite,
    bgYellow: ()=>bgYellow,
    black: ()=>black,
    blue: ()=>blue,
    bold: ()=>bold,
    cyan: ()=>cyan,
    dim: ()=>dim,
    gray: ()=>gray,
    green: ()=>green,
    grey: ()=>grey,
    hidden: ()=>hidden,
    inverse: ()=>inverse,
    italic: ()=>italic,
    magenta: ()=>magenta,
    red: ()=>red,
    reset: ()=>reset,
    strikethrough: ()=>strikethrough,
    underline: ()=>underline,
    white: ()=>white,
    yellow: ()=>yellow
});
var FORCE_COLOR;
var NODE_DISABLE_COLORS;
var NO_COLOR;
var TERM;
var isTTY = true;
if (typeof __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] !== "undefined") {
    ({ FORCE_COLOR, NODE_DISABLE_COLORS, NO_COLOR, TERM } = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env || {});
    isTTY = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].stdout && __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].stdout.isTTY;
}
var $ = {
    enabled: !NODE_DISABLE_COLORS && NO_COLOR == null && TERM !== "dumb" && (FORCE_COLOR != null && FORCE_COLOR !== "0" || isTTY)
};
function init(x, y) {
    let rgx = new RegExp(`\\x1b\\[${y}m`, "g");
    let open = `\x1B[${x}m`, close = `\x1B[${y}m`;
    return function(txt) {
        if (!$.enabled || txt == null) return txt;
        return open + (!!~("" + txt).indexOf(close) ? txt.replace(rgx, close + open) : txt) + close;
    };
}
var reset = init(0, 0);
var bold = init(1, 22);
var dim = init(2, 22);
var italic = init(3, 23);
var underline = init(4, 24);
var inverse = init(7, 27);
var hidden = init(8, 28);
var strikethrough = init(9, 29);
var black = init(30, 39);
var red = init(31, 39);
var green = init(32, 39);
var yellow = init(33, 39);
var blue = init(34, 39);
var magenta = init(35, 39);
var cyan = init(36, 39);
var white = init(37, 39);
var gray = init(90, 39);
var grey = init(90, 39);
var bgBlack = init(40, 49);
var bgRed = init(41, 49);
var bgGreen = init(42, 49);
var bgYellow = init(43, 49);
var bgBlue = init(44, 49);
var bgMagenta = init(45, 49);
var bgCyan = init(46, 49);
var bgWhite = init(47, 49);
// src/index.ts
var MAX_ARGS_HISTORY = 100;
var COLORS = [
    "green",
    "yellow",
    "blue",
    "magenta",
    "cyan",
    "red"
];
var argsHistory = [];
var lastTimestamp = Date.now();
var lastColor = 0;
var processEnv = typeof __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] !== "undefined" ? __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env : {};
globalThis.DEBUG ??= processEnv.DEBUG ?? "";
globalThis.DEBUG_COLORS ??= processEnv.DEBUG_COLORS ? processEnv.DEBUG_COLORS === "true" : true;
var topProps = {
    enable (namespace) {
        if (typeof namespace === "string") {
            globalThis.DEBUG = namespace;
        }
    },
    disable () {
        const prev = globalThis.DEBUG;
        globalThis.DEBUG = "";
        return prev;
    },
    // this is the core logic to check if logging should happen or not
    enabled (namespace) {
        const listenedNamespaces = globalThis.DEBUG.split(",").map((s)=>{
            return s.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
        });
        const isListened = listenedNamespaces.some((listenedNamespace)=>{
            if (listenedNamespace === "" || listenedNamespace[0] === "-") return false;
            return namespace.match(RegExp(listenedNamespace.split("*").join(".*") + "$"));
        });
        const isExcluded = listenedNamespaces.some((listenedNamespace)=>{
            if (listenedNamespace === "" || listenedNamespace[0] !== "-") return false;
            return namespace.match(RegExp(listenedNamespace.slice(1).split("*").join(".*") + "$"));
        });
        return isListened && !isExcluded;
    },
    log: (...args)=>{
        const [namespace, format, ...rest] = args;
        const logWithFormatting = console.warn ?? console.log;
        logWithFormatting(`${namespace} ${format}`, ...rest);
    },
    formatters: {}
};
function debugCreate(namespace) {
    const instanceProps = {
        color: COLORS[lastColor++ % COLORS.length],
        enabled: topProps.enabled(namespace),
        namespace,
        log: topProps.log,
        extend: ()=>{}
    };
    const debugCall = (...args)=>{
        const { enabled, namespace: namespace2, color, log } = instanceProps;
        if (args.length !== 0) {
            argsHistory.push([
                namespace2,
                ...args
            ]);
        }
        if (argsHistory.length > MAX_ARGS_HISTORY) {
            argsHistory.shift();
        }
        if (topProps.enabled(namespace2) || enabled) {
            const stringArgs = args.map((arg)=>{
                if (typeof arg === "string") {
                    return arg;
                }
                return safeStringify(arg);
            });
            const ms = `+${Date.now() - lastTimestamp}ms`;
            lastTimestamp = Date.now();
            if (globalThis.DEBUG_COLORS) {
                log(colors_exports[color](bold(namespace2)), ...stringArgs, colors_exports[color](ms));
            } else {
                log(namespace2, ...stringArgs, ms);
            }
        }
    };
    return new Proxy(debugCall, {
        get: (_, prop)=>instanceProps[prop],
        set: (_, prop, value)=>instanceProps[prop] = value
    });
}
var Debug = new Proxy(debugCreate, {
    get: (_, prop)=>topProps[prop],
    set: (_, prop, value)=>topProps[prop] = value
});
function safeStringify(value, indent = 2) {
    const cache = /* @__PURE__ */ new Set();
    return JSON.stringify(value, (key, value2)=>{
        if (typeof value2 === "object" && value2 !== null) {
            if (cache.has(value2)) {
                return `[Circular *]`;
            }
            cache.add(value2);
        } else if (typeof value2 === "bigint") {
            return value2.toString();
        }
        return value2;
    }, indent);
}
function getLogs(numChars = 7500) {
    const logs = argsHistory.map(([namespace, ...args])=>{
        return `${namespace} ${args.map((arg)=>{
            if (typeof arg === "string") {
                return arg;
            } else {
                return JSON.stringify(arg);
            }
        }).join(" ")}`;
    }).join("\n");
    if (logs.length < numChars) {
        return logs;
    }
    return logs.slice(-numChars);
}
function clearLogs() {
    argsHistory.length = 0;
}
var index_default = Debug;
;
}),
"[project]/Downloads/getLoaded/node_modules/.pnpm/@prisma+driver-adapter-utils@7.2.0/node_modules/@prisma/driver-adapter-utils/dist/index.mjs [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// src/debug.ts
__turbopack_context__.s([
    "ColumnTypeEnum",
    ()=>ColumnTypeEnum,
    "DriverAdapterError",
    ()=>DriverAdapterError,
    "bindAdapter",
    ()=>bindAdapter,
    "bindMigrationAwareSqlAdapterFactory",
    ()=>bindMigrationAwareSqlAdapterFactory,
    "bindSqlAdapterFactory",
    ()=>bindSqlAdapterFactory,
    "err",
    ()=>err,
    "isDriverAdapterError",
    ()=>isDriverAdapterError,
    "mockAdapter",
    ()=>mockAdapter,
    "mockAdapterErrors",
    ()=>mockAdapterErrors,
    "mockAdapterFactory",
    ()=>mockAdapterFactory,
    "mockMigrationAwareAdapterFactory",
    ()=>mockMigrationAwareAdapterFactory,
    "ok",
    ()=>ok
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$debug$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$debug$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/getLoaded/node_modules/.pnpm/@prisma+debug@7.2.0/node_modules/@prisma/debug/dist/index.mjs [app-client] (ecmascript)");
;
// src/error.ts
var DriverAdapterError = class extends Error {
    name = "DriverAdapterError";
    cause;
    constructor(payload){
        super(typeof payload["message"] === "string" ? payload["message"] : payload.kind);
        this.cause = payload;
    }
};
function isDriverAdapterError(error) {
    return error["name"] === "DriverAdapterError" && typeof error["cause"] === "object";
}
// src/result.ts
function ok(value) {
    return {
        ok: true,
        value,
        map (fn) {
            return ok(fn(value));
        },
        flatMap (fn) {
            return fn(value);
        }
    };
}
function err(error) {
    return {
        ok: false,
        error,
        map () {
            return err(error);
        },
        flatMap () {
            return err(error);
        }
    };
}
// src/binder.ts
var debug = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$debug$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$debug$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Debug"])("driver-adapter-utils");
var ErrorRegistryInternal = class {
    registeredErrors = [];
    consumeError(id) {
        return this.registeredErrors[id];
    }
    registerNewError(error) {
        let i = 0;
        while(this.registeredErrors[i] !== void 0){
            i++;
        }
        this.registeredErrors[i] = {
            error
        };
        return i;
    }
};
function copySymbolsFromSource(source, target) {
    const symbols = Object.getOwnPropertySymbols(source);
    const symbolObject = Object.fromEntries(symbols.map((symbol)=>[
            symbol,
            true
        ]));
    Object.assign(target, symbolObject);
}
var bindMigrationAwareSqlAdapterFactory = (adapterFactory)=>{
    const errorRegistry = new ErrorRegistryInternal();
    const boundFactory = {
        adapterName: adapterFactory.adapterName,
        provider: adapterFactory.provider,
        errorRegistry,
        connect: async (...args)=>{
            const ctx = await wrapAsync(errorRegistry, adapterFactory.connect.bind(adapterFactory))(...args);
            return ctx.map((ctx2)=>bindAdapter(ctx2, errorRegistry));
        },
        connectToShadowDb: async (...args)=>{
            const ctx = await wrapAsync(errorRegistry, adapterFactory.connectToShadowDb.bind(adapterFactory))(...args);
            return ctx.map((ctx2)=>bindAdapter(ctx2, errorRegistry));
        }
    };
    copySymbolsFromSource(adapterFactory, boundFactory);
    return boundFactory;
};
var bindSqlAdapterFactory = (adapterFactory)=>{
    const errorRegistry = new ErrorRegistryInternal();
    const boundFactory = {
        adapterName: adapterFactory.adapterName,
        provider: adapterFactory.provider,
        errorRegistry,
        connect: async (...args)=>{
            const ctx = await wrapAsync(errorRegistry, adapterFactory.connect.bind(adapterFactory))(...args);
            return ctx.map((ctx2)=>bindAdapter(ctx2, errorRegistry));
        }
    };
    copySymbolsFromSource(adapterFactory, boundFactory);
    return boundFactory;
};
var bindAdapter = (adapter, errorRegistry = new ErrorRegistryInternal())=>{
    const boundAdapter = {
        adapterName: adapter.adapterName,
        errorRegistry,
        queryRaw: wrapAsync(errorRegistry, adapter.queryRaw.bind(adapter)),
        executeRaw: wrapAsync(errorRegistry, adapter.executeRaw.bind(adapter)),
        executeScript: wrapAsync(errorRegistry, adapter.executeScript.bind(adapter)),
        dispose: wrapAsync(errorRegistry, adapter.dispose.bind(adapter)),
        provider: adapter.provider,
        startTransaction: async (...args)=>{
            const ctx = await wrapAsync(errorRegistry, adapter.startTransaction.bind(adapter))(...args);
            return ctx.map((ctx2)=>bindTransaction(errorRegistry, ctx2));
        }
    };
    if (adapter.getConnectionInfo) {
        boundAdapter.getConnectionInfo = wrapSync(errorRegistry, adapter.getConnectionInfo.bind(adapter));
    }
    return boundAdapter;
};
var bindTransaction = (errorRegistry, transaction)=>{
    return {
        adapterName: transaction.adapterName,
        provider: transaction.provider,
        options: transaction.options,
        queryRaw: wrapAsync(errorRegistry, transaction.queryRaw.bind(transaction)),
        executeRaw: wrapAsync(errorRegistry, transaction.executeRaw.bind(transaction)),
        commit: wrapAsync(errorRegistry, transaction.commit.bind(transaction)),
        rollback: wrapAsync(errorRegistry, transaction.rollback.bind(transaction))
    };
};
function wrapAsync(registry, fn) {
    return async (...args)=>{
        try {
            return ok(await fn(...args));
        } catch (error) {
            debug("[error@wrapAsync]", error);
            if (isDriverAdapterError(error)) {
                return err(error.cause);
            }
            const id = registry.registerNewError(error);
            return err({
                kind: "GenericJs",
                id
            });
        }
    };
}
function wrapSync(registry, fn) {
    return (...args)=>{
        try {
            return ok(fn(...args));
        } catch (error) {
            debug("[error@wrapSync]", error);
            if (isDriverAdapterError(error)) {
                return err(error.cause);
            }
            const id = registry.registerNewError(error);
            return err({
                kind: "GenericJs",
                id
            });
        }
    };
}
// src/const.ts
var ColumnTypeEnum = {
    // Scalars
    Int32: 0,
    Int64: 1,
    Float: 2,
    Double: 3,
    Numeric: 4,
    Boolean: 5,
    Character: 6,
    Text: 7,
    Date: 8,
    Time: 9,
    DateTime: 10,
    Json: 11,
    Enum: 12,
    Bytes: 13,
    Set: 14,
    Uuid: 15,
    // Arrays
    Int32Array: 64,
    Int64Array: 65,
    FloatArray: 66,
    DoubleArray: 67,
    NumericArray: 68,
    BooleanArray: 69,
    CharacterArray: 70,
    TextArray: 71,
    DateArray: 72,
    TimeArray: 73,
    DateTimeArray: 74,
    JsonArray: 75,
    EnumArray: 76,
    BytesArray: 77,
    UuidArray: 78,
    // Custom
    UnknownNumber: 128
};
// src/mock.ts
var mockAdapterErrors = {
    queryRaw: new Error("Not implemented: queryRaw"),
    executeRaw: new Error("Not implemented: executeRaw"),
    startTransaction: new Error("Not implemented: startTransaction"),
    executeScript: new Error("Not implemented: executeScript"),
    dispose: new Error("Not implemented: dispose")
};
function mockAdapter(provider) {
    return {
        provider,
        adapterName: "@prisma/adapter-mock",
        queryRaw: ()=>Promise.reject(mockAdapterErrors.queryRaw),
        executeRaw: ()=>Promise.reject(mockAdapterErrors.executeRaw),
        startTransaction: ()=>Promise.reject(mockAdapterErrors.startTransaction),
        executeScript: ()=>Promise.reject(mockAdapterErrors.executeScript),
        dispose: ()=>Promise.reject(mockAdapterErrors.dispose),
        [Symbol.for("adapter.mockAdapter")]: true
    };
}
function mockAdapterFactory(provider) {
    return {
        provider,
        adapterName: "@prisma/adapter-mock",
        connect: ()=>Promise.resolve(mockAdapter(provider)),
        [Symbol.for("adapter.mockAdapterFactory")]: true
    };
}
function mockMigrationAwareAdapterFactory(provider) {
    return {
        provider,
        adapterName: "@prisma/adapter-mock",
        connect: ()=>Promise.resolve(mockAdapter(provider)),
        connectToShadowDb: ()=>Promise.resolve(mockAdapter(provider)),
        [Symbol.for("adapter.mockMigrationAwareAdapterFactory")]: true
    };
}
;
}),
"[project]/Downloads/getLoaded/node_modules/.pnpm/@prisma+adapter-pg@7.2.0/node_modules/@prisma/adapter-pg/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/pg.ts
__turbopack_context__.s([
    "PrismaPg",
    ()=>PrismaPgAdapterFactory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Downloads/getLoaded/node_modules/.pnpm/next@16.0.10_@babel+core@7.28.5_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$debug$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$debug$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/getLoaded/node_modules/.pnpm/@prisma+debug@7.2.0/node_modules/@prisma/debug/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$driver$2d$adapter$2d$utils$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Downloads/getLoaded/node_modules/.pnpm/@prisma+driver-adapter-utils@7.2.0/node_modules/@prisma/driver-adapter-utils/dist/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$pg$40$8$2e$16$2e$3$2f$node_modules$2f$pg$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/getLoaded/node_modules/.pnpm/pg@8.16.3/node_modules/pg/esm/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$postgres$2d$array$40$3$2e$0$2e$4$2f$node_modules$2f$postgres$2d$array$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Downloads/getLoaded/node_modules/.pnpm/postgres-array@3.0.4/node_modules/postgres-array/index.js [app-client] (ecmascript)");
;
;
// package.json
var name = "@prisma/adapter-pg";
// src/constants.ts
var FIRST_NORMAL_OBJECT_ID = 16384;
;
;
;
var { types } = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$pg$40$8$2e$16$2e$3$2f$node_modules$2f$pg$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
var { builtins: ScalarColumnType, getTypeParser } = types;
var AdditionalScalarColumnType = {
    NAME: 19
};
var ArrayColumnType = {
    BIT_ARRAY: 1561,
    BOOL_ARRAY: 1e3,
    BYTEA_ARRAY: 1001,
    BPCHAR_ARRAY: 1014,
    CHAR_ARRAY: 1002,
    CIDR_ARRAY: 651,
    DATE_ARRAY: 1182,
    FLOAT4_ARRAY: 1021,
    FLOAT8_ARRAY: 1022,
    INET_ARRAY: 1041,
    INT2_ARRAY: 1005,
    INT4_ARRAY: 1007,
    INT8_ARRAY: 1016,
    JSONB_ARRAY: 3807,
    JSON_ARRAY: 199,
    MONEY_ARRAY: 791,
    NUMERIC_ARRAY: 1231,
    OID_ARRAY: 1028,
    TEXT_ARRAY: 1009,
    TIMESTAMP_ARRAY: 1115,
    TIMESTAMPTZ_ARRAY: 1185,
    TIME_ARRAY: 1183,
    UUID_ARRAY: 2951,
    VARBIT_ARRAY: 1563,
    VARCHAR_ARRAY: 1015,
    XML_ARRAY: 143
};
var UnsupportedNativeDataType = class _UnsupportedNativeDataType extends Error {
    // map of type codes to type names
    static typeNames = {
        16: "bool",
        17: "bytea",
        18: "char",
        19: "name",
        20: "int8",
        21: "int2",
        22: "int2vector",
        23: "int4",
        24: "regproc",
        25: "text",
        26: "oid",
        27: "tid",
        28: "xid",
        29: "cid",
        30: "oidvector",
        32: "pg_ddl_command",
        71: "pg_type",
        75: "pg_attribute",
        81: "pg_proc",
        83: "pg_class",
        114: "json",
        142: "xml",
        194: "pg_node_tree",
        269: "table_am_handler",
        325: "index_am_handler",
        600: "point",
        601: "lseg",
        602: "path",
        603: "box",
        604: "polygon",
        628: "line",
        650: "cidr",
        700: "float4",
        701: "float8",
        705: "unknown",
        718: "circle",
        774: "macaddr8",
        790: "money",
        829: "macaddr",
        869: "inet",
        1033: "aclitem",
        1042: "bpchar",
        1043: "varchar",
        1082: "date",
        1083: "time",
        1114: "timestamp",
        1184: "timestamptz",
        1186: "interval",
        1266: "timetz",
        1560: "bit",
        1562: "varbit",
        1700: "numeric",
        1790: "refcursor",
        2202: "regprocedure",
        2203: "regoper",
        2204: "regoperator",
        2205: "regclass",
        2206: "regtype",
        2249: "record",
        2275: "cstring",
        2276: "any",
        2277: "anyarray",
        2278: "void",
        2279: "trigger",
        2280: "language_handler",
        2281: "internal",
        2283: "anyelement",
        2287: "_record",
        2776: "anynonarray",
        2950: "uuid",
        2970: "txid_snapshot",
        3115: "fdw_handler",
        3220: "pg_lsn",
        3310: "tsm_handler",
        3361: "pg_ndistinct",
        3402: "pg_dependencies",
        3500: "anyenum",
        3614: "tsvector",
        3615: "tsquery",
        3642: "gtsvector",
        3734: "regconfig",
        3769: "regdictionary",
        3802: "jsonb",
        3831: "anyrange",
        3838: "event_trigger",
        3904: "int4range",
        3906: "numrange",
        3908: "tsrange",
        3910: "tstzrange",
        3912: "daterange",
        3926: "int8range",
        4072: "jsonpath",
        4089: "regnamespace",
        4096: "regrole",
        4191: "regcollation",
        4451: "int4multirange",
        4532: "nummultirange",
        4533: "tsmultirange",
        4534: "tstzmultirange",
        4535: "datemultirange",
        4536: "int8multirange",
        4537: "anymultirange",
        4538: "anycompatiblemultirange",
        4600: "pg_brin_bloom_summary",
        4601: "pg_brin_minmax_multi_summary",
        5017: "pg_mcv_list",
        5038: "pg_snapshot",
        5069: "xid8",
        5077: "anycompatible",
        5078: "anycompatiblearray",
        5079: "anycompatiblenonarray",
        5080: "anycompatiblerange"
    };
    type;
    constructor(code){
        super();
        this.type = _UnsupportedNativeDataType.typeNames[code] || "Unknown";
        this.message = `Unsupported column type ${this.type}`;
    }
};
function fieldToColumnType(fieldTypeId) {
    switch(fieldTypeId){
        case ScalarColumnType.INT2:
        case ScalarColumnType.INT4:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$driver$2d$adapter$2d$utils$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Int32;
        case ScalarColumnType.INT8:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$driver$2d$adapter$2d$utils$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Int64;
        case ScalarColumnType.FLOAT4:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$driver$2d$adapter$2d$utils$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Float;
        case ScalarColumnType.FLOAT8:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$driver$2d$adapter$2d$utils$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Double;
        case ScalarColumnType.BOOL:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$driver$2d$adapter$2d$utils$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Boolean;
        case ScalarColumnType.DATE:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$driver$2d$adapter$2d$utils$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Date;
        case ScalarColumnType.TIME:
        case ScalarColumnType.TIMETZ:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$driver$2d$adapter$2d$utils$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Time;
        case ScalarColumnType.TIMESTAMP:
        case ScalarColumnType.TIMESTAMPTZ:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$driver$2d$adapter$2d$utils$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].DateTime;
        case ScalarColumnType.NUMERIC:
        case ScalarColumnType.MONEY:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$driver$2d$adapter$2d$utils$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Numeric;
        case ScalarColumnType.JSON:
        case ScalarColumnType.JSONB:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$driver$2d$adapter$2d$utils$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Json;
        case ScalarColumnType.UUID:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$driver$2d$adapter$2d$utils$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Uuid;
        case ScalarColumnType.OID:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$driver$2d$adapter$2d$utils$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Int64;
        case ScalarColumnType.BPCHAR:
        case ScalarColumnType.TEXT:
        case ScalarColumnType.VARCHAR:
        case ScalarColumnType.BIT:
        case ScalarColumnType.VARBIT:
        case ScalarColumnType.INET:
        case ScalarColumnType.CIDR:
        case ScalarColumnType.XML:
        case AdditionalScalarColumnType.NAME:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$driver$2d$adapter$2d$utils$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Text;
        case ScalarColumnType.BYTEA:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$driver$2d$adapter$2d$utils$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Bytes;
        case ArrayColumnType.INT2_ARRAY:
        case ArrayColumnType.INT4_ARRAY:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$driver$2d$adapter$2d$utils$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Int32Array;
        case ArrayColumnType.FLOAT4_ARRAY:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$driver$2d$adapter$2d$utils$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].FloatArray;
        case ArrayColumnType.FLOAT8_ARRAY:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$driver$2d$adapter$2d$utils$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].DoubleArray;
        case ArrayColumnType.NUMERIC_ARRAY:
        case ArrayColumnType.MONEY_ARRAY:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$driver$2d$adapter$2d$utils$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].NumericArray;
        case ArrayColumnType.BOOL_ARRAY:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$driver$2d$adapter$2d$utils$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].BooleanArray;
        case ArrayColumnType.CHAR_ARRAY:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$driver$2d$adapter$2d$utils$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].CharacterArray;
        case ArrayColumnType.BPCHAR_ARRAY:
        case ArrayColumnType.TEXT_ARRAY:
        case ArrayColumnType.VARCHAR_ARRAY:
        case ArrayColumnType.VARBIT_ARRAY:
        case ArrayColumnType.BIT_ARRAY:
        case ArrayColumnType.INET_ARRAY:
        case ArrayColumnType.CIDR_ARRAY:
        case ArrayColumnType.XML_ARRAY:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$driver$2d$adapter$2d$utils$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].TextArray;
        case ArrayColumnType.DATE_ARRAY:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$driver$2d$adapter$2d$utils$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].DateArray;
        case ArrayColumnType.TIME_ARRAY:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$driver$2d$adapter$2d$utils$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].TimeArray;
        case ArrayColumnType.TIMESTAMP_ARRAY:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$driver$2d$adapter$2d$utils$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].DateTimeArray;
        case ArrayColumnType.TIMESTAMPTZ_ARRAY:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$driver$2d$adapter$2d$utils$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].DateTimeArray;
        case ArrayColumnType.JSON_ARRAY:
        case ArrayColumnType.JSONB_ARRAY:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$driver$2d$adapter$2d$utils$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].JsonArray;
        case ArrayColumnType.BYTEA_ARRAY:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$driver$2d$adapter$2d$utils$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].BytesArray;
        case ArrayColumnType.UUID_ARRAY:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$driver$2d$adapter$2d$utils$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].UuidArray;
        case ArrayColumnType.INT8_ARRAY:
        case ArrayColumnType.OID_ARRAY:
            return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$driver$2d$adapter$2d$utils$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Int64Array;
        default:
            if (fieldTypeId >= FIRST_NORMAL_OBJECT_ID) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$driver$2d$adapter$2d$utils$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ColumnTypeEnum"].Text;
            }
            throw new UnsupportedNativeDataType(fieldTypeId);
    }
}
function normalize_array(element_normalizer) {
    return (str)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$postgres$2d$array$40$3$2e$0$2e$4$2f$node_modules$2f$postgres$2d$array$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parse"])(str, element_normalizer);
}
function normalize_numeric(numeric) {
    return numeric;
}
function normalize_date(date) {
    return date;
}
function normalize_timestamp(time) {
    return `${time.replace(" ", "T")}+00:00`;
}
function normalize_timestamptz(time) {
    return time.replace(" ", "T").replace(/[+-]\d{2}(:\d{2})?$/, "+00:00");
}
function normalize_time(time) {
    return time;
}
function normalize_timez(time) {
    return time.replace(/[+-]\d{2}(:\d{2})?$/, "");
}
function normalize_money(money) {
    return money.slice(1);
}
function normalize_xml(xml) {
    return xml;
}
function toJson(json) {
    return json;
}
var parsePgBytes = getTypeParser(ScalarColumnType.BYTEA);
var normalizeByteaArray = getTypeParser(ArrayColumnType.BYTEA_ARRAY);
function convertBytes(serializedBytes) {
    return parsePgBytes(serializedBytes);
}
function normalizeBit(bit) {
    return bit;
}
var customParsers = {
    [ScalarColumnType.NUMERIC]: normalize_numeric,
    [ArrayColumnType.NUMERIC_ARRAY]: normalize_array(normalize_numeric),
    [ScalarColumnType.TIME]: normalize_time,
    [ArrayColumnType.TIME_ARRAY]: normalize_array(normalize_time),
    [ScalarColumnType.TIMETZ]: normalize_timez,
    [ScalarColumnType.DATE]: normalize_date,
    [ArrayColumnType.DATE_ARRAY]: normalize_array(normalize_date),
    [ScalarColumnType.TIMESTAMP]: normalize_timestamp,
    [ArrayColumnType.TIMESTAMP_ARRAY]: normalize_array(normalize_timestamp),
    [ScalarColumnType.TIMESTAMPTZ]: normalize_timestamptz,
    [ArrayColumnType.TIMESTAMPTZ_ARRAY]: normalize_array(normalize_timestamptz),
    [ScalarColumnType.MONEY]: normalize_money,
    [ArrayColumnType.MONEY_ARRAY]: normalize_array(normalize_money),
    [ScalarColumnType.JSON]: toJson,
    [ArrayColumnType.JSON_ARRAY]: normalize_array(toJson),
    [ScalarColumnType.JSONB]: toJson,
    [ArrayColumnType.JSONB_ARRAY]: normalize_array(toJson),
    [ScalarColumnType.BYTEA]: convertBytes,
    [ArrayColumnType.BYTEA_ARRAY]: normalizeByteaArray,
    [ArrayColumnType.BIT_ARRAY]: normalize_array(normalizeBit),
    [ArrayColumnType.VARBIT_ARRAY]: normalize_array(normalizeBit),
    [ArrayColumnType.XML_ARRAY]: normalize_array(normalize_xml)
};
function mapArg(arg, argType) {
    if (arg === null) {
        return null;
    }
    if (Array.isArray(arg) && argType.arity === "list") {
        return arg.map((value)=>mapArg(value, argType));
    }
    if (typeof arg === "string" && argType.scalarType === "datetime") {
        arg = new Date(arg);
    }
    if (arg instanceof Date) {
        switch(argType.dbType){
            case "TIME":
            case "TIMETZ":
                return formatTime(arg);
            case "DATE":
                return formatDate(arg);
            default:
                return formatDateTime(arg);
        }
    }
    if (typeof arg === "string" && argType.scalarType === "bytes") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(arg, "base64");
    }
    if (ArrayBuffer.isView(arg)) {
        return new Uint8Array(arg.buffer, arg.byteOffset, arg.byteLength);
    }
    return arg;
}
function formatDateTime(date) {
    const pad = (n, z = 2)=>String(n).padStart(z, "0");
    const ms = date.getUTCMilliseconds();
    return pad(date.getUTCFullYear(), 4) + "-" + pad(date.getUTCMonth() + 1) + "-" + pad(date.getUTCDate()) + " " + pad(date.getUTCHours()) + ":" + pad(date.getUTCMinutes()) + ":" + pad(date.getUTCSeconds()) + (ms ? "." + String(ms).padStart(3, "0") : "");
}
function formatDate(date) {
    const pad = (n, z = 2)=>String(n).padStart(z, "0");
    return pad(date.getUTCFullYear(), 4) + "-" + pad(date.getUTCMonth() + 1) + "-" + pad(date.getUTCDate());
}
function formatTime(date) {
    const pad = (n, z = 2)=>String(n).padStart(z, "0");
    const ms = date.getUTCMilliseconds();
    return pad(date.getUTCHours()) + ":" + pad(date.getUTCMinutes()) + ":" + pad(date.getUTCSeconds()) + (ms ? "." + String(ms).padStart(3, "0") : "");
}
// src/errors.ts
var TLS_ERRORS = /* @__PURE__ */ new Set([
    "UNABLE_TO_GET_ISSUER_CERT",
    "UNABLE_TO_GET_CRL",
    "UNABLE_TO_DECRYPT_CERT_SIGNATURE",
    "UNABLE_TO_DECRYPT_CRL_SIGNATURE",
    "UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY",
    "CERT_SIGNATURE_FAILURE",
    "CRL_SIGNATURE_FAILURE",
    "CERT_NOT_YET_VALID",
    "CERT_HAS_EXPIRED",
    "CRL_NOT_YET_VALID",
    "CRL_HAS_EXPIRED",
    "ERROR_IN_CERT_NOT_BEFORE_FIELD",
    "ERROR_IN_CERT_NOT_AFTER_FIELD",
    "ERROR_IN_CRL_LAST_UPDATE_FIELD",
    "ERROR_IN_CRL_NEXT_UPDATE_FIELD",
    "DEPTH_ZERO_SELF_SIGNED_CERT",
    "SELF_SIGNED_CERT_IN_CHAIN",
    "UNABLE_TO_GET_ISSUER_CERT_LOCALLY",
    "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
    "CERT_CHAIN_TOO_LONG",
    "CERT_REVOKED",
    "INVALID_CA",
    "INVALID_PURPOSE",
    "CERT_UNTRUSTED",
    "CERT_REJECTED",
    "HOSTNAME_MISMATCH",
    "ERR_TLS_CERT_ALTNAME_FORMAT",
    "ERR_TLS_CERT_ALTNAME_INVALID"
]);
var SOCKET_ERRORS = /* @__PURE__ */ new Set([
    "ENOTFOUND",
    "ECONNREFUSED",
    "ECONNRESET",
    "ETIMEDOUT"
]);
function convertDriverError(error) {
    if (isSocketError(error)) {
        return mapSocketError(error);
    }
    if (isTlsError(error)) {
        return {
            kind: "TlsConnectionError",
            reason: error.message
        };
    }
    if (isDriverError(error)) {
        return {
            originalCode: error.code,
            originalMessage: error.message,
            ...mapDriverError(error)
        };
    }
    throw error;
}
function mapDriverError(error) {
    switch(error.code){
        case "22001":
            return {
                kind: "LengthMismatch",
                column: error.column
            };
        case "22003":
            return {
                kind: "ValueOutOfRange",
                cause: error.message
            };
        case "22P02":
            return {
                kind: "InvalidInputValue",
                message: error.message
            };
        case "23505":
            {
                const fields = error.detail?.match(/Key \(([^)]+)\)/)?.at(1)?.split(", ");
                return {
                    kind: "UniqueConstraintViolation",
                    constraint: fields !== void 0 ? {
                        fields
                    } : void 0
                };
            }
        case "23502":
            {
                const fields = error.detail?.match(/Key \(([^)]+)\)/)?.at(1)?.split(", ");
                return {
                    kind: "NullConstraintViolation",
                    constraint: fields !== void 0 ? {
                        fields
                    } : void 0
                };
            }
        case "23503":
            {
                let constraint;
                if (error.column) {
                    constraint = {
                        fields: [
                            error.column
                        ]
                    };
                } else if (error.constraint) {
                    constraint = {
                        index: error.constraint
                    };
                }
                return {
                    kind: "ForeignKeyConstraintViolation",
                    constraint
                };
            }
        case "3D000":
            return {
                kind: "DatabaseDoesNotExist",
                db: error.message.split(" ").at(1)?.split('"').at(1)
            };
        case "28000":
            return {
                kind: "DatabaseAccessDenied",
                db: error.message.split(",").find((s)=>s.startsWith(" database"))?.split('"').at(1)
            };
        case "28P01":
            return {
                kind: "AuthenticationFailed",
                user: error.message.split(" ").pop()?.split('"').at(1)
            };
        case "40001":
            return {
                kind: "TransactionWriteConflict"
            };
        case "42P01":
            return {
                kind: "TableDoesNotExist",
                table: error.message.split(" ").at(1)?.split('"').at(1)
            };
        case "42703":
            return {
                kind: "ColumnNotFound",
                column: error.message.split(" ").at(1)?.split('"').at(1)
            };
        case "42P04":
            return {
                kind: "DatabaseAlreadyExists",
                db: error.message.split(" ").at(1)?.split('"').at(1)
            };
        case "53300":
            return {
                kind: "TooManyConnections",
                cause: error.message
            };
        default:
            return {
                kind: "postgres",
                code: error.code ?? "N/A",
                severity: error.severity ?? "N/A",
                message: error.message,
                detail: error.detail,
                column: error.column,
                hint: error.hint
            };
    }
}
function isDriverError(error) {
    return typeof error.code === "string" && typeof error.message === "string" && typeof error.severity === "string" && (typeof error.detail === "string" || error.detail === void 0) && (typeof error.column === "string" || error.column === void 0) && (typeof error.hint === "string" || error.hint === void 0);
}
function mapSocketError(error) {
    switch(error.code){
        case "ENOTFOUND":
        case "ECONNREFUSED":
            return {
                kind: "DatabaseNotReachable",
                host: error.address ?? error.hostname,
                port: error.port
            };
        case "ECONNRESET":
            return {
                kind: "ConnectionClosed"
            };
        case "ETIMEDOUT":
            return {
                kind: "SocketTimeout"
            };
    }
}
function isSocketError(error) {
    return typeof error.code === "string" && typeof error.syscall === "string" && typeof error.errno === "number" && SOCKET_ERRORS.has(error.code);
}
function isTlsError(error) {
    if (typeof error.code === "string") {
        return TLS_ERRORS.has(error.code);
    }
    switch(error.message){
        case "The server does not support SSL connections":
        case "There was an error establishing an SSL connection":
            return true;
    }
    return false;
}
// src/pg.ts
var types2 = __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$pg$40$8$2e$16$2e$3$2f$node_modules$2f$pg$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].types;
var debug = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$debug$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$debug$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Debug"])("prisma:driver-adapter:pg");
var PgQueryable = class {
    constructor(client, pgOptions){
        this.client = client;
        this.pgOptions = pgOptions;
    }
    provider = "postgres";
    adapterName = name;
    /**
   * Execute a query given as SQL, interpolating the given parameters.
   */ async queryRaw(query) {
        const tag = "[js::query_raw]";
        debug(`${tag} %O`, query);
        const { fields, rows } = await this.performIO(query);
        const columnNames = fields.map((field)=>field.name);
        let columnTypes = [];
        try {
            columnTypes = fields.map((field)=>fieldToColumnType(field.dataTypeID));
        } catch (e) {
            if (e instanceof UnsupportedNativeDataType) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$driver$2d$adapter$2d$utils$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DriverAdapterError"]({
                    kind: "UnsupportedNativeDataType",
                    type: e.type
                });
            }
            throw e;
        }
        const udtParser = this.pgOptions?.userDefinedTypeParser;
        if (udtParser) {
            for(let i = 0; i < fields.length; i++){
                const field = fields[i];
                if (field.dataTypeID >= FIRST_NORMAL_OBJECT_ID && !Object.hasOwn(customParsers, field.dataTypeID)) {
                    for(let j = 0; j < rows.length; j++){
                        rows[j][i] = await udtParser(field.dataTypeID, rows[j][i], this);
                    }
                }
            }
        }
        return {
            columnNames,
            columnTypes,
            rows
        };
    }
    /**
   * Execute a query given as SQL, interpolating the given parameters and
   * returning the number of affected rows.
   * Note: Queryable expects a u64, but napi.rs only supports u32.
   */ async executeRaw(query) {
        const tag = "[js::execute_raw]";
        debug(`${tag} %O`, query);
        return (await this.performIO(query)).rowCount ?? 0;
    }
    /**
   * Run a query against the database, returning the result set.
   * Should the query fail due to a connection error, the connection is
   * marked as unhealthy.
   */ async performIO(query) {
        const { sql, args } = query;
        const values = args.map((arg, i)=>mapArg(arg, query.argTypes[i]));
        try {
            const result = await this.client.query({
                text: sql,
                values,
                rowMode: "array",
                types: {
                    // This is the error expected:
                    // No overload matches this call.
                    // The last overload gave the following error.
                    // Type '(oid: number, format?: any) => (json: string) => unknown' is not assignable to type '{ <T>(oid: number): TypeParser<string, string | T>; <T>(oid: number, format: "text"): TypeParser<string, string | T>; <T>(oid: number, format: "binary"): TypeParser<...>; }'.
                    //   Type '(json: string) => unknown' is not assignable to type 'TypeParser<Buffer, any>'.
                    //     Types of parameters 'json' and 'value' are incompatible.
                    //       Type 'Buffer' is not assignable to type 'string'.ts(2769)
                    //
                    // Because pg-types types expect us to handle both binary and text protocol versions,
                    // where as far we can see, pg will ever pass only text version.
                    //
                    // @ts-expect-error
                    getTypeParser: (oid, format)=>{
                        if (format === "text" && customParsers[oid]) {
                            return customParsers[oid];
                        }
                        return types2.getTypeParser(oid, format);
                    }
                }
            }, values);
            return result;
        } catch (e) {
            this.onError(e);
        }
    }
    onError(error) {
        debug("Error in performIO: %O", error);
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f40$prisma$2b$driver$2d$adapter$2d$utils$40$7$2e$2$2e$0$2f$node_modules$2f40$prisma$2f$driver$2d$adapter$2d$utils$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["DriverAdapterError"](convertDriverError(error));
    }
};
var PgTransaction = class extends PgQueryable {
    constructor(client, options, pgOptions, cleanup){
        super(client, pgOptions);
        this.options = options;
        this.pgOptions = pgOptions;
        this.cleanup = cleanup;
    }
    async commit() {
        debug(`[js::commit]`);
        this.cleanup?.();
        this.client.release();
    }
    async rollback() {
        debug(`[js::rollback]`);
        this.cleanup?.();
        this.client.release();
    }
};
var PrismaPgAdapter = class extends PgQueryable {
    constructor(client, pgOptions, release){
        super(client);
        this.pgOptions = pgOptions;
        this.release = release;
    }
    async startTransaction(isolationLevel) {
        const options = {
            usePhantomQuery: false
        };
        const tag = "[js::startTransaction]";
        debug("%s options: %O", tag, options);
        const conn = await this.client.connect().catch((error)=>this.onError(error));
        const onError = (err)=>{
            debug(`Error from pool connection: ${err.message} %O`, err);
            this.pgOptions?.onConnectionError?.(err);
        };
        conn.on("error", onError);
        const cleanup = ()=>{
            conn.removeListener("error", onError);
        };
        try {
            const tx = new PgTransaction(conn, options, this.pgOptions, cleanup);
            await tx.executeRaw({
                sql: "BEGIN",
                args: [],
                argTypes: []
            });
            if (isolationLevel) {
                await tx.executeRaw({
                    sql: `SET TRANSACTION ISOLATION LEVEL ${isolationLevel}`,
                    args: [],
                    argTypes: []
                });
            }
            return tx;
        } catch (error) {
            cleanup();
            conn.release(error);
            this.onError(error);
        }
    }
    async executeScript(script) {
        const statements = script.split(";").map((stmt)=>stmt.trim()).filter((stmt)=>stmt.length > 0);
        for (const stmt of statements){
            try {
                await this.client.query(stmt);
            } catch (error) {
                this.onError(error);
            }
        }
    }
    getConnectionInfo() {
        return {
            schemaName: this.pgOptions?.schema,
            supportsRelationJoins: true
        };
    }
    async dispose() {
        return this.release?.();
    }
    underlyingDriver() {
        return this.client;
    }
};
var PrismaPgAdapterFactory = class {
    constructor(poolOrConfig, options){
        this.options = options;
        if (poolOrConfig instanceof __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$pg$40$8$2e$16$2e$3$2f$node_modules$2f$pg$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Pool) {
            this.externalPool = poolOrConfig;
            this.config = poolOrConfig.options;
        } else {
            this.externalPool = null;
            this.config = poolOrConfig;
        }
    }
    provider = "postgres";
    adapterName = name;
    config;
    externalPool;
    async connect() {
        const client = this.externalPool ?? new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$pg$40$8$2e$16$2e$3$2f$node_modules$2f$pg$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Pool(this.config);
        const onIdleClientError = (err)=>{
            debug(`Error from idle pool client: ${err.message} %O`, err);
            this.options?.onPoolError?.(err);
        };
        client.on("error", onIdleClientError);
        return new PrismaPgAdapter(client, this.options, async ()=>{
            if (this.externalPool) {
                if (this.options?.disposeExternalPool) {
                    await this.externalPool.end();
                    this.externalPool = null;
                } else {
                    this.externalPool.removeListener("error", onIdleClientError);
                }
            } else {
                await client.end();
            }
        });
    }
    async connectToShadowDb() {
        const conn = await this.connect();
        const database = `prisma_migrate_shadow_db_${globalThis.crypto.randomUUID()}`;
        await conn.executeScript(`CREATE DATABASE "${database}"`);
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$Downloads$2f$getLoaded$2f$node_modules$2f2e$pnpm$2f$pg$40$8$2e$16$2e$3$2f$node_modules$2f$pg$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Pool({
            ...this.config,
            database
        });
        return new PrismaPgAdapter(client, void 0, async ()=>{
            await conn.executeScript(`DROP DATABASE "${database}"`);
            await client.end();
        });
    }
};
;
}),
]);

//# sourceMappingURL=0901d__pnpm_a2db0f90._.js.map