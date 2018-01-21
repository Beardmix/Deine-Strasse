import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { User } from '../../classes/class-user';
import { Chat } from '../../classes/class-chat';
import { Message } from '../../classes/class-message';
import { UsersProvider } from '../../providers/users-prov';
import { ChatsProvider } from '../../providers/chats-prov';
import { Logger } from '../../providers/logger-prov';

@Component({
    selector: 'modal-chat',
    templateUrl: 'modal-chat.html'
})
/**
 * Modal to display a chat in full screen
 * There the user can answer and simply read
 * The chat is chosen thanks to its ID, and fetched from the local datacache
 */
export class ModalChatComponent {
    // Chat to display
    chat: Chat = new Chat();
    messages: Message[] = [];
    newmessage: Message = new Message();
    currentUser: User = new User();

    constructor(public params: NavParams, public viewCtrl: ViewController, private chatsProv: ChatsProvider, private userProv: UsersProvider) {

        // chatID as received by parameter
        var chatID = params.get('chatID');
        Logger.debug(this, 'chatID', chatID);

        // Gets the chat thanks to its ID
        this.userProv.getCurrentUser()
            .then(currentUser => {
                this.currentUser = currentUser;
                return chatsProv.getChat(chatID);
            })
            .then(chat => {
                Logger.debug(this, 'chat received', chat);
                // copy the received chat to the display
                this.chat = chat;
                return chatsProv.getMessages({ chatID: chat.id }, true);
            })
            .then(messages => {
                Logger.debug(this, 'messages received', messages);
                // copy the received messages to the display
                this.messages = messages;
                this.messages.forEach(message => {
                    userProv.getProfile(message.userid)
                        .then(user => {
                            message.username = user.name;
                        })
                        .catch(err => {
                            Logger.error(this, 'getProfile', err);
                        });
                });
            })
            .catch(err => {
                Logger.error(this, 'getChat', err);
            });
    }

    public getPicture(userid: string): string {
        var picturepath: string = "";
        this.chat.activeusers.forEach(user => {
            if (user.id == userid) {
                picturepath = user.lowres_img_url;
            }
        })
        if (picturepath == ""){
            picturepath = "assets/img/profile.png";
        }
        return picturepath;
    }

    public sendMessage() {
        this.newmessage.chatID = this.chat.id;
        this.newmessage.userid = this.currentUser.id;
        this.chatsProv.sendMessage(this.newmessage)
            .then(newmessage => {
                this.newmessage = new Message();
            })
            .catch(err => {
                Logger.error(this, 'sendMessage', err);
            });
    }

    /**
     * Closes modal and returns appropriate data
     */
    public closeModal() {
        let returnData = {};
        this.viewCtrl.dismiss(returnData);
    }

}
