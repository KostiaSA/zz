/// <reference path="../buhta-core.ts" />
/// <reference path="../utils.ts" />

module BuhtaCore {

    function calcElementHeight(element): number {
        var elementBordersHeight = parseInt(element.css("border-top-width").replace("px", "")) + parseInt(element.css("border-bottom-width").replace("px", ""));
        var elementMarginsHeight = parseInt(element.css("marginTop").replace("px", "")) + parseInt(element.css("marginBottom").replace("px", ""));

        // другие элементы после element: собираем высоты 
        var otherHeight = 0;
        var elements = element.parent().children();
        for (var i = element.index() + 1; i < elements.length; i++) {
            var el = $(elements[i]);
            if (el.css("float") != "right" && isElementReallyVisible(el))
                //  otherHeight += el.innerHeight() + parseInt(el.css("marginTop").replace("px", "")) + parseInt(el.css("marginBottom").replace("px", ""));
                otherHeight += el.outerHeight();
        }

        var fullHeight = element.parent().height() - element.position().top - elementBordersHeight - elementMarginsHeight - otherHeight;
        //console.log("------------------------------------");
        //console.log("fullHeight=", fullHeight);
        //console.log("parent=", parent);
        //console.log("parent.height()=", element.parent().height());
        //console.log("element.position().top=", element.position().top);
        return fullHeight;
    }

    app.directive("fitHeight", () => {
        return {
            restrict: 'A',
            //scope: false, // use controller scope

            link: (scope: ng.IScope, element: JQuery, attrs) => {
                element.css("position", "relative"); // без position:relative ничего не работает!
                element.parent().css("position", "relative");

                scope.$watch(
                    () => {
                        var h = calcElementHeight(element);
                        if (h < 0) h = 0;
                        return h;
                    },
                    (newVal, oldVal) => {
                        // resize
                        //if ((<any>element[0]).isVisible(element[0])) {
                        if (isElementReallyVisible(element))
                            element.innerHeight(calcElementHeight(element));
                    });
            }
        }
    });
}