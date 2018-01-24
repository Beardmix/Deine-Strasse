import {Message} from "./class-message";
import {User} from "./class-user";
import {AbstractModelType} from "./class-abstract"; 

/**
 * Class to define a chat Type.
 * Allows to make a conversion between the server and the local type.
 * The attributes defined here are known before runtime and permits easier debugging.
 * Only simple conversions are recommended here.
 */
export class Chat extends AbstractModelType{
    clone(objectDest: AbstractModelType): void {
        throw new Error("Method not implemented.");
    }
    title: string;
    messages: Message[];
    activePersons: string[];
    activeusers: User[];

    constructor() {
        super();
    }

    /**
     * Copies the necessary attributes from the database to the local type
     * Could be implemented in the constructor, but kept outside for flexibility
     * @param chat chat from the DB to copy from
     */
    initialise(chat) {
        this.id = chat._id;
        this.title = chat.title;
        this.messages = [];
        this.activeusers = [];
    }

    toDBJSON():{} {
        var objectJSON = {
            title: this.title
        };
        return objectJSON;
    }
}
