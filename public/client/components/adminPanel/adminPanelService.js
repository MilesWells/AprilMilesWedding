angular.module('WeddingApp').factory('AdminPanelService', [
    '$http', 'toastr',
    ($http, toastr) => {

        return {
            generateAccessCode: generateAccessCode,
            getAllUsers: getAllUsers
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

        function getAllUsers() {
            return new Promise((resolve, reject) => {
                $http.get('/admin/users')
                    .success((result) => {
                        resolve(result);
                    })
                    .error(error => {
                        console.log(error);
                        reject(error);
                    });
            });
        }
    }]);