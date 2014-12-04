/**
 * Created by user on 02.12.2014.3333333
 */

/// <reference path="DesignerServiceApi.ts" />

module DesignerService {

    class DesignerWork {
        database:string;
        sql:Array<string>;
        sqlDoneIndex:number;
        sqlRunning:boolean;
        result:string;
        resultTimeMs:number;
    }

//    var app;

    var cmd = [];

    cmd[DesignerCmd.GetAppDirTree] = function (request:BaseDesignerRequest, response) {
        var req = <GetAppDirTreeDesignerRequest>request;
        var resp = new GetAppDirTreeDesignerResponse();
        resp.result = DesignerResult.Ok;
        resp.dirtree = {дерево: "это оно"};

        var fs = require('fs');
        var walk = function (dir, tree, done) {
            var results = [];
            fs.readdir(dir, function (err, list) {
                if (err) return done(err);
                var i = 0;
                (function next() {
                    var file = list[i++];
                    if (!file) return done(null, results);
                    var fileObject:any = {name: file, list: []};
                    file = dir + '/' + file;
                    fileObject.path=file;
                    tree.list.push(fileObject);
                    fs.stat(file, function (err, stat) {
                        fileObject.isDir=stat && stat.isDirectory();
                        if (stat && stat.isDirectory()) {
                            walk(file, fileObject, function (err, tree, res) {
                                results = results.concat(res);
                                next();
                            });
                        } else {
                            results.push(file);
                            next();
                        }
                    });
                })();
            });
        };

        var root = {name: "root", isDir: true, list: []};

        walk("c:/zz-app", root, function (err, results) {
            if (err) throw err;
            console.log(results);
            resp.dirtree=root;
            response.send(resp);
        });

    }


    function post(request, response) {
        var req = <BaseDesignerRequest>request.body;
        cmd[DesignerCmd.GetAppDirTree](req, response);

        //var responseJson = new BaseDesignerResponse();
        //responseJson.result = DesignerResult.Error;
        //responseJson.error = "не найдена";
        //
        //response.send(responseJson);
    }

    export function start(_app:any) {
        //app = _app;
        _app.post('/designer', post);
    }


}