﻿/// <reference path="tsUnit.ts" />
/// <reference path="../../../lib/lib.ts" />
/// <reference path="../core/buhta-core.d.ts" />

/// <reference path="testdatetime/testdatetime.ts" />
/// <reference path="testsql/testMsSql.ts" />
/// <reference path="testsql/testPgSql.ts" />
/// <reference path="test-schema/TestSchemaObject.ts" />

module BuhtaTest {

    class Limiter implements tsUnit.ITestRunLimiter {
        TestSchemaObject
        isTestsGroupActive(groupName: string): boolean {
            if (groupName == "TestSchemaObject") return false;  // служебный класс
            //if (groupName == "MsSqlTest1")
            //if (groupName == "TestDateTimeGroup")
            //if (groupName == "TestSchemaObjectGroup")
                return true;
        }
        isTestActive(testName: string): boolean {
            //if (testName == "boolean_test")
                return true;
        }
        isParametersSetActive(paramatersSetNumber: number): boolean {
            return true;
        }
    }


    export function execute() {

        //new BuhtaTestModule.TestSchemaObjectGroup().test_save_restore_to_xml();

        var test = new tsUnit.Test(BuhtaTestModule);

        $("body").css("background-color", "white");
        $("body").addClass("test");

        test.showResults($("body")[0], test.run(new Limiter()));
    }

}