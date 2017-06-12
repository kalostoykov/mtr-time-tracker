///<reference path="_all.ts"/>
import {AuthenticationService} from "./services/authentication";
import {IScope, IEnvConfig} from "./interface";
export let Module = "app";

angular.module(Module, [
    'ngRoute',
    'ngCookies',
    'angular-jwt',
    'environment',
    'angularMoment'
])
    .constant('config', {
        appTitle: 'MTR Design Projects'
    })
    .config([
        '$routeProvider',
        '$locationProvider',
        'envServiceProvider',
        ($routeProvider:angular.route.IRouteProvider,
         $locationProvider:ng.ILocationProvider,
         envServiceProvider:angular.environment.ServiceProvider) => {
            'use strict';

            envServiceProvider.config({
                domains: {
                    development: ['mtr-time-tracker.dev'],
                    production: [
                        'www.mtr-time-tracker.aws.mtrdev.com',
                        'mtr-time-tracker.aws.mtrdev.com'
                    ]
                },
                vars: {
                    development: {
                        apiUrl: '//localhost:9000/time-tracker/api'
                    },
                    production: {
                        apiUrl: '//api.mtr-time-tracker.aws.mtrdev.com/time-tracker/api'
                    }
                }
            });
            envServiceProvider.check();
            $routeProvider
                .when('/', {
                    redirectTo: '/time-reports'
                })
                .when('/account', {
                    controller: 'AccountController',
                    templateUrl: '/views/account.html',
                    controllerAs: 'c'
                })
                .when('/projects/:id/time-reports/new', {
                    controller: 'TimeReportNewController',
                    templateUrl: '/views/time-reports/new.html',
                    controllerAs: 'c'
                })
                .when('/projects/:project_id/time-reports/:id', {
                    controller: 'TimeReportEditController',
                    templateUrl: '/views/time-reports/edit.html',
                    controllerAs: 'c'
                })
                .when('/projects/:project_id/time-reports/:id/view', {
                    controller: 'TimeReportViewController',
                    templateUrl: '/views/time-reports/view.html',
                    controllerAs: 'c'
                })
                .when('/time-reports', {
                    controller: 'TimeReportListController',
                    templateUrl: '/views/time-reports/list.html',
                    controllerAs: 'c'
                })
                .when('/time-reports?from&to', {
                    controller: 'TimeReportListController',
                    templateUrl: '/views/time-reports/list.html',
                    controllerAs: 'c'
                })
                .when('/404', {
                    controller: "NotFoundController",
                    templateUrl: '/views/404.html',
                    controllerAs: 'c'
                })
                .when('/login', {
                    controller: 'LoginController',
                    templateUrl: '/views/login.html',
                    controllerAs: 'c'
                })
                .otherwise({
                    redirectTo: '/404'
                });
        }])
    .run([
        '$location',
        '$cookieStore',
        '$http',
        'config',
        'envService',
        '$rootScope',
        'AuthenticationService',
        ($location:ng.ILocationService,
         $cookieStore:angular.cookies.ICookieStoreService,
         $http:ng.IHttpService,
         config:IEnvConfig,
         envService:angular.environment.Service,
         $scope:IScope,
         AuthenticationService:AuthenticationService) => {
            $scope.globals = $cookieStore.get('globals') || {};
            if ($scope.globals.currentUser) {
                AuthenticationService.SetCredentials($scope.globals.currentUser.token, function (response:any) {
                    if (typeof response.success != 'boolean' ||
                        typeof response.success == 'boolean' && response.success == false) {
                        $location.path('/login');
                    }
                });
                $http.defaults.headers.common.Authorization = 'JWT ' + $scope.globals.currentUser.token;
            }
            $scope.$on('$locationChangeStart', (event, next, current):any =>  {
                var restrictedPage = $.inArray($location.path(), ['/login', '/404']) === -1;
                if (restrictedPage && !$scope.globals.currentUser) {
                    $location.path('/login');
                }
            });
            $scope.$on('$viewContentLoaded', function(){
                $('.datepicker').datetimepicker({
                    format: 'Y-m-d',
                    dayOfWeekStart: '1',
                    maxDate: new Date(),
                    defaultDate: new Date(),
                    timepicker: false,
                    inline: false
                });
                $('.timemask').mask('00:00', {placeholder: '00:00'});
            });
        }
    ]);
