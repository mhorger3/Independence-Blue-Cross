// create the module and name it configApp
var configApp = angular.module('configApp', ['ngRoute']);
// configure our routes
configApp.config(function($routeProvider) {
    $routeProvider
        // route for the dashboard page
        .when('/', {
            templateUrl: 'pages/dashboard.html',
            controller: 'mainController'
        })
        // route for the package view page
        .when('/packageView', {
            templateUrl: 'pages/packageView.html',
            controller: 'packageViewController'
        })
        // route for the mnemonic view page
        .when('/mnemonicView', {
                templateUrl: 'pages/mnemonicView.html',
                controller: 'mnemonicViewController'
        })
        // route for the package info page
        .when('/packageInfo/:id', {
                templateUrl: 'pages/packageInfo.html',
                controller: 'packageInfoController'
        })
        // route for the mnemonic info page
        .when('/mnemonicInfo/:id', {
                templateUrl: 'pages/mnemonicInfo.html',
                controller: 'mnemonicInfoController'
        })
        // route for the keyword view page
        .when('/keywordView', {
                templateUrl: 'pages/keywordView.html',
                controller: 'keywordViewController'
        })
        // route for the publish history page
        .when('/publishHistory', {
                templateUrl: 'pages/publishHistory.html',
                controller: 'publishHistoryController'
        })
        // route for the checkout
        .when('/checkout', {
                templateUrl: 'pages/checkout.html',
                controller: 'checkoutController'
        });
});