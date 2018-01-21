import {Injectable} from "@angular/core";

@Injectable()
export class Logger {
    private static APP: string = "DS2";
    private static TAG_INF: string = "INF";
    private static TAG_DBG: string = "DBG";
    private static TAG_ERR: string = "ERR";
    public static SHOW_INF: boolean = true;
    public static SHOW_DBG: boolean = true;
    public static SHOW_ERR: boolean = true;

    public constructor() {
    }

    public static info(instance: any, message: string) {
        if (this.SHOW_INF) {
            this.log(this.TAG_INF, instance, message);
        }
    }

    public static debug(instance: any, message: string, obj: Object = undefined) {
        if (this.SHOW_DBG) {
            this.log(this.TAG_DBG, instance, message, obj);
        }
    }

    public static error(instance: any, message: string, err: Object = undefined) {
        if (this.SHOW_ERR) {
            this.log(this.TAG_ERR, instance, message, err);
        }
    }

    private static log(tag: string, instance: any, message: string, obj: Object = undefined) {
        // make sure that instance["constructor"].name is defined
        var location = instance ? (instance["constructor"] ? (instance["constructor"].name ? instance["constructor"].name : "") : "") : "";

        if (!obj) {
            console.log("[" + this.APP + "][" + tag + "][" + location + "] " + message);
        }
        else {
            console.log("[" + this.APP + "][" + tag + "][" + location + "] " + message, obj);
        }
    }
}
