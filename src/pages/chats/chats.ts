import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { ModalChatComponent } from '../../components/modal-chat/modal-chat';

import { ChatsProvider } from '../../providers/chats-prov';
import { UsersProvider } from '../../providers/users-prov';
import { Logger } from '../../providers/logger-prov';

import { Chat } from '../../classes/class-chat';

@Component({
    selector: 'page-chats',
    templateUrl: 'chats.html'
})
/**
 * Page for the chats
 * Lists all existing chats and provides the ability to delete them
 */
export class ChatsPage {
    // List of available chats
    chats: Chat[];
    // Loading element preventing actions while data is being fetched
    loading: any;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public modalCtrl: ModalController,
        private users: UsersProvider,
        public loadingCtrl: LoadingController,
        private chatsProv: ChatsProvider) {

        // starts the loading UI element
        this.presentLoadingDefault();
    }

    /**
     * Function triggered when the View has been loaded
     */
    ionViewDidLoad() {
        Logger.info(this, 'ionViewDidLoad');

        // Get all chats
        this.chatsProv.getChats()
            .then(chats => {
                Logger.debug(this, 'chats received', chats);
                // stop the loading action as over
                this.loading.dismiss();
                // copies chats to the display
                this.chats = chats;

                var listPromises = [];
                this.chats.forEach(chat => {
                    listPromises.push(this.chatsProv.getChatUsers(chat));
                })
                Promise
                    .all(listPromises)
                    .then(activeusers => {
                        this.chats.forEach((chat, index) => {
                            chat.activeusers = activeusers[index];
                        })
                    })
                    .catch(err => {
                        Logger.error(this, 'fetchChatUsers', err);
                    });
            })
            .catch(err => {
                Logger.error(this, 'fetchChats', err);
                this.loading.dismiss();
            });
    }

    /**
     * Shows the default loading element
     */
    presentLoadingDefault() {
        this.loading = this.loadingCtrl.create({});
        this.loading.present();
    }

    /**
     * Presents the chat modal when clicked on a list element
     * @param chatID ID of the chat to display
     */
    presentChatModal(chatID) {
        let profileModal = this.modalCtrl.create(ModalChatComponent, { chatID: chatID });
        profileModal.present();
    }

}
