var app = angular.module('VOD', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/javascripts/template/home.html',
            controller: 'MainCtrl',
            data: {
                requireLogin: true
            }
        }).state('login', {
            url: '/login',
            templateUrl: '/javascripts/template/login.html',
            controller: 'AuthCtrl',
            data: {
                requireLogin: false
            }
        }).state('register', {
            url: '/register',
            templateUrl: '/javascripts/template/register.html',
            controller: 'AuthCtrl',
            data: {
                requireLogin: false
            }
        });
    $urlRouterProvider.otherwise('home');
    //for setting url without #
    $locationProvider.html5Mode(true);
});

app.run(function($rootScope, $state, auth) {
    $rootScope.$on('$stateChangeStart', function(event, $stateProvider) {
        var requireLogin = $stateProvider.data.requireLogin;
        if (requireLogin && (!auth.isLoggedIn())) {
            event.preventDefault();
            $state.go("login");
        }
    });

    $rootScope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams) {
            if (($state.current.name == "login") || ($state.current.name == "register") && (auth.isLoggedIn())) {
                $state.go("home");
            }
        });
});