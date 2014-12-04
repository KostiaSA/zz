/// <reference path="../Utils.ts" />
/// <reference path="SchemaObject.ts" />

module BuhtaCore {
    export class SchemaTableColumn extends BaseObject {
        table: SchemaTable;
        name: string;
        dataType: SqlDataType;
        isPrimaryKey: boolean;
        notNull: boolean;

        registerProperties() {
            super.registerProperties();
            this.registerProperty("table", "BuhtaCore.SchemaTable");
            this.registerProperty("name", "string");
            this.registerProperty("dataType", "BuhtaCore.SqlDataType");
            this.registerProperty("isPrimaryKey", "boolean");
            this.registerProperty("notNull", "boolean");
        }

        emitColumnNameSql(database: string= "data") {
            if (dbms[database] == "mssql") {
                return "[" + this.name + "]";
            }
            else
                if (dbms[database] == "pgsql") {
                    return "\"" + this.name + "\"";
                }
                else
                    throw "неизвестный тип sql-сервера: " + dbms[database];
        }
    }

    export class SqlDataType extends BaseObject {
        get name() {
            return "?SqlDataType";
        }
        get nameEx() {
            return this.name;
        }
        getDeclareSql(database: string= "data"):string {
            throw "SqlDataType.getDeclareSql(): abstract error";
        }
        registerProperties() {
            super.registerProperties();
            //            this.registerProperty("name", "string");
        }
    }

    export class StringDataType extends SqlDataType {
        get name() {
            return "String";
        }
        constructor(public maxLen: number) {
            super();
        }
        get nameEx() {
            if (this.maxLen == -1)
                return "String(max)";
            else
                return "String(" + this.maxLen + ")";
        }
        registerProperties() {
            super.registerProperties();
            this.registerProperty("maxLen", "number");
        }
        getDeclareSql(database: string= "data") {
            if (dbms[database] == "mssql") {
                if (this.maxLen == -1)
                    return "nvarchar(max)";
                else
                    return "nvarchar(" + this.maxLen + ")";
            }
            else
                if (dbms[database] == "pgsql") {
                    if (this.maxLen == -1)
                        return "text";
                    else
                        return "varchar(" + this.maxLen + ")";
                }
                else
                    throw "неизвестный тип sql-сервера: " + dbms[database];
        }
    }


    export class IntDataType extends SqlDataType {
        constructor() {
            super();
        }
        get name() {
            return "Int";
        }
        getDeclareSql(database: string= "data") {
            if (dbms[database] == "mssql") {
                return "int";
            }
            else
                if (dbms[database] == "pgsql") {
                    return "int";
                }
                else
                    throw "неизвестный тип sql-сервера: " + dbms[database];
        }
    }

    export class SmallIntDataType extends SqlDataType {
        constructor() {
            super();
        }
        get name() {
            return "SmallInt";
        }
        getDeclareSql(database: string= "data"):string {
            if (dbms[database] == "mssql") {
                return "smallint";
            }
            else
                if (dbms[database] == "pgsql") {
                    return "smallint";
                }
                else
                    throw "неизвестный тип sql-сервера: " + dbms[database];
        }
    }

    export class BigIntDataType extends SqlDataType {
        constructor() {
            super();
        }
        get name() {
            return "BigInt";
        }
        getDeclareSql(database: string= "data") {
            if (dbms[database] == "mssql") {
                return "bigint";
            }
            else
                if (dbms[database] == "pgsql") {
                    return "bigint";
                }
                else
                    throw "неизвестный тип sql-сервера: " + dbms[database];
        }
    }

    export class BooleanDataType extends SqlDataType {
        constructor() {
            super();
        }
        get name() {
            return "Boolean";
        }
        getDeclareSql(database: string= "data") {
            if (dbms[database] == "mssql") {
                return "bit";
            }
            else
                if (dbms[database] == "pgsql") {
                    return "boolean";
                }
                else
                    throw "неизвестный тип sql-сервера: " + dbms[database];
        }
    } 

