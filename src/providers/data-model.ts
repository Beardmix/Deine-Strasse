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

    private static TAG_USERID = "USERID";

    static insertions: Datalist<Insertion> = new Datalist<Insertion>("insertion");
    static users: Datalist<User> = new Datalist<User>("person");
    static chats: Datalist<Chat> = new Datalist<Chat>("chats");
    static chats_persons: Datalist<ChatPerson> = new Datalist<ChatPerson>("chat_person");
    static messages: Datalist<Message> = new Datalist<Message>("messages");

    static currentUser: User = null;

    static storage: Storage;

    static bounds: {
        southwest: { lat: number, lng: number },
        northeast: { lat: number, lng: number }
    };

    constructor() {
        Logger.info(this, 'Hello from Constructor');
        DataModel.currentUser = new User();

        DataModel.bounds = {
            southwest: { lat: 0, lng: 0 },
            northeast: { lat: 0, lng: 0 }
        };
    }

    static storeLoginData() {
        DataModel.storage.ready()
        .then(() => {
            DataModel.storage.set(DataModel.TAG_USERID, DataModel.currentUser.id);
        }).catch((err) => {
            Logger.error(this, 'Error Storing the current user', err);
        });
    }

    static restoreCurrentUser() {
        DataModel.storage.ready()
        .then(() => {
            return DataModel.storage.get(DataModel.TAG_USERID)
        })
        .then((val) => {
            // Just SAVE / LOAD the userID but not the user values for now.
            if(val != null)
            {
                console.log("known user", val);
                
            }
            else{
                console.log("no user yet");
                
            }
            
        }).catch((err) => {
            Logger.error(this, 'Error Storing the current user', err);
        });
    }

}
