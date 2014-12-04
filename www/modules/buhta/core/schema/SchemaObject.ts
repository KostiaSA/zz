/// <reference path="../../../../lib/lib.ts" />
/// <reference path="../Utils.ts" />

module BuhtaCore {
    export class PropertyDescriptor {
        name:string;
        type:string;
        //toString = (value: any): string => {
        //    if ()
        //}
    }

    export interface IXMLSerializable {
        __properties__: any;
        xmlSerialize(parent:JQuery, objectIds:Array<IXMLSerializable>, rootModuleName:string, propName?:string);
        registerProperties();
        registerProperty(name:string, type:string);
    }

    var ObjectsCache:{ [id: string]: SchemaObject; } = {};

    export function getSchemaObject(id:Guid, database:string = "schema"):SchemaObject {
        if (!ObjectsCache[id.toString()]) {
            var ds = executeSql("SELECT Data FROM __SchemaObject__ WHERE Id=" + id.toSql("schema"), database);
            if (ds.tables[0].rows.length == 0)
                throw "Объект схемы '" + id + "' не найден в базе данных '" + database + "'";

            var newObj = <SchemaObject>getBaseObjectFromXml($(ds.tables[0].rows[0]["Data"]), []);

            ObjectsCache[id.toString()] = newObj;
        }
        return ObjectsCache[id.toString()];
    }
    //export function getSchemaObject(id:string, database:string = "schema"):SchemaObject {
    //    if (!ObjectsCache[id]) {
    //        var ds = executeSql("SELECT Data FROM SchemaObject WHERE ID=" + id.toSql("schema"), database);
    //        if (ds.tables[0].rows.length == 0)
    //            throw "Объект схемы '" + id + "' не найден в базе данных '" + database + "'";
    //
    //        var newObj = <SchemaObject>getBaseObjectFromXml($(ds.tables[0].rows[0]["Data"]), []);
    //
    //        ObjectsCache[id] = newObj;
    //    }
    //    return ObjectsCache[id];
    //}

    export function getBaseObjectFromXml(xml:JQuery, objectIds:Array<Object>, rootModuleName?:string, moduleName?:string, _className?:string):BaseObject {

        if (!rootModuleName) {
            rootModuleName = xml.attr("module");
            _className = xml.prop("tagName").camelize(true);
            moduleName = rootModuleName;
        }
        else {
            if (!moduleName)
                moduleName = rootModuleName;
            if (xml.attr("module"))
                moduleName = xml.attr("module");
            if (xml.attr("type"))
                _className = xml.attr("type");
            else {
                if (!_className)
                    _className = xml.prop("tagName").camelize(true);
            }
        }
        // console.log(xml.prop("tagName"), moduleName, _className);

        var obj:any;
        if (_className == "array")
            obj = [];
        else {
            try {
                obj = eval("new " + moduleName + "." + _className + "()");
            }
            catch (err) {
                throw "getBaseObjectFromXml(): ошибка создания объекта '" + "new " + moduleName + "." + _className + "()" + "'";
            }
        }

        if (obj.registerProperties) {
            obj.registerProperties();

            for (var i = 0; i < xml[0].attributes.length; i++) {
                var a = xml[0].attributes[i];
                if (a.name == "obj") {
                    objectIds[a.value] = obj;
                }
                else {

                    var propName = a.name.camelize(false);

                    if (propName == "module") continue;
                    if (propName == "type") continue;

                    var propDesc = <PropertyDescriptor>obj.__properties__[propName];
                    if (!propDesc)
                        throw "свойство '" + propName + "' не зарегистрировано у объекта '" + (<any>obj).getClassName() + "'";
                    var value:any;
                    if (propDesc.type == "string" || propDesc.type == "String")
                        value = a.value;
                    else if (propDesc.type == "number" || propDesc.type == "Number")
                        value = Number(a.value);
                    else if (propDesc.type == "date")
                        value = Date.parse(a.value);
                    else if (propDesc.type == "DateTime")
                        value = new DateTime(a.value);
                    else if (propDesc.type == "Date")
                        value = new Date(a.value);
                    else if (propDesc.type == "DateOnly")
                        value = new DateOnly(a.value);
                    else if (propDesc.type == "Time")
                        value = new Time(a.value);
                    else if (propDesc.type == "Guid")
                        value = new Guid(a.value);
                    else if (propDesc.type == "boolean" || propDesc.type == "Boolean")
                        value = a.value == "true";
                    else if (propDesc.type == "array" || propDesc.type == "Array") {
                        throw "свойство '" + propName + "': массив недопустим в аттрибутах"
                    }
                    else {
                        // объекты: здесь, в аттрибутах могут быть только ref:
                        if (!/^(ref:)\d+$/.test(a.value))
                            throw "свойство '" + propName + "': неверный формат ссылки на объект - '" + a.value + "'";
                        var ref = /\d+$/.exec(a.value)[0];
                        value = objectIds[ref];

                    }
                    obj[propName] = value;
                }
            }
        }

        if (angular.isArray(obj)) {
            xml.children().each((index, el) => {
                var tagName = $(el).prop("tagName").toLowerCase();
                if (tagName == "string")
                    (<any>obj).push($(el).attr("value"));
                else if (tagName == "number")
                    (<any>obj).push(Number($(el).text()));
                else if (tagName == "boolean")
                    (<any>obj).push($(el).text() == "true");
                else if (tagName == "date")
                    (<any>obj).push(Date.parse($(el).text()));
                else if (tagName == "date-time")
                    (<any>obj).push(new DateTime($(el).text()));
                else if (tagName == "time")
                    (<any>obj).push(new Time($(el).text()));
                else if (tagName == "date-only")
                    (<any>obj).push(new DateOnly($(el).text()));
                else
                    (<any>obj).push(getBaseObjectFromXml($(el), objectIds, rootModuleName));
            });
        }
        else {
            xml.children().each((index, el) => {
                var propName = $(el).prop("tagName").camelize(false);
                var propDesc = <PropertyDescriptor>obj.__properties__[propName];
                if (!propDesc)
                    throw "свойство '" + propName + "' не зарегистрировано у объекта '" + (<any>obj).getClassName() + "'";

                obj[propName] = getBaseObjectFromXml($(el), objectIds, rootModuleName, rootModuleName, propDesc.type);
            });
        }
        return <BaseObject>obj;
    }

