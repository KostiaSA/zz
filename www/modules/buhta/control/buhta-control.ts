/**
 * Created by Kostia on 05.12.2014. ==
 */

/// <reference path="../../../lib/lib.ts" />
/// <reference path="../core/buhta-core.d.ts" />
/// <reference path="Control" />
/// <reference path="Button" />
/// <reference path="OkCancelButtons" />

module BuhtaControl {
    export function testNoAngular() {
        var c = new Control();
        c.sourceJ = $("<div>пиздец<button>жми2</button><ok-cancel-buttons/></div>");
        c.renderTo($("body"));
        c.onClick = (sender:Control)=> {
            alert('click1:' + sender.nativeJ.text());
        };
    }
}