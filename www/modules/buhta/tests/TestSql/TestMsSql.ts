/// <reference path="../tsUnit.ts" />
/// <reference path="../../core/buhta-core.d.ts" />

module BuhtaTestModule {

    export class TestMsSqlGroup extends tsUnit.TestClass {

        connect_test() {
            var ds = BuhtaCore.executeSql("select '777' xxx", this.db);
            this.areIdentical(ds.tables[0].rows[0]["xxx"], '777');
        }

        db: string = "test-ms";

        createTable_test() {
            var t = new BuhtaCore.SchemaTable();

            t.name = "Тестовая таблица";
            t.addIntColumn("Ключ").isPrimaryKey = true;
            t.addStringColumn("Номер", 30);
            t.addStringColumn("Название.Полное");

            //console.log(t.emitDropAndCreateTableSql("test-ms"));
            BuhtaCore.executeSql(t.emitDropAndCreateTableSql(this.db), this.db);
        }

        insert_test() {
            var op = new BuhtaCore.SqlInsert();
            op.table = "Тестовая таблица";
            op.database = this.db;
            op.recs.push({ Ключ: 101, Номер: "123-91", "Название.Полное": "ООО 'Рога и копыта\" 1" });
            op.recs.push({ Ключ: 102, Номер: "123-92", "Название.Полное": "ООО 'Рога и копыта\" 2" });
            op.recs.push({ Ключ: 103, Номер: "123-93", "Название.Полное": "ООО 'Рога и копыта\" 3" });
            op.execute();

            this.areIdentical(BuhtaCore.getValueFromSql("SELECT count(*) FROM \"Тестовая таблица\"", this.db), 3);

        }

        update_test() {
            var op = new BuhtaCore.SqlUpdate();
            op.table = "Тестовая таблица";
            op.keyFieldName = "Ключ";
            op.database = this.db;
            op.recs.push({ Ключ: 102, Номер: "123-92", "Название.Полное": "ООО 'Рога без копыт++++++++++++++++++++++\" 2" });
            op.execute();

            this.areIdentical(BuhtaCore.getValueFromSql("SELECT \"Название.Полное\" FROM \"Тестовая таблица\" WHERE Ключ=102", this.db), "ООО 'Рога без копыт++++++++++++++++++++++\" 2");
        }

        datatypes_test() {
            var t = new BuhtaCore.SchemaTable();
            t.name = "TestTypesTable";

            t.addSmallIntColumn("SmallIntMin");
            t.addSmallIntColumn("SmallIntMax");

            t.addIntColumn("IntMin");
            t.addIntColumn("IntMax");

            t.addBigIntColumn("BigIntMin");
            t.addBigIntColumn("BigIntMax");

            t.addStringColumn("String5", 5);
            t.addStringColumn("StringMax");
            t.addStringColumn("StringNumber", 10);

            t.addDecimalColumn("DecimalMin", 16, 2);
            t.addDecimalColumn("DecimalMax", 16, 2);

            t.executeDropAndCreateTable(this.db);

            var op = new BuhtaCore.SqlInsert();
            op.schemaTable = t;
            op.database = this.db;
            var rec: any = {};
            rec.SmallIntMin = -32768;
            rec.SmallIntMax = 32767;
            rec.IntMin = -2147483648;
            rec.IntMax = 2147483647;
            rec.BigIntMin = -9007199254740991;  // Number.MAX_SAFE_INTEGER 2^53 это немного меньше, чем надо 2^64, но тоже до хера
            rec.BigIntMax = 9007199254740991;

            rec.String5 = "АВйцZ";
            rec.StringNumber = "12345";

            var a = [];
            for (var i = 0; i < 50000; i++)
                a[i] = i.toString() + "'";

            rec.StringMax = "走进黄河之都 广汽吉奥人文之旅兰州站花絮篇" + a.join();
            rec.DecimalMin = -99999999999999.99;
            rec.DecimalMax = 99999999999999.99;

            op.recs.push(rec);
            op.execute();

            var ds = BuhtaCore.executeSql("select * from \"TestTypesTable\"", this.db);
            var r = ds.tables[0].rows[0];
            this.areIdentical(r.SmallIntMin, rec.SmallIntMin, "SmallIntMin");
            this.areIdentical(r.SmallIntMax, rec.SmallIntMax, "SmallIntMax");
            this.areIdentical(r.IntMin, rec.IntMin, "IntMin");
            this.areIdentical(r.IntMax, rec.IntMax, "IntMax");
            this.areIdentical(r.BigIntMin, rec.BigIntMin, "BigIntMin");
            this.areIdentical(r.BigIntMax, rec.BigIntMax, "BigIntMax");
            this.areIdentical(r.String5, rec.String5, "String5");
            this.areIdentical(r.StringNumber, rec.StringNumber, "StringNumber");
            this.areIdentical(r.StringMax, rec.StringMax, "StringMax");
            this.areIdentical(r.DecimalMin, rec.DecimalMin, "DecimalMin");
            this.areIdentical(r.DecimalMax, rec.DecimalMax, "DecimalMax");

        }

