import { Storage } from '@ionic/storage';

/**
 * Class to define a datalist Type.
 * Allows to make a clear storage format.
 * It is possible to store metadata next to the data itself
 */
export class Datalist<Type> {
    name: string = "";
    data: Type [] = [];
    timestamp: number = 0;
    expirency: number = 1000 * 60 * 5 * 0; // 5 minutes

    constructor(f_name: string) {
        this.name = f_name;
    }

    isFresh(): boolean {
        var now = Date.now();        
        return (this.timestamp + this.expirency) > now;
    }

    clear(){
        this.data = [];
        this.timestamp = 0; 
    }

    store(storage: Storage){
        this.data.forEach(element => {
            // element.store(storage);
        });
    }
}