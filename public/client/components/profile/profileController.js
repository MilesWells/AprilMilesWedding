angular.module('WeddingApp')
    .controller('ProfileCtrl', function($scope, $rootScope) {
        $scope.user = $rootScope.user;
    });