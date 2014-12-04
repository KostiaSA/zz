/// <reference path="../../../../lib/lib.ts" />

class DateTime {

    moment: Moment;

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
        if (p1 && p1.length && p1.length >= 2 && p1.length <= 7) {
            // у этих дебилов месяцы начинаются с нуля, исправляем
            if (p1[1]) {
                p1[1]--;
            }
        }
        this.moment = moment(p1, p2, p3, p4);
    }
    toString(format?: string) {
        return this.moment.format(format);
    }

    toSql(): string {
        return this.toString("'YYYY-MM-DD HH:mm:ss.SS'");
    }

    toTime(): Time {
        return new Time(this.toString("HH:mm:ss.SS"));
    }

    // из momentjs
    fromNow(withoutSuffix?: boolean): string { return this.moment.fromNow(withoutSuffix) }
    startOf(unitOfTime: string): DateTime { return new DateTime(this.moment.startOf(unitOfTime).toDate()) }
    endOf(unitOfTime: string): DateTime { return new DateTime(this.moment.endOf(unitOfTime).toDate()) }
    add(unitOfTime: string, amount: number): DateTime { return new DateTime(this.moment.add(unitOfTime, amount).toDate()) }

}




