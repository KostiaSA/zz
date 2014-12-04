/// <reference path="../Utils.ts" />
/// <reference path="../datatypes/DateOnly.ts" />
/// <reference path="../datatypes/DateTime.ts" />
/// <reference path="../datatypes/Time.ts" />
/// <reference path="../datatypes/Guid.ts" />

module BuhtaCore {

    //export class DataRow {
    //    constructor(private row: any, private table: DataTable) {
    //        table.columns.forEach((column, index) => { this[column.Name.toString()] = row.value[index] });
    //    }
    //    [name: string]: any;
    //}

    export class DataColumn {
        constructor(private column: any) {
            //console.log(column);
        }
        get Name(): string {
            return this.column.name;
        }

    }

    export class DataTable {
        constructor(private table: any, private dbms: string) {
            var dateColumns;
            var dateTimeColumns;
            var timeColumns;
            var guidColumns;
            this._columns = [];
            this.table.columns.forEach((column, index) => {
                this._columns[index] = new DataColumn(column);
                if (column.dataType.toLowerCase() == "time") {
                    if (!timeColumns)
                        timeColumns = {};
                    timeColumns[column.name] = true;
                }
                else
                    if (column.dataType.toLowerCase() == "date") {
                        if (!dateColumns)
                            dateColumns = {};
                        dateColumns[column.name] = true;
                        //console.log("column.name:",column.name);

                    }
                    else
                        if (column.dataType.toLowerCase() == "datetime" || column.dataType.toLowerCase() == "datetime2") {
                            if (!dateTimeColumns)
                                dateTimeColumns = {};
                            dateTimeColumns[column.name] = true;
                        }
                        else
                            if (column.dataType.toLowerCase() == "uniqueidentifier") {
                                if (!guidColumns)
                                    guidColumns = {};
                                guidColumns[column.name] = true;
                                //console.log("column.name:",column.name);

                            }
            });

            // конвертируем строковую дату в правильный объект Date
            if (dateColumns) {
                this.table.rows.forEach((row, index) => {
                    for (var colName in dateColumns) {
                        if (!row[colName]) continue;
                        row[colName] = new DateOnly(row[colName].toString());//.replace("T", " ").replace("Z", ""));
                    }
                });
            }

            // конвертируем строковую дату в правильный объект DateTime
            if (dateTimeColumns) {
                var _dbms = this.dbms;
                this.table.rows.forEach((row, index) => {
                    for (var colName in dateTimeColumns) {
                        if (!row[colName]) continue;
                        //if (row[colName].toString().indexOf("-") == -1)
                        //    throw "postgre возвращает только время";  //row[colName] = new DateTime("1970-01-01T" + row[colName] + "Z");  // postgre возвращает только время
                        //else {
                        if (_dbms == "mssql")
                            row[colName] = new DateTime(row[colName].replace("T", " ").replace("Z", ""));
                        else
                            row[colName] = new DateTime(row[colName]);
                        //  }
                    }
                });
            }

            // конвертируем строковый time в правильный объект Time
            if (timeColumns) {
                this.table.rows.forEach((row, index) => {
                    for (var colName in timeColumns) {
                        if (!row[colName]) continue;
                        if (row[colName].toString().indexOf("-") == -1)
                            row[colName] = new Time("1970-01-01 " + row[colName]);  // postgre возвращает только время
                        else {
                            if (_dbms == "mssql")
                                row[colName] = new Time(row[colName].replace("T", " ").replace("Z", ""));
                            else
                                row[colName] = new Time(row[colName]);
                        }
                    }
                });
            }

            // конвертируем строковые Guid в правильный объект Guid
            if (guidColumns) {
                this.table.rows.forEach((row, index) => {
                    for (var colName in guidColumns) {
                        if (!row[colName]) continue;
                        row[colName] = new Guid(row[colName]);
                    }
                });
            }

        }

        private _columns: Array<DataColumn>;
        get columns(): Array<DataColumn> {
            //if (!this._columns) {
            //    this._columns = [];
            //    this.table.columns.forEach((column, index) => { this._columns[index] = new DataColumn(column) });
            //}
            return this._columns;
        }

