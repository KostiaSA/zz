/// <reference path="../tsUnit.ts" />
/// <reference path="../../core/buhta-core.d.ts" />

module BuhtaTestModule {

    export class TestDateTimeGroup extends tsUnit.TestClass {

        test1() {
            var dt = new DateTime();

            dt = new DateTime(new Date());

            this.areIdentical(new DateTime([2006, 12, 31, 18, 59, 31, 99]).toSql(), new DateTime("2006-12-31 18:59:31.09").toSql());

            dt = new DateTime([2006]);
            this.areIdentical(dt.toString("YYYY-MM-DD HH:mm:ss.SS"), "2006-01-01 00:00:00.00");

            dt = new DateTime([2006, 11]);
            this.areIdentical(dt.toString("YYYY-MM-DD HH:mm:ss.SS"), "2006-11-01 00:00:00.00");

            dt = new DateTime([2006, 12, 31]);
            this.areIdentical(dt.toString("YYYY-MM-DD HH:mm:ss.SS"), "2006-12-31 00:00:00.00");

            dt = new DateTime([2006, 12, 31, 18]);
            this.areIdentical(dt.toString("YYYY-MM-DD HH:mm:ss.SS"), "2006-12-31 18:00:00.00");

            dt = new DateTime([2006, 12, 31, 18, 59]);
            this.areIdentical(dt.toString("YYYY-MM-DD HH:mm:ss.SS"), "2006-12-31 18:59:00.00");

            dt = new DateTime([2006, 12, 31, 18, 59, 31]);
            this.areIdentical(dt.toString("YYYY-MM-DD HH:mm:ss.SS"), "2006-12-31 18:59:31.00");

            dt = new DateTime([2006, 12, 31, 18, 59, 31, 99]);
            this.areIdentical(dt.toString("YYYY-MM-DD HH:mm:ss.SS"), "2006-12-31 18:59:31.09");

            dt = new DateTime([2006, 12, 31, 18, 59, 31, 20]);
            this.areIdentical(dt.toString("YYYY-MM-DD HH:mm:ss.SS"), "2006-12-31 18:59:31.02");

            dt = new DateTime([2006, 12, 31, 18, 59, 31, 999]);
            this.areIdentical(dt.toString("YYYY-MM-DD HH:mm:ss.SS"), "2006-12-31 18:59:31.99");
            this.areIdentical(dt.toSql(), "'2006-12-31 18:59:31.99'");
        }

        test2() {
            var dt = new DateTime();
            this.areIdentical(dt.fromNow(), "a few seconds ago");

            dt = new DateTime([2006, 12, 31, 18, 59, 31, 999]);
            this.areIdentical(dt.startOf("day").toSql(), new DateTime([2006, 12, 31]).toSql());
            this.areIdentical(dt.startOf("month").toSql(), new DateTime([2006, 12, 1]).toSql());
            this.areIdentical(dt.startOf("quarter").toSql(), new DateTime([2006, 10, 1]).toSql());
            this.areIdentical(dt.startOf("year").toSql(), new DateTime([2006, 1, 1]).toSql());

            dt = new DateTime([2006, 4, 15, 16, 39, 21, 23]);
            this.areIdentical(dt.endOf("day").toSql(), new DateTime([2006, 4, 15, 23, 59, 59, 999]).toSql());
            this.areIdentical(dt.endOf("month").toSql(), new DateTime([2006, 4, 30, 23, 59, 59, 999]).toSql());
            this.areIdentical(dt.endOf("quarter").toSql(), new DateTime([2006, 6, 30, 23, 59, 59, 999]).toSql());
            this.areIdentical(dt.endOf("year").toSql(), new DateTime([2006, 12, 31, 23, 59, 59, 999]).toSql());

            //dt = new DateTime([2006, 12, 31, 18, 59, 31, 999]);
            dt.startOf("day");
            this.areIdentical(dt.endOf("day").toSql(), new DateTime([2006, 12, 31, 23, 59, 59, 999]).toSql());
        }

        test3() {
            //  add и substract меняют оригинальную дату !!!

            var dt = new DateTime([2006, 4, 30, 16, 39, 21, 23]);
            this.areIdentical(dt.add("day", 2).toSql(), new DateTime([2006, 5, 2, 16, 39, 21, 23]).toSql(), "add day");

            dt = new DateTime([2006, 4, 30, 16, 39, 21, 23]);
            this.areIdentical(dt.add("month", 11).toSql(), new DateTime([2007, 3, 30, 16, 39, 21, 23]).toSql(), "add month");

            dt = new DateTime([2006, 4, 30, 16, 39, 21, 23]);
            this.areIdentical(dt.add("quarter", 1).toSql(), new DateTime([2006, 7, 30, 16, 39, 21, 23]).toSql(), "add quarter");

            dt = new DateTime([2006, 4, 30, 16, 39, 21, 23]);
            this.areIdentical(dt.add("year", -2).toSql(), new DateTime([2004, 4, 30, 16, 39, 21, 23]).toSql(), "add year");

        }

        test4() {
            //  add и substract меняют оригинальную дату !!!

            var dt = new DateTime([2006, 4, 30, 16, 39, 21, 23]);
            var t = dt.toTime();
            this.areIdentical(t.toSql(), "'16:39:21.02'", "DateTime.toTime()");
        }
    }

}