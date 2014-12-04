/**
 * Created by Kostia on 03.12.2014.
 */

/// <reference path="../../../../../server/DesignerServiceApi.ts" />

module BuhtaCore {

    export class SchemaStore {

        //getObjectsTree():any {
        //    var request = new GetAppDirTreeDesignerRequest();
        //    var response = <GetAppDirTreeDesignerResponse>this.callDesignerService(request);
        //    return response.dirtree;
        //}
        //
        //callDesignerService(request:BaseDesignerRequest):BaseDesignerResponse {
        //
        //    var response = $.ajax({
        //        type: "POST",
        //        url: "designer",
        //        cache: false,
        //        contentType: "application/json; charset=utf-8",
        //        data: JSON.stringify(request),
        //        dataType: "json",
        //        async: false
        //    });
        //
        //    if (response.statusText == "OK") {
        //        var parsed:BaseDesignerResponse = response.responseJSON;
        //        if (parsed.result === DesignerResult.Ok) {
        //            return parsed;
        //        }
        //        else
        //            throw 'Ошибка callDesignerService:\n' + parsed.error;
        //
        //    }
        //    else
        //        throw 'Ошибка callDesignerService:\n' + response.statusText;
        //
        //}

        private static currentLogin:string;

        static getCurrentLogin():string {
            if (!this.currentLogin) {
                this.currentLogin = "savchenkov";
            }
            return this.currentLogin;
        }

        tables:any = {};

        constructor() {
            this.tables.SchemaLoginTable = new SchemaLoginTable();
            this.tables.SchemaObjectTable = new SchemaObjectTable();
            this.tables.SchemaModuleTable = new SchemaModuleTable();
            this.tables.SchemaModuleDependenciesTable = new SchemaModuleDependenciesTable();
            this.tables.SchemaAppTable = new SchemaAppTable();
            this.tables.SchemaSnapshotTable = new SchemaSnapshotTable();
            this.tables.SchemaSnapshotObjectsTable = new SchemaSnapshotObjectsTable();
        }

        createSchemaTables() {
            for (var tableName in this.tables) {
                var table = <SchemaTable>(this.tables[tableName]);
                table.executeCreateTable("schema");
            }
        }

        dropAndCreateSchemaTables() {
            for (var tableName in this.tables) {
                var table = <SchemaTable>(this.tables[tableName]);
                table.executeDropAndCreateTable("schema");
            }
        }

        createSampleSchema() {
            this.dropAndCreateSchemaTables();
            var rec:any;


            var r = new SqlInsert("schema", this.tables.SchemaLoginTable);
            rec = {};
            rec.Id = new Guid("39bb47c5-bc48-40b9-a3a8-6708d632197e");
            rec.Login = "Savchenkov";
            rec.Password = "1234567890";
            r.recs.push(rec);
            r.execute();

            var r = new SqlInsert("schema", this.tables.SchemaLoginTable);
            rec = {};
            rec.Id = new Guid("e4d4d248-7906-412c-834a-43b9d95f3521");
            rec.Login = "Sidorenko";
            rec.Password = "9876543210";
            r.recs.push(rec);
            r.execute();

            var r = new SqlInsert("schema", this.tables.SchemaAppTable);
            rec = {};
            rec.Id = new Guid("09bccb8d-af1f-468b-b445-50e00c9bc961");
            rec.Name = "Buhta CRM";
            //rec.MainMenuId = "9876543210";
            r.recs.push(rec);
            r.execute();

            var r = new SqlInsert("schema", this.tables.SchemaModuleTable);
            rec = {};
            rec.Id = new Guid("6cf67bdb-b02d-414c-96ad-af34b6659c22");
            rec.Name = "CRM";
            rec.CompanyName = "ООО \"БУХта\"";
            r.recs.push(rec);
            r.execute();


            var t = new SchemaTable();
            t.id = new Guid("310b912d-096f-4910-8f53-32d292723625");
            t.name = "Организация";
            t.version = 1;
            t.moduleId = new Guid("6cf67bdb-b02d-414c-96ad-af34b6659c22");
            t.addGuidColumn("Id");
            t.addStringColumn("Номер");
            t.addStringColumn("Название");
            t.addStringColumn("Город");
            t.saveToSql();

            t = new SchemaTable();
            t.id = new Guid("af8a7de6-48f9-4da9-b4d4-7a48dcd64835");
            t.name = "Сотрудник";
            t.version = 1;
            t.moduleId = new Guid("6cf67bdb-b02d-414c-96ad-af34b6659c22");
            t.addGuidColumn("Id");
            t.addStringColumn("Номер");
            t.addStringColumn("Фамилия");
            t.addStringColumn("Имя");
            t.addStringColumn("Отчество");
            t.addDateColumn("ДатаРождения");
            t.saveToSql();
        }

    }

    export class SchemaLoginTable extends SchemaTable {
        constructor() {
            super();
            this.name = "__SchemaLogin__";
            this.addGuidColumn("Id");
            this.addStringColumn("Login");
            this.addStringColumn("Password");
        }
    }

    export class SchemaObjectTable extends SchemaTable {
        constructor() {
            super();
            this.name = "__SchemaObject__";
            this.addGuidColumn("Id");
            this.addIntColumn("Version");
            this.addStringColumn("Name");
            this.addStringColumn("Data");
            this.addGuidColumn("ParentId");
            this.addGuidColumn("ModuleId");
            this.addGuidColumn("CheckoutLoginId");
            this.addDateTimeColumn("UpdateDate");
        }
    }

    export class SchemaModuleTable extends SchemaTable {
        constructor() {
            super();
            this.name = "__SchemaModule__";
            this.addGuidColumn("Id");
            this.addStringColumn("Name");
            this.addStringColumn("CompanyName");
        }
    }

    export class SchemaModuleDependenciesTable extends SchemaTable {
        constructor() {
            super();
            this.name = "__SchemaModuleDependencies__";
            this.addGuidColumn("ModuleId");
            this.addGuidColumn("DependedOnId");
        }
    }

    export class SchemaAppTable extends SchemaTable {
        constructor() {
            super();
            this.name = "__SchemaApp__";
            this.addGuidColumn("Id");
            this.addStringColumn("Name");
            this.addGuidColumn("MainMenuId");
            this.addGuidColumn("ProductSnapshotId");
        }
    }

    export class SchemaSnapshotTable extends SchemaTable {
        constructor() {
            super();
            this.name = "__SchemaSnapshot__";
            this.addGuidColumn("Id");
            this.addStringColumn("Name");
            this.addDateTimeColumn("CreateDate");
        }
    }

    export class SchemaSnapshotObjectsTable extends SchemaTable {
        constructor() {
            super();
            this.name = "__SchemaSnapshotObjects__";
            this.addGuidColumn("SnapshotId");
            this.addGuidColumn("ObjectId");
            this.addIntColumn("ObjectVersion");
            this.addDateTimeColumn("CreateDate");
        }
    }
}
