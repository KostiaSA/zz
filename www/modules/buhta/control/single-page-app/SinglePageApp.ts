/**
 * Created by Kostia on 05.12.2014.
 */

module BuhtaControl {
    export class SinglePageApp extends Control {

        constructor() {
            super();
            this.template = "modules/buhta/control/single-page-app/single-page-app.html";
        }

    }

    registeredTags["single-page-app"] = SinglePageApp;

}