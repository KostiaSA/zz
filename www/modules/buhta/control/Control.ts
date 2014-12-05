/**
 * Created by Kostia on 05.12.2014.
 */

module BuhtaControl {
    export var registeredTags = {};

    export class Control {
        sourceJ:JQuery;
        nativeJ:JQuery;

        getRootTag():string {
            return "div";
        }

        getTemplate():JQuery {
            return undefined;
        }

        isVisible():boolean {
            return true;
        }

        private getOnlyText(el:JQuery):string {
            var ret = "";
            for (var i=0;i<el[0].childNodes.length;i++){
                if (el[0].childNodes[i].nodeName=="#text")
                    ret += el[0].childNodes[i].textContent;
            }
            return ret;
        }

        renderTo(domJ:JQuery) {

            var template = this.getTemplate();
            if (!template) {
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
                throw "нет шаблона";
            }
            this.nativeJ.appendTo(domJ);
        }
    }

    registeredTags["control"] = Control;

}
