'use strict';

angular.module('nm', ['ngAnimate', 'nm.route', 'nm.locale', 'nm.services', 'nm.directives', 'pasvaz.bindonce', 'nm.filters', 'nm.controllers']).
    constant('app', {
        status: {
            count: 0,
            show: false
        },
        tools: {
            subStrByByte: function (val, len, suffix) {
                var b = 0, j = 0, l = val.length;
                for (j; j < l; j++) {
                    if (val.charCodeAt(j) > 255) b += 2;
                    else b += 1;
                    if (b >= len) return val.substring(0, j) + suffix;
                }
                return val;
            },
            isArray: function (obj) {
                return Array.isArray ? Array.isArray(obj) : this.ps.call(obj) === '[object Array]';
            },
            isObject: function (obj) {
                return obj === Object(obj);
            },
            isUndefined: function (obj) {
                return obj === void 0;
            },
            isFunction: function (obj) {
                return typeof obj === 'function';
            },
            slice: Array.prototype.slice,
            fe: Array.prototype.forEach,
            ks: Object.prototype.keys,
            hp: Object.prototype.hasOwnProperty,
            ps: Object.prototype.toString,
            s: Array.prototype.some,
            breaker: {},
            keys: function (obj) {
                if (!this.isObject(obj)) return [];
                if (this.ks) return this.ks(obj);
                var keys = [];
                for (var key in obj) if (this.hp.call(obj, key)) keys.push(key);
                return keys;
            },
            each: function (obj, iterator, context) {
                if (obj == null) return obj;
                if (this.fe && obj.forEach === this.fe) {
                    obj.forEach(iterator, context);
                } else if (obj.length === +obj.length) {
                    for (var i = 0, length = obj.length; i < length; i++) {
                        if (iterator.call(context, obj[i], i, obj) === this.breaker) return;
                    }
                } else {
                    var keys = this.keys(obj);
                    for (var i = 0, length = keys.length; i < length; i++) {
                        if (iterator.call(context, obj[keys[i]], keys[i], obj) === this.breaker) return;
                    }
                }
                return obj;
            },
            extend: function (obj) { //扩展此方法很有意义。angular.extend({obj:{n:'g',id:1}},{obj:{n:'t'}})结果{obj:{n:'t'}}；而app.extend({obj:{n:'g',id:1}},{obj:{n:'t'}})结果{obj:{n:'t',id:1}}
                var $this = this;
                $this.each($this.slice.call(arguments, 1), function (source) {
                    if (source) {
                        for (var prop in source) {
                            if ($this.isObject(source[prop]) || $this.isArray(source[prop]))
                                $this.extend(obj[prop] = ($this.isUndefined(obj[prop]) ? ($this.isArray(source[prop]) ? [] : {}) : obj[prop]), source[prop]);
                            else obj[prop] = source[prop];
                        }
                    }
                });
                return obj;
            },
            find: function (obj, predicate, iterator, context) {
                var result;
                this.any(obj, function (value, index, list) {
                    if (predicate.call(context, value, index, list)) {
                        if (iterator) result = iterator.call(context, value, index, list);
                        else result = value;
                        return true;
                    }
                });
                return result;
            },
            any: function (obj, predicate, context) {
                predicate || (predicate = function (value) { return value; });
                var result = false;
                if (obj == null) return result;
                if (this.s && obj.some === this.s) return obj.some(predicate, context);
                this.each(obj, function (value, index, list) {
                    if (result || (result = predicate.call(context, value, index, list))) return {};
                });
                return !!result;
            },
            matches: function (attrs) {
                return function (obj) {
                    if (obj === attrs) return true;
                    for (var key in attrs) {
                        if (attrs[key] !== obj[key])
                            return false;
                    }
                    return true;
                }
            },
            where: function (obj, attrs, iterator) { //{字段:值},function(v){return v.id // {id:v.id,n:v.n}}
                return this.filter(obj, this.matches(attrs), iterator);
            },
            findWhere: function (obj, attrs, iterator) {
                return this.find(obj, this.matches(attrs), iterator);
            },
            filter: function (obj, predicate, iterator, context) {
                var results = [];
                if (obj == null) return results;
                this.each(obj, function (value, index, list) {
                    if (predicate.call(context, value, index, list))
                        if (iterator) results.push(iterator.call(context, value, index, list));
                        else results.push(value);
                });
                return results;
            },
            random: function (min, max) {
                if (max == null) {
                    max = min;
                    min = 0;
                }
                return min + Math.floor(Math.random() * (max - min + 1));
            },
            leftPad: function (s, len, seq) { return (Array(len + 1).join(seq) + s).split('').reverse().join('').substring(0, len).split('').reverse().join(''); },
            initDate: function (range, less) {
                if (!less) less = 0;
                var c = new Date(), l = new Date();
                c.setDate(c.getDate() - less);
                l.setDate(l.getDate() - less - range);
                return (l.getFullYear() + '/' + this.leftPad(l.getMonth() + 1, 2, '0') + '/' + this.leftPad(l.getDate(), 2, '0')) + " - " + (c.getFullYear() + '/' + this.leftPad(c.getMonth() + 1, 2, '0') + '/' + this.leftPad(c.getDate(), 2, '0'));
            }
        }
    }).
    config(function ($httpProvider, app) {
        var timeId = 0;
        $httpProvider.defaults.transformRequest.push(function (data) {
            app.status.count += 1;
            if (timeId) { app.timeout.cancel(timeId) }
            timeId = app.timeout(function () { app.timeout.cancel(timeId); if (!app.status.show && app.status.count > 0) { app.status.show = true; app.loading(true) } }, 100);
            return data;
        });
        $httpProvider.defaults.transformResponse.push(function (data) { 
            app.status.count -= 1;
            if (app.status.show && app.status.count === 0) {
                app.status.show = false;
                app.loading(false);
            }
            return data;
        });
        $httpProvider.interceptors.push(function ($q) {
            return {
                request: function (config) {
                    config.headers['Auth'] = app.user || '';
                    return config || $q.when(config);
                },
                responseError: function (res) {
                    sessionStorage.removeItem(document.domain);
                    if (res.status == 401) window.location.href = '/login';
                    //else window.location.href = '/error/' + res.status;
                }
            };
        });
    }).
    run(function (app, $rootScope, localeZh, $location, serverApi, $timeout) {
        app.timeout = $timeout;
        app.loading = function (value) { $rootScope.loading.show = value; };
        $rootScope.loading = { show: false };
        $rootScope.logOut = function () {
            serverApi.loginOut(app.user).then(function () {
                sessionStorage.removeItem(document.domain);
                window.location.href = '/login';
            });
        };
    });