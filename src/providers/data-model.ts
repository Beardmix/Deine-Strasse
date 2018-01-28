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

    private static TAG_LOGIN_DATA = "TAG_LOGIN_DATA";

    static insertions: Datalist<Insertion> = new Datalist<Insertion>("insertion");
    static users: Datalist<User> = new Datalist<User>("person");
    static chats: Datalist<Chat> = new Datalist<Chat>("chats");
    static chats_persons: Datalist<ChatPerson> = new Datalist<ChatPerson>("chat_person");
    static messages: Datalist<Message> = new Datalist<Message>("messages");

    static currentUser: User = null;

    static storage: Storage = null;

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

        DataModel.storage = new Storage({
            name: '_ionicstorage',
            storeName: '_ionickv',
            driverOrder: ['sqlite', 'indexeddb', 'websql', 'localstorage']
        });
    }

    static storeLoginData(email: string, token: string) {
        DataModel.storage.ready()
            .then(() => {
                var data = {
                    email: email,
                    token: token
                }
                DataModel.storage.set(DataModel.TAG_LOGIN_DATA, data);
            }).catch((err) => {
                Logger.error(this, 'Error Storing the login data', err);
            });
    }

    static restoreLoginData(): Promise<{}> {

        return new Promise((resolve, reject) => {
            DataModel.storage.ready()
                .then(() => {
                    return DataModel.storage.get(DataModel.TAG_LOGIN_DATA)
                })
                .then((data) => {
                    if (data != null && data.token != null && data.email != null) {
                        resolve(data);
                    }
                    else {
                        reject();
                    }
                }).catch((err) => {
                    Logger.error(this, 'Error restoring the login data', err);
                    reject();
                });
        });
    }

}
