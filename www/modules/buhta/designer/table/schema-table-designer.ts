// <reference path="../../core/buhta-core.d.ts" />

//interface I_ZZ {
//    button?: ZZ_Button;
//}

//class ZZ_SchemaTableDesigner extends ZZ {
//    get button() { return this }
//    //enabled(setEnabled?: boolean): boolean {
//    //    if (setEnabled != undefined) {
//    //        if (setEnabled)
//    //            this._element.removeAttr("disabled");
//    //        else
//    //            this._element.attr("disabled", "disabled");
//    //        return setEnabled;
//    //    }
//    //    else
//    //        return this._element.attr("disabled") != "disabled";
//    //}
//}  
  
  
module BuhtaDesigner {

    BuhtaCore.app.directive("schemaTableDesigner", ["$compile", ($compile: ng.ICompileService) => {
       return {
            restrict: 'E',
            replace: true,
            transclude: true,
            //scope: false, // use controller scope

            link:
            {
                pre: function preLink(scope: ng.IScope, element: JQuery, attributes: ng.IAttributes, ctrl: ng.IControllerService, transclude: ng.ITranscludeFunction) {

                    scope["table"] = scope["DesignedObject"];
                },
                post: function postLink(scope: ng.IScope, element: JQuery, attributes: ng.IAttributes, ctrl: ng.IControllerService, transclude: ng.ITranscludeFunction) {

                    element[0]["$scope"] = scope;
                    element[0]["$compile"] = $compile;
                    //element.attr("zz-type","button")
                    //element.addClass("btn btn-default");
                    scope["table"] = scope["DesignedObject"];

                    scope["openColumnEditForm"] = () => {
                        var column = $((<any>this.getColumnsGrid()).datagrid('getSelected'));
                        scope["column"] = this.editedTable.getColumnModel(column);


                        $("<div/>").load('BuhtaCore/schema/designer/SchemaTableColumnEditForm.html', '', (html) => {
                            var content = this._compile(html)(scope);//.appendTo("body");
                            var dialog: any = content;
                            dialog.dialog({
                                modal: true,
                                width: 600,
                                height: 'auto',
                                cache: false,
                                buttons: '.dialog-buttons',
                                onClose: () => dialog.dialog('destroy')
                                //href: 'BuhtaCore/schema/designer/SchemaTableColumnEditForm.html'
                            });

                            scope["columnEditFormSave"] = () => {
                                scope["column"].__saveChanges();
                                dialog.dialog('close');
                                // dialog.dialog('destroy');
                            };

                            scope["columnEditFormClose"] = () => {
                                if (scope["column"].__isChanged())
                                    window.alert("было изменено");
                                dialog.dialog('close');
                                // dialog.dialog('destroy');
                            };
                            scope.$apply();
                        });

                    };


                }
            },
            //link: (scope: ng.IScope, element: JQuery, attributes: ng.IAttributes, ctrl: ng.IControllerService, transclude: ng.ITranscludeFunction) => {

            //    element[0]["$scope"] = scope;
            //    element[0]["$compile"] = $compile;
            //    //element.attr("zz-type","button")
            //    //element.addClass("btn btn-default");
            //    scope["table"] = scope["DesignedObject"]; --

            //},
            templateUrl: "modules/buhta/designer/table/schemaTableDesigner.html"
        }
    }]);

}