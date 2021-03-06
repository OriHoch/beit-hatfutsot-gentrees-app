(function () {

    'use strict';

    function createModel(){

        var mom = {isWife: true, isMale: false, isMaleNotEditable: true, isAlive: true},
            dad = {isMale: true, isMaleNotEditable: true, isAlive: true};

        return {
            me : {isAliveNotEditable: true, isAlive: true},
            dad: _.clone(dad),
            mom: _.clone(mom),
            momsDad : _.clone(dad),
            momsMom : _.clone(mom),
            dadsDad : _.clone(dad),
            dadsMom : _.clone(mom),
            numBrothers: 0,
            numMomsBrothers: 0,
            numDadsBrothers: 0,
            brothers: [],
            momsBrothers: [],
            dadsBrothers: []
        };
    }

    angular.module('gt.app', ['uuid','ngAnimate', 'ngTouch', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'ui.utils', 'pascalprecht.translate','angular-google-analytics']);

    angular.element(document).ready(function () {
        angular.bootstrap(document, ['gt.app']);
    });

    angular.module('gt.app').config(function (AnalyticsProvider) {
        AnalyticsProvider.setAccount('UA-8676522-3');
        //AnalyticsProvider.enterDebugMode(true);
    });

    angular.module('gt.app').run(['$templateCache', '$state', '$rootScope', 'gtRegistrationSvc',
        function ($templateCache, $state, $rootScope, regSvc) {
            $templateCache.put('shell.html', '<div ng-include="\'/modules/gt.app/views/shell.html\'"></div>');


            $rootScope.showSpinner = false;
            $rootScope.model = localStorage.model ? JSON.parse(localStorage.model) : createModel();

            $rootScope.$watch('model', function () {
                localStorage.model = JSON.stringify($rootScope.model);
            }, true);


            $rootScope.clear = function(){
              for(var k in localStorage){
                  delete localStorage[k];
              }
              $state.go('welcome');
            };

            regSvc.getConfigData().then(function(res){
                $rootScope.configOption = res;
            });


            $rootScope.$on('$stateChangeStart', function (event, toState) {

                var status = regSvc.status,
                    allowedStatuses = toState.data.allowedStatuses;

                if (!_.contains(allowedStatuses, status)) {
                    event.preventDefault();
                    var newState = _.findLast($state.get(), function (s) {
                        return s.data && _.contains(s.data.allowedStatuses, status);
                    });

                    $state.go(newState);
                }
            });

        }]);

})();