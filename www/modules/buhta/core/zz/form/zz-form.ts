/// <reference path="../zz.ts" />

module BuhtaCore {

    export interface I_ZZ {
        form?: ZZ_Form;
    }

    export class ZZ_Form extends ZZ {
        get form() { return this }
    }

    app.directive("zzForm", ["$compile", ($compile: ng.ICompileService) => {
       return {
            restrict: 'E',
            replace: true,
            transclude: true,
            //scope: false, // use controller scope

            link: (scope: ng.IScope, element: JQuery, attributes: ng.IAttributes, ctrl: ng.IControllerService, transclude: ng.ITranscludeFunction) => {

                element[0]["$scope"] = scope;
                element[0]["$compile"] = $compile;
                element.attr("zz-type", "form")
            //element.addClass("btn btn-default");

            var table = $("<table class='zz-form-table'></table>");

                element.children().each((index: number, control: Element): JQuery => {
                    var tr = $("<tr></tr>").appendTo(table);
                    var label_td = $("<td></td>").appendTo(tr);
                    var input_td = $("<td></td>").appendTo(tr);
                    var chld = $(control).children();
                    if (chld[0])
                        chld.appendTo(label_td);
                    if (chld[1])
                        $(chld[1]).appendTo(input_td);
                    if (chld[2])
                        $(chld[2]).appendTo(input_td);
                    $(control).remove();
                    return undefined;
                })
            table.appendTo(element);


            },
            template: '<div ng-transclude></div>'
        }
    }]);

}