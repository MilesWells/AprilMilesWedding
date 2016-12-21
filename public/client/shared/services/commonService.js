angular.module('WeddingApp').factory('CommonService', function(){

        return {
            allFalse: allFalse
        };

        function allFalse(object) {
            for (var i in object) {
                if (object[i] === true) {
                    return false;
                }
            }

            return true;
        }

    }
);