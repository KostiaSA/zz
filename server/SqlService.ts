/**
 * Created by user on 02.12.2014.3333333
 */

/// <reference path="DesignerServiceApi.ts" />

module SqlService {

    var logErrorsToConsole=true;

    class SqlWork {
        database:string;
        sql:Array<string>;
        sqlDoneIndex:number;
        sqlRunning:boolean;
        result:string;
        resultDataset:{};
        resultTimeMs:number;
    }

    class Database {
        name:string;
        isSchema:boolean;
        dbms:string;
        server:string;
        port:string;
        database:string;
        login:string;
        password:string;
    }

    var databases:Database[] = [];

    var msSqlDriver:any;
    var pgSqlDriver:any;

    var app;

    function msSqlExecute(work:SqlWork, doneHandler:any) {

        if (!databases[work.database]) {
            work.result = "msSqlExecute: не найдена база данных '" + work.database + "'";
            doneHandler();
            return;
        }
        var db = databases[work.database];
        var config = {
            user: db.login,
            password: db.password,
            server: db.server, // You can use 'localhost\\instance' to connect to named instance
            database: db.database,
            port: db.port
        };

        msSqlDriver.connect(config, function (/*err*/) {
            // ... error checks


            var recordset = {tables: []};
            var curr_table;
            //var rowIndex = 0;
            var startTime:any = new Date();
            var bigIntCols;

            var request = new msSqlDriver.Request();
            request.stream = true; // You can set streaming differently for each request

            var connSetup:string = "";
            connSetup += "set textsize 2147483647;";
            connSetup += "set quoted_identifier on;";
            connSetup += "set arithabort on;";
            connSetup += "set numeric_roundabort on;";
            connSetup += "set ansi_warnings on;";
            connSetup += "set ansi_padding on;";
            connSetup += "set ansi_nulls on;"; // не изменять, в будущих версиях sql всегда будет on
            connSetup += "set concat_null_yields_null on;"; // не изменять, в будущих версиях sql всегда будет on
            connSetup += "set cursor_close_on_commit off;";
            connSetup += "set implicit_transactions off;";
            connSetup += "set language us_english;";
            connSetup += "set dateformat ymd;";
            connSetup += "set datefirst 1;";
            connSetup += "set transaction isolation level read committed;";
            connSetup += "set xact_abort on;";
            connSetup += "SET ANSI_WARNINGS OFF;";
            connSetup += "SET NOCOUNT ON;";
            connSetup += "SET ANSI_NULL_DFLT_ON ON;";


            request.on('recordset', function (columns:Array<any>) {
                // Emitted once for each recordset in a query
                //console.log('recordset', columns.length);
                var cols = [];
                bigIntCols = undefined;
                for (var i in columns) {
                    cols.push({name: i.toString(), dataType: columns[i].type.declaration});

                    // исправляется глюк, когда bigint приходит как строка
                    if (columns[i].type.declaration == "int" && columns[i].length == 8) {
                        if (!bigIntCols)
                            bigIntCols = {};
                        bigIntCols[i.toString()] = true;
                    }
                }
                curr_table = {columns: cols, rows: []};
                recordset.tables.push(curr_table);
            });

            request.on('row', function (row) {
                // исправляется глюк, когда bigint приходит как строка
                if (bigIntCols) {
                    for (var colName in bigIntCols) {
                        row[colName] = parseInt(row[colName]);
                    }
                }
                curr_table.rows.push(row);

                //var curr_row = { value: [] };
                //curr_table.rows.push(curr_row);
                //for (var i in row) {
                //    curr_row.value.push(row[i]);
                //}
            });

            request.on('error', function (err) {
                // May be emitted multiple times
                if (logErrorsToConsole) {
                    console.log('mssql query error 1: ', err.message,";\n",work.sql.join(";\n"));
                    //console.log(work.sql.join(";\n"));
                }
                work.result = err.message;
                doneHandler();
            });

            request.on('done', function (/*returnValue*/) {
                // Always emitted as the last one
                if (work.result != "error") {
                    work.result = "Ok";
                    work.resultDataset = recordset;
                }
                work.resultTimeMs = <any>(new Date()) - startTime;
                doneHandler();
                console.log('mssql query ok!', work.resultTimeMs, 'ms');
                //response.send({ result: 'ok', recordset: recordset });
            });

            request.query(connSetup + "\n" + work.sql.join(";\n")); // or request.execute(procedure);
        });

    }

