/// <reference path="../../../../lib/lib.ts" />
/// <reference path="zz.ts" />

module BuhtaCore {

    export interface I_ZZ {
        tabset?: ZZ_Tabset;
        tab?: ZZ_Tab;
        setActive? ();
        getParentTabset? (): ZZ_Tabset;
    }

    export class ZZ_Tabset extends ZZ {
        get tabset() { return this }
        enabled(setEnabled?: boolean): boolean {
            if (setEnabled != undefined) {
                if (setEnabled)
                    this.element.removeAttr("disabled");
                else
                    this.element.attr("disabled", "disabled");
                return setEnabled;
            }
            else
                return this.element.attr("disabled") != "disabled";
        }

        // content может быть JQuery, html-строка или путь на html-файл
        addTab(title, content: any, id?: string, param?:any): ZZ_Tab {

            if (angular.isString(content)) {
                if (/(.html)$/.test(content))
                    content = loadHtmlAsAstring(content);

                var childScope = this.scope.$new();
                if (param)
                    for (var k in param) childScope[k] = param[k];

                content = this.compile(content)(childScope);
            }

            if (id && this.element.find("[zz-id='" + id + "']").length > 0)
                throw "ZZ_Tabset.addTab: уже есть tab c id='" + id + "'";

            var closableStr: string = "";
            if (this.element.attr("closable") == "")
                closableStr = "<button type='button' class='close closeTab mlm' onclick='BuhtaCore.zz($(this).parent().parent()).remove()'> x </button>";
            var li = $("<li zz-type='tab'><a href='#'>" + closableStr + "</a></li>").appendTo(this.element.children("ul"));
            li.find("a").append("<span>" + title + "</span>");
            if (id) {
                li.attr("zz-id", id);
            }


            var contentEl = content.addClass("tab-pane").appendTo(this.element.children(".tab-content"));
            if (id) {
                contentEl.attr("zz-id", id);
            }

            var newTab = new ZZ_Tab(li, this.scope, this.compile);
            li.find("a").click((eventObject: JQueryEventObject) => {
                newTab.setActive();
            });
            newTab.setActive();

            return newTab;
        }
        constructor(_element: JQuery, _scope: ng.IScope, _compile: ng.ICompileService) {
            super(_element, _scope, _compile);
            _element.addClass("zz-tabset");
        }

    }

    export class ZZ_Tab extends ZZ {
        get tab() { return this }
        enabled(setEnabled?: boolean): boolean {
            if (setEnabled != undefined) {
                if (setEnabled)
                    this.element.removeAttr("disabled");
                else
                    this.element.attr("disabled", "disabled");
                return setEnabled;
            }
            else
                return this.element.attr("disabled") != "disabled";
        }
        getParentTabset(): ZZ_Tabset {
            var el = this.element.parents(".zz-tabset").first();
            //return new ZZ_Tabset(el);
            return <ZZ_Tabset>el[0]["$zz"];
        }

        private _savedTabHeight = -1;
        setActive() {
            var tabset: JQuery = this.getParentTabset().element;
            tabset.children("ul").children("li").removeClass("active");
            tabset.children(".tab-content").children(".tab-pane").removeClass("active");
            $(tabset.children("ul").children()[this.element.index()]).addClass("active");
            $(tabset.children(".tab-content").children()[this.element.index()]).addClass("active");
            //if (tabset.find(".tab-content").height() != this._savedTabHeight) {
              //  this._savedTabHeight = tabset.find(".tab-content").height();
                this.scope.$apply();
            //}

        }

        remove() {
            var tabset: JQuery = this.getParentTabset().element;
            var index = this.element.index();
            $(tabset.children("ul").children()[index]).remove();
            $(tabset.children(".tab-content").children()[index]).remove();
            zz(tabset.children("ul").children().first()).tab.setActive();
            this.element = undefined;
        }

        constructor(_element: JQuery, _scope: ng.IScope, _compile: ng.ICompileService) {
            super(_element, _scope, _compile);
            _element.addClass("zz-tab");
        }

    }


    app.directive("zzTabset", ["$compile", ($compile: ng.ICompileService) => {
       return {
            restrict: 'E',
            replace: true,
            transclude: true,
            //scope: false, // use controller scope

            link: (scope: ng.IScope, element: JQuery, attributes: ng.IAttributes, ctrl: ng.IControllerService, transclude: ng.ITranscludeFunction) => {

                var zzTabset: ZZ_Tabset = element[0]["$zz"] = new ZZ_Tabset(element, scope, $compile);

                var ul = $("(<ul class='nav nav-tabs'></ul>").appendTo(element);

                var content: JQuery;
                if (element.attr("fit-height") == "")
                    content = $compile("<div class='tab-content' fit-height></div>")(scope).appendTo(element);
                else
                    content = $("<div class='tab-content'></div>").appendTo(element);

                element.children(".tab-pane").each((index: number, tab: Element): JQuery => {

                    var tabId = $(tab).attr("zz-id");

                    var title = $(tab).attr("title");
                    if (!title) title = "tab?";

                    var closableStr: string = "";
                    if (element.attr("closable") == "")
                        closableStr = "<button type='button' class='close closeTab mlm' onclick='zz($(this).parent().parent()).remove()'> x </button>";
                    var li = $("<li zz-type='tab'><a href='#'>" + closableStr + "</a></li>").appendTo(ul);
                    var zzTab = new ZZ_Tab(li,scope,$compile);
                    li.find("a").append($("<span>" + title + "</span>"));
                    if (tabId) {
                        li.attr("zz-id", tabId);
                    }

                    $(tab).css("position", "relative");
                    $(tab).css("height", "100%");
                    $(tab).appendTo(content);
                    if (tabId) {
                        $(tab).removeAttr("zz-id");
                    }

                    if (index == 0) {
                        li.addClass("active");
                        $(tab).addClass("active");
                    }
                    li.find("a").click((eventObject: JQueryEventObject) => {
                        zz($(eventObject.delegateTarget).parent()).setActive();
                    });
                    return undefined;
                })
        },
            template: '<div ng-transclude><div>'
        }
    }]);

    app.directive("zzTab", ["$compile", ($compile: ng.ICompileService) => {
       return {
            restrict: 'E',
            replace: true,
            transclude: true,
            link: (scope: ng.IScope, element: JQuery, attributes: ng.IAttributes, ctrl: ng.IControllerService, transclude: ng.ITranscludeFunction) => {
                var zzTab: ZZ_Tab = element[0]["$zz"] = new ZZ_Tab(element, scope, $compile);
                var newDiv = element.children("ng-transclude").children().appendTo(element).parent().addClass("tab-pane");
                element.children("ng-transclude").remove();
            },
            template: '<div><ng-transclude></ng-transclude></div>'
        }
    }]);

}