/// <reference path="../buhta-core.ts" />
/// <reference path="zz.ts" />
/// <reference path="../utils.ts" />

module BuhtaCore {

    export interface I_ZZ {
        button?: ZZ_Button;
    }

    export class ZZ_Button extends ZZ {
        get button() { return this }
        //enabled(setEnabled?: boolean): boolean {
        //    if (setEnabled != undefined) {
        //        if (setEnabled)
        //            this._element.removeAttr("disabled");
        //        else
        //            this._element.attr("disabled", "disabled");
        //        return setEnabled;
        //    }
        //    else
        //        return this._element.attr("disabled") != "disabled";
        //}
        constructor(_element: JQuery, _scope: ng.IScope, _compile: ng.ICompileService) {
            super(_element, _scope, _compile);
            _element.addClass("zz-button btn btn-default");
        }

    }


    app.directive("zzButton", ["$compile", ($compile: ng.ICompileService) => {
      return {
            restrict: 'E',
            replace: true,
            transclude: true,
            //scope: false, // use controller scope

            link: (scope: ng.IScope, element: JQuery, attributes: ng.IAttributes, ctrl: ng.IControllerService, transclude: ng.ITranscludeFunction) => {

                var zzButton = new ZZ_Button(element, scope, $compile);

            },
            template: '<button ng-transclude></button>'
        }
}]);

}