/**
 * Created by Kostia on 05.12.2014.
 */

/// <reference path="Tabset" />

module BuhtaControl {
    export class Tab extends Control {

        parentTabset:Tabset;

        get id():string {
            return this.$.attr("id");
        }

        setActive() {
            this.parentTabset.tabsUl.children("li").removeClass("active");
            this.parentTabset.$.children(".tab-pane").removeClass("active");
            this.$.addClass("active");
            this.parentTabset.tabsUl.children("[id='" + this.id + "']").addClass("active");

            //var tabset:JQuery = this.getParentTabset().element;
            //tabset.children("ul").children("li").removeClass("active");
            //tabset.children(".tab-content").children(".tab-pane").removeClass("active");
            //$(tabset.children("ul").children()[this.element.index()]).addClass("active");
            //$(tabset.children(".tab-content").children()[this.element.index()]).addClass("active");
            ////if (tabset.find(".tab-content").height() != this._savedTabHeight) {
            ////  this._savedTabHeight = tabset.find(".tab-content").height();
            //this.scope.$apply();
            ////}

        }

        getRootTag():string {
            return "div";
        }

        afterRender() {
            super.afterRender();
            this.$.addClass("tab-pane");
            this.$.css("position", "relative");
            this.$.css("height", "100%");
        }

    }

    registeredTags["tab"] = Tab;

}