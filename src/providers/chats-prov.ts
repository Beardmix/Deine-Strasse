import { Injectable } from '@angular/core';
import { DataCtrlProvider } from './data-ctrl';
import { DataModel } from './data-model'
import { Logger } from './logger-prov';
import { Message } from '../classes/class-message';
import { Chat } from '../classes/class-chat';
import { ChatPerson } from '../classes/class-chat-person';
import { User } from '../classes/class-user';

@Injectable()
export class ChatsProvider {

    constructor(private dataCtrl: DataCtrlProvider) {
        Logger.info(this, 'Hello from Constructor');
    }

    public getChat(chatID: string): Promise<Chat> {
        return this.dataCtrl.fetchElement<Chat>(Chat, DataModel.chats, { id: chatID });
    }

    /**
     * Fetches all messages in the specified chat
     */
    public getMessages(filters = { chatID: "" }, forceRefresh: boolean = false): Promise<Array<Message>> {
        var options = {
            chat: { exact: filters.chatID },
            sort: ['+_created'],
            size: 1000
        };
        return this.dataCtrl.fetchData<Message>(Message, DataModel.messages, options, forceRefresh);
    }

    public getChatUsers(chat: Chat): Promise<Array<User>> {
        let userslist: User[] = [];
        return new Promise<Array<User>>((resolve, reject) => {
            var options = {
                chat: { exact: chat.id },
                size: 1000
            };
            this.dataCtrl.fetchData<ChatPerson>(ChatPerson, DataModel.chats_persons, options, true)
                .then(chatlist => {
                    var idlist = [];
                    chatlist.forEach(elem => {
                        var user = this.dataCtrl.fetchElementSync<User>(User, DataModel.users, { id: elem.id_user });
                        if (user != null) {
                            userslist.push(user)
                        } else {
                            idlist.push(elem.id_user);
                        }
                    })

                    // if all the desired users are not locally downloaded
                    if (idlist.length > 0) {
                        var options = {
                            id: { any: idlist },
                            size: 1000
                        };
                        this.dataCtrl.fetchData<User>(User, DataModel.users, options, true)
                            .then(users => {
                                userslist = userslist.concat(users);
                                resolve(userslist);
                            });
                    } else {
                        resolve(userslist);
                    }
                })
        });
    }

    public getChats(): Promise<Chat[]> {
        return new Promise<Chat[]>((resolve, reject) => {
            let currentUserTemp: User = new User;
            this.dataCtrl.getCurrentUser()
                .then(currentUser => {
                    currentUserTemp = currentUser;
                    return this.dataCtrl.fetchChats({ userID: currentUser.id });
                })
                .then(chatsDB => {
                    var chats: Chat[] = [];
                    chatsDB.forEach(chat => {
                        // if (Potential filter) 
                        {
                            chats.push(chat);
                        }
                    });
                    resolve(chats);
                })
                .catch(err => {
                    reject(err);
                })
        });
    }

    public sendMessage(message: Message): Promise<Message> {
        return this.dataCtrl.createData<Message>(Message, DataModel.messages, message);
    }

    public startChat(title: string, dest: User): Promise<Chat> {
        var newchat: Chat = new Chat;

        newchat.title = title;

        return new Promise<Chat>((resolve, reject) => {
            let currentUserTemp: User = new User;
            let chatTemp: Chat = new Chat;
            
            this.dataCtrl.getCurrentUser()
                .then(currentUser => {
                    currentUserTemp = currentUser;
                    return this.dataCtrl.createData<Chat>(Chat, DataModel.chats, newchat);
                })
                .then(chat => {
                    chatTemp = chat;
                    var link = new ChatPerson();
                    link.id_chat = chatTemp.id;
                    link.id_user = currentUserTemp.id;
                    this.dataCtrl.createData<ChatPerson>(ChatPerson, DataModel.chats_persons, link)
                })
                .then(link1 => {
                    var link = new ChatPerson();
                    link.id_chat = chatTemp.id;
                    link.id_user = dest.id;
                    this.dataCtrl.createData<ChatPerson>(ChatPerson, DataModel.chats_persons, link)
                })
                .then(link2 => {
                    resolve(chatTemp);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

}
