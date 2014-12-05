/**
 * Created by Kostia on 03.12.2014.
 */

/// <reference path="../../../../../server/DesignerServiceApi.ts" />
/// <reference path="folder/SchemaFolder.ts" />

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
            this.tables.SchemaPackageTable = new SchemaPackageTable();
            this.tables.SchemaPackageDependenciesTable = new SchemaPackageDependenciesTable();
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

            var r = new SqlInsert("schema", this.tables.SchemaPackageTable);
            rec = {};
            rec.Id = new Guid("6cf67bdb-b02d-414c-96ad-af34b6659c22");
            var crmPackage=rec.Id;
            rec.Name = "CRM";
            rec.CompanyName = "ООО \"БУХта\"";
            r.recs.push(rec);
            r.execute();

            var r = new SqlInsert("schema", this.tables.SchemaPackageTable);
            rec = {};
            rec.Id = new Guid("35c9af9b-7502-49c6-906c-27042e332923");
            var authModule=rec.Id;
            rec.Name = "AUTH";
            rec.CompanyName = "ООО \"БУХта\"";
            r.recs.push(rec);
            r.execute();

            var r = new SqlInsert("schema", this.tables.SchemaPackageTable);
            rec = {};
            rec.Id = new Guid("903903f7-dc5a-4f21-a7df-aca3a8091334");
            var retailPackage=rec.Id;
            rec.Name = "RETAIL";
            rec.CompanyName = "ООО \"Авалон\"";
            r.recs.push(rec);
            r.execute();


            var t = new SchemaTable();
            t.id = new Guid("310b912d-096f-4910-8f53-32d292723625");
            t.name = "Организация";
            t.version = 1;
            t.packageId = crmPackage;
            t.addGuidColumn("Id");
            t.addStringColumn("Номер");
            t.addStringColumn("Название");
            t.addStringColumn("Город");
            t.saveToSql();

            t = new SchemaTable();
            t.id = new Guid("af8a7de6-48f9-4da9-b4d4-7a48dcd64835");
            t.name = "Сотрудник";
            t.version = 1;
            t.packageId = crmPackage;
            t.addGuidColumn("Id");
            t.addStringColumn("Номер");
            t.addStringColumn("Фамилия");
            t.addStringColumn("Имя");
            t.addStringColumn("Отчество");
            t.addDateColumn("ДатаРождения");
            t.saveToSql();

            var f=new SchemaFolder();
            t.id = new Guid("8db782f3-141a-4b66-b791-64f6933f4fb2");
            var qFolder=t.id;
            t.name = "Запросы";
            t.version = 1;
            t.packageId = crmPackage;
            t.saveToSql();

            t = new SchemaTable();
            t.id = new Guid("");
            t.name = "Регион";
            t.version = 1;
            t.packageId = crmPackage;
            t.parentId = qFolder;
            t.addGuidColumn("Id");
            t.addIntColumn("Номер");
            t.addStringColumn("Название");
            t.saveToSql();

            t = new SchemaTable();
            t.id = new Guid("db628203-a3df-4fb9-912b-0d82dc0a1168");
            t.name = "Магазин";
            t.version = 1;
            t.packageId = retailPackage;
            t.addGuidColumn("Id");
            t.addStringColumn("Номер");
            t.addStringColumn("Название");
            t.addStringColumn("Город");
            t.addStringColumn("Адрес");
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
            this.addGuidColumn("PackageId");
            this.addGuidColumn("CheckoutLoginId");
            this.addDateTimeColumn("UpdateDate");
        }
    }

    export class SchemaPackageTable extends SchemaTable {
        constructor() {
            super();
            this.name = "__SchemaPackage__";
            this.addGuidColumn("Id");
            this.addStringColumn("Name");
            this.addStringColumn("CompanyName");
        }
    }

    export class SchemaPackageDependenciesTable extends SchemaTable {
        constructor() {
            super();
            this.name = "__SchemaPackageDependencies__";
            this.addGuidColumn("PackageId");
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
