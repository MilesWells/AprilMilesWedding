'use strict';

/**********************************************************************
 * Angular Application
 **********************************************************************/
var app = angular.module('WeddingApp', ['ngResource', 'ngRoute', 'ngMessages', 'toastr'])
    .config(function($routeProvider, $locationProvider, $httpProvider) {
        //================================================
        // Check if the user is connected
        //================================================
        var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
            // Initialize a new promise
            var deferred = $q.defer();

            // Make an AJAX call to check if the user is logged in
            $http.get('/loggedin').success(function(user){
                // Authenticated
                if (user !== '0')
                /*$timeout(deferred.resolve, 0);*/
                    deferred.resolve();

                // Not Authenticated
                else {
                    $rootScope.message = 'You need to log in.';
                    //$timeout(function(){deferred.reject();}, 0);
                    deferred.reject();
                    $location.url('/login');
                }
            });

            return deferred.promise;
        };
        //================================================

        //================================================
        // Add an interceptor for AJAX errors
        //================================================
        $httpProvider.interceptors.push(function($q, $location) {
            return {
                response: function(response) {
                    // do something on success
                    return response;
                },
                responseError: function(response) {
                    if (response.status === 401)
                        $location.url('#/login');
                    return $q.reject(response);
                }
            };
        });
        //================================================

        //================================================
        // Define all the routes
        //================================================
        $routeProvider
            .when('/', {
                templateUrl: '/components/home/homeView.html'
            })
            .when('/profile', {
                templateUrl: '/components/profile/profileView.html',
                controller: 'ProfileCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/requests/songs', {
                templateUrl: '/components/songRequest/songRequestView.html',
                controller: 'SongRequestCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/login', {
                templateUrl: '/components/login/loginView.html',
                controller: 'LoginCtrl'
            })
            .when('/register', {
                templateUrl: '/components/register/registerView.html',
                controller: 'RegisterCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
        //================================================

    }) // end of config()
    .run(function($rootScope, $http){
        $rootScope.message = '';

        // Logout function is available in any pages
        $rootScope.logout = function(){
            $rootScope.message = 'Logged out.';
            $rootScope.setUser(null);
            $http.post('/logout');
        };
    })
    .run(["$rootScope", "UserService",
        function($rootScope, UserService){
            $rootScope.getUser = UserService.getUser;
            $rootScope.setUser = UserService.setUser;
        }
    ])
    .run(["$rootScope", "CommonService",
        function($rootScope, CommonService){
            $rootScope.allFalse = CommonService.allFalse;
        }
    ]);