"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IgnoringWatchFileSystem = void 0;
var IGNORE_TIME_ENTRY = "ignore";
var IgnoringWatchFileSystem = /** @class */ (function () {
    /**
     * @param {WatchFileSystem} wfs original file system
     * @param {(string|RegExp)[]} paths ignored paths
     */
    function IgnoringWatchFileSystem(wfs, paths) {
        this.wfs = wfs;
        this.paths = paths;
    }
    IgnoringWatchFileSystem.prototype.watch = function (files, dirs, missing, startTime, options, callback, callbackUndelayed) {
        var _this = this;
        files = Array.from(files);
        dirs = Array.from(dirs);
        var ignored = function (path) {
            return _this.paths.some(function (p) {
                return p instanceof RegExp ? p.test(path) : path.indexOf(p) === 0;
            });
        };
        var notIgnored = function (path) { return !ignored(path); };
        var ignoredFiles = files.filter(ignored);
        var ignoredDirs = dirs.filter(ignored);
        var watcher = this.wfs.watch(files.filter(notIgnored), dirs.filter(notIgnored), missing, startTime, options, function (err, fileTimestamps, dirTimestamps, changedFiles, removedFiles) {
            var e_1, _a, e_2, _b;
            if (err)
                return callback(err);
            try {
                for (var ignoredFiles_1 = __values(ignoredFiles), ignoredFiles_1_1 = ignoredFiles_1.next(); !ignoredFiles_1_1.done; ignoredFiles_1_1 = ignoredFiles_1.next()) {
                    var path = ignoredFiles_1_1.value;
                    fileTimestamps.set(path, IGNORE_TIME_ENTRY);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (ignoredFiles_1_1 && !ignoredFiles_1_1.done && (_a = ignoredFiles_1.return)) _a.call(ignoredFiles_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            try {
                for (var ignoredDirs_1 = __values(ignoredDirs), ignoredDirs_1_1 = ignoredDirs_1.next(); !ignoredDirs_1_1.done; ignoredDirs_1_1 = ignoredDirs_1.next()) {
                    var path = ignoredDirs_1_1.value;
                    dirTimestamps.set(path, IGNORE_TIME_ENTRY);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (ignoredDirs_1_1 && !ignoredDirs_1_1.done && (_b = ignoredDirs_1.return)) _b.call(ignoredDirs_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            callback(err, fileTimestamps, dirTimestamps, changedFiles, removedFiles);
        }, callbackUndelayed);
        return {
            close: function () { return watcher.close(); },
            pause: function () { return watcher.pause(); },
            getContextTimeInfoEntries: function () {
                var e_3, _a;
                var dirTimestamps = watcher.getContextTimeInfoEntries();
                try {
                    for (var ignoredDirs_2 = __values(ignoredDirs), ignoredDirs_2_1 = ignoredDirs_2.next(); !ignoredDirs_2_1.done; ignoredDirs_2_1 = ignoredDirs_2.next()) {
                        var path = ignoredDirs_2_1.value;
                        dirTimestamps.set(path, IGNORE_TIME_ENTRY);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (ignoredDirs_2_1 && !ignoredDirs_2_1.done && (_a = ignoredDirs_2.return)) _a.call(ignoredDirs_2);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                return dirTimestamps;
            },
            getFileTimeInfoEntries: function () {
                var e_4, _a;
                var fileTimestamps = watcher.getFileTimeInfoEntries();
                try {
                    for (var ignoredFiles_2 = __values(ignoredFiles), ignoredFiles_2_1 = ignoredFiles_2.next(); !ignoredFiles_2_1.done; ignoredFiles_2_1 = ignoredFiles_2.next()) {
                        var path = ignoredFiles_2_1.value;
                        fileTimestamps.set(path, IGNORE_TIME_ENTRY);
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (ignoredFiles_2_1 && !ignoredFiles_2_1.done && (_a = ignoredFiles_2.return)) _a.call(ignoredFiles_2);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                return fileTimestamps;
            }
        };
    };
    return IgnoringWatchFileSystem;
}());
exports.IgnoringWatchFileSystem = IgnoringWatchFileSystem;
//# sourceMappingURL=IgnorePlugin.js.map