    export class DateTimeDataType extends SqlDataType {
        constructor() {
            super();
        }
        get name() {
            return "DataTime";
        }
        getDeclareSql(database: string= "data") {
            if (dbms[database] == "mssql") {
                return "datetime2";
            }
            else
                if (dbms[database] == "pgsql") {
                    return "timestamp";
                }
                else
                    throw "неизвестный тип sql-сервера: " + dbms[database];
        }
    }

    export class TimeDataType extends SqlDataType {
        constructor() {
            super();
        }
        get name() {
            return "Time";
        }
        getDeclareSql(database: string= "data") {
            if (dbms[database] == "mssql") {
                return "time(2)";
            }
            else
                if (dbms[database] == "pgsql") {
                    return "time without time zone";
                }
                else
                    throw "неизвестный тип sql-сервера: " + dbms[database];
        }
    }

    export class DateDataType extends SqlDataType {
        constructor() {
            super();
        }
        get name() {
            return "Date";
        }
        getDeclareSql(database: string= "data") {
            if (dbms[database] == "mssql") {
                return "date";
            }
            else
                if (dbms[database] == "pgsql") {
                    return "date";
                }
                else
                    throw "неизвестный тип sql-сервера: " + dbms[database];
        }
    }

    export class BlobDataType extends SqlDataType {
        constructor() {
            super();
        }
        get name() {
            return "Blob";
        }
        getDeclareSql(database: string= "data") {
            if (dbms[database] == "mssql") {
                return "varbinary(max)";
            }
            else
                if (dbms[database] == "pgsql") {
                    return "bytea";
                }
                else
                    throw "неизвестный тип sql-сервера: " + dbms[database];
        }
    }

    export class GuidDataType extends SqlDataType {
        constructor() {
            super();
        }
        get name() {
            return "Guid";
        }
        getDeclareSql(database: string= "data") {
            if (dbms[database] == "mssql") {
                return "uniqueidentifier";
            }
            else
                if (dbms[database] == "pgsql") {
                    return "uuid";
                }
                else
                    throw "неизвестный тип sql-сервера: " + dbms[database];
        }
    }

    export class DecimalDataType extends SqlDataType {
        constructor(public precision: number, public scale: number) {
            super();
            if (precision < 1 || precision > 16)
                throw "DecimalDataType: precision должен быть от 1 до 16";
            if (scale < 1 || scale > 16)
                throw "DecimalDataType: scale должен быть от 1 до 16";
            if (scale > precision)
                throw "DecimalDataType: scale должен быть меньше precision";
        }
        get name() {
            return "Decimal";
        }
        get nameEx() {
            return "Decimal(" + this.precision + "," + this.scale + ")";
        }
        registerProperties() {
            super.registerProperties();
            this.registerProperty("precision", "number");
            this.registerProperty("scale", "number");
        }
        getDeclareSql(database: string= "data") {
            if (dbms[database] == "mssql") {
                return "decimal(" + this.precision + "," + this.scale + ")";
            }
            else
                if (dbms[database] == "pgsql") {
                    return "decimal(" + this.precision + "," + this.scale + ")";
                }
                else
                    throw "неизвестный тип sql-сервера: " + dbms[database];
        }
    }

    export class ForeingKeyDataType extends SqlDataType {
        foreingTableId: string;
        registerProperties() {
            super.registerProperties();
            this.registerProperty("foreingTableId", "string");
        }
    }

    export class SchemaTable extends SchemaObject {
        constructor() {
            super();
            this.columns = [];
        }
        columns: Array<SchemaTableColumn>;

        registerProperties() {
            super.registerProperties();
            this.registerProperty("columns", "array");
        }

        get primaryKey(): SchemaTableColumn {
            for (var i = 0; i < this.columns.length; i++) {
                if (this.columns[i].isPrimaryKey)
                    return this.columns[i];
            }
            return undefined;
        }

