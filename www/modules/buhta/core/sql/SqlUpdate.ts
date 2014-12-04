/// <reference path="../Utils.ts" />
module BuhtaCore {


    export class SqlUpdate extends SqlWriteOper{
        keyFieldName: string;
        recs: Array<any> = [];
        packetSize = 500;
        execute() {
            if (this.table && this.schemaTable)
                throw "SqlUpdate: должно быть указано что-то одно, или 'table' или 'schemaTable'";

            if (!this.keyFieldName)
                throw "SqlUpdate: не заполнен 'keyFieldName'";

            var tableName: string;
            if (this.table)
                tableName = this.table;
            else
                if (this.schemaTable)
                    tableName = this.schemaTable.name;
                else
                    throw "SqlUpdate: не заполнено 'table' или 'schemaTable'";

            if (!this.database)
                this.database = "data";

            var _dbms = dbms[this.database];

            if (!_dbms) {
                throw "SqlUpdate: неизвестная база данных '" + this.database + "'";
            }


            if (this.recs.length == 0)
                throw "SqlUpdate: пустой 'rec'";

            var sql = new StringBuilder();
            for (var i = 0; i < this.recs.length; i++) {
                var r = this.recs[i];
                sql.append("UPDATE " + getBracketSqlName(tableName, _dbms) + " SET ");
                for (var propName in r) {
                    if (this.isIgnoreProperty(propName,r[propName])) continue;
                    if (propName === this.keyFieldName) continue;
                    sql.append(getBracketSqlName(propName, _dbms) + "=");
                    sql.append(r[propName].toSql(this.database) + ",");
                }
                sql.removeLastChar();
                sql.appendLine(" WHERE " + getBracketSqlName(this.keyFieldName, _dbms) + "=" + r[this.keyFieldName].toSql(this.database)+";");
                if ((i + 1) % this.packetSize == 0) {
                    executeSql(sql.toString(), this.database);
                    sql.clear();
                }
            }
            console.log(sql.toString());
            executeSql(sql.toString(), this.database);
        }
    }

}