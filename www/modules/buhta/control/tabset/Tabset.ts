/**
 * Created by Kostia on 05.12.2014.
 */

module BuhtaControl {
    export class Tabset extends Control {

        tabsUl:JQuery;

        getRootTag():string {
            return "div";
        }

        afterRender() {
            super.afterRender();
        }

        getTabById(id:string):Tab {
            var el = this.$.find("[id='" + id + "']");
            if (el.length > 0)
                return <Tab>(el[0]["__control__"]);
            else
                return undefined;

        }

        renderTo(domJ:JQuery) {
            this.beforeRender();

            if (!this.sourceJ)
                throw (<any>this).getClassName() + ": нет html-шаблона";

            // сначала кнопки <ul>
            var ul = $("<ul class='nav nav-tabs'></ul>");
            for (var i = 0; i < this.sourceJ.children().length; i++) {
                var child = $(this.sourceJ.children()[i]);
                var childTag = child.prop("tagName").toLowerCase();
                if (childTag == "tab") {
                    var tabId = child.attr("id");
                    var title = child.attr("title");
                    if (!title) title = "tab?";

                    var closableStr:string = "";
                    if (this.sourceJ.attr("closable") == "")
                        closableStr = "<button type='button' class='close closeTab mlm' onclick='zz($(this).parent().parent()).remove()'> x </button>";
                    var li = $("<li zz-type='tab'><a href='#'>" + closableStr + "</a></li>").appendTo(ul);
                    if (i == 0) {
                        li.addClass("active");
                    }
                    //var zzTab = new ZZ_Tab(li,scope,$compile);
                    li.find("a").append($("<span>" + title + "</span>"));
                    if (tabId) {
                        li.attr("id", tabId);
                    }
                }
            }
            ul.appendTo(domJ);
            this.tabsUl = ul;

            // затем содержимое
            var content = $("<div class='tab-content'></div>");
            for (var i = 0; i < this.sourceJ.children().length; i++) {
                var child = $(this.sourceJ.children()[i]);
                var childTag = child.prop("tagName").toLowerCase();
                var childControl:Control;
                if (!registeredTags[childTag]) {
                    if (childTag.indexOf("-") > -1)
                        throw "неизвестный tag '" + childTag + "'";
                    else
                        childControl = new Control();
                }
                else
                    childControl = new registeredTags[childTag]();
                childControl.sourceJ = child;
                childControl.renderTo(content);
                if (childTag=="tab") {
                    (<Tab>childControl).parentTabset=this;
                    if (i == 0) {
                        childControl.$.addClass("active");
                    }
                }
            }

            this.copyAttrsFrom(this.sourceJ, content);
            content.appendTo(domJ);

            this.$ = content;
            this.$[0]["__control__"] = this;
            //this.renderChildrenFrom(this.sourceJ);

            this.afterRender();
            //this.$.appendTo(domJ);
        }
    }

    registeredTags["tabset"] = Tabset;

}