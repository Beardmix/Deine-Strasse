import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { User } from '../classes/class-user';
import { Insertion } from '../classes/class-insertion';
import { Chat } from '../classes/class-chat';
import { ChatPerson } from '../classes/class-chat-person';
import { Message } from '../classes/class-message';
import { Datalist } from '../classes/class-datalist';

import { Logger } from './logger-prov';

@Injectable()
export class DataModel {

    static insertions: Datalist<Insertion> = new Datalist<Insertion>("insertion");
    static users: Datalist<User> = new Datalist<User>("person");
    static chats: Datalist<Chat> = new Datalist<Chat>("chats");
    static chats_persons: Datalist<ChatPerson> = new Datalist<ChatPerson>("chat_person");
    static messages: Datalist<Message> = new Datalist<Message>("messages");

    static currentUser: User = null;

    static bounds: {
        southwest: { lat: number, lng: number },
        northeast: { lat: number, lng: number }
    };

    constructor(private storage: Storage) {
        Logger.info(this, 'Hello from Constructor');
        DataModel.currentUser = new User();

        this.storage.ready().then(() => {
            // this.currentUser.store(this.storage);
            // this.currentUser.restore("HJlxyBUNo9g", this.storage);
        });

        DataModel.bounds = {
            southwest: { lat: 0, lng: 0 },
            northeast: { lat: 0, lng: 0 }
        };
    }

}