    function pgSqlExecute(work:SqlWork, doneHandler:any) {
        var database = databases[work.database];
        var conString = "postgres://" + database.login + ":" + database.password + "@" + database.server + ":" + database.port + "/" + database.database;

        pgSqlDriver.connect(conString, function (err, client, done) {
            if (err) {
                work.result = 'postgersql connect error: ' + err;
                console.error(work.result);
                doneHandler();
                return;
            }
            var startTime:any = new Date();

            var recordset = {tables: []};
            work.sqlDoneIndex = -1;
            work.sqlRunning = false;

            var interval = setInterval(() => {
                if (work.sqlRunning)
                    return;

                if (work.sqlDoneIndex >= work.sql.length - 1) {

                    //call `done()` to release the client back to the pool
                    done();

                    work.resultDataset = recordset;
                    work.resultTimeMs = <any>(new Date()) - startTime;
                    doneHandler();
                    clearInterval(interval);
                    console.log('pgsql query ok!', work.resultTimeMs, 'ms');
                    //return;
                }
                else {
                    work.sqlRunning = true;
                    client.query(work.sql[work.sqlDoneIndex + 1], [], function (err, result) {
                        if (err) {
                            work.result = 'postgersql query error: ' + err;
                            if (logErrorsToConsole) {
                                console.log(work.result);
                                console.log(work.sql[work.sqlDoneIndex + 1]);
                            }
                            console.error(work.result);
                            //doneHandler();
                            work.sqlDoneIndex = 1000000000;
                            work.sqlRunning = false;
                            return;
                        }

                        var curr_table;
                        var cols = [];

                        result.fields.map((f) => {
                            var col = {name: f.name, dataType: "string"};
                            if ([1082].indexOf(f.dataTypeID) > -1)
                                col.dataType = "date";
                            else if ([1114, 1184, 1186].indexOf(f.dataTypeID) > -1)
                                col.dataType = "datetime";
                            else if ([1083, 1266].indexOf(f.dataTypeID) > -1)
                                col.dataType = "time";
                            else if ([2950].indexOf(f.dataTypeID) > -1)
                                col.dataType = "uniqueidentifier";
                            cols.push(col);
                            return f;
                        });

                        curr_table = {columns: cols, rows: []};
                        recordset.tables.push(curr_table);
                        curr_table.rows = result.rows;

                        //result.rows.map((r) => {
                        //    var curr_row = { value: [] };
                        //    curr_table.rows.push(curr_row);
                        //    for (var i in r) {
                        //        curr_row.value.push(r[i]);
                        //    }
                        //    return r;
                        //});

                        work.result = "Ok";
                        work.sqlDoneIndex++;
                        work.sqlRunning = false;
                        //return;
                    });
                }
            }, 1);


        });
    }

    function post(request, response) {
        var work:SqlWork = new SqlWork();
        work.database = request.body.database;
        work.sql = request.body.sql;

        var database = databases[work.database];
        if (!database) {
            var responseJson = {
                result: "error",
                error: "не найдена база данных '" + work.database + "'"
            };
            response.send(responseJson);
        }
        else if (database.dbms == "mssql") {
            msSqlExecute(work, () => {
                var responseJson = {
                    dataset: work.resultDataset,
                    result: work.result,
                    error: ""
                };
                if (work.result != "Ok") {
                    responseJson.result = "error";
                    responseJson.error = work.result;
                }
                response.send(responseJson);
            });
        }
        else if (database.dbms == "pgsql") {
            pgSqlExecute(work, () => {
                var responseJson = {
                    dataset: work.resultDataset,
                    result: work.result,
                    error: ""
                };
                if (work.result != "Ok") {
                    responseJson.result = "error";
                    responseJson.error = work.result;
                }
                response.send(responseJson);
            });
        }
        else {
            var responseJson = {
                result: "error",
                error: "неизвестный тип базы данных '" + database.dbms + "'"
            };
            response.send(responseJson);
        }
    }

    export function start(_app:any) {
        app = _app;
        msSqlDriver = require('mssql');
        msSqlDriver.map.register(Number, msSqlDriver.BigInt);

        pgSqlDriver = require('pg');
        require('pg-parse-float')(pgSqlDriver);

        pgSqlDriver.types.setTypeParser(20, 'text', parseFloat); // иначе bigint возвращается как string

        app.post('/sql', post);

    }


