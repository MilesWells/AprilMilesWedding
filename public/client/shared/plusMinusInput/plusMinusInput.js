angular.module('WeddingApp')
    .component('plusMinusInput', {
        templateUrl: '/shared/plusMinusInput/plusMinusInput.html',
        bindings: {
            inputValue: '=',
            minValue: '@'
        },
        controller: function () {
            let ctrl = this;

            if(ctrl.inputValue < ctrl.minValue) {
                ctrl.inputValue = ctrl.minValue;
            }

            ctrl.inc = () => {
                ctrl.inputValue++;
            };

            ctrl.dec = () => {
                if(ctrl.inputValue > ctrl.minValue) {
                    ctrl.inputValue--;
                }
            };
        }
    });