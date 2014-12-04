/// <reference path="../../Utils.ts" />
/// <reference path="../SchemaObject.ts" />

module BuhtaCore {

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


} 