        guid_test() {
            var t = new BuhtaCore.SchemaTable();
            t.name = "TestGuidTable";

            t.addGuidColumn("GuidMin");
            t.addGuidColumn("GuidMax");
            t.addGuidColumn("GuidRandom");

            t.executeDropAndCreateTable(this.db);

            var op = new BuhtaCore.SqlInsert(); 
            op.schemaTable = t;
            op.database = this.db;
            var rec: any = {};

            rec.GuidMin = new Guid("00000000-0000-0000-0000-000000000000");
            rec.GuidMax = new Guid("ffffffff-ffff-ffff-FFFF-ffffffffffff");
            rec.GuidRandom = Guid.NewGuid();

            op.recs.push(rec);
            op.execute();

            var ds = BuhtaCore.executeSql("select * from \"" + t.name+"\"", this.db);
            var r = ds.tables[0].rows[0];

            this.areIdentical(r.GuidMin.getClassName(), "Guid", "typeof GuidMin");
            this.areIdentical(r.GuidMax.toString(), rec.GuidMax.toString(), "GuidMax");
            this.areIdentical(r.GuidRandom.toString(), rec.GuidRandom.toString(), "GuidRandom");

            this.areIdentical(r.GuidMin.toString(), rec.GuidMin.toString(), "GuidMin");
            this.areIdentical(r.GuidMax.toString(), rec.GuidMax.toString(), "GuidMax");
            this.areIdentical(r.GuidRandom.toString(), rec.GuidRandom.toString(), "GuidRandom");

        }

        boolean_test() {
            var t = new BuhtaCore.SchemaTable();
            t.name = "TestBooleanTable";

            t.addBooleanColumn("BooleanTrue");
            t.addBooleanColumn("BooleanFalse");

            t.executeDropAndCreateTable(this.db);

            var op = new BuhtaCore.SqlInsert();
            op.schemaTable = t;
            op.database = this.db;
            var rec: any = {};

            rec.BooleanTrue = true;
            rec.BooleanFalse = false;

            op.recs.push(rec);
            op.execute();

            var ds = BuhtaCore.executeSql("select * from \"" + t.name + "\"", this.db);
            var r = ds.tables[0].rows[0];

            this.areIdentical(r.BooleanTrue.getClassName(), "Boolean", "typeof BooleanTrue");
            this.areIdentical(r.BooleanFalse.getClassName(), "Boolean", "typeof BooleanFalse");

            this.areIdentical(r.BooleanTrue, true, "BooleanTrue");
            this.areIdentical(r.BooleanFalse, false, "BooleanFalse");

        }

        dateTime_test() {
            var t = new BuhtaCore.SchemaTable();
            t.name = "TestDateTimeTable";
            t.addDateTimeColumn("DateTimeMin");
            t.addDateTimeColumn("DateTimeMax");
            t.addDateTimeColumn("DateTimeNow");

            t.addTimeColumn("TimeMin");
            t.addTimeColumn("TimeMax");
            t.addTimeColumn("TimeNow");

            t.addDateColumn("DateMin");
            t.addDateColumn("DateMax");
            t.addDateColumn("DateNow");

            t.executeDropAndCreateTable(this.db);

            var op = new BuhtaCore.SqlInsert();
            op.schemaTable = t;
            op.database = this.db;
            var rec: any = {};

            rec.DateTimeMin = new DateTime("0100-01-01 00:00:00.00");
            rec.DateTimeMax = new DateTime("3500-12-31 23:59:59.99");
            rec.DateTimeNow = new DateTime();

            rec.TimeMax = new Time("23:59:59.99");
            rec.TimeMin = new Time("00:00:00.00");
            rec.TimeNow = new Time();

            rec.DateMax = new DateOnly("3500-12-31");
            rec.DateMin = new DateOnly("0100-01-01");
            rec.DateNow = new DateOnly();

            op.recs.push(rec);
            op.execute();

            var ds = BuhtaCore.executeSql("select * from \"TestDateTimeTable\"", this.db);
            var r = ds.tables[0].rows[0];
            this.areIdentical(r.DateTimeMin.toSql(), rec.DateTimeMin.toSql(), "DateTimeMin");
            this.areIdentical(r.DateTimeMax.toSql(), rec.DateTimeMax.toSql(), "DateTimeMax");
            this.areIdentical(r.DateTimeNow.toSql(), rec.DateTimeNow.toSql(), "DateTimeNow");

            this.areIdentical(r.TimeMin.toString(), rec.TimeMin.toString(), "TimeMin");
            this.areIdentical(r.TimeMax.toString(), rec.TimeMax.toString(), "TimeMax");
            this.areIdentical(r.TimeNow.toString(), rec.TimeNow.toString(), "TimeNow");

            this.areIdentical(r.DateMin.toString(), rec.DateMin.toString(), "DateMin");
            this.areIdentical(r.DateMax.toString(), rec.DateMax.toString(), "DateMax");
            this.areIdentical(r.DateNow.toString(), rec.DateNow.toString(), "DateNow");

        }
    }

}