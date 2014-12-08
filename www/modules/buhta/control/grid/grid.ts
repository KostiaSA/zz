/**
 * Created by Kostia on 05.12.2014.
 */
/// <reference path="../../../../lib/lib.ts" />

module BuhtaControl {
    declare var Slick:any;
    export class Grid extends Control {

        constructor() {
            super();
            this.template = "modules/buhta/control/grid/grid.html";
        }

        getRootTag():string {
            return "div";
        }

        afterRender() {
            super.afterRender();
        }

        columns:Array<GridColumn> = [];
        nativeSlickGrid:any;
        data:string;
        sql:string;
        slickGridElement:JQuery;
        runtimeData:any;
        keyField:string;
        parentField:string;

        get isTreeMode():boolean {
            if (this.parentField)
                return true;
            else
                return false;
        }

        private createSlickGridCols():Array<any> {
            var cols = this.columns.map((column, index) => {
                return column.createNativeCol(index);
            });
            return cols;
        }


        private rowIndexByKey:any;
        private rowParentByKey:any;

        private getNodeLevelByKey(key:any):number {
            var level = 0;
            var parentKey = this.rowParentByKey[key];
            while (parentKey) {
                level++;
                parentKey = this.rowParentByKey[parentKey];
            }
            return level;
        }

        private getIsNodeCollapsedByParent(nodeKey:any):boolean {
            if (!this.isTreeMode)
                return false;
            //var row = this.runtimeData[this.rowIndexByKey[key]];
            //if (row.__collapsed__)
            //    return true;
            var parentKey = this.rowParentByKey[nodeKey];
            while (parentKey) {
                var row = this.runtimeData[this.rowIndexByKey[parentKey]];
                if (row.__collapsed__)
                    return true;
                parentKey = this.rowParentByKey[parentKey];
            }
            return false;
        }

        private evalData():any {
            if (this.data)
                this.runtimeData = this.scope.$eval(this.data);
            else if (this.sql) {
                var sql = BuhtaCore.processTemplate(this.sql, this.scope);
                var ds = BuhtaCore.executeSql(sql);
                if (ds.tables.length == 0)
                    throw "zz-grid: sql-запрос не возвращает результат (не содержит SELECT)";
                this.runtimeData = ds.tables[0].rows;
                if (this.columns.length == 0)
                    this.autoCreateColumns();
            }
            else
                throw "zz-grid: не заполнены 'sql' или 'data'";

            if (this.parentField) {
                if (!this.keyField)
                    throw "zz-grid: не заполнен 'key' для режима 'TreeList'";
                this.rowIndexByKey = {};
                this.rowParentByKey = {};
                this.runtimeData.map((row, index) => {
                    this.rowIndexByKey[row[this.keyField]] = index;
                    this.rowParentByKey[row[this.keyField]] = row[this.parentField];
                    row["__haschildren__"] = false;
                    row["__collapsed__"] = true;
                });
                this.runtimeData.map((row, index) => {
                    row["__level__"] = this.getNodeLevelByKey(row[this.keyField]);

                    if (this.rowParentByKey[row[this.keyField]])
                        this.runtimeData[this.rowIndexByKey[this.rowParentByKey[row[this.keyField]]]]["__haschildren__"] = true;
                });
            }

            return this.runtimeData;
        }

        private autoCreateColumns() {
            if (this.runtimeData.getClassName() == "DataTable") {
                var table = <BuhtaCore.DataTable>(this.runtimeData);
                this.columns = table.columns.map((tableCol) => {
                    var zzcol = new GridColumn(this);
                    zzcol.title = tableCol.Name;
                    zzcol.field = tableCol.Name;
                    zzcol.width = 150;
                    return zzcol;
                });
            }
            else
                throw "ZZ_Grid.autoCreateColumns(): gridData должен быть типа 'DataTable'"
        }

        // в это процедуре не работает this, передаем zz-grid через args
        private myFilter(item, grid) {
            //if (item["percentComplete"] < percentCompleteThreshold) {
            //    return false;
            //}
            //if (searchString != "" && item["title"].indexOf(searchString) == -1) {
            //    return false;
            //}
            if (grid.isTreeMode) {
                if (grid.getIsNodeCollapsedByParent(item[grid.keyField]))
                    return false;
            }
            return true;
        }

        createNativeSlickGrid() {

            var options = {
                enableCellNavigation: true,
                enableColumnReorder: true,
                forceSyncScrolling: true,
                fullWidthRows: false,
                syncColumnCellResize: true
                //headerRowHeight: 35,
                //topPanelHeight:35,
                //forceFitColumns: true
            };
            this.evalData();
            var rows:any;
            if (this.runtimeData.getClassName() == "DataTable")
                rows = this.runtimeData;
            else
                rows = this.runtimeData;

            // добавляем уникальный id
            if (rows.length > 0 && !rows[0]["__id__"]) {
                rows.map((row, index) => {
                    row["__id__"] = index;
                });
            }

            var dataView = new Slick.Data.DataView({inlineFilters: true});
            this.nativeSlickGrid = new Slick.Grid(this["slickGridElement"], dataView, this.createSlickGridCols(), options);
            //this.element.bind('destroyed', function () {
            //    this.nativeSlickGrid = undefined;
            //})
            //this.nativeSlickGrid.setSelectionModel(new Slick.CellSelectionModel());

            dataView.grid = this.nativeSlickGrid;
            dataView.beginUpdate();
            dataView.setItems(rows, ["__id__"]);
            dataView.setFilter(this.myFilter);
            dataView.setFilterArgs(this);
            dataView.endUpdate();

            this.nativeSlickGrid.onClick.subscribe(function (e, args) {
                if ($(e.target).hasClass("toggle")) {
                    var item = dataView.getItem(args.row);
                    if (item) {
                        if (!item.__collapsed__) {
                            item.__collapsed__ = true;
                        } else {
                            item.__collapsed__ = false;
                        }
                        dataView.updateItem(item.__id__, item);
                    }
                    e.stopImmediatePropagation();
                }
            });

            // wire up model events to drive the grid
            dataView.onRowCountChanged.subscribe(function (e, args) {
                this.grid.updateRowCount();
                this.grid.render();
            });

            dataView.onRowsChanged.subscribe(function (e, args) {
                this.grid.invalidateRows(args.rows);
                this.grid.render();
            });


        }

        refreshColumns() {
            //cols.
        }

        insertActionClick() {
            alert("insertActionClick!");
        }

        updateActionClick() {
            alert("updateActionClick!");
        }

        //constructor(_element: JQuery, _scope: ng.IScope, _compile: ng.ICompileService) {
        //    super(_element, _scope, _compile);
        //    _element.addClass("zz-grid");
        //}

        renderChildrenFrom(from:JQuery, to?:JQuery) {
            if (!to)
                to = this.$;
            for (var i = 0; i < from.children().length; i++) {
                var child = $(from.children()[i]);
                var childTag = child.prop("tagName").toLowerCase();

                if (childTag == "slickgrid-placeholder") {
                    ?
                }
                else {
                    var childControl:Control;
                    if (!registeredTags[childTag]) {
                        if (childTag.indexOf("-") > -1)
                            throw "неизвестный tag '" + childTag + "'";
                        else
                            childControl = new Control();
                    }
                    else
                        childControl = new registeredTags[childTag]();
                    childControl.sourceJ = child;
                    childControl.renderTo(to);
                }
            }

        }

    }

    registeredTags["grid"] = Grid;

}