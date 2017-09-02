angular.module('WeddingApp')
    .controller('ResetPasswordCtrl', function ($scope, $rootScope, $http, $location, toastr) {
        $scope.message = '';

        // Register the login() function
        $scope.register = function(isValid) {
            if(!isValid) {
                return;
            }

            let resetParams = JSON.parse(localStorage.getItem('resetPassword'));

            $scope.hasActiveRequest = true;

            $http.post('/resetpassword', {
                accessCode: resetParams.accessCode,
                username: resetParams.email,
                password: $scope.password,
                confirmPassword: $scope.confirmPassword
            })
            .success(() => {
                localStorage.removeItem('resetPassword');
                toastr.success('Your password has been reset! Please log in using your new password.');
                $location.url('/login');
            })
            .error(response => {
                // Error: authentication failed
                $scope.message = response;
                $scope.hasActiveRequest = false;
            });
        };
    });