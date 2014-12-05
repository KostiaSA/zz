/**
 * Created by Kostia on 05.12.2014.
 */

module BuhtaControl {
    export class OkCancelButtons extends Control {

        constructor() {
            super();
            this.template = "modules/buhta/control/ok-cancel-buttons.html";
        }

        getRootTag():string {
            return "div";
        }

    }

    registeredTags["ok-cancel-buttons"] = OkCancelButtons;

}