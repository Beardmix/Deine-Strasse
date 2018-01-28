import {Injectable} from "@angular/core";

@Injectable()
export class Utils {

    public constructor() {
    }

    public static delay(timeout: number, succeed: boolean):Promise<any> {
        return new Promise<any>((resolve, reject) => {
        setTimeout(() => { 
            if(succeed)
            {
                resolve();
            }
            else
            { 
                reject("Crash Testing: Delayed Function Failed");
            }
        }, 2000);
        });
    }

    public static rand_delay(maxtimeout: number):Promise<any> {
        return this.delay(Math.random() * maxtimeout, Math.random() > 0.5);
    }
}
