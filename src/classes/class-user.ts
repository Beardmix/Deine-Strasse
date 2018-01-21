import {Storage} from "@ionic/storage";
import {AbstractModelType} from "./class-abstract"; 

/**
 * Class to define a user Type.
 * Allows to make a conversion between the server and the local type.
 * The attributes defined here are known before runtime and permits easier debugging.
 * Only simple conversions are recommended here.
 */
export class User extends AbstractModelType{
    personID: string = "";
    name: string = "";
    lowres_img_url: string = "";
    free_text: string = "";
    location = {lat: 0, lng: 0};

    constructor() {
        super();
    }

    /**
     * Copies the necessary attributes from the database to the local type
     * Could be implemented in the constructor, but kept outside for flexibility
     * @param person person from the DB to copy from
     */
    initialise(person) {
        this.id = person._id;
        this.name = person.forename;
        this.personID = person.person;
        this.lowres_img_url = person.lowres_img_url ? person.lowres_img_url : "";
        this.free_text = person.free_text ? person.free_text : "";
        this.location.lat = person.latitude;
        this.location.lng = person.longitude;
    }

    toDBJSON():{} {
        var objectJSON = {
            forename: this.name,
            lowres_img_url: this.lowres_img_url,
            free_text: this.free_text,
            latitude: this.location.lat,
            longitude: this.location.lng,
        };
        return objectJSON;
    }


    store(storage: Storage) {
        storage.set(this.id + 'name', this.name);
        storage.set(this.id + 'personID', this.personID);
        storage.set(this.id + 'lowres_img_url', this.lowres_img_url);
        storage.set(this.id + 'free_text', this.free_text);
        storage.set(this.id + 'location.lat', this.location.lat);
        storage.set(this.id + 'location.lng', this.location.lng);
    }

    restore(id: string, storage: Storage): Promise<{}> {
        var ref = this;
        var p = new Promise(function (resolve, reject) {
            ref.id = id;
            storage.get(ref.id + 'name')
                .then((val) => {
                    ref.name = val;
                    return storage.get(ref.id + 'personID')
                })
                .then((val) => {
                    ref.personID = val;
                    return storage.get(ref.id + 'lowres_img_url')
                })
                .then((val) => {
                    ref.lowres_img_url = val;
                    return storage.get(ref.id + 'free_text')
                })
                .then((val) => {
                    ref.free_text = val;
                    return storage.get(ref.id + 'location.lat')
                })
                .then((val) => {
                    ref.location.lat = val;
                    return storage.get(ref.id + 'location.lng')
                })
                .then((val) => {
                    ref.location.lng = val;
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
        return p;
    }
}
