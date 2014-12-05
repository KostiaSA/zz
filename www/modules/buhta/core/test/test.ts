/// <reference path="../Utils.ts" />
/// <reference path="../schema/schemaobject.ts" />

module BuhtaCore {
    export function test1() {
        zz("spa").spaTabset.addTab("grid-test", "modules/buhta/core/test/grid-test.html", "grid-test-xxx", {tableName: "Договор"});
    }

    export function openSchemaDesigner() {
        zz("spa").spaTabset.addTab("Дизайнер конфигурации", "<div style='height:100%'><schema-designer></schema-table-designer></div>", "Дизайнер кунфигурации", { tableName: "?" });
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
        zz("spa").spaTabset.scope["DesignedObject"] = getSchemaObject(new Guid("af8a7de6-48f9-4da9-b4d4-7a48dcd64835"));
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