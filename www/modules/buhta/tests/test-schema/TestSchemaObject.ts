/**
 * Created by Kostia on 04.12.2014.
 */
/// <reference path="../tsUnit.ts" />
/// <reference path="../../core/buhta-core.d.ts" />

module BuhtaTestModule {

    export class TestSchemaObject extends BuhtaCore.SchemaObject {
        module:string = "BuhtaTestModule";
        stringProp:string;
        numberMaxProp:number;
        numberMinProp:number;
        booleanProp:boolean;

        arrayOfStringsProp:string[];
        arrayOfGuidsProp:Guid[];

        registerProperties() {
            super.registerProperties();

            this.registerProperty("stringProp", "string");
            this.registerProperty("numberMaxProp", "number");
            this.registerProperty("numberMinProp", "number");

            this.registerProperty("booleanProp", "boolean");

            this.registerProperty("arrayOfStringsProp", "array");
            this.registerProperty("arrayOfGuidsProp", "array");
        }

    }

    export class TestSchemaObjectGroup extends tsUnit.TestClass {

        test_save_restore_to_xml() {

            var o = new TestSchemaObject();

            o.stringProp="走进黄河之都 广汽吉奥人文之旅兰州站花絮篇+1234567890\n='Бухта'-ООО\"[]{}()<>";
            o.numberMaxProp=Number.MAX_VALUE;
            o.numberMinProp=Number.MIN_VALUE;
            o.booleanProp=true;

            var xml = o.toXML();
            console.log(xml);
            var n = <TestSchemaObject>BuhtaCore.getBaseObjectFromXml($(xml), []);
            this.areIdentical(o.stringProp, n.stringProp, "stringProp");
            this.areIdentical(o.numberMaxProp, n.numberMaxProp, "numberMaxProp");
            this.areIdentical(o.numberMinProp, n.numberMinProp, "numberMinProp");
            this.areIdentical(o.booleanProp, n.booleanProp, "booleanProp");

        }
    }

}