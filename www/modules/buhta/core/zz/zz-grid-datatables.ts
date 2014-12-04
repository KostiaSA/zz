/// <reference path="../../lib/lib.ts" />
/// <reference path="zz.ts" />

//interface I_ZZ {
//    grid?: ZZ_Grid;
//}

//class ZZ_Grid extends ZZ {
//    get button() { return this }
//}
module BuhtaCore {

    app.directive("zzGridDatatables", ["$compile", ($compile: ng.ICompileService) => {
      return {
            restrict: 'E',
            replace: true,
            transclude: true,
            //scope: false, // use controller scope

            link: (scope: ng.IScope, element: JQuery, attributes: ng.IAttributes, ctrl: ng.IControllerService, transclude: ng.ITranscludeFunction) => {

                element[0]["$scope"] = scope;
                element[0]["$compile"] = $compile;
                element.attr("zz-type", "grid")
            element.addClass("zz-grid");


                //var table = element.children("table").dataTable({
                //    "scrollY": "200px",
                //    "scrollCollapse": true,
                //    "paging": false
                //});

                //scope.$watch(
                //    () => {
                //        return element.width();
                //    },
                //    (newVal, oldVal) => {
                //        table.fnAdjustColumnSizing();
                //    });

                //scope.$watch(
                //    () => {
                //        var delta = element.find(".dataTables_scrollBody").offset().top - element.offset().top;
                //        return element.height() - delta;
                //    },
                //    (newVal, oldVal) => {
                //        var delta = element.find(".dataTables_scrollBody").offset().top - element.offset().top;
                //        table.fnSettings().oScroll.sY = (element.height()-delta).toString() + "px";
                //        table.fnDraw();
                //    });

            },
            //template: '<div><table ng-transclude class="display" width="100%" cellspacing="0"><ng-transclude></ng-transclude></table></div>'
            template: '<div ng-transclude><ng-transclude></ng-transclude></div>'
        }
   }]);

}