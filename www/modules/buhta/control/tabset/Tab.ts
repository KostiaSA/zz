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
        }

        remove() {
            var index = this.$.index();
            $(this.parentTabset.tabsUl.children("li")[index]).remove();
            $(this.parentTabset.$.children(".tab-pane")[index]).remove();
            if (this.parentTabset.$.children(".tab-pane").length > 0)
                <Tab>(this.parentTabset.$.children(".tab-pane")[0]["__control__"]).setActive();
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