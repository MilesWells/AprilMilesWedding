angular.module('WeddingApp')
    .controller('LoginCtrl', function ($scope, $rootScope, $http, $location) {
        $scope.message = '';

        $http.get('/loggedin', {})
            .success(result => {
                if (result.UserId) {
                    $location.url('/profile');
                }
            });

        // Register the login() function
        $scope.login = function() {
            $scope.hasActiveRequest = true;

            $http.post('/login', {
                username: $scope.email,
                password: $scope.password
            })
            .success(user => {
                $rootScope.setUser(user);
                // No error: authentication OK
                $location.url('/profile');
            })
            .error(() => {
                // Error: authentication failed
                $scope.message = 'Incorrect username or password.';
                $scope.hasActiveRequest = false;
            });
        };
    });