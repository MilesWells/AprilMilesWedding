angular.module('WeddingApp')
    .controller('MainCtrl', function($scope, $rootScope, $location, $http) {
        $scope.logout = function() {
            $http.post('/logout', {})
                .success(function() {
                    $rootScope.user = null;

                    $location.url('/');
                });
        };
    });