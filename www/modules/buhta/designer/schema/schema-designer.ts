/// <reference path="../../core/buhta-core.d.ts" />


module BuhtaDesigner {

    BuhtaCore.app.directive("schemaDesigner", ["$compile", ($compile: ng.ICompileService) => {
       return {
            restrict: 'E',
            replace: true,
            transclude: true,
            //scope: false, // use controller scope

            link:
            {
                pre: function preLink(scope: ng.IScope, element: JQuery, attributes: ng.IAttributes, ctrl: ng.IControllerService, transclude: ng.ITranscludeFunction) {

                    //scope["table"] = scope["DesignedObject"];
                },
                post: function postLink(scope: ng.IScope, element: JQuery, attributes: ng.IAttributes, ctrl: ng.IControllerService, transclude: ng.ITranscludeFunction) {

                    element[0]["$scope"] = scope;
                    element[0]["$compile"] = $compile;
                    scope["table"] = scope["DesignedObject"];

                }
            },
            templateUrl: "modules/buhta/designer/schema/schemaDesigner.html"
        }
    }]);

}