        addSmallIntColumn(name?: string): SchemaTableColumn {
            var c = new SchemaTableColumn();
            this.columns.push(c);
            c.table = this;
            c.name = name;
            c.dataType = new SmallIntDataType();
            return c;
        }

        addIntColumn(name?: string): SchemaTableColumn {
            var c = new SchemaTableColumn();
            this.columns.push(c);
            c.table = this;
            c.name = name;
            c.dataType = new IntDataType();
            return c;
        }

        addBigIntColumn(name?: string): SchemaTableColumn {
            var c = new SchemaTableColumn();
            this.columns.push(c);
            c.table = this;
            c.name = name;
            c.dataType = new BigIntDataType();
            return c;
        }

        addStringColumn(name?: string, maxLen: number= -1): SchemaTableColumn {
            var c = new SchemaTableColumn();
            this.columns.push(c);
            c.table = this;
            c.name = name;
            c.dataType = new StringDataType(maxLen);
            return c;
        }

        addDecimalColumn(name?: string, precision?: number, scale?: number): SchemaTableColumn {
            var c = new SchemaTableColumn();
            this.columns.push(c);
            c.table = this;
            c.name = name;
            c.dataType = new DecimalDataType(precision, scale);
            return c;
        }

        addDateTimeColumn(name?: string): SchemaTableColumn {
            var c = new SchemaTableColumn();
            this.columns.push(c);
            c.table = this;
            c.name = name;
            c.dataType = new DateTimeDataType();
            return c;
        }

        addDateColumn(name?: string): SchemaTableColumn {
            var c = new SchemaTableColumn();
            this.columns.push(c);
            c.table = this;
            c.name = name;
            c.dataType = new DateDataType();
            return c;
        }

        addTimeColumn(name?: string): SchemaTableColumn {
            var c = new SchemaTableColumn();
            this.columns.push(c);
            c.table = this;
            c.name = name;
            c.dataType = new TimeDataType();
            return c;
        }

        addGuidColumn(name?: string): SchemaTableColumn {
            var c = new SchemaTableColumn();
            this.columns.push(c);
            c.table = this;
            c.name = name;
            c.dataType = new GuidDataType();
            return c;
        }

        addBooleanColumn(name?: string): SchemaTableColumn {
            var c = new SchemaTableColumn();
            this.columns.push(c);
            c.table = this;
            c.name = name;
            c.dataType = new BooleanDataType();
            return c;
        }

