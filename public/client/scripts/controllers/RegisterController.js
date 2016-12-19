angular.module('WeddingApp')
    .controller('RegisterCtrl', function($scope, $rootScope, $http, $location) {
        $scope.message = '';

        // Register the login() function
        $scope.register = function(){
            $scope.hasActiveRequest = true;

            $http.post('/register', {
                accessCode: $scope.accessCode,
                username: $scope.email,
                password: $scope.password,
                confirmPassword: $scope.confirmPassword
            })
            .success(function(user){
                $rootScope.user = user;

                // No error: authentication OK
                $location.url('/profile');
            })
            .error(function(response){
                // Error: authentication failed
                $scope.message = response;
                $scope.password = '';
                $scope.confirmPassword = '';
                $scope.hasActiveRequest = false;
            });
        };
    });