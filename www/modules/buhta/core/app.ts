/// <reference path="../../../lib/lib.ts" />

module BuhtaCore {
    export var app = angular.module("app", []);

    export var dbms = {};
    dbms["schema"] = "mssql";
    dbms["data"] = "mssql";
    dbms["sunerja"] = "mssql";
    dbms["schema-pg"] = "pgsql";
    dbms["data-pg"] = "pgsql";
    dbms["sunerja-pg"] = "pgsql";
    dbms["test-pg"] = "pgsql";
    dbms["test-ms"] = "mssql";

    // отключение перехвата исключений в angular
    app.factory('$exceptionHandler', function () {
        return function (exception, cause) {
            exception.message += ' (caused by "' + cause + '")';
            throw exception;
        };
    });


    app.run(($rootScope) => {

        //console.clear();

        $(window).resize(function () {
            $rootScope.$apply();
        });

        window.onload = () => {
            $rootScope.$apply();
        };
    });
}