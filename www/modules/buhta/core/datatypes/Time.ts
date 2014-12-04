/// <reference path="../../../../lib/lib.ts" />
/// <reference path="DateTime.ts" />

class Time extends DateTime {
    constructor();
    constructor(date: Date);
    constructor(date: number);
    constructor(date: number[]);
    constructor(date: string, format?: string, strict?: boolean);
    constructor(date: string, format?: string, language?: string, strict?: boolean);
    constructor(date: string, formats: string[], strict?: boolean);
    constructor(date: string, formats: string[], language?: string, strict?: boolean);
    constructor(date: string, specialFormat: () => void, strict?: boolean);
    constructor(date: string, specialFormat: () => void, language?: string, strict?: boolean);
    constructor(date: string, formatsIncludingSpecial: any[], strict?: boolean);
    constructor(date: string, formatsIncludingSpecial: any[], language?: string, strict?: boolean);
    constructor(date: Date);
    constructor(date: Object);

    constructor(p1?: any, p2?: any, p3?: any, p4?: any) {
        if (typeof p1 == "string" && p1.indexOf("-") == -1)
            p1 = "1970-01-01 " + p1;
        super(p1, p2, p3, p4);
    }

    toSql(): string {
        return this.toString("'HH:mm:ss.SS'");
    }

    toString(format?: string) {
        if (!format)
            return this.moment.format("HH:mm:ss.SS");
        else
            return this.moment.format(format);
    }

}

