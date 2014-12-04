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
        guidProp:Guid;
        dateTimeProp:DateTime;
        dateProp:Date;
        timeProp:Time;
        dateOnlyProp:DateOnly;

        arrayOfStringsProp:string[];
        arrayOfNumbersProp:number[];
        arrayOfBooleansProp:boolean[];
        arrayOfDatesProp:Date[];
        arrayOfDateTimesProp:DateTime[];
        arrayOfDateOnlysProp:DateOnly[];
        arrayOfTimesProp:Time[];
        arrayOfGuidsProp:Guid[];

        registerProperties() {
            super.registerProperties();

            this.registerProperty("stringProp", "string");
            this.registerProperty("numberMaxProp", "number");
            this.registerProperty("numberMinProp", "number");

            this.registerProperty("booleanProp", "boolean");
            this.registerProperty("guidProp", "Guid");

            this.registerProperty("dateTimeProp", "DateTime");
            this.registerProperty("dateProp", "Date");
            this.registerProperty("timeProp", "Time");
            this.registerProperty("dateOnlyProp", "DateOnly");

            this.registerProperty("arrayOfStringsProp", "array");
            this.registerProperty("arrayOfNumbersProp", "array");
            this.registerProperty("arrayOfBooleansProp", "array");
            this.registerProperty("arrayOfDatesProp", "array");
            this.registerProperty("arrayOfDateTimesProp", "array");
            this.registerProperty("arrayOfDateOnlysProp", "array");
            this.registerProperty("arrayOfTimesProp", "array");
            this.registerProperty("arrayOfGuidsProp", "array");
        }

    }

    export class TestSchemaObjectGroup extends tsUnit.TestClass {

        test_save_restore_to_xml() {

            var o = new TestSchemaObject();

            o.stringProp = "走进黄河之都 广汽吉奥人文之旅兰州站花絮篇+1234567890\n='Бухта'-ООО\"[]{}()<>";
            o.numberMaxProp = Number.MAX_VALUE;
            o.numberMinProp = Number.MIN_VALUE;
            o.booleanProp = true;
            o.guidProp = Guid.NewGuid();
            o.dateTimeProp = new DateTime();
            o.dateProp = new Date();
            o.timeProp = new Time();
            o.dateOnlyProp = new DateOnly();

            o.arrayOfStringsProp = ["123", "456"];
            o.arrayOfNumbersProp = [123, 456, 89.876];
            o.arrayOfBooleansProp = [true, false, true];
            o.arrayOfDatesProp = [new Date(), new Date("2014-11-11 13:56")];

            var xml = o.toXML();
            console.log(xml);
            var n = <TestSchemaObject>BuhtaCore.getBaseObjectFromXml($(xml), []);
            this.areIdentical(o.stringProp, n.stringProp, "stringProp");
            this.areIdentical(o.numberMaxProp, n.numberMaxProp, "numberMaxProp");
            this.areIdentical(o.numberMinProp, n.numberMinProp, "numberMinProp");
            this.areIdentical(o.booleanProp, n.booleanProp, "booleanProp");
            this.areIdentical(o.guidProp.toSql(), n.guidProp.toSql(), "guidProp");
            this.areIdentical(o.dateTimeProp.toSql(), n.dateTimeProp.toSql(), "dateTimeProp");
            this.areIdentical(o.dateProp.toSql(), n.dateProp.toSql(), "dateProp");
            this.areIdentical(o.timeProp.toSql(), n.timeProp.toSql(), "timeProp");
            this.areIdentical(o.dateOnlyProp.toSql(), n.dateOnlyProp.toSql(), "dateOnlyProp");

            this.areCollectionsIdentical(o.arrayOfStringsProp, n.arrayOfStringsProp, "arrayOfStringsProp");
            this.areCollectionsIdentical(o.arrayOfNumbersProp, n.arrayOfNumbersProp, "arrayOfNumbersProp");
            this.areCollectionsIdentical(o.arrayOfBooleansProp, n.arrayOfBooleansProp, "arrayOfBooleansProp");
            this.areCollectionsIdentical(o.arrayOfDatesProp, n.arrayOfDatesProp, "arrayOfDatesProp");

        }
    }

}