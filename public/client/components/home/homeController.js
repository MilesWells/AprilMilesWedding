angular.module('WeddingApp')
    .controller('HomeCtrl', function($scope, $rootScope, $location, $http) {
        $scope.user = $rootScope.getUser();

        $scope.$watch(function() {
            return $rootScope.user;
        }, function() {
            $scope.user = $rootScope.user;
        }, true);

        $scope.logout = function() {
            $http.post('/logout', {})
                .success(function() {
                    $rootScope.setUser(null);

                    $location.url('/');
                });
        };
    });