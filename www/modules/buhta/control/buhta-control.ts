/**
 * Created by Kostia on 05.12.2014. ==
 */

/// <reference path="../../../lib/lib.ts" />
/// <reference path="../core/buhta-core.d.ts" />
/// <reference path="Control" />
/// <reference path="button/Button" />
/// <reference path="OkCancelButtons" />
/// <reference path="single-page-app/SinglePageApp" />
/// <reference path="tabset/Tabset" />
/// <reference path="tabset/Tab" />

module BuhtaControl {
    export function testNoAngular() {
        var c = new Control();
        c.sourceJ = $("<div>пиздец<button>жми2</button><ok-cancel-buttons/></div>");
        c.renderTo($("body"));
        c.onClick = (sender:Control)=> {
            var ok=sender.find<Button>("#okButton");
            if (ok)
            ok.text="жопа";
            alert('click1:' + sender.$.text());
        };
    }
    export function startSPA() {
        var c = new SinglePageApp();
        c.renderTo($("body"));
    }
}