        importSchemaFromNativeDB(tableName: string, database: string= "data") {
            if (this.columns.length != 0)
                throw "Для импорта нужна пустая таблица.";

            this.name = tableName;

            //this.addRole("^Таблица");

            var sql = "";
            sql += "SELECT *, \n";
            sql += "CASE \n";
            sql += "  WHEN(SELECT count(*) FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE K \n";
            sql += "        WHERE K.COLUMN_NAME = C.COLUMN_NAME AND \n";
            sql += "		      K.TABLE_NAME = " + tableName.toSql(database) + " AND \n";
            sql += "			  SUBSTRING(K.CONSTRAINT_NAME, 1, 4) = 'PK__') = 1 THEN 1 \n";
            sql += "  ELSE 0 \n";
            sql += "  END IsKey \n";
            sql += "FROM INFORMATION_SCHEMA.COLUMNS C WHERE TABLE_NAME = " + tableName.toSql(database) + " order by ORDINAL_POSITION \n";

            var rows = executeSql(sql, database).tables[0].rows;

            for (var i in rows) {
                var row = rows[i];
                var newCol = new SchemaTableColumn();
                newCol.table = this;
                this.columns.push(newCol);

                newCol.name = row["COLUMN_NAME"];
                newCol.isPrimaryKey = row["IsKey"] == "1";
                //if (row["IsKey"] == "1")
                //    $("<schema-table-role>^PK</schema-table-role>").appendTo(newCol);

                var dataType = row["DATA_TYPE"].toString().toLowerCase();

                if (dataType == "int" || dataType == "tinyint" || dataType == "smallint")
                    newCol.dataType = new IntDataType();

                if (dataType == "datetime" || dataType == "smalldatetime")
                    newCol.dataType = new DateTimeDataType();

                if (dataType == "bit")
                    newCol.dataType = new BooleanDataType();

                if (dataType == "image" || dataType == "binary" || dataType == "varbinary")
                    newCol.dataType = new BlobDataType();

                if (dataType == "money")
                    newCol.dataType = new DecimalDataType(16, 4);

                if (dataType == "uniqueidentifier")
                    newCol.dataType = new GuidDataType();

                if (dataType == "decimal")
                    newCol.dataType = new DecimalDataType(row["NUMERIC_PRECISION"], row["NUMERIC_SCALE"]);

                if (dataType == "nvarchar" || dataType == "varchar" || dataType == "char" || dataType == "nchar")
                    newCol.dataType = new StringDataType(row["CHARACTER_MAXIMUM_LENGTH"]);

                //if (dataType == "binary" || dataType == "varbinary")
                //    newCol.attr("data-type", "Binary")
                //        .attr("data-length", row["CHARACTER_MAXIMUM_LENGTH"]);

                if (!newCol.dataType)
                    throw "Неизвестный тип данных " + dataType;

                //c.IsNotNullable = row["IS_NULLABLE"].ToString() == "NO";
                if (row["IS_NULLABLE"].toString() == "NO")
                    newCol.notNull = true;

            }
        }

        emitCreateTableSql(database: string= "data"): string {
            if (this.columns.length == 0)
                throw "emitCreateTableSql(): таблица '" + this.name + "' не содержит полей";
            var sql = new StringBuilder();
            sql.appendLine("CREATE TABLE " + this.emitTableNameSql(database) + "(");
            this.columns.map((col) => {
                var primaryKeyStr = col.isPrimaryKey ? " PRIMARY KEY" : "";
                sql.appendLine("  " + col.emitColumnNameSql(database) + " " + col.dataType.getDeclareSql(database) + primaryKeyStr + ",");
            })
            sql.removeLastChar(2);
            sql.appendLine();
            sql.appendLine(");");
            return sql.toString();
        }

        emitDropTableSql(database: string= "data"): string {
            var sql = new StringBuilder();
            sql.appendLine("DROP TABLE " + this.emitTableNameSql(database) + ";");
            return sql.toString();
        }

        emitDropAndCreateTableSql(database: string= "data"): string {
            var sql = new StringBuilder();
            sql.append(this.emitDropTableIfExistsSql(database));
            sql.append(this.emitCreateTableSql(database));
            return sql.toString();
        }

        emitDropTableIfExistsSql(database: string= "data"): string {
            var sql = new StringBuilder();
            if (dbms[database] == "mssql") {
                sql.appendLine("IF OBJECT_ID('" + this.name + "', 'U') IS NOT NULL");
                sql.appendLine("  DROP TABLE " + this.emitTableNameSql(database) + ";");
            }
            else
                if (dbms[database] == "pgsql") {
                    sql.appendLine("  DROP TABLE IF EXISTS " + this.emitTableNameSql(database) + ";");
                }
                else
                    throw "неизвестный тип sql-сервера: " + dbms[database];
            return sql.toString();
        }

        emitTableNameSql(database: string= "data") {
            if (dbms[database] == "mssql") {
                return "\"" + this.name + "\"";
            }
            else
                if (dbms[database] == "pgsql") {
                    return "\"" + this.name + "\"";
                }
                else
                    throw "неизвестный тип sql-сервера: " + dbms[database];
        }

