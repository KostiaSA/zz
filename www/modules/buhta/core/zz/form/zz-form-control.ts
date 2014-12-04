/// <reference path="../zz.ts" />
module BuhtaCore {

    export interface I_ZZ {
        formControl?: ZZ_FormControl;
    }

    export class ZZ_FormControl extends ZZ {
        get formControl() { return this }
    }

}

