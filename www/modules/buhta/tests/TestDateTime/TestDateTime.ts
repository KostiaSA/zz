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

        test_add() {
            //  add меняют оригинальную дату !!!

            var dt = new DateTime([2006, 4, 30, 16, 39, 21, 23]);
            this.areIdentical(dt.addDays(1).toSql(), new DateTime([2006, 5, 1, 16, 39, 21, 23]).toSql(), "add days +1");
            this.areIdentical(dt.addDays(-1).toSql(), new DateTime([2006, 4, 29, 16, 39, 21, 23]).toSql(), "add days -1");
            this.areIdentical(dt.addDays(365).toSql(), new DateTime([2007, 4, 30, 16, 39, 21, 23]).toSql(), "add days 365");
            this.areIdentical(dt.addDays(-365).toSql(), new DateTime([2005, 4, 30, 16, 39, 21, 23]).toSql(), "add days -365");

            this.areIdentical(dt.addYears(1).toSql(), new DateTime([2007, 4, 30, 16, 39, 21, 23]).toSql(), "add years +1");
            this.areIdentical(dt.addYears(-10).toSql(), new DateTime([1996, 4, 30, 16, 39, 21, 23]).toSql(), "add years -10");

            var dt = new DateTime([2006, 5, 31, 16, 39, 21, 23]);
            this.areIdentical(dt.addQuarters(2).toSql(), new DateTime([2006, 11, 30, 16, 39, 21, 23]).toSql(), "add quarters +2");
            this.areIdentical(dt.addQuarters(-1).toSql(), new DateTime([2006, 2, 28, 16, 39, 21, 23]).toSql(), "add quarters -1");
            this.areIdentical(dt.addQuarters(4).toSql(), new DateTime([2007, 5, 31, 16, 39, 21, 23]).toSql(), "add quarters 4");
            this.areIdentical(dt.addQuarters(-4).toSql(), new DateTime([2005, 5, 31, 16, 39, 21, 23]).toSql(), "add quarters -4");

            var dt = new DateTime([2006, 3, 31, 16, 39, 21, 23]);
            this.areIdentical(dt.addMonths(1).toSql(), new DateTime([2006, 4, 30, 16, 39, 21, 23]).toSql(), "add months +1");
            this.areIdentical(dt.addMonths(-1).toSql(), new DateTime([2006, 2, 28, 16, 39, 21, 23]).toSql(), "add months -1");
            this.areIdentical(dt.addMonths(12).toSql(), new DateTime([2007, 3, 31, 16, 39, 21, 23]).toSql(), "add months 12");
            this.areIdentical(dt.addMonths(-12).toSql(), new DateTime([2005, 3, 31, 16, 39, 21, 23]).toSql(), "add months -12");

            var dt = new DateTime([2006, 4, 30, 16, 39, 21, 23]);
            this.areIdentical(dt.addWeeks(1).toSql(), new DateTime([2006, 5, 7, 16, 39, 21, 23]).toSql(), "add weeks +1");
            this.areIdentical(dt.addWeeks(-1).toSql(), new DateTime([2006, 4, 23, 16, 39, 21, 23]).toSql(), "add weeks -1");
            this.areIdentical(dt.addWeeks(5).toSql(), new DateTime([2006, 6, 4, 16, 39, 21, 23]).toSql(), "add weeks 5");
            this.areIdentical(dt.addWeeks(-5).toSql(), new DateTime([2006, 3, 26, 16, 39, 21, 23]).toSql(), "add weeks -5");

            this.areIdentical(dt.addHours(1).toSql(), new DateTime([2006, 4, 30, 17, 39, 21, 23]).toSql(), "add hours +1");
            this.areIdentical(dt.addHours(-1).toSql(), new DateTime([2006, 4, 30, 15, 39, 21, 23]).toSql(), "add hours -1");
            this.areIdentical(dt.addHours(24).toSql(), new DateTime([2006, 5, 1, 16, 39, 21, 23]).toSql(), "add hours 24");
            this.areIdentical(dt.addHours(-24).toSql(), new DateTime([2006, 4, 29, 16, 39, 21, 23]).toSql(), "add hours -24");

            this.areIdentical(dt.addMinutes(1).toSql(), new DateTime([2006, 4, 30, 16, 40, 21, 23]).toSql(), "add minutes +1");
            this.areIdentical(dt.addMinutes(-1).toSql(), new DateTime([2006, 4, 30, 16, 38, 21, 23]).toSql(), "add minutes -1");
            this.areIdentical(dt.addMinutes(60).toSql(), new DateTime([2006, 4, 30, 17, 39, 21, 23]).toSql(), "add minutes 60");
            this.areIdentical(dt.addMinutes(-60).toSql(), new DateTime([2006, 4, 30, 15, 39, 21, 23]).toSql(), "add minutes -60");

            this.areIdentical(dt.addSeconds(1).toSql(), new DateTime([2006, 4, 30, 16, 39, 22, 23]).toSql(), "add seconds +1");
            this.areIdentical(dt.addSeconds(-1).toSql(), new DateTime([2006, 4, 30, 16, 39, 20, 23]).toSql(), "add seconds -1");
            this.areIdentical(dt.addSeconds(60).toSql(), new DateTime([2006, 4, 30, 16, 40, 21, 23]).toSql(), "add seconds 60");
            this.areIdentical(dt.addSeconds(-60).toSql(), new DateTime([2006, 4, 30, 16, 38, 21, 23]).toSql(), "add seconds -60");

            this.areIdentical(dt.addMilliseconds(1).toSql(), new DateTime([2006, 4, 30, 16, 39, 21, 24]).toSql(), "add milliseconds +1");
            this.areIdentical(dt.addMilliseconds(-1).toSql(), new DateTime([2006, 4, 30, 16, 39, 21, 22]).toSql(), "add milliseconds -1");
            this.areIdentical(dt.addMilliseconds(1000).toSql(), new DateTime([2006, 4, 30, 16, 39, 22, 23]).toSql(), "add milliseconds 1000");
            this.areIdentical(dt.addMilliseconds(-1000).toSql(), new DateTime([2006, 4, 30, 16, 39, 20, 23]).toSql(), "add milliseconds -1000");

        }

        test_startOf_endOf() {
            //  startOf_endOf меняют оригинальную дату !!!
            var dt = new DateTime([2006, 4, 30, 16, 39, 21, 23]);
            this.areIdentical(dt.startOfYear().toSql(), new DateTime([2006, 1, 1, 0, 0, 0, 0]).toSql(), "startOf Year");
            this.areIdentical(dt.startOfQuarter().toSql(), new DateTime([2006, 4, 1, 0, 0, 0, 0]).toSql(), "startOf Quarter");
            this.areIdentical(dt.startOfMonth().toSql(), new DateTime([2006, 4, 1, 0, 0, 0, 0]).toSql(), "startOf Month");
            this.areIdentical(dt.startOfWeek().toSql(), new DateTime([2006, 4, 24, 0, 0, 0, 0]).toSql(), "startOf Week");
            this.areIdentical(dt.startOfDay().toSql(), new DateTime([2006, 4, 30, 0, 0, 0, 0]).toSql(), "startOf Day");
            this.areIdentical(dt.startOfHour().toSql(), new DateTime([2006, 4, 30, 16, 0, 0, 0]).toSql(), "startOf Hour");
            this.areIdentical(dt.startOfMinute().toSql(), new DateTime([2006, 4, 30, 16, 39, 0, 0]).toSql(), "startOf Minute");
            this.areIdentical(dt.startOfSecond().toSql(), new DateTime([2006, 4, 30, 16, 39, 21, 0]).toSql(), "startOf Second");
            this.areIdentical(dt.endOfDay().toSql(), new DateTime([2006, 4, 30, 23, 59, 59, 999]).toSql(), "endOf Day");
            this.areIdentical(dt.endOfHour().toSql(), new DateTime([2006, 4, 30, 16, 59, 59, 999]).toSql(), "endOf Hour");
            this.areIdentical(dt.endOfMinute().toSql(), new DateTime([2006, 4, 30, 16, 39, 59, 999]).toSql(), "endOf Minute");
            this.areIdentical(dt.endOfSecond().toSql(), new DateTime([2006, 4, 30, 16, 39, 21, 999]).toSql(), "endOf Second");

            var dt = new DateTime([2006, 4, 29, 16, 39, 21, 23]);
            this.areIdentical(dt.endOfYear().toSql(), new DateTime([2006, 12, 31, 23, 59, 59, 999]).toSql(), "endOf Year");
            this.areIdentical(dt.endOfQuarter().toSql(), new DateTime([2006, 6, 30, 23, 59, 59, 999]).toSql(), "endOf Quarter");
            this.areIdentical(dt.endOfMonth().toSql(), new DateTime([2006, 4, 30, 23, 59, 59, 999]).toSql(), "endOf Month");
            this.areIdentical(dt.endOfWeek().toSql(), new DateTime([2006, 4, 30, 23, 59, 59, 999]).toSql(), "endOf Week");
        }

        test_get_DateTime() {
            //  get_DateTime получить час-мин-сек-день-месяц-год !!!
            var dt = new DateTime([2006, 4, 30, 16, 39, 21, 23]);
            this.areIdentical(dt.year().toString(), "2006", "get_DateTime year");
            this.areIdentical(dt.quarter().toString(), "2", "get_DateTime quarter");
            this.areIdentical(dt.month().toString(), "4", "get_DateTime month");
            this.areIdentical(dt.day().toString(), "30", "get_DateTime day");
            this.areIdentical(dt.hour().toString(), "16", "get_DateTime hour");
            this.areIdentical(dt.minute().toString(), "39", "get_DateTime minute");
            this.areIdentical(dt.second().toString(), "21", "get_DateTime second");
            this.areIdentical(dt.millisecond().toString(), "23", "get_DateTime millisecond");

            var dt = new DateTime([2014, 1, 1, 16, 39, 21, 23]);
            this.areIdentical(dt.week().toString(), "1", "get_DateTime week");
            this.areIdentical(dt.dayOfWeek().toString(), "3", "get_DateTime dayOfWeek");
            this.areIdentical(dt.dayOfYear().toString(), "1", "get_DateTime dayOfYear");
            var dt = new DateTime([2014, 12, 27, 16, 39, 21, 23]);
            this.areIdentical(dt.week().toString(), "52", "get_DateTime week");
            this.areIdentical(dt.dayOfWeek().toString(), "6", "get_DateTime dayOfWeek");
            this.areIdentical(dt.dayOfYear().toString(), "361", "get_DateTime dayOfYear");
            this.areIdentical(dt.daysInMonth().toString(), "31", "get_DateTime daysInMonth");

        }

        test_diff_DateTime() {
            //  diff_DateTime разница между датами  в днях-месяцах-годах !!!
            var dt1 = new DateTime([2014, 4, 21, 0, 0, 0, 0]);
            var dt2 = new DateTime([2014, 4, 20, 0, 0, 0, 0]);
            this.areIdentical(dt1.diffDays(dt2).toString(), "1", "diff_DateTime day");
        }

    }

}