    databases["schema"] = {
        name: "schema",
        dbms: "mssql",
        //server: '5.19.239.191',
        //port: '64754',
        server: '192.168.0.133',
        port: '1433',
        database: 'Buhta4',
        login: 'sa1',
        password: 'sonyk'
    };

    databases["data"] = {
        name: "data",
        dbms: "mssql",
        //server: '5.19.239.191',
        //port: '64754',
        server: '192.168.0.133',
        port: '1433',
        database: 'sunerja',
        login: 'sa1',
        password: 'sonyk'
    };

    databases["sunerja"] = {
        name: "sunerja",
        dbms: "mssql",
        //server: '5.19.239.191',
        //port: '64754',
        server: '192.168.0.133',
        port: '1433',
        database: 'sunerja',
        login: 'sa1',
        password: 'sonyk'
    };

    databases["schema-pg"] = {
        name: "schema-pg",
        dbms: "pgsql",
        server: '192.168.0.49',
        port: '5432',
        database: 'BuhtaTest',
        login: 'kostia',
        password: 'sonyk'
    };

    databases["data-pg"] = {
        name: "schema-pg",
        dbms: "pgsql",
        server: '192.168.0.49',
        port: '5432',
        database: 'BuhtaTest',
        login: 'kostia',
        password: 'sonyk'
    };

    databases["sunerja-pg"] = {
        name: "sunerja-pg",
        dbms: "pgsql",
        server: '192.168.0.49',
        //server: '5.19.239.191',
        port: '5432',
        database: 'sunerja',
        login: 'postgres',
        password: 'sonyk'
    };

    databases["test-ms"] = {
        name: "test",
        dbms: "mssql",
        server: '192.168.0.133',
        port: '1433',
        database: 'test',
        login: 'sa1',
        password: 'sonyk'
    };

    databases["test-pg"] = {
        name: "test-pg",
        dbms: "pgsql",
        server: '192.168.0.49',
        port: '5432',
        database: 'test',
        login: 'postgres',
        password: 'sonyk'
    };

// все это для дома 307
//    databases["schema"].server = '5.19.239.191';
//    databases["schema"].port = '64754';
//    databases["sunerja"].server = '5.19.239.191';
//    databases["sunerja"].port = '64754';
//    databases["data"].server = '5.19.239.191';
//    databases["data"].port = '64754';
//    databases["schema-pg"].server = '5.19.239.191';
//    databases["schema-pg"].server = '5.19.239.191';
//    databases["sunerja-pg"].server = '5.19.239.191';
//    databases["test-ms"].server = '5.19.239.191';
//    databases["test-ms"].port = '64754';
//    databases["test-pg"].server = '5.19.239.191';


// дата в postgreSql
//databases["data"] = {
//    name: "data",
//    dbms: "pgsql",
//    server: '192.168.0.49',
//    port: '5432',
//    database: 'sunerja',
//    login: 'postgres',
//    password: 'sonyk'
//}

// схема в postgreSql
//    databases["schema"] = {
//        name: "schema",
//        dbms: "pgsql",
//        server: '5.19.239.191',
//        port: '5432',
//        database: 'schema',
//        login: 'postgres',
//        password: 'sonyk'
//    }
}


/* коды postgrSql
 Bool        - > 16
 ByteA       - > 17
 Char        - > 18
 Name        - > 19
 Int8        - > 20
 Int2        - > 21
 Int4        - > 23
 RegProc     - > 24
 Text        - > 25
 Oid         - > 26
 Tid         - > 27
 Xid         - > 28
 Cid         - > 29
 Xml         - > 142
 Point       - > 600
 LSeg        - > 601
 Path        - > 602
 Box         - > 603
 Polygon     - > 604
 Line        - > 628
 Cidr        - > 650
 Float4      - > 700
 Float8      - > 701
 AbsTime     - > 702
 RelTime     - > 703
 TInterval   - > 704
 Unknown     - > 705
 Circle      - > 718
 Money       - > 790
 MacAddr     - > 829
 Inet        - > 869
 BpChar      - > 1042
 VarChar     - > 1043
 Date        - > 1082
 Time        - > 1083
 Timestamp   - > 1114
 TimestampTZ - > 1184
 Interval    - > 1186
 TimeTZ      - > 1266
 Bit         - > 1560
 VarBit      - > 1562
 Numeric     - > 1700
 RefCursor   - > 1790
 Record      - > 2249
 Void        - > 2278
 UUID        - > 2950
 */
