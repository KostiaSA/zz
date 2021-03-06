﻿/// <reference path="../../../lib/lib.ts" />
// <reference path="CoreDataTypes/DateOnly.ts" />
// <reference path="coredatatypes/datetime.ts" />
// <reference path="coredatatypes/guid.ts" />
// <reference path="coredatatypes/time.ts" />
// <reference path="sql/sql.ts" />
/// <reference path="app.ts" />


module BuhtaCore {

    //export function randomString(length) {
    //    var result = '';
    //    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    //    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    //    return result;
    //}

    export function processTemplate(template: string, context: any): string {
        return Handlebars.compile(template)(context);
    }

    export function notifySuccess(msg: string) {
        (<any>$).notify(msg, { className: 'success', showDuration: 300 });
    }

    export function notifyError(msg: string) {
        (<any>$).notify(msg, { className: 'error', showDuration: 300 });
    }

    export function notifyInfo(msg: string) {
        (<any>$).notify(msg, { className: 'info', showDuration: 300 });
    }

    export function notifyWarn(msg: string) {
        (<any>$).notify(msg, { className: 'warn', showDuration: 300 });
    }

    //export function replaceSql(sql, token, value, ...tokneAndValue) {
    //    var ret = sql;
    //    alert(ret);
    //    for (var i = 0; i < arguments.length; i += 2) {
    //        ret = ret.replace(new RegExp("{{" + arguments[i] + "}}", 'g'), arguments[i + 1] === null ? 'NULL' : arguments[i + 1].toSql(this.database));
    //    }
    //    alert(ret);
    //    return ret;
    //};

    //export function getClassName1(obj: any) { //*
    //    var funcNameRegex = /function (.{1,})\(/;
    //    var results = (funcNameRegex).exec(obj.constructor.toString());
    //    return (results && results.length > 1) ? results[1] : "";
    //};


    export function isElementReallyVisible(element: JQuery): boolean {
        return (<any>element[0]).isVisible(element[0]);
    }

    export function getNearElement(element: JQuery, selector: string): JQuery {
        var parent = element.parent();
        while (parent.length > 0) {
            var grids = parent.find(selector);
            if (grids.length > 0)
                return grids.first();
            else
                parent = parent.parent();
        }
        return parent; // пустой список
    }

    export class StringBuilder {
        _array = [];
        _index = 0;

        append(str: string): void {
            this._array[this._index] = str;
            this._index++;
        }

        appendLine(str?: string): void {
            if (str)
                this._array[this._index] = str + '\n';
            else
                this._array[this._index] = '\n';
            this._index++;
        }

        removeLastChar(count: number= 1): void {
            var str: string = this.toString();
            this._array = [];
            this._array[0] = str.substring(0, str.length - count);
            this._index = 1;
        }

        toString() {
            return this._array.join('');
        }

        get length(): number {
            return this.toString().length;
        }

        clear() {
            this._array = [];
            this._index = 0;
        }
    }

    export function assert(condition, message) {
        if (!condition) {
            throw message || "Assertion failed";
        }
    }

    window.onerror = function (message: any, uri: string, lineNumber: number, columnNumber?: number): void {
        var extra = !columnNumber ? '' : '\ncolumn: ' + columnNumber;
        //extra += !error ? '' : '\nerror: ' + error;
        alert("Error: " + message + "\nurl: " + uri + "\nline: " + lineNumber + extra);
        var suppressErrorAlert = false;
        //return suppressErrorAlert;
    };


    export function defineAttrProperty(obj: any, attrName: string) {
        var propName = "attr_" + attrName.camelize(false);
        Object.defineProperty(obj, propName, {
            get: function () { return obj.$.attr(attrName); },
            set: function (newValue) { obj.$.attr(attrName, newValue); },
            enumerable: true,
            configurable: true
        });
    }

    export function defineAttrProperties(obj: JQuery) {
        defineAttrProperty(obj, 'style');
    }

    export function unCamelize(text: string, separator?) {

        // Assume separator is - if no one has been provided.
        if (!separator) {
            separator = "-";
        }

        // Replace all capital letters by separator followed by lowercase one
        var text = text.replace(/[A-Z]/g, function (letter) {
            return separator + letter.toLowerCase();
        });

        // Remove first separator (to avoid _hello_world name)
        if (text[0] == separator)
            text = text.substring(1);
        return text;

    }

    export function loadHtmlAsAstring(path: string): string {
        var str: string;
        $.ajax({
            url: path,
            async: false,
            success: function (result) {
                str = result;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                throw jqXHR.responseText;
            }
        });
        return str;
    }


