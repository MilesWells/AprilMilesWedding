angular.module('WeddingApp').factory('UserService', [
    '$window', '$rootScope',
    ($window, $rootScope) => {

        let user;

        return {
            getUser: getUser,
            setUser: setUser
        };

        function getUser() {
            $rootScope.user = user || angular.fromJson($window.localStorage.getItem('user'));
            return $rootScope.user;
        }

        function setUser(userInfo) {
            user = userInfo;
            $rootScope.user = userInfo;
            $window.localStorage.setItem('user', angular.toJson(userInfo));
        }

    }
]);