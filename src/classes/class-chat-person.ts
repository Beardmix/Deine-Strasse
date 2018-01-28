import {AbstractModelType} from "./class-abstract"; 

/**
 * Class to define a chat Type.
 * Allows to make a conversion between the server and the local type.
 * The attributes defined here are known before runtime and permits easier debugging.
 * Only simple conversions are recommended here.
 */
export class ChatPerson extends AbstractModelType{
    id_chat: string;
    id_user: string;
    push: boolean = false;
    unread: boolean = false;

    constructor() {
        super();
    }

    /**
     * Copies the necessary attributes from the database to the local type
     * Could be implemented in the constructor, but kept outside for flexibility
     * @param chatperson chatperson from the DB to copy from
     */
    initialise(chatperson) {
        this.id = chatperson._id;
        this.id_chat = chatperson.chat.id;
        this.id_user = chatperson.person.id;
        this.push = chatperson.push;
        this.unread = chatperson.unread;
    }

    clone(objectDest: ChatPerson): void {
        objectDest.id_chat = this.id_chat;
        objectDest.id_user = this.id_user;
        objectDest.push = this.push;
        objectDest.unread = this.unread;
    }

    toDBJSON():{} {
        var objectJSON = {
            chat: this.id_chat,
            person: this.id_user,
            push: this.push,
            unread: this.unread
        };
        return objectJSON;
    }
}
