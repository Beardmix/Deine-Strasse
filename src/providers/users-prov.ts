import { Injectable } from "@angular/core";
import { DataCtrlProvider } from "./data-ctrl";
import { DataModel } from './data-model'
import { User } from "../classes/class-user";
import { Logger } from "./logger-prov";

@Injectable()
export class UsersProvider {

    constructor(private dataCtrl: DataCtrlProvider) {
        Logger.info(this, 'Hello from Constructor');
    }

    public getNeighbours(): Promise<Array<User>> {
        return new Promise((resolve, reject) => {
            let currentUserTemp: User = new User;

            this.dataCtrl.getCurrentUser()
                .then(currentUser => {
                    currentUserTemp = currentUser;
                    return this.dataCtrl.fetchProfiles();
                })
                .then(profiles => {
                    Logger.debug(this, 'profiles received', profiles);

                    var neighbours: User[] = [];
                    profiles.forEach(profil => {
                        if (profil.id != currentUserTemp.id) {
                            neighbours.push(profil);
                        }
                    });
                    resolve(neighbours);
                })
                .catch(err => {
                    reject(err);
                })
        });
    }

    public getDistanceToUser(user2: User): Promise<string> {
        return new Promise((resolve, reject) => {
            this.dataCtrl.getCurrentUser()
                .then(currentUser => {
                    var toRadians = function (Value) {
                        /** Converts numeric degrees to radians */
                        return Value * Math.PI / 180;
                    }

                    var getDistance = function (start, end) {
                        var R = 6371000; // metres
                        var φ1 = toRadians(start.lat);
                        var φ2 = toRadians(end.lat);
                        var Δφ = toRadians(end.lat - start.lat);
                        var Δλ = toRadians(end.lng - start.lng);

                        var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                            Math.cos(φ1) * Math.cos(φ2) *
                            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
                        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

                        var d = R * c;
                        return d;
                    };

                    if (!currentUser.location || !user2.location) {
                        reject('Location Unknown');
                    }
                    var dist = getDistance(currentUser.location, user2.location);
                    if (dist < 500) {
                        resolve(Math.round(dist).toFixed(0).replace(".", ",") + 'm');
                    } else {
                        resolve("> " + Math.round(dist / 1000).toFixed(0).replace(".", ",") + 'km');
                    }
                })
        });
    }

    public getCurrentUser(): Promise<User> {
        return this.dataCtrl.getCurrentUser();
    }

    public getProfile(userID: string): Promise<User> {
        return this.dataCtrl.fetchElement<User>(User, DataModel.users, { id: userID });
    }

    public getProfilePersonID(personID: string): Promise<User> {
        return new Promise((resolve, reject) => {
            this.dataCtrl.fetchProfiles()
                .then(profiles => {
                    profiles.forEach(profil => {
                        if (profil.personID == personID) {
                            resolve(profil);
                        }
                    });
                    reject(null);
                })
                .catch(err => {
                    reject(err);
                })
        });
    }


}
