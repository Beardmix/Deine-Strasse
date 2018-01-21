import {AbstractModelType} from "./class-abstract"; 

/**
 * Class to define a message Type.
 * Allows to make a conversion between the server and the local type.
 * The attributes defined here are known before runtime and permits easier debugging.
 * Only simple conversions are recommended here.
 */
export class Message extends AbstractModelType{
    text: string;
    chatID: string;
    username: string;
    userid: string;

    constructor() {
        super();
    }


    /**
     * Copies the necessary attributes from the database to the local type
     * Could be implemented in the constructor, but kept outside for flexibility
     * @param message message from the DB to copy from
     */
    initialise(message) {
        this.id = message._id;
        this.text = message.message;
        this.chatID = message.chat.id;
        this.userid = message.person.id;
        this.username = "";
    }

    toDBJSON():{} {
        var objectJSON = {
            message: this.text,
            chat: this.chatID,
            person: this.userid
        };
        return objectJSON;
    }
}
