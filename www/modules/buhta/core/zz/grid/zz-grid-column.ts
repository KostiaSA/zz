
/// <reference path="../../../../../lib/lib.ts" />
/// <reference path="zz-grid.ts" />
/// <reference path="../zz.ts" />

module BuhtaCore {

    //export interface I_ZZ {
    //    grid?: ZZ_Grid;
    //    insertActionClick? ();
    //    updateActionClick? ();
    //}

    export class ZZ_GridColumn {
        title: string;
        field: string;
        width: number;
        eval: string;
        style: string;

        constructor(public grid: ZZ_Grid) {
            grid.columns.push(this);
        }

        createNativeCol(index: number): any {
            var col: any = {};
            col.id = "col" + index;
            col.name = this.title;
            col.field = this.field;
            col.width = this.width;
            col.rerenderOnResize = true;

            var js = "";
            js += "(function x(rowIndex, colIndex, field, column, row){";
            js += "  var span='';";
            js += "  span+='<span';";

            if (index == 0 && this.grid.isTreeMode) {
                js += "    if (row[\"__collapsed__\"]) {";
                js += "        span += \" class='collapsed tree-column' \";";
                js += "    } else {";
                js += "        span += \" class='expanded tree-column' \";";
                js += "    }";
            }

            if (index > 0 && this.grid.isTreeMode) {
                js += "    if (row[\"__collapsed__\"]) {";
                js += "        span += \" class='collapsed' \";";
                js += "    } else {";
                js += "        span += \" class='expanded' \";";
                js += "    }";
            }

            if (this.style) {
                js += "  span+=' style=\"";
                js += this.style;
                js += ";\"';";
            }

            js += "  span+='>';";

            if (index == 0 && this.grid.isTreeMode) {
                js += "span+=\"<span style='display:inline-block;height:1px;width:\" + (10 * row[\"__level__\"]) + \"px'></span>\";";

                js += "if (row[\"__haschildren__\"]) {";
                js += "    if (row[\"__collapsed__\"]) {";
                js +="        span += \"<span class='toggle expand' ></span>&nbsp;\";";
                js += "    } else {";
                js +="        span += \"<span class='toggle collapse' ></span>&nbsp;\";";
                js += "    }";
                js += "}";
                js += "else {";
                js +="    span += \"<span class='toggle'></span>&nbsp;\";";
                js += "}";
            }


            js += "  try {";
            js += "  span+=(function y(rowIndex, colIndex, field, column, row){";
            if (this.eval)
                js += this.eval;
            else
                if (this.field)
                    js += " return row[\"" + this.field + "\"];";
                else
                    js += " return '?нет field или eval';";

            js += "}).call(this,rowIndex, colIndex, field, column, row);";
            js += " } catch(e) { span+='<span style=\"color:red\">ошибка eval:'+e.message+'</span>'; }";
            js += "  span+='</span>';";
            js += " return span;})";
            //console.log(js);
            try {
                col.formatter = eval(js);
            }
            catch (e) {
                col.formatter = (function y(rowIndex, colIndex, field, column, row) { return "<span style='color:red'>ошибка eval:" + e.message + "</span>" });
            }

            return col;
        }


    }
}