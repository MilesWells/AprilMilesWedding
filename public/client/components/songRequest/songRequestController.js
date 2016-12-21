angular.module('WeddingApp')
    .controller('SongRequestCtrl', function($scope, $rootScope, SongRequestService) {
        var self = this;

        self.refreshList = function() {
            SongRequestService.getAllRequests()
                .then(function(result) {
                    $scope.songRequests = result.data.Items;
                });
        };

        $scope.removeSongRequest = function(songRequestId) {
            SongRequestService.deleteRequest(songRequestId)
                .then(self.refreshList);
        };

        $scope.addSongRequest = function() {
            var user = $rootScope.getUser();
            SongRequestService.addRequest({
                UserId: user.UserId,
                SongName: $scope.songName,
                Artist: $scope.artist,
                Album: $scope.album
            }).then(self.refreshList);
        };

        self.refreshList();
    });