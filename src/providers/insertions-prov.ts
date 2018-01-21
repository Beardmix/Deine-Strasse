import { Injectable } from "@angular/core";
import { DataCtrlProvider } from "./data-ctrl";
import { DataModel } from './data-model'
import { User } from "../classes/class-user";
import { Insertion } from "../classes/class-insertion";
import { Logger } from "./logger-prov";

@Injectable()
export class InsertionsProvider {

    constructor(private dataCtrl: DataCtrlProvider) {
        Logger.info(this, 'Hello from Constructor');
    }

    public getInsertions(filters = { personID: "" }): Promise<Array<Insertion>> {

        return new Promise((resolve, reject) => {
            let currentUserTemp: User = new User;
            this.dataCtrl.getCurrentUser()
                .then(currentUser => {
                    currentUserTemp = currentUser;
                    return this.dataCtrl.fetchInsertions();
                })
                .then(insertionsDB => {
                    var insertions: Insertion[] = [];
                    insertionsDB.forEach(insertion => {
                        var valid = false;

                        if (filters.personID == "") {
                            valid = (insertion.creator != currentUserTemp.personID);
                        } else {
                            valid = (insertion.creator == filters.personID);
                        }

                        if (valid) {
                            insertions.push(insertion);
                        }
                    });
                    resolve(insertions);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    public getInsertion(insertionID: string): Promise<Insertion> {
        return this.dataCtrl.fetchElement<Insertion>(Insertion, DataModel.insertions, { id: insertionID });
    }

    public addInsertion(insertion: Insertion): Promise<{}> {
        return new Promise((resolve, reject) => {
            this.dataCtrl.getCurrentUser()
                .then(currentUser => {
                    insertion.location = currentUser.location;
                    insertion.type = "offer";
                    insertion.status = 1;
                    insertion.start = new Date(); // save the start as creation date as the field is free
                    insertion.end = new Date(); // save the start as last modification date as the field is free
                    return this.dataCtrl.createData<Insertion>(Insertion, DataModel.insertions, insertion);
                })
                .then(entry => {
                    resolve(entry);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
}
