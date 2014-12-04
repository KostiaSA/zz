/// <reference path="../tsUnit.ts" />
/// <reference path="TestMsSql.ts" />


module BuhtaTestModule {

    export class TestPgSqlGroup extends TestMsSqlGroup {
        constructor() {
            super();
            this.db = "test-pg";
        }
    }

}