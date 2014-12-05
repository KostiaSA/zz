/**
 * Created by Kostia on 05.12.2014.
 */

module BuhtaControl {
    export class Button extends Control{
        text:string;

        getRootTag():string {
            return "button";
        }

    }

    registeredTags["button"] = Button;

}