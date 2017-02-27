angular.module('WeddingApp')
    .controller('AdminPanelCtrl', function ($scope, $rootScope, toastr, AdminPanelService) {
        $scope.user = $rootScope.getUser();
        $scope.newCodes = [];
        $scope.numberOfCodes = 1;

        $scope.generateCodes = () => {
            let promises = [];

            for(let i = 0; i < $scope.numberOfCodes; i++) {
                promises.push(AdminPanelService.generateAccessCode());
            }

            Promise.all(promises)
                .then(values => {
                    toastr.success('Successfully generated new access codes');
                    $scope.newCodes = values;
                }, () => {
                    toastr.error('Failed to generate access codes');
                });
        };
    });