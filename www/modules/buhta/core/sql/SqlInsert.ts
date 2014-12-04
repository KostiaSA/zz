/// <reference path="../Utils.ts" />
module BuhtaCore {

    export class ServerSideValue {
        static serverDateTime = {
            toSql(database?:string):string {
                if (dbms[database] == "mssql")
                    return "getdate()";
                else if (dbms[database] == "pgsql")
                    return "LOCALTIMESTAMP";
                else
                    throw "ServerSideValue.serverDateTime(): неизвестный тип базы данных '" + dbms[database] + "'";


            }
        }
    }


    export class SqlWriteOper {
        database:string;
        table:string;
        schemaTable:SchemaTable;
        recs:Array<any> = [];
        packetSize = 500;

        constructor(database?:string, table?:string);
        constructor(database?:string, schemaTable?:SchemaTable);
        constructor(database?:string, table?:any) {
            this.database = database;
            if (table && angular.isString(table))
                this.table = table;
            else
                this.schemaTable = table;
        }

        isIgnoreProperty(propName:any, propValue:any):boolean {
            // если убрать propValue !== false, то вместо false в базу будет сохраняться null
            return (!propValue && propValue !== false) || propName.substr(0, 2) === "__";
        }
    }

    export class SqlInsert extends SqlWriteOper {

        execute() {
            if (this.table && this.schemaTable)
                throw "SqlInsert: должно быть указано что-то одно, или 'table' или 'schemaTable'";

            if (this.table && this.schemaTable)
                throw "SqlInsert: должно быть указано что-то одно, или 'table' или 'schemaTable'";

            var tableName:string;
            if (this.table)
                tableName = this.table;
            else if (this.schemaTable)
                tableName = this.schemaTable.name;
            else
                throw "SqlInsert: не заполнено 'table' или 'schemaTable'";

            if (!this.database)
                this.database = "data";

            var _dbms = dbms[this.database];

            if (!_dbms) {
                throw "SqlInsert: неизвестная база данных '" + this.database + "'";
            }

            if (this.recs.length == 0)
                throw "SqlInsert: пустой 'rec'";

            var sql = new StringBuilder();
            for (var i = 0; i < this.recs.length; i++) {
                var r = this.recs[i];
                sql.append("INSERT INTO " + getBracketSqlName(tableName, _dbms) + "(");
                for (var propName in r) {
                    if (this.isIgnoreProperty(propName,r[propName])) continue;
                    sql.append(getBracketSqlName(propName, _dbms) + ",");
                }
                sql.removeLastChar();
                sql.append(") VALUES(");
                for (var propName in r) {
                    if (this.isIgnoreProperty(propName,r[propName])) continue;
                    //console.log(propName);
                    sql.append(r[propName].toSql(this.database) + ",");
                }
                sql.removeLastChar();
                sql.appendLine(");");
                if ((i + 1) % this.packetSize == 0) {
                    executeSql(sql.toString(), this.database);
                    sql.clear();
                }
            }
            //console.log(sql.toString());
            executeSql(sql.toString(), this.database);
        }
    }

}