angular.module('WeddingApp').factory('SongRequestService', [
    '$http', 'toastr',
    function($http, toastr){

        return {
            getAllRequests: getAllRequests,
            addRequest: addRequest,
            deleteRequest: deleteRequest,
            getMyRequests: getMyRequests
        };

        function getAllRequests() {
            return $http.get('/songRequests')
                .success(function(data) {
                    return data;
                })
                .error(function(error) {
                    toastr.error('Unable to retrieve the song requests.');
                    return error;
                });
        }

        function addRequest(songRequest) {
            return $http.post('/songRequests', { songRequest: songRequest })
                .success(function() {
                    toastr.success('Your song request has been added!');
                    return null;
                })
                .error(function(error) {
                    toastr.error('Unable to add your song request.');
                    return error;
                });
        }

        function deleteRequest(songRequestId) {
            return $http.delete('/songRequests/' + songRequestId)
                .success(function() {
                    toastr.success('Your song request has been removed!');
                    return null;
                })
                .error(function(error) {
                    toastr.error('Unable to remove your song request.');
                    return error;
                });
        }

        function getMyRequests(userId) {
            return $http.get('/songRequests', { userId: userId })
                .success(function(data) {
                    return data;
                })
                .error(function(error) {
                    toastr.error('Unable to retrieve the song requests.');
                    return error;
                });
        }

    }
]);