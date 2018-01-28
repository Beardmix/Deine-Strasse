import {Storage} from "@ionic/storage";
import {Logger} from "../providers/logger-prov";
import {AbstractModelType} from "./class-abstract"; 

/**
 * Class to define an insertion Type.
 * Allows to make a conversion between the server and the local type.
 * The attributes defined here are known before runtime and permits easier debugging.
 * Only simple conversions are recommended here.
 */
export class Insertion extends AbstractModelType{
    title: string;
    description: string;
    creator: string;
    type: string;
    location = {lat: 0, lng: 0};
    icon: string;
    start: Date;
    end: Date;
    status: number;

    constructor() {
        super();
    }

    /**
     * Copies the necessary attributes from the database to the local type
     * Could be implemented in the constructor, but kept outside for flexibility
     * @param insertion insertion from the DB to copy from
     */
    initialise(insertion) {
        this.id = insertion._id;
        this.creator = insertion._creator;
        this.title = insertion.title;
        this.description = insertion.description;
        this.type = insertion.type;
        this.location.lat = insertion.latitude;
        this.location.lng = insertion.longitude;
        this.icon = this.type2Icon(this.type);
        this.start = new Date(insertion.start);
        this.end = new Date(insertion.end);
        this.status = insertion.status;
    }

    clone(objectDest: Insertion): void {
        objectDest.id = this.id;
        objectDest.creator = this.creator;
        objectDest.title = this.title;
        objectDest.description = this.description;
        objectDest.type = this.type;
        objectDest.location.lat = this.location.lat;
        objectDest.location.lng = this.location.lng;
        objectDest.icon = this.icon;
        objectDest.start = this.start;
        objectDest.end = this.end;
        objectDest.status = this.status;
    }

    toDBJSON():{} {
        var objectJSON = {
            title: this.title,
            description: this.description,
            type: this.type,
            latitude: this.location.lat,
            longitude: this.location.lng,
            searchField: this.title + ' ' + this.description,
            start: this.start.toISOString(),
            end: this.end.toISOString(),
            status: this.status
        };
        return objectJSON;
    }

    store(storage: Storage) {
        storage.set(this.id + 'title', this.title);
        storage.set(this.id + 'creator', this.creator);
        storage.set(this.id + 'description', this.description);
        storage.set(this.id + 'location.lat', this.location.lat);
        storage.set(this.id + 'location.lng', this.location.lng);
    }

    restore(id: string, storage: Storage) {
        this.id = id;
        storage.get(this.id + 'title')
            .then((val) => {
                this.title = val;
                return storage.get(this.id + 'creator')
            })
            .then((val) => {
                this.creator = val;
                return storage.get(this.id + 'description')
            })
            .then((val) => {
                this.description = val;
                return storage.get(this.id + 'location.lat')
            })
            .then((val) => {
                this.location.lat = val;
                return storage.get(this.id + 'location.lng')
            })
            .then((val) => {
                this.location.lng = val;
            })
            .catch((err) => {
                Logger.error(this, "Error Restoring Object", err)
            });
    }

    /**
     * Determine which icon best suits the insertion regarding its native type
     * Could be made member function without parameter and return value, but kept so for reusability
     * @param type native type of the insertions
     */
    type2Icon(type): string {
        var icon: string = "";

        if (type == "offer") {
            icon = "assets/img/offerMapIcon.png";
        } else if (type == "request") {
            icon = "assets/img/requestMapIcon.png";
        } else if (type == "public") {
            icon = "assets/img/publicMapIcon.png";
        } else {
            // case not supported
            icon = "";
        }

        return icon;
    }
}
