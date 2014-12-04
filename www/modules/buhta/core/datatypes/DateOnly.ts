/// <reference path="DateTime.ts" />
/// <reference path="../../../../lib/lib.ts" />
 
class DateOnly extends DateTime {
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
        super(p1, p2, p3, p4);
        this.moment = this.moment.startOf("day");
    }

    toSql(): string {
        return this.toString("'YYYY-MM-DD'");
    }

    toString(format?: string) {
        if (!format)
            return this.moment.format("YYYY-MM-DD");
        else
            return this.moment.format(format);
    }

}