    Object.defineProperty(Object.prototype, "getClassName", {
        value: function () {
            var funcNameRegex = /function (.{1,})\(/;
            var results = (funcNameRegex).exec((this).constructor.toString());
            return (results && results.length > 1) ? results[1] : "";
        },
        enumerable: false
    });

    (<any>String.prototype).toSql = function (database: string= "data") {
        if (dbms[database] == "mssql")
            return "N'" + this.replace(/'/g, "''") + "'";  // N для правильных unicode-строк
        else
            if (dbms[database] == "pgsql")
                return "'" + this.replace(/'/g, "''") + "'";
            else
                throw "String.toSql(): неизвестный тип базы данных '" + dbms[database] + "'";
    };

    (<any>Number.prototype).toSql = function () {
        return this.toString();
    };

    (<any>Boolean.prototype).toSql = function () {
        return this == true ? "'1'" : "'0'";
    };

    (<any>Date.prototype).toSql = function () {
//        return "'" + this.toISOString().replace("T", " ") + "'";
        return new DateTime(this).toSql();
    };

    //$.fn.textWidth = function (text, font) {
    //    if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
    //    $.fn.textWidth.fakeEl.text(text || this.val() || this.text()).css('font', font || this.css('font'));
    //    return $.fn.textWidth.fakeEl.width();
    //};
}

interface Number {
    toSql(database?: string): string;
}
interface String {
    toSql(database?: string): string;
}
interface Boolean {
    toSql(database?: string): string;
}
interface Date {
    toSql(database?: string): string;
    format(format: string): string;
}

//// thanks to Sunasara Imdadhusen
//// http://www.codeproject.com/Articles/773356/Date-and-Time-formatting-in-JavaScript-like-Net-Cs

////"d" 	The day of the month, from 1 through 31.	5 / 1 / 2014 1:45:30 PM 	1
////"dd"	The day of the month, from 01 through 31. 	5 / 1 / 2014 1:45:30 PM	01
////"ddd"	The abbreviated name of the day of the week.5 / 15 / 2014 1:45:30 PM	Thu
////"dddd"	The full name of the day of the week.5 / 15 / 2014 1:45:30 PM	Thursday
////"f"	The tenths of a second in a date and time value.5 / 15 / 2014 13:45:30.617	6
////"ff"	The hundredths of a second in a date and time value 	5 / 15 / 2014 13:45:30.617	61
////"fff"	The milliseconds in a date and time value.5 / 15 / 2014 13:45:30.617	617
////"F"	If non - zero, the tenths of a second in a date and time value.5 / 15 / 2014 13:45:30.617	6
////"FF" 	If non - zero, the hundredths of a second in a date and time value.5 / 15 / 2014 13:45:30.617	61
////"FFF"	If non - zero, the milliseconds in a date and time value.5 / 15 / 2014 13:45:30.617	617
////"h"	The hour, using a 12 - hour clock from 1 to 12. 	5 / 15 / 2014 1:45:30 AM	1
////"hh"	The hour, using a 12 - hour clock from 01 to 12. 	5 / 15 / 2014 1:45:30 AM	01
////"H"	The hour, using a 24 - hour clock from 0 to 23. 	5 / 15 / 2014 1:45:30 AM	1
////"HH"	The hour, using a 24 - hour clock from 00 to 23. 	5 / 15 / 2014 1:45:30 AM	01
////"m"	The minute, from 0 through 59. 	5 / 15 / 2014 1:09:30 AM	9
////"mm"	The minute, from 00 through 59. 	5 / 15 / 2014 1:09:30 AM	09
////"M"	The month, from 1 through 12. 	5 / 15 / 2014 1:45:30 PM	6
////"MM"	The month, from 01 through 12. 	5 / 15 / 2014 1:45:30 PM	06
////"MMM"	The abbreviated name of the month.6 / 15 / 2014 1:45:30 PM	Jun
////"MMMM"	The full name of the month.6 / 15 / 2014 1:45:30 PM	June
////"s"	The second, from 0 through 59. 	5 / 15 / 2014 1:45:09 PM	9
////"ss"	The second, from 00 through 59. 	5 / 15 / 2014 1:45:09 PM	09
////"t"	The first character of the AM / PM designator.5 / 15 / 2014 1:45:09 PM	P
////"tt"	The AM / PM designator.5 / 15 / 2014 1:45:09 PM	PM
////"y"	The year, from 0 to 99. 	5 / 15 / 2014 1:45:09 PM	9
////"yy"	The year, from 00 to 99. 	5 / 15 / 2014 1:45:09 PM	09
////"yyy"	The year, with a minimum of three digits.5 / 15 / 2009 1:45:30 PM	2009
////"yyyy"	The year as a four - digit number.5 / 15 / 2009 1:45:30 PM	2009
////"yyyyy"	The year as a five - digit number.5 / 15 / 2009 1:45:30 PM	02009
////"z"	Hours offset from UTC, with no leading zeros.5 / 15 / 2014 1:45:30 PM -07:00 - 7
////"zz"	Hours offset from UTC, with a leading zero for a single - digit value.5 / 15 / 2014 1:45:30 PM -07:00 - 07
////"zzz"	Hours and minutes offset from UTC.5 / 15 / 2014 1:45:30 PM -07:00	-07:00
////"st"	Date ordinal(st, nd, rd and th) display from day of the date.5 / 15 / 2014 1:45:30 PM	15th
//var dayNames = ['Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur'];
//var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//Date.prototype.format = function (format) {
//    var wordSplitter = /\W+/, _date = this;
//    this.Date = function (format) {
//        var words = format.split(wordSplitter);
//        words.forEach(function (w) {
//            if (typeof (wordReplacer[w]) === "function") {
//                format = format.replace(w, wordReplacer[w]());
//            }
//            else {
//                wordReplacer['e'](w);
//            }
//        });
//        return format.replace(/\s+(?=\b(?:st|nd|rd|th)\b)/g, "");
//    };
//    var _pad = function (n, c) {
//        if ((n = n + '').length < c) {
//            return new Array((++c) - n.length).join('0') + n;
//        }
//        return n;
//    }
//    var wordReplacer = {
//        //The day of the month, from 1 through 31. (eg. 5/1/2014 1:45:30 PM, Output: 1)
//        d: function (): Date {
//            return _date.getDate();
//        },
//        //The day of the month, from 01 through 31. (eg. 5/1/2014 1:45:30 PM, Output: 01)
//        dd: function () {
//            return _pad(_date.getDate(), 2);
//        },
//        //The abbreviated name of the day of the week. (eg. 5/15/2014 1:45:30 PM, Output: Mon)
//        ddd: function () {
//            return dayNames[_date.getDay()].slice(0, 3);
//        },
//        //The full name of the day of the week. (eg. 5/15/2014 1:45:30 PM, Output: Monday)
//        dddd: function () {
//            return dayNames[_date.getDay()] + 'day';
//        },
//        //The tenths of a second in a date and time value. (eg. 5/15/2014 13:45:30.617, Output: 6)
//        f: function () {
//            return parseInt((_date.getMilliseconds() / 100).toString());
//        },
//        //The hundredths of a second in a date and time value.  (eg. 5/15/2014 13:45:30.617, Output: 61)
//        ff: function () {
//            return parseInt((_date.getMilliseconds() / 10).toString());
//        },
//        //The milliseconds in a date and time value. (eg. 5/15/2014 13:45:30.617, Output: 617)
//        fff: function () {
//            return _date.getMilliseconds();
//        },
//        //If non-zero, The tenths of a second in a date and time value. (eg. 5/15/2014 13:45:30.617, Output: 6)
//        F: function () {
//            return (_date.getMilliseconds() / 100 > 0) ? parseInt((_date.getMilliseconds() / 100).toString()).toString() : '';
//        },
//        //If non-zero, The hundredths of a second in a date and time value.  (eg. 5/15/2014 13:45:30.617, Output: 61)
//        FF: function () {
//            return (_date.getMilliseconds() / 10 > 0) ? parseInt((_date.getMilliseconds() / 10).toString()).toString() : '';
//        },
//        //If non-zero, The milliseconds in a date and time value. (eg. 5/15/2014 13:45:30.617, Output: 617)
//        FFF: function () {
//            return (_date.getMilliseconds() > 0) ? _date.getMilliseconds() : '';
//        },
//        //The hour, using a 12-hour clock from 1 to 12. (eg. 5/15/2014 1:45:30 AM, Output: 1)
//        h: function () {
//            return _date.getHours() % 12 || 12;
//        },
//        //The hour, using a 12-hour clock from 01 to 12. (eg. 5/15/2014 1:45:30 AM, Output: 01)
//        hh: function () {
//            return _pad(_date.getHours() % 12 || 12, 2);
//        },
//        //The hour, using a 24-hour clock from 0 to 23. (eg. 5/15/2014 1:45:30 AM, Output: 1)
//        H: function () {
//            return _date.getHours();
//        },
//        //The hour, using a 24-hour clock from 00 to 23. (eg. 5/15/2014 1:45:30 AM, Output: 01)
//        HH: function () {
//            return _pad(_date.getHours(), 2);
//        },
//        //The minute, from 0 through 59. (eg. 5/15/2014 1:09:30 AM, Output: 9
//        m: function () {
//            return _date.getMinutes()();
//        },
//        //The minute, from 00 through 59. (eg. 5/15/2014 1:09:30 AM, Output: 09
//        mm: function () {
//            return _pad(_date.getMinutes(), 2);
//        },
//        //The month, from 1 through 12. (eg. 5/15/2014 1:45:30 PM, Output: 6
//        M: function () {
//            return _date.getMonth() + 1;
//        },
//        //The month, from 01 through 12. (eg. 5/15/2014 1:45:30 PM, Output: 06
//        MM: function () {
//            return _pad(_date.getMonth() + 1, 2);
//        },
//        //The abbreviated name of the month. (eg. 5/15/2014 1:45:30 PM, Output: Jun
//        MMM: function () {
//            return monthNames[_date.getMonth()].slice(0, 3);
//        },
//        //The full name of the month. (eg. 5/15/2014 1:45:30 PM, Output: June)
//        MMMM: function () {
//            return monthNames[_date.getMonth()];
//        },
//        //The second, from 0 through 59. (eg. 5/15/2014 1:45:09 PM, Output: 9)
//        s: function () {
//            return _date.getSeconds();
//        },
//        //The second, from 00 through 59. (eg. 5/15/2014 1:45:09 PM, Output: 09)
//        ss: function () {
//            return _pad(_date.getSeconds(), 2);
//        },
//        //The first character of the AM/PM designator. (eg. 5/15/2014 1:45:30 PM, Output: P)
//        t: function () {
//            return _date.getHours() >= 12 ? 'P' : 'A';
//        },
//        //The AM/PM designator. (eg. 5/15/2014 1:45:30 PM, Output: PM)
//        tt: function () {
//            return _date.getHours() >= 12 ? 'PM' : 'AM';
//        },
//        //The year, from 0 to 99. (eg. 5/15/2014 1:45:30 PM, Output: 9)
//        y: function () {
//            return Number(_date.getFullYear().toString().substr(2, 2));
//        },
//        //The year, from 00 to 99. (eg. 5/15/2014 1:45:30 PM, Output: 09)
//        yy: function () {
//            return _pad(_date.getFullYear().toString().substr(2, 2), 2);
//        },
//        //The year, with a minimum of three digits. (eg. 5/15/2014 1:45:30 PM, Output: 2009)
//        yyy: function () {
//            var _y = Number(_date.getFullYear().toString().substr(1, 2));
//            return _y > 100 ? _y : _date.getFullYear();
//        },
//        //The year as a four-digit number. (eg. 5/15/2014 1:45:30 PM, Output: 2009)
//        yyyy: function () {
//            return _date.getFullYear();
//        },
//        //The year as a five-digit number. (eg. 5/15/2014 1:45:30 PM, Output: 02009)
//        yyyyy: function () {
//            return _pad(_date.getFullYear(), 5);
//        },
//        //Hours offset from UTC, with no leading zeros. (eg. 5/15/2014 1:45:30 PM -07:00, Output: -7)
//        z: function () {
//            return parseInt((_date.getTimezoneOffset() / 60).toString()); //hourse
//        },
//        //Hours offset from UTC, with a leading zero for a single-digit value. (eg. 5/15/2014 1:45:30 PM -07:00, Output: -07)
//        zz: function () {
//            var _h: any = parseInt((_date.getTimezoneOffset() / 60).toString()); //hourse
//            if (_h < 0) _h = '-' + _pad(Math.abs(_h), 2);
//            return _h;
//        },
//        //Hours and minutes offset from UTC. (eg. 5/15/2014 1:45:30 PM -07:00, Output: -07:00)
//        zzz: function () {
//            var _h = parseInt((_date.getTimezoneOffset() / 60).toString()); //hourse
//            var _m = _date.getTimezoneOffset() - (60 * _h);
//            var _hm = _pad(_h, 2) + ':' + _pad(Math.abs(_m), 2);
//            if (_h < 0) _hm = '-' + _pad(Math.abs(_h), 2) + ':' + _pad(Math.abs(_m), 2);
//            return _hm;
//        },
//        ////Date ordinal display from day of the date. (eg. 5/15/2014 1:45:30 PM, Output: 15th)
//        //st: function () {
//        //    var _day = wordReplacer.d();
//        //    return _day < 4 | _day > 20 && ['st', 'nd', 'rd'][_day % 10 - 1] || 'th';
//        //},
//        e: function (method) {
//            throw 'ERROR: Not supported method [' + method + ']';
//        }
//    };
//    return this.Date(format);
//}

