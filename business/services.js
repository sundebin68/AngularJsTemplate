'use strict';

angular.module('nm.services', []).
    factory('serverApi', function($q, $http) {
        return {
            loginOut: function (data) { return post('Query', 'LogOut', data); },
            net: function (params) { return post('Query', 'Net', params); },
            social: function (params) { return post('Query', 'Social', params); },
            keyWords: function () { return get('Query', 'Keys'); },
            orgs: function () { return get('Query', 'Orgs'); },
        };

        function get(ctrl, fn, params) {
            var defer = $q.defer();
            $http({
                method: 'get',
                url: '/api/' + ctrl + '/' + fn,
                params: params || {} 
            }).success(function(d) {
                defer.resolve(d);
            }).error(function(d) {
                defer.reject(d);
            });
            return defer.promise;
        }

        function post(ctrl, fn, data) {
            var defer = $q.defer();
            $http({
                method: 'post',
                url: '/api/' + ctrl + '/' + fn,
                data: data || {},
            }).success(function(d) {
                defer.resolve(d);
            }).error(function(d) {
                defer.reject(d);
            });
            return defer.promise;
        }
    }).
    service('helpers', function() {
        this.watchersContainedIn = function(scope) {
            var watchers = (scope.$$watchers) ? scope.$$watchers.length : 0;
            var child = scope.$$childHead;
            while (child) {
                watchers += (child.$$watchers) ? child.$$watchers.length : 0;
                child = child.$$nextSibling;
            }
            return watchers;
        }
    });