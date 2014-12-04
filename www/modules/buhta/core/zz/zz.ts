/// <reference path="../../../../lib/lib.ts" />
/// <reference path="../Utils.ts" />

module BuhtaCore {

    export interface I_ZZ {
        id(newId?: string): string;
        element: JQuery;
        scope: ng.IScope;
        compile: ng.ICompileService;
        enabled(setEnabled?: boolean);
        remove();
    }

    export class ZZ implements I_ZZ {

        static selector(sel?: any): I_ZZ {
            var el: JQuery;

            //if (!sel)
            //    return zz("spa");

            if (angular.isString(sel)) {

                el = $("[zz-id='" + sel + "']").first();
                if (el.length == 0)
                    throw "ZZ.selector: не наден объект с zz-id='" + sel + "'";
            }
            else
                if (sel instanceof jQuery) {

                    el = sel.first();
                    if (el.length == 0)
                        throw "ZZ.selector: объект 'sel' пустой";
                }
                else
                    throw "ZZ.selector: параметр 'sel' должен быть string или JQuery";

            if (!el[0]["$zz"])
                throw "ZZ.selector: у элемента <" + el.prop("tagName").toLowerCase() + "> нет свойства $zz";
            return el[0]["$zz"];
            //var typeName = "ZZ_" + el.attr("zz-type").capitalize();
            //return eval("new BuhtaCore." + typeName + "(el)");
            //var ret 
            //if (el.attr("zz-type") == "button")
            //    return new ZZ_Button(el);
            //else
            //    if (el.attr("zz-type") == "tabset")
            //        return new ZZ_Tabset(el);
            //    else
            //        if (el.attr("zz-type") == "tab")
            //            return new ZZ_Tab(el);
            //        else
            //            return new ZZ(el);
        }

        get element(): JQuery {
            return this._element;
            //return this._element[0]["$scope"];
        }

        get scope(): ng.IScope {
            return this._scope;
            //return this._element[0]["$scope"];
        }

        get compile(): ng.ICompileService {
            return this._compile;
            //return this._element[0]["$compile"];
        }

        remove() {
            this._element.remove;
        }

        id(newId?: string): string {
            if (newId) {
                this._element.attr("zz-id", newId);
                return newId;
            }
            else
                return this._element.attr("zz-id");
        }

        constructor(private _element: JQuery, private _scope: ng.IScope, private _compile: ng.ICompileService) {
            _element[0]["$zz"] = this;
        }

        enabled(setEnabled?: boolean): boolean {
            if (setEnabled != undefined) {
                if (setEnabled)
                    this._element.removeAttr("disabled");
                else
                    this._element.attr("disabled", "disabled");
                return setEnabled;
            }
            else
                return this._element.attr("disabled") != "disabled";
        }
    }

    export var zz = ZZ.selector;

    //zz("").button.enabled();
}
