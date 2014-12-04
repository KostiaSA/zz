/// <reference path="zz-form-control.ts" />

module BuhtaCore {

    export interface I_ZZ {
        formText?: ZZ_FormText;
    }

    export class ZZ_FormText extends ZZ_FormControl {
        get formText() { return this }
    }


    app.directive("zzFormText", ["$compile", ($compile: ng.ICompileService) => {
      return {
            restrict: 'E',
            replace: true,
            transclude: true,
            //scope: false, // use controller scope

            link: (scope: ng.IScope, element: JQuery, attributes: ng.IAttributes, ctrl: ng.IControllerService, transclude: ng.ITranscludeFunction) => {

                element[0]["$scope"] = scope;
                element[0]["$compile"] = $compile;
                element.attr("zz-type", "form-text")
            //element.addClass("btn btn-default");

        },
            template: '<div ng-transclude></div>'
        }
    }]);

}