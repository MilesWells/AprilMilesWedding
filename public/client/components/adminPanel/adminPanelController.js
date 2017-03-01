angular.module('WeddingApp')
    .controller('AdminPanelCtrl', function ($scope, $rootScope, toastr, AdminPanelService) {
        $scope.user = $rootScope.getUser();
        $scope.newCodes = [];
        $scope.numberOfCodes = 1;
        $scope.users = [];
        $scope.rsvps = 0;
        $scope.plusOnes = 0;
        let self = this;

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

        self.init = () => {
            AdminPanelService.getAllUsers()
                .then(users => {
                    $scope.users = users.Items;

                    $scope.rsvps = users.Items.filter(user => {
                        return user.Rsvp;
                    }).length;

                    $scope.plusOnes = users.Items.filter(user => {
                        return user.PlusOne;
                    }).length;

                    $scope.$apply();
                }, () => {
                    toastr.error('Unable to get user list');
                });
        };

        self.init();
    });