angular.module('WeddingApp')
    .controller('ForgotPasswordCtrl', function ($scope, $rootScope, $http, $location) {
        $scope.message = '';

        // Register the login() function
        $scope.submit = function() {
            $scope.hasActiveRequest = true;

            $http.post('/forgotpassword', {
                username: $scope.email,
                accessCode: $scope.accessCode
            })
            .success(() => {

            })
            .error(() => {
                // Error: authentication failed
                $scope.message = 'Invalid email/access code combination.';
                $scope.hasActiveRequest = false;
            });
        };
    });