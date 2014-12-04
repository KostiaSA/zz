/**
 * Created by Kostia on 04.12.2014.
 */
/// <reference path="../tsUnit.ts" />
/// <reference path="../../core/buhta-core.d.ts" />

module BuhtaTestModule {

    export class TestSchemaObject extends BuhtaCore.SchemaObject {
        module:string = "BuhtaTestModule";
        stringProp:string;
        arrayOfStringsProp:string[];
        arrayOfGuidsProp:Guid[];

        registerProperties() {
            super.registerProperties();
            this.registerProperty("stringProp", "String");
            this.registerProperty("arrayOfStringsProp", "array");
            this.registerProperty("arrayOfGuidsProp", "array");
        }

    }

    export class TestSchemaObjectGroup extends tsUnit.TestClass {

        test_save_restore_to_xml() {

            var o = new TestSchemaObject();
//            o.stringProp="走进黄河之都 广汽吉奥人文之旅兰州站花絮篇+1234567890\n='Бухта'-ООО\"[]{}()<>";
            o.stringProp = "123";
            var xml = o.toXML();
            console.log(xml);
            var n = <TestSchemaObject>BuhtaCore.getBaseObjectFromXml($(xml), []);
            this.areIdentical(o.stringProp, n.stringProp, "stringProp");

        }
    }

}