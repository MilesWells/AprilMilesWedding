angular.module('WeddingApp')
    .controller('RegisterCtrl', function($scope, $rootScope, $http, $location) {
        $scope.message = '';
        $scope.rsvp = 2;
        $scope.subscribe = true;

        // Register the login() function
        $scope.register = function(isValid){
            if(!isValid) {
                return;
            }

            $scope.hasActiveRequest = true;

            $http.post('/register', {
                accessCode: $scope.accessCode,
                username: $scope.email,
                password: $scope.password,
                confirmPassword: $scope.confirmPassword,
                name: $scope.name,
                rsvp: $scope.rsvp != 0,
                plusOne: $scope.rsvp == 2,
                subscribe: $scope.subscribe
            })
            .success(function(user){
                $rootScope.setUser(user);

                // No error: authentication OK
                $location.url('/profile');
            })
            .error(function(response){
                // Error: authentication failed
                $scope.message = response;
                $scope.hasActiveRequest = false;
            });
        };
    });