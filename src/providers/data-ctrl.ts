import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { PublicAPI } from 'ec.sdk';

import { Http } from '@angular/http';
import { Observable } from 'rxjs';

import { DataModel } from './data-model'
import { Logger } from './logger-prov';

import { AbstractModelType } from '../classes/class-abstract';
import { User } from '../classes/class-user';
import { Message } from '../classes/class-message';
import { Chat } from '../classes/class-chat';
import { ChatPerson } from '../classes/class-chat-person';
import { Insertion } from '../classes/class-insertion';
import { Datalist } from '../classes/class-datalist';
import { log } from 'util';


@Injectable()
export class DataCtrlProvider {

    private observUser: any;
    private api: PublicAPI;

    constructor(private model: DataModel, private storage: Storage, private http: Http) {
        Logger.info(this, 'Hello from Constructor');
        this.observUser = Observable
            .create(observer => {
                Logger.info(this, 'Completing Observable for fetching user');
                observer.complete();
            })
            .publish();
    };

    public login(email, password): Promise<{}> {
        return new Promise((resolve, reject) => {
            this.connectToDatamager(email, password)
                .then(() => {
                    return this.api.entryList('person', { mail: email });
                })
                .then((list) => {
                    let user = list.getAllItems()[0];
                    Logger.debug(this, 'User Fetched', user);
                    DataModel.currentUser.initialise(user);
                    this.observUser.connect();
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    private connectToDatamager(email, password): Promise<{}> {

        return new Promise((resolve, reject) => {

            this.api = new PublicAPI('ac49925a', 'live', true);
            this.api.setClientID('rest');
            this.api.login(email, password)
                .then((token) => {
                    console.log(token);
                    resolve();
                }).catch((err) => {
                    reject(err);
                });
        });
    }


    public computeBounderies(center) {
        var SEARCH_ZOOM_LEVEL = 8;
        var SEARCH_ZOOM_LEVEL_DIVIDER = 1000;
        var SEARCH_ZOOM_LEVEL_FACTOR = 1.5;

        var zoomLevelLat = SEARCH_ZOOM_LEVEL / SEARCH_ZOOM_LEVEL_DIVIDER;
        var zoomLevelLng = SEARCH_ZOOM_LEVEL * SEARCH_ZOOM_LEVEL_FACTOR / SEARCH_ZOOM_LEVEL_DIVIDER;

        DataModel.bounds.southwest.lng = center.lng - zoomLevelLng;
        DataModel.bounds.southwest.lat = center.lat - zoomLevelLat;
        DataModel.bounds.northeast.lng = center.lng + zoomLevelLng;
        DataModel.bounds.northeast.lat = center.lat + zoomLevelLat;
    }

    public getBounderies(): Promise<any> {
        return new Promise((resolve, reject) => {
            if ((DataModel.bounds.southwest.lng != 0 || DataModel.bounds.southwest.lat != 0) ||
                (DataModel.bounds.northeast.lng != 0 || DataModel.bounds.northeast.lat != 0)) {
                resolve(DataModel.bounds);
            }
            else {
                this.getCurrentUser()
                    .then(currentUser => {
                        this.computeBounderies(currentUser.location);
                        resolve(DataModel.bounds);
                    })
                    .catch(err => {
                        reject(err);
                    })
            }
        });
    }

    public fetchData<Type extends AbstractModelType>(
        type: { new(): Type; },
        modeldata: Datalist<Type>,
        options: any,
        forceRefresh: boolean = false): Promise<Array<Type>> {
        return new Promise((resolve, reject) => {
            if (!forceRefresh && modeldata.isFresh()) {
                resolve(modeldata.data);
            } else {
                this.api.entryList(modeldata.name, options)
                    .then(entriesDB => {

                        // convert entries
                        let list: Type[] = [];
                        entriesDB.getAllItems().forEach((entry) => {
                            let element: Type = new type();
                            element.initialise(entry);
                            list.push(element);
                        });                        

                        // Merges arrays to keep the results in cache
                        list.forEach(elem => {
                            let overwritten = false;
                            modeldata.data.forEach(data => {
                                if (elem.id == data.id) {
                                    data = elem;
                                    overwritten = true;
                                }
                            })
                            if (overwritten == false) {
                                modeldata.data.push(elem);
                            }
                        })

                        // saves the last update timestamp
                        modeldata.timestamp = Date.now();

                        // returns the list of required data
                        resolve(list);
                    })
                    .catch(err => {
                        reject(err);
                    });
            }
        });
    }

    public fetchElement<Type extends AbstractModelType>(
        type: { new(): Type; },
        modeldata: Datalist<Type>,
        filters = { id: "" }): Promise<any> {

        return new Promise((resolve, reject) => {

            let element: Type = new type();
            let isFound: boolean = false;

            modeldata.data.forEach(entry => {
                if (entry.id == filters.id) {
                    element = entry;
                    isFound = true;
                }
            });
            if (isFound) {
                resolve(element);
            }
            else {
                reject("Element Not Found");
            }
        });
    }

    public fetchElementSync<Type extends AbstractModelType>(
        type: { new(): Type; },
        modeldata: Datalist<Type>,
        filters = { id: "" }): Type {
        let element: Type = new type();
        let isFound: boolean = false;

        modeldata.data.forEach(entry => {
            if (entry.id == filters.id) {
                element = entry;
                isFound = true;
            }
        });
        if (isFound) {
            return (element);
        }
        else {
            return null;
        }
    }

    public createData<Type extends AbstractModelType>(
        type: { new(): Type; },
        modeldata: Datalist<Type>,
        object: Type): Promise<Type> {
        return new Promise((resolve, reject) => {
            var objectJSON = object.toDBJSON();
            this.api.createEntry(modeldata.name, objectJSON)
                .then((entry) => {
                    let element: Type = new type();
                    element.initialise(entry);
                    modeldata.data.push(element);
                    resolve(element)
                }).catch((err) => {
                    reject(err)
                });
        });
    }

    /**
     * Fetches all insertions from the database.
     * @param forceRefresh If forceRefresh is set to true, the insertions are again taken from the database and not from the cache
     */
    public fetchInsertions(filters = null, forceRefresh: boolean = false): Promise<Array<Insertion>> {
        var options = {
            size: 0,
            latitude: { 
                from: DataModel.bounds.southwest.lat,
                to: DataModel.bounds.northeast.lat
            },
            longitude: {
                from: DataModel.bounds.southwest.lng,
                to: DataModel.bounds.northeast.lng
            }
        };
        return this.fetchData<Insertion>(Insertion, DataModel.insertions, options, forceRefresh);
    }

    /**
     * Fetches all profiles from the database.
     * @param forceRefresh If forceRefresh is set to true, the profiles are again taken from the database and not from the cache
     */
    public fetchProfiles(filters = null, forceRefresh: boolean = false): Promise<Array<User>> {
        var options = {
            size: 0,
            latitude: {
                from: DataModel.bounds.southwest.lat,
                to: DataModel.bounds.northeast.lat
            },
            longitude: {
                from: DataModel.bounds.southwest.lng,
                to: DataModel.bounds.northeast.lng
            }
        };
        return this.fetchData<User>(User, DataModel.users, options, forceRefresh);
    }

    /**
     * Fetches all chats in which the user is involved.
     */
    public fetchChats(filters = { userID: "" }, forceRefresh: boolean = false): Promise<Array<Chat>> {

        var options = {
            person: { exact: filters.userID },
            size: 1000
        };
        return this.fetchData<ChatPerson>(ChatPerson, DataModel.chats_persons, options, forceRefresh)
            .then(chatlist => {
                var idlist = [];
                chatlist.forEach(elem => {
                    idlist.push(elem.id_chat);
                })
                var options = {
                    id: { any: idlist },
                    sort: ['-last_message_date'],
                    size: 1000
                };
                return this.fetchData<Chat>(Chat, DataModel.chats, options, forceRefresh);
            });
    }

    /**
     * Fetches the current User. 
     * If already loaded then just returned directly. If not, waiting for the observer to finish
     */
    public getCurrentUser(options = null): Promise<User> {
        return new Promise((resolve, reject) => {
            // If the user has already been loaded or restored, just return it
            // Else subscribe to the observer and wait
            if (DataModel.currentUser.name.length > 0) {
                resolve(DataModel.currentUser);
            } else {
                this.observUser.subscribe(
                    value => { },
                    error => { },
                    () => {
                        resolve(DataModel.currentUser);
                    }
                );
            }
        });
    }

}
