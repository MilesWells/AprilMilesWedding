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
                localStorage.setItem('resetPassword', JSON.stringify({
                    email: $scope.email,
                    accessCode: $scope.accessCode
                }));
                $location.url('/resetpassword');
            })
            .error(() => {
                // Error: authentication failed
                $scope.message = 'Invalid email/access code combination.';
                $scope.hasActiveRequest = false;
            });
        };
    });