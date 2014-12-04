/// <reference path="../Utils.ts" />
module BuhtaCore {


    export class SqlUpsert extends SqlWriteOper{
        keyFieldName: string;
        recs: Array<any> = [];
        packetSize = 500;
        execute() {
            if (this.table && this.schemaTable)
                throw "SqlUpsert: должно быть указано что-то одно, или 'table' или 'schemaTable'";

            if (!this.keyFieldName)
                throw "SqlUpsert: не заполнен 'keyFieldName'";

            var tableName: string;
            if (this.table)
                tableName = this.table;
            else
                if (this.schemaTable)
                    tableName = this.schemaTable.name;
                else
                    throw "SqlUpsert: не заполнено 'table' или 'schemaTable'";

            if (!this.database)
                this.database = "data";

            var _dbms = dbms[this.database];

            if (!_dbms) {
                throw "SqlUpsert: неизвестная база данных '" + this.database + "'";
            }


            if (this.recs.length == 0)
                throw "SqlUpsert: пустой 'rec'";

            var sql = new StringBuilder();
            for (var i = 0; i < this.recs.length; i++) {
                var r = this.recs[i];

                if (_dbms == "pgsql") {
                    sql.appendLine("DO $$");
                    sql.appendLine("BEGIN");
                }

                sql.append("IF EXISTS(SELECT * FROM " + getBracketSqlName(tableName, _dbms) + " WHERE " + getBracketSqlName(this.keyFieldName, _dbms) + "=" + r[this.keyFieldName].toSql(this.database) + ")");
                if (_dbms == "pgsql") {
                    sql.appendLine(" THEN");
                }
                sql.appendLine();

                sql.append("  UPDATE " + getBracketSqlName(tableName, _dbms) + " SET ");
                for (var propName in r) {
                    if (this.isIgnoreProperty(propName,r[propName])) continue;
                    if (propName === this.keyFieldName) continue;
                    sql.append(getBracketSqlName(propName, _dbms) + "=");
                    sql.append(r[propName].toSql(this.database) + ",");
                }
                sql.removeLastChar();
                sql.appendLine(" WHERE " + getBracketSqlName(this.keyFieldName, _dbms) + "=" + r[this.keyFieldName].toSql(this.database) + ";");

                sql.appendLine("ELSE");

                sql.append("  INSERT INTO " + getBracketSqlName(tableName, _dbms) + "(");
                var r = this.recs[i];
                for (var propName in r) {
                    if (this.isIgnoreProperty(propName,r[propName])) continue;
                    sql.append(getBracketSqlName(propName, _dbms) + ",");
                }
                sql.removeLastChar();
                sql.append(") VALUES(");
                for (var propName in r) {
                    if (this.isIgnoreProperty(propName,r[propName])) continue;
                    sql.append(r[propName].toSql(this.database) + ",");
                }
                sql.removeLastChar();
                sql.appendLine(");");

                if (_dbms == "pgsql") {
                    sql.appendLine("END IF;");
                    sql.appendLine("END$$;");
                }


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