        //private _rows: Array<any>;
        get rows(): Array<any> {
            return this.table.rows;
            //if (!this._rows) {
            //    this._rows = [];
            //    this.table.rows.forEach((row, index) => { this._rows[index] = new DataRow(row, this) });
            //}
            //return this._rows;
        }
    }

    export class Dataset {
        constructor(private dataset: any, private dbms: string) { }

        private _tables: Array<DataTable>;
        get tables(): Array<DataTable> {
            if (!this._tables) {
                this._tables = [];
                this.dataset.tables.forEach((table, index) => { this._tables[index] = new DataTable(table, this.dbms) });
            }
            return this._tables;
        }

        // для отладки
        appendToHtml(parentEl: JQuery) {
            for (var tableIndex = 0; tableIndex < this.tables.length; tableIndex++) {
                var table = this.tables[tableIndex];
                var tableEl = $("<table style='background-color:white;width: initial;' class='table table-bordered'/>").appendTo(parentEl);
                var headRowEl = $("<tr style='padding-left:8px;'/>").appendTo(tableEl);
                for (var colIndex = 0; colIndex < table.columns.length; colIndex++) {
                    $("<th/>").appendTo(headRowEl).text(table.columns[colIndex].Name);
                }
                for (var rowIndex = 0; rowIndex < table.rows.length; rowIndex++) {
                    var rowEl = $("<tr/>").appendTo(tableEl);
                    for (var colIndex = 0; colIndex < table.columns.length; colIndex++) {
                        $("<td/>").appendTo(rowEl).text(table.rows[rowIndex][table.columns[colIndex].Name]);
                    }
                }
            }
        }
    }

    export function randomString(length) {
        var result = '';
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
    }

    var sqlsession: string = randomString(12);

    //function executeSchemaSqlAsync(sql: string, done?) {
    //    $.ajax({
    //        type: "POST",
    //        url: "sqlservice.asmx/ExecuteSql",
    //        cache: false,
    //        contentType: "application/json; charset=utf-8",
    //        data: JSON.stringify({ sql: sql, session: sqlsession, schema: 1 }),
    //        dataType: "json",
    //        success: function (data, status) {
    //            var response = JSON.parse(data.d);
    //            if (response.result == 'Ok') {
    //                if (done)
    //                    done(response.dataset);
    //            }
    //            else
    //                alert('Ошибка executeSql:\n' + response.error);
    //        },
    //        error: function ajaxFailed(xmlRequest) {
    //            alert(xmlRequest.status + ' \n\r ' +
    //                xmlRequest.statusText + '\n\r' +
    //                xmlRequest.responseText);
    //        }
    //    });

    //}

    export function getBracketSqlName(name: string, dbms: string) {
        if (dbms == "mssql")
            return "\"" + name + "\"";
        else
            if (dbms == "pgsql")
                return "\"" + name + "\"";
            else
                throw "getBracketSqlName(): неизвестный тип базы данных '" + dbms + "'";

    }

    export function executeSql(sql: any, schema: string= "data"): Dataset {
        if (!angular.isArray(sql))
            sql = [sql];

        var response = $.ajax({
            type: "POST",
            url: "sql",
            cache: false,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ sql: sql, session: sqlsession, database: schema }),
            dataType: "json",
            async: false
        });

        if (response.statusText == "OK") {
            var parsed = response.responseJSON;
            if (parsed.result == 'Ok') {
                return new Dataset(parsed.dataset, dbms[schema]);
            }
            else
                throw 'Ошибка executeSql:\n' + parsed.error;

        }
        else
            throw 'Ошибка executeSql:\n' + response.statusText;

    }

    export function getValueFromSql(sql: any, schema: string= "data"): any {
        var ds = executeSql(sql, schema);
        if (ds.tables.length == 0)
            throw "getValueFromSql(): в sql-запросе нет опреатора SELECT";
        else
            if (ds.tables[0].rows.length == 0)
                throw "getValueFromSql(): sql-запрос вернул 0 записей";
            else
                if (ds.tables[0].rows.length > 1)
                    throw "getValueFromSql(): sql-запрос вернул более 1-ой записи";
                else
                    for (var propName in ds.tables[0].rows[0])
                        return ds.tables[0].rows[0][propName];
    }



}