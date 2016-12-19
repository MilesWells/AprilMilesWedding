angular.module('WeddingApp')
    .controller('LoginCtrl', function($scope, $rootScope, $http, $location) {
        $scope.message = '';

        // Register the login() function
        $scope.login = function(){
            $scope.hasActiveRequest = true;

            $http.post('/login', {
                username: $scope.email,
                password: $scope.password
            })
            .success(function(user){
                $rootScope.user = user;
                // No error: authentication OK
                $location.url('/profile');
            })
            .error(function(){
                // Error: authentication failed
                $scope.message = 'Incorrect username or password.';
                $scope.password = '';
                $scope.hasActiveRequest = false;
            });
        };
    });