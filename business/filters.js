'use strict';

angular.module('nm.filters', []).filter('trust', function($sce) {
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}).filter('subStrByByte', function(app) {
    return function (val, len, suffix) { 
        return app.tools.subStrByByte(val, len, suffix);
    };
});