'use strict';

/**********************************************************************
 * Angular Application
 **********************************************************************/
let app = angular.module('WeddingApp', ['ngResource', 'ngRoute', 'ngMessages', 'toastr', 'textAngular'])
    .config(($routeProvider, $locationProvider, $httpProvider) => {
        //================================================
        // Check if the user is connected
        //================================================
        let checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
            // Initialize a new promise
            let deferred = $q.defer();

            // Make an AJAX call to check if the user is logged in
            $http.get('/loggedin').success(user => {
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
        // Check if the user is an admin
        //================================================
        let checkAdminStatus = function($q, $timeout, $http, $location, $rootScope){
            // Initialize a new promise
            let deferred = $q.defer();

            // Make an AJAX call to check if the user is logged in
            $http.get('/isadmin').success(user => {
                // Authenticated
                if (user !== '0')
                /*$timeout(deferred.resolve, 0);*/
                    deferred.resolve();

                // Not Authenticated
                else {
                    //$timeout(function(){deferred.reject();}, 0);
                    deferred.reject();
                    $location.url('/');
                }
            });

            return deferred.promise;
        };
        //================================================

        //================================================
        // Add an interceptor for AJAX errors
        //================================================
        $httpProvider.interceptors.push(($q, $location) => {
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
            .when('/blog/new', {
                templateUrl: '/components/blogPost/blogPostView.html',
                controller: 'BlogPostCtrl',
                resolve: {
                    loggedin: checkAdminStatus
                }
            })
            .when('/requests/songs', {
                templateUrl: '/components/songRequest/songRequestView.html',
                controller: 'SongRequestCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/admin', {
                templateUrl: '/components/adminPanel/adminPanelView.html',
                controller: 'AdminPanelCtrl',
                resolve: {
                    loggedin: checkAdminStatus
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
            .when('/help', {
                templateUrl: '/components/help/helpView.html'
            })
            .when('/hotel', {
                templateUrl: '/components/hotel/hotelView.html'
            })
            .otherwise({
                redirectTo: '/'
            });
        //================================================

    }) // end of config()
    .run(($rootScope, $http) => {
        $rootScope.message = '';

        // Logout function is available in any pages
        $rootScope.logout = function(){
            $rootScope.message = 'Logged out.';
            $rootScope.setUser(null);
            $http.post('/logout');
        };
    })
    .run(["$rootScope", "UserService",
        ($rootScope, UserService) => {
            $rootScope.getUser = UserService.getUser;
            $rootScope.setUser = UserService.setUser;
        }
    ])
    .run(["$rootScope", "CommonService",
        ($rootScope, CommonService) => {
            $rootScope.allFalse = CommonService.allFalse;
        }
    ])
    .filter('range', function() {
        return function(input, from, to) {
            const min = parseInt(from);
            const max = parseInt(to);
            for (let i = min; i <= max; i++)
                input.push(i);
            return input;
        };
    })
    .directive('ngConfirmClick', [
        function() {
            return {
                link: function (scope, element, attr) {
                    let msg = attr.ngConfirmClick || "Are you sure?";
                    let clickAction = attr.confirmedClick;
                    element.bind('click', function (event) {
                        if (window.confirm(msg)) {
                            scope.$eval(clickAction)
                        }
                    });
                }
            };
        }]);