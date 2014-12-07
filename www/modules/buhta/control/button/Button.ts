/**
 * Created by Kostia on 05.12.2014.
 */

module BuhtaControl {
    export class Button extends Control{

        //getRootTag():string {
        //    return "button";
        //}

        afterRender()
        {
            super.afterRender();
            this.$.addClass("btn");
        }

    }

    registeredTags["button"] = Button;

}