        emitLimitOffsetSql(limit: number, offset: number= 0, database: string= "data") {
            if (dbms[database] == "mssql") {
                return "OFFSET " + offset + " ROWS FETCH NEXT " + limit + " ROWS ONLY";
            }
            else
                if (dbms[database] == "pgsql") {
                    return "LIMIT " + limit + " OFFSET " + offset;
                }
                else
                    throw "неизвестный тип sql-сервера: " + dbms[database];
        }

        executeCreateTable(database: string= "data") {
            executeSql(this.emitCreateTableSql(database), database);
        }

        executeDropAndCreateTable(database: string= "data") {
            executeSql(this.emitDropAndCreateTableSql(database), database);
        }

        copyDataAsync(sourceDatabase, destDatabase: string, showProgress: JQuery) {
            var isRunning = false;
            var offset = 0;
            var limit = 500;

            var interval = setInterval(() => {
                console.log("interval");
                if (isRunning)
                    return;
                isRunning = true;
                if (!this.copyPartialDataAsync(sourceDatabase, destDatabase, limit, offset, showProgress)) {
                    // закончились записи
                    clearInterval(interval);
                    isRunning = false;
                }
                else {
                    //продолжаем
                    offset += limit;
                    isRunning = false;
                }
            }, 1);


        }

        copyPartialDataAsync(sourceDatabase, destDatabase: string, limit: number, offset: number, showProgress: JQuery): boolean {

            var sql = new StringBuilder();
            sql.appendLine("SELECT");
            this.columns.map((col) => {
                sql.appendLine("  " + col.emitColumnNameSql(sourceDatabase) + ",");
            })
            sql.removeLastChar(2);
            sql.appendLine();
            sql.appendLine("FROM " + this.emitTableNameSql(sourceDatabase) + " ORDER BY " + this.primaryKey.emitColumnNameSql(sourceDatabase) + " " + this.emitLimitOffsetSql(limit, offset, sourceDatabase));


            var ds = executeSql(sql.toString(), sourceDatabase);
            if (ds.tables[0].rows.length == 0)
                return false;

            sql.clear();
            sql.append("INSERT INTO " + this.emitTableNameSql(destDatabase) + "(");
            this.columns.map((col) => {
                sql.append(col.emitColumnNameSql(destDatabase) + ",");
            })
            sql.removeLastChar(1);
            sql.append(") VALUES(");
            var insertStr = sql.toString();

            sql.clear();
            ds.tables[0].rows.map((row) => {
                sql.append(insertStr);
                this.columns.map((col) => {
                    sql.append(row[col.name].toSql(destDatabase) + ",");
                })
                sql.removeLastChar(1);
                sql.appendLine(");");
            });
            executeSql(sql.toString(), destDatabase);
            showProgress.text("records=" + (offset + limit).toString());
            return true;

        }

        //get columnsNg() {
        //    var ret = [];

        //    this.$.find("columns>column").each((index, element) => {
        //        ret.push(this.getColumnModel($(element)));
        //    });
        //    return ret;
        //}

        //getColumnModel(col: JQuery): any {
        //    var obj: any = { $: col };

        //    //var x = eval("new Buhta." + col.attr("data-type") + "DataType(col)");

        //    obj.getDataTypeObj = (): SqlDataType=> {
        //        return eval("new Buhta." + obj.dataType + "DataType(col)");
        //    };

        //    SchemaTable.columnAttrs.each((_attr) => {
        //        var propName = _attr.camelize(false);
        //        obj[propName] = col.attr(_attr);
        //    });

        //    obj["__saveChanges"] = () => {
        //        SchemaTable.columnAttrs.each((_attr) => {
        //            var propName = _attr.camelize(false);
        //            col.attr(_attr, obj[propName]);
        //        });
        //    }

        //    obj["__isChanged"] = () => {
        //        var result = false;
        //        SchemaTable.columnAttrs.each((_attr) => {
        //            var propName = _attr.camelize(false);
        //            if (col.attr(_attr) != obj[propName])
        //                result = true;
        //        });
        //        return result;
        //    }

        //    return obj;
        //}

    }


} 