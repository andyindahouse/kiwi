export class Error400 extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = 'Error400';
    }
}
export class Error401 extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = 'Error401';
    }
}
export class Error403 extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = 'Error403';
    }
}
export class Error404 extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = 'Error404';
    }
}
export class InfoError extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = 'InfoError';
    }
}