    export class BaseObject implements IXMLSerializable {
        module:string = "BuhtaCore";
        __properties__:any = {};


        registerProperties() {
        }

        registerProperty(name:string, type:string) {
            if (name == "obj" || name == "ref" || name == "type" || name == "module")
                throw "Объект не должен содержать свойства с названием 'obj','ref','type','module'";

            var propDesc = new PropertyDescriptor();
            propDesc.name = name;
            propDesc.type = type;
            this.__properties__[name] = propDesc;
        }

        xmlSerialize(parent:JQuery, objectIds:Array<IXMLSerializable>, rootModuleName:string, propName?:string) {
            objectIds.push(this);
            var el:JQuery;
            if (!propName)
                el = $("<" + unCamelize((<any>this).getClassName()) + "/>").appendTo(parent);
            else
                el = $("<" + unCamelize(propName) + " type='" + (<any>this).getClassName() + "'/>").appendTo(parent);

            if (rootModuleName == "") { // корневой вызов
                rootModuleName = this["module"];
                el.attr("module", rootModuleName)
            }
            else {
                if (rootModuleName != this["module"])  // модуль пишем, если только он отличается от корневого.
                    el.attr("module", this["module"])
            }

            this.registerProperties();

            this["__el__"] = el;
            for (var prop in this.__properties__) {
                if (!this[prop]) continue; // не заполнено
                var propType = this.__properties__[prop].type;
                if (this[prop].getClassName().toLowerCase() != propType.toLowerCase()) {
                    if (propType == "string" || propType == "String" || propType == "date" || propType == "boolean" || propType == "array" ||
                        (this[prop] instanceof Object && !(this[prop] instanceof eval(this["module"] + "." + propType))))
                        throw "SchemaObject.xmlSerialize(): неверный тип значения '" + this[prop].getClassName() + "' у свойства '" + prop + "' объекта '" + (<any>this).getClassName() + "'";
                }
                if (propType == "string" || propType == "String")
                    el.attr(unCamelize(prop), this[prop].toString());
                else if (propType == "number" || propType == "Number")
                    el.attr(unCamelize(prop), this[prop].toString());
                else if (propType == "Guid")
                    el.attr(unCamelize(prop), this[prop].toString());
                else if (propType == "date" || propType == "Date")
                    el.attr(unCamelize(prop), new DateTime(this[prop]).toString("YYYY-MM-DD HH:mm:ss.SS"));
                else if (propType == "DateTime")
                    el.attr(unCamelize(prop), this[prop].toString("YYYY-MM-DD HH:mm:ss.SS"));
                else if (propType == "DateOnly")
                    el.attr(unCamelize(prop), this[prop].toString("YYYY-MM-DD"));
                else if (propType == "Time")
                    el.attr(unCamelize(prop), this[prop].toString("HH:mm:ss.SS"));
                else if (propType == "boolean" || propType == "Boolean") {
                    if (this[prop] == true)
                        el.attr(unCamelize(prop), this[prop].toString());
                }
                else if (propType == "array" || propType == "Array") {
                    var arrayEl = $("<" + unCamelize(prop) + "/>").appendTo(el);
                    this[prop].map(function (item) {
                        if (angular.isString(item))
                            $("<string/>").appendTo(arrayEl).attr("value", item.toString());
                        else if (angular.isNumber(item))
                            $("<number/>").appendTo(arrayEl).text(item.toString());
                        else if (angular.isArray(item))
                            throw "xmlSerialize(): сериализация свойства '" + prop + "' -> не допускается массив в массиве.";
                        else if (item === true)
                            $("<boolean/>").appendTo(arrayEl).text(item.toString());
                        else if (item === false)
                            $("<boolean/>").appendTo(arrayEl).text(item.toString());
                        else if (angular.isDate(item))
                            $("<date/>").appendTo(arrayEl).text(new DateTime(item).toString("YYYY-MM-DD HH:mm:ss.SS"));
                        else if (item.getClassName() == "Guid")
                            $("<guid/>").appendTo(arrayEl).text(item.toString());
                        else if (item.getClassName() == "DateTime")
                            $("<date-time/>").appendTo(arrayEl).text(item.toString("YYYY-MM-DD HH:mm:ss.SS"));
                        else if (item.getClassName() == "DateOnly")
                            $("<date-only/>").appendTo(arrayEl).text(item.toString("YYYY-MM-DD"));
                        else if (item.getClassName() == "Time")
                            $("<time/>").appendTo(arrayEl).text(item.toString("HH:mm:ss.SS"));
                        else
                            item.xmlSerialize(arrayEl, objectIds, rootModuleName);
                    });
                }
                else
                // объекты
                {
                    if (objectIds.indexOf(this[prop]) > -1) {
                        // внутренняя ссылка на объект
                        el.attr(unCamelize(prop), "ref:" + objectIds.indexOf(this[prop]).toString());
                        this[prop]["__el__"].attr("obj", objectIds.findIndex(this[prop]));
                    }
                    else {
                        // объект inline
                        if (!(this[prop].xmlSerialize))
                            throw "SchemaObject.xmlSerialize(): объект '" + this[prop].getClassName() + "' не поддерживает сериализацию в XML (метод xmlSerialize)";

                        this[prop].xmlSerialize(el, objectIds, rootModuleName, prop);
                    }
                }
            }

        }

    }


