/// <reference path="../Utils.ts" />
/// <reference path="../schema/schemaobject.ts" />


module BuhtaCore {
    declare var JXON: any;
    export function test1() {

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

        t.executeCreateTable(this.db);

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

        rec.DateMax = new Date("2014-12-31 00:00:00");
        //rec.DateMin = new Date("0100-01-01 00:00:00");
        //rec.DateNow = new Date();

        op.recs.push(rec);
        op.execute();

        var ds = BuhtaCore.executeSql("select * from \"TestDateTimeTable\"", this.db);
        var r = ds.tables[0].rows[0];


        //var ins = new SqlUpsert();
        //ins.database = "data-pg";
        //ins.table = "Проводка";
        //ins.keyFieldName = "Ключ";
        //ins.rec.Ключ = 100;
        //ins.rec.Дата = new Date();
        //ins.rec.Дебет = "41/1'12";
        //ins.rec.Сумма = 7890 + 786.12;
        //ins.execute();

        //var ins = new SqlInsert();
        //ins.database = "data-pg";
        //ins.table = "Проводка";
        //ins.rec.Ключ = 100;
        //ins.rec.Дата = new Date();
        //ins.rec.Дебет = "41/1";
        //ins.rec.Сумма = 7890 + 786.12;
        //ins.execute();

        //zz("spa").spaTabset.addTab("grid-test", "buhtacore/test/grid-test.html", "grid-test-xxx", { tableName: "Договор" });


        //var html=processTemplate("<div>Привет уроды ------, {{title}}!</div>", { title: "My New Post", body: "This is my first post!" })
        //var source = "<div>Привет уроды, {{title}}!</div>";
        //var template = Handlebars.compile(source);
        //var context = { title: "My New Post", body: "This is my first post!" };
        //var html = template(context);
        //zz("spa").spaTabset.addTab("grid-test", html, "grid-test-xxx");



        //var table = new SchemaTable();
        //table.name = "Организация";
        //table.columns = [];

        //var col = new SchemaTableColumn();
        //col.table = table;
        //col.name = "Номер";
        //col.dataType = new StringDataType(-1);
        //table.columns.push(col);

        //col = new SchemaTableColumn();
        //col.table = table;
        //col.dataType = new StringDataType(100);
        //col.name = "Название";
        //table.columns.push(col);

        //table.saveToSql();
        //$("body").text(table.toXML());

    }

    export function test2() {
        var table = new SchemaTable();
        table.importSchemaFromNativeDB("Проводка", "sunerja");
        table.saveToSql();
        $("body").text("Ok");
        //executeSql(table.emitCreateTableSql("sunerja-pg"), "sunerja-pg");
        //$("body").text("+" +table.emitCreateTableSql("sunerja-pg"));
        //table.copyDataAsync("sunerja", "sunerja-pg",$("body"));
        //table.saveToSql();

    }

    export function openTable() {
        //  alert("opentable");
        zz("spa").spaTabset.scope["DesignedObject"] = getSchemaObject("SchemaTable.Проводка");
        zz("spa").spaTabset.addTab("Таблица: ТМЦ", "<div style='height:100%'><schema-table-designer></schema-table-designer></div>", "table123");
    }

    //function test2() {

    //    var x = 0;
    //    setInterval(() => {
    //        //        var ds = executeSql('update dbo."UserGroupAccess" set "UserGroup"=\'0\' WHERE false', "sunerja");
    //        var ds = executeSql('SELECT "UserGroup" FROM dbo."UserGroupAccess" WHERE "UserGroup" like \'омер\' limit 10', "sunerja");
    //        x++;
    //        $("body").text(x.toString());
    //    });

    //    return;
    //    //    var ds = executeSql(["select top 10 Номер,Название from ТМЦ select top 5 Номер,Название from ТМЦ ", "select top 10 Название from ТМЦ"], "BuhtaStore");

    //    var m = [];
    //    for (var i = 0; i < 100; i++)
    //        //m.push('SELECT "UserGroup" x1,"UserGroup" x2 FROM dbo."UserGroupAccess" where "UserGroup">\'\' limit 10000 ');
    //        m.push('update dbo."UserGroupAccess" set "UserGroup"=\'0\' WHERE false');

    //    //    var ds = executeSql(['SELECT "UserGroup" FROM dbo."UserGroupAccess" limit 1', 'SELECT "UserGroup" FROM dbo."UserGroupAccess" limit 1', 'SELECT "UserGroup" FROM dbo."UserGroupAccess" limit 1', 'SELECT "UserGroup" FROM dbo."UserGroupAccess" limit 1'], "sunerja");
    //    //    var ds = executeSql('update dbo."UserGroupAccess" set "UserGroup"=\'0\' WHERE false', "sunerja");
    //    var ds = executeSql(m.join(";"), "sunerja");

    //    $("body").text("");
    //    ds.appendToHtml($("body"));
    //}

    //function ajax1() {
    //    setInterval(ajax2, 1);
    //}

    //var counter = 0;

    //function ajax2() {
    //    var json: JQueryAjaxSettings = {};
    //    json.url = "sql";
    //    json.async = false;
    //    json.data = { session: "xykfdhjuj84764", method: "ExecuteSql", db: "Buhta5", sql: "select * from организация" };
    //    json.success = (data, textStatus, jqXHR) => {
    //        //  alert("ok");
    //        //        $("body").text(JSON.stringify(data));
    //        $("body").text(counter++);
    //    }
    //json.error = (jqXHR, textStatus, errorThrown) => {
    //        //alert(textStatus);
    //        throw "error: " + jqXHR.responseText;

    //    }
    //$.ajax(json);
    //    //alert(1);
    //}
    export function designerTest() {
        var x= new SchemaStore().createSampleSchema();
        $("body").text("createSchemaTables Ok");
    }

}