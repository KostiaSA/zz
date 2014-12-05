/// <reference path="../../../../lib/lib.ts" />

interface Moment {
    dayOfYear(): number;  // глюк в библиотеке typescript для moment
}

class DateTime {

    moment:Moment;

    constructor();
    constructor(date:Date);
    constructor(date:number);
    constructor(date:number[]);
    constructor(date:string, format?:string, strict?:boolean);
    constructor(date:string, format?:string, language?:string, strict?:boolean);
    constructor(date:string, formats:string[], strict?:boolean);
    constructor(date:string, formats:string[], language?:string, strict?:boolean);
    constructor(date:string, specialFormat:() => void, strict?:boolean);
    constructor(date:string, specialFormat:() => void, language?:string, strict?:boolean);
    constructor(date:string, formatsIncludingSpecial:any[], strict?:boolean);
    constructor(date:string, formatsIncludingSpecial:any[], language?:string, strict?:boolean);
    //constructor(date:Date);
    constructor(date:Object);

    constructor(p1?:any, p2?:any, p3?:any, p4?:any) {
        if (p1 && p1.length && p1.length >= 2 && p1.length <= 7) {
            // у этих дебилов месяцы начинаются с нуля, исправляем
            if (p1[1]) {
                p1[1]--;
            }
        }
        this.moment = moment(p1, p2, p3, p4);
    }

    toString(format?:string) {
        return this.moment.format(format);
    }

    toSql():string {
        return this.toString("'YYYY-MM-DD HH:mm:ss.SS'");
    }

    toTime():Time {
        return new Time(this.toString("HH:mm:ss.SS"));
    }

    // из momentjs
    fromNow(withoutSuffix?:boolean):string {
        return this.moment.fromNow(withoutSuffix)
    }

    startOf(unitOfTime:string):DateTime {
        return new DateTime(this.moment.startOf(unitOfTime).toDate())
    }

    endOf(unitOfTime:string):DateTime {
        return new DateTime(this.moment.endOf(unitOfTime).toDate())
    }

    add(unitOfTime:string, amount:number):DateTime {
        return new DateTime(this.moment.add(unitOfTime, amount).toDate())
    }

    addYears(years:number):DateTime {
        return new DateTime(this.moment.clone().add(years, 'years').toDate());
    }

    addQuarters(quarters:number):DateTime {
        return new DateTime(this.moment.clone().add(quarters, 'quarters').toDate());
    }

    addMonths(months:number):DateTime {
        return new DateTime(this.moment.clone().add(months, 'months').toDate());
    }

    addWeeks(weeks:number):DateTime {
        return new DateTime(this.moment.clone().add(weeks, 'weeks').toDate());
    }

    addDays(days:number):DateTime {
        return new DateTime(this.moment.clone().add(days, 'days').toDate());
    }

    addHours(hours:number):DateTime {
        return new DateTime(this.moment.clone().add(hours, 'hours').toDate());
    }

    addMinutes(minutes:number):DateTime {
        return new DateTime(this.moment.clone().add(minutes, 'minutes').toDate());
    }

    addSeconds(seconds:number):DateTime {
        return new DateTime(this.moment.clone().add(seconds, 'seconds').toDate());
    }

    addMilliseconds(milliseconds:number):DateTime {
        return new DateTime(this.moment.clone().add(milliseconds, 'milliseconds').toDate());
    }

    startOfYear():DateTime {
        return new DateTime(this.moment.clone().startOf('year').toDate());
    }

    startOfQuarter():DateTime {
        return new DateTime(this.moment.clone().startOf('quarter').toDate());
    }

    startOfMonth():DateTime {
        return new DateTime(this.moment.clone().startOf('month').toDate());
    }

    startOfWeek():DateTime {
        return new DateTime(this.moment.clone().startOf('isoWeek').toDate());
    }

    startOfDay():DateTime {
        return new DateTime(this.moment.clone().startOf('day').toDate());
    }

    startOfHour():DateTime {
        return new DateTime(this.moment.clone().startOf('hour').toDate());
    }

    startOfMinute():DateTime {
        return new DateTime(this.moment.clone().startOf('minute').toDate());
    }

    startOfSecond():DateTime {
        return new DateTime(this.moment.clone().startOf('second').toDate());
    }

    endOfYear():DateTime {
        return new DateTime(this.moment.clone().endOf('year').toDate());
    }

    endOfQuarter():DateTime {
        return new DateTime(this.moment.clone().endOf('quarter').toDate());
    }

    endOfMonth():DateTime {
        return new DateTime(this.moment.clone().endOf('month').toDate());
    }

    endOfWeek():DateTime {
        return new DateTime(this.moment.clone().endOf('isoWeek').toDate());
    }

    endOfDay():DateTime {
        return new DateTime(this.moment.clone().endOf('day').toDate());
    }

    endOfHour():DateTime {
        return new DateTime(this.moment.clone().endOf('hour').toDate());
    }

    endOfMinute():DateTime {
        return new DateTime(this.moment.clone().endOf('minute').toDate());
    }

    endOfSecond():DateTime {
        return new DateTime(this.moment.clone().endOf('second').toDate());
    }

    year():number {
        return this.moment.clone().year().toNumber();
    }

    quarter():number {
        return this.moment.clone().quarter().toNumber();
    }

    month():number {
        return (this.moment.clone().month().toNumber() + 1);
    }

    week():number {
        return this.moment.clone().isoWeek().toNumber();
    }

    day():number {
        return this.moment.clone().date().toNumber();
    }

    hour():number {
        return this.moment.clone().hour().toNumber();
    }

    minute():number {
        return this.moment.clone().minute().toNumber();
    }

    second():number {
        return this.moment.clone().second().toNumber();
    }

    millisecond():number {
        return this.moment.clone().millisecond().toNumber();
    }

    dayOfWeek():number {
        return this.moment.clone().isoWeekday().toNumber();
    }

    dayOfYear():number {
        return this.moment.clone().dayOfYear().toNumber();
    }

    daysInMonth():number {
        return this.moment.clone().daysInMonth().toNumber();
    }

    diffYears(datetime:DateTime):number {
        return this.moment.clone().diff(datetime.moment.clone(), 'years').toNumber();
    }

    diffMonths(datetime:DateTime):number {
        return this.moment.clone().diff(datetime.moment.clone(), 'months').toNumber();
    }

    diffWeeks(datetime:DateTime):number {
        return this.moment.clone().diff(datetime.moment.clone(), 'weeks').toNumber();
    }

    // 1 день = 24 часа
    diffDays(datetime:DateTime):number {
        return this.moment.clone().diff(datetime.moment.clone(), 'days').toNumber();
    }

    diffHours(datetime:DateTime):number {
        return this.moment.clone().diff(datetime.moment.clone(), 'hours').toNumber();
    }

    diffMinutes(datetime:DateTime):number {
        return this.moment.clone().diff(datetime.moment.clone(), 'minutes').toNumber();
    }

    diffSeconds(datetime:DateTime):number {
        return this.moment.clone().diff(datetime.moment.clone(), 'seconds').toNumber();
    }

    diffMilliSeconds(datetime:DateTime):number {
        return this.moment.clone().diff(datetime.moment.clone()).toNumber();
    }

    isBefore(datetime:DateTime):boolean {
        return this.moment.clone().isBefore(datetime.moment.clone());
    }
    isSame(datetime:DateTime):boolean {
        return this.moment.clone().isSame(datetime.moment.clone());
    }
    isAfter(datetime:DateTime):boolean {
        return this.moment.clone().isAfter(datetime.moment.clone());
    }

}