    declare function html_beautify(source:string):string;
    export class SchemaObject extends BaseObject {
        //get id(): string {
        //    return (<any>this).getClassName() + "." + this.name;
        //}

        id:Guid;
        name:string;
        version:number;
        moduleId:Guid;
        parentId:Guid;

        registerProperties() {
            super.registerProperties();
            this.registerProperty("id", "Guid");
            this.registerProperty("name", "string");
            this.registerProperty("version", "number");
            this.registerProperty("moduleId", "Guid");
            this.registerProperty("parentId", "Guid");
        }

        toXML() {
            var root = $("<div/>");
            var objects = [];
            this.xmlSerialize(root, objects, "");
            return html_beautify(root[0].innerHTML);
        }

        saveToSql() {
            var r = new SqlInsert("schema", new SchemaObjectTable());
            var rec:any = {};
            rec.Id = this.id;
            rec.Name = this.name;
            rec.ModuleId = this.moduleId;
            rec.ParentId = this.parentId;
            rec.Version = this.version;
            rec.UpdateDate = new DateTime();
            rec.Data = this.toXML();
            rec.UpdateDate = ServerSideValue.serverDateTime;

            r.recs.push(rec);
            r.execute();

            //var sql = "";
            //sql += "IF NOT EXISTS(SELECT ID FROM SchemaObject WHERE ID=" + this.id.toSql("schema") + ")";
            //sql += "  INSERT SchemaObject(ID,Data) VALUES(" + this.id.toSql("schema") + "," + this.toXML().toSql("schema") + ")";
            //sql += "ELSE";
            //sql += "  UPDATE SchemaObject SET Data=" + this.toXML().toSql("schema") + " WHERE ID=" + this.id.toSql("schema") + "";
            //executeSql(sql, "schema");
        }

    }

} 