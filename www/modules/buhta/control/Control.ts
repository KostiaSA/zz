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
            return "div";
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
            this.$.click(()=>{
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
            var elements=this.$.find(selector);
            for (var i=0;i<elements.length;i++){
                var el:any=elements[i];
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

        renderTo(domJ:JQuery) {

            if (!this.template) {
                if (!this.sourceJ)
                    throw (<any>this).getClassName() + ": нет html-шаблона";
                this.$ = $("<" + this.getRootTag() + "/>");

                var attrs = this.sourceJ.prop("attributes");
                for (var i = 0; i < attrs.length; i++) {
                    var attrName=attrs[i].name;
                    if (attrName)
                        this.$.attr(attrName, attrs[i].value);
                };

                this.$.addClass(this.sourceJ.attr("class"));
                this.$.text(this.getOnlyText(this.sourceJ));
                this.$[0]["__control__"] = this;
                for (var i = 0; i < this.sourceJ.children().length; i++) {
                    var child = $(this.sourceJ.children()[i]);
                    var childTag = child.prop("tagName").toLowerCase();
                    if (!registeredTags[childTag])
                        throw "неизвестный tag '" + childTag + "'";
                    var childControl:Control = new registeredTags[childTag]();
                    childControl.sourceJ = child;
                    childControl.renderTo(this.$);
                }
            }
            else {
                var template:JQuery = this.getTemplate();
                this.$ = $("<" + this.getRootTag() + "/>");

                var attrs = template.prop("attributes");
                for (var i = 0; i < attrs.length; i++) {
                    var attrName=attrs[i].name;
                    if (attrName)
                        this.$.attr(attrName, attrs[i].value);
                };

                this.$.addClass(template.attr("class"));
                this.$.text(this.getOnlyText(template));
                this.$[0]["__control__"] = this;
                for (var i = 0; i < template.children().length; i++) {
                    var child = $(template.children()[i]);
                    var childTag = child.prop("tagName").toLowerCase();
                    if (!registeredTags[childTag])
                        throw "неизвестный tag '" + childTag + "'";
                    var childControl:Control = new registeredTags[childTag]();
                    childControl.sourceJ = child;
                    childControl.renderTo(this.$);
                }
            }
            this.$.appendTo(domJ);
        }
    }

    registeredTags["control"] = Control;

}
