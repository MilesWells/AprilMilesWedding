angular.module('WeddingApp')
    .controller('ProfileCtrl', function ($scope, $rootScope, $http, toastr, SongRequestService) {
        $scope.user = $rootScope.getUser();
        $scope.rsvp = $scope.user.Rsvp + $scope.user.PlusOne;

        SongRequestService.getMyRequests($scope.user.UserId)
            .then(result => {
                $scope.songRequests = result.data.Items;
            });

        $scope.updateRsvp = function() {
            $scope.user.Rsvp = $scope.rsvp != 0;
            $scope.user.PlusOne = $scope.rsvp == 2;

            $http.put('/me', { user: $scope.user })
                .success(user => {
                    $rootScope.setUser(user);
                    toastr.success('Your RSVP has been updated!')
                })
                .error(() => {
                    toastr.error('There was a problem updating your RSVP.')
                });
        };
    });