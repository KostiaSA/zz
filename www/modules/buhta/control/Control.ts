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
        nativeJ:JQuery;
        template:string;

        getRootTag():string {
            return "div";
        }

        get text() {
            return this.nativeJ.text();
        }

        set text(value:string) {
            this.nativeJ.text(value);
        }

        private _onClick:ClickEvent;
        get onClick():ClickEvent {
            return this._onClick;
        }
        set onClick(handler:ClickEvent) {
            this._onClick = handler;
            this.nativeJ.click(()=>{
                handler(this);
            });
        }

        getTemplate():JQuery {
            alert("getTemplate()");
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

        private getOnlyText(el:JQuery):string {
            var ret = "";
            for (var i = 0; i < el[0].childNodes.length; i++) {
                if (el[0].childNodes[i].nodeName == "#text")
                    ret += el[0].childNodes[i].textContent;
            }
            return ret;
        }

        renderTo(domJ:JQuery) {

            if (!this.template) {
                if (!this.sourceJ)
                    throw (<any>this).getClassName() + ": нет html-шаблона";
                this.nativeJ = $("<" + this.getRootTag() + "/>");
                this.nativeJ.addClass(this.sourceJ.attr("class"));
                this.nativeJ.text(this.getOnlyText(this.sourceJ));
                this.nativeJ["__control__"] = this;
                for (var i = 0; i < this.sourceJ.children().length; i++) {
                    var child = $(this.sourceJ.children()[i]);
                    var childTag = child.prop("tagName").toLowerCase();
                    if (!registeredTags[childTag])
                        throw "неизвестный tag '" + childTag + "'";
                    var childControl:Control = new registeredTags[childTag]();
                    childControl.sourceJ = child;
                    childControl.renderTo(this.nativeJ);
                }
            }
            else {
                var template:JQuery = this.getTemplate();
                this.nativeJ = $("<" + this.getRootTag() + "/>");
                this.nativeJ.addClass(template.attr("class"));
                this.nativeJ.text(this.getOnlyText(template));
                this.nativeJ["__control__"] = this;
                for (var i = 0; i < template.children().length; i++) {
                    var child = $(template.children()[i]);
                    var childTag = child.prop("tagName").toLowerCase();
                    if (!registeredTags[childTag])
                        throw "неизвестный tag '" + childTag + "'";
                    var childControl:Control = new registeredTags[childTag]();
                    childControl.sourceJ = child;
                    childControl.renderTo(this.nativeJ);
                }
            }
            this.nativeJ.appendTo(domJ);
        }
    }

    registeredTags["control"] = Control;

}
