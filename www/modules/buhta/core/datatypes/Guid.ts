
class Guid {
    constructor(private value: string= "00000000-0000-0000-0000-000000000000") {
        this.value = value.toLowerCase();
    }

    private static s4(): string {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    static NewGuid(): Guid {
        return new Guid(Guid.s4() + Guid.s4() + '-' + Guid.s4() + '-' + Guid.s4() + '-' +
            Guid.s4() + '-' + Guid.s4() + Guid.s4() + Guid.s4());
    }

    toString(): string {
        return this.value;
    }

    toSql(database?: string): string {
        return "'" + this.value + "'";
    }

};



