/**
 * Created by Kostia on 05.12.2014.
 */

module BuhtaControl {
    export var registeredTags = {};
    export var templatesCache = {};

    export interface ClickEvent {
        (sender:Control): void;
    }

    export class Control {
        scope:any;
        sourceJ:JQuery;
        $:JQuery;
        template:string;

        getRootTag():string {
            return undefined;
        }

        get text() {
            return this.$.text();
        }

        set text(value:string) {
            this.$.text(value);
        }

        private _onClick:ClickEvent;
        get onClick():ClickEvent {
            return this._onClick;
        }

        set onClick(handler:ClickEvent) {
            this._onClick = handler;
            this.$.click(()=> {
                handler(this);
            });
        }

        getTemplate():JQuery {
            if (/(.html)$/.test(this.template)) {
                var templ = templatesCache[this.template];
                if (!templ) {
                    templatesCache[this.template] = templ = BuhtaCore.loadHtmlAsAstring(this.template);
                }
                return $(templ);
            }
            else
                return $(this.template);
        }

        isVisible():boolean {
            return true;
        }

        find<T extends Control>(selector:string):T {
            var elements = this.$.find(selector);
            for (var i = 0; i < elements.length; i++) {
                var el:any = elements[i];
                if (el.__control__ || el.__control__ instanceof Control)
                    return <T>el.__control__;
            }
            return undefined;
        }

        private getOnlyText(el:JQuery):string {
            var ret = "";
            for (var i = 0; i < el[0].childNodes.length; i++) {
                if (el[0].childNodes[i].nodeName == "#text")
                    ret += el[0].childNodes[i].textContent;
            }
            return ret;
        }

        beforeRender() {
        }

        afterRender() {
        }

        copyClassesFrom(from:JQuery) {
            this.$.addClass(from.attr("class"));
        }

        copyAttrsFrom(from:JQuery, to?:JQuery) {
            if (!to)
                to = this.$;
            var attrs = from.prop("attributes");
            for (var i = 0; i < attrs.length; i++) {
                var attrName = attrs[i].name;
                if (attrName)
                    to.attr(attrName, attrs[i].value);
            }
        }

        renderChildrenFrom(from:JQuery, to?:JQuery) {
            if (!to)
                to = this.$;
            for (var i = 0; i < from.children().length; i++) {
                var child = $(from.children()[i]);
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
                childControl.renderTo(to);
            }

        }

        renderTo(domJ:JQuery) {
            this.beforeRender();

            if (!this.template) {
                if (!this.sourceJ)
                    throw (<any>this).getClassName() + ": нет html-шаблона";
                if (this.getRootTag())
                    this.$ = $("<" + this.getRootTag() + "/>");
                else
                    this.$ = $("<" + this.sourceJ.prop("tagName") + "/>");

                this.copyAttrsFrom(this.sourceJ);
                this.copyClassesFrom(this.sourceJ);

                this.$.text(this.getOnlyText(this.sourceJ));
                this.$[0]["__control__"] = this;
                this.renderChildrenFrom(this.sourceJ);
            }
            else {
                var template:JQuery = this.getTemplate();
                if (this.getRootTag())
                    this.$ = $("<" + this.getRootTag() + "/>");
                else
                    this.$ = $("<" + template.prop("tagName") + "/>");

                this.copyAttrsFrom(template);

                this.copyClassesFrom(template);

                this.$.text(this.getOnlyText(template));
                this.$[0]["__control__"] = this;
                this.renderChildrenFrom(template);
            }

            this.afterRender();
            this.$.appendTo(domJ);
        }
    }


}
