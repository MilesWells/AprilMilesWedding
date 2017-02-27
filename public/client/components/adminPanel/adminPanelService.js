angular.module('WeddingApp').factory('AdminPanelService', [
    '$http', 'toastr',
    ($http, toastr) => {

        return {
            generateAccessCode: generateAccessCode
        };

        function generateAccessCode() {
            return new Promise((resolve, reject) => {
                $http.post('/admin/accessCodes', {})
                    .success((result) => {
                        resolve(result);
                    })
                    .error(error => {
                        reject(error);
                    });
            });
        }
    }]);