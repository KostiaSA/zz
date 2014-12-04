/// <reference path="../../../../lib/lib.ts" />
/// <reference path="zz.ts" />
/// <reference path="zz-tabset.ts" />
module BuhtaCore {

    export interface I_ZZ {
        spa?: ZZ_Spa;
        spaTabset?: ZZ_Tabset;
    }

    export class ZZ_Spa extends ZZ {
        get spa() { return this }

        get spaTabset(): ZZ_Tabset {
            return zz("spa-tabset").tabset;
        }
    }


    app.directive("zzSpa", ["$compile", ($compile: ng.ICompileService) => {
       return {
            restrict: 'E',
            replace: true,
            transclude: true,
            //scope: false, // use controller scope

            link: (scope: ng.IScope, element: JQuery, attributes: ng.IAttributes, ctrl: ng.IControllerService, transclude: ng.ITranscludeFunction) => {

                //element[0]["$scope"] = scope;
                //element[0]["$compile"] = $compile;
                //element.attr("zz-type", "spa")

                element[0]["$zz"] = new ZZ_Spa(element, scope, $compile);
                element.addClass("zz-spa");

                $("body").css("height", "100%").css("width", "100%");

            },
            templateUrl: 'modules/buhta/core/zz/zz-spa.html'
        }
    }]);

}