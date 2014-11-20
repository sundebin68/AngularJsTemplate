'use strict';

angular.module('nm.route', ['ngRoute']).
    provider('getFile', function() {
        this.html = function(fn) {
            return '/html/' + fn + '?' + Math.random();
        };
        this.$get = function() {
            return {
                html: this.html
            };
        };
    }).
    config(function($routeProvider, $locationProvider, getFileProvider) {
        var help = {
                templateUrl: getFileProvider.html('help.html'),
                controller: 'helpCtrl'
            };
        $routeProvider.
            when('/help', help).
            when('/', help).
            otherwise({ redirectTo: '/' });

        $locationProvider.html5Mode(true).hashPrefix('!');
    });