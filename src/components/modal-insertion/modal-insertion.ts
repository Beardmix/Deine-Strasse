import { Component } from '@angular/core';
import { NavParams, ViewController, ModalController } from 'ionic-angular';
import { ModalChatComponent } from '../../components/modal-chat/modal-chat';
import { Insertion } from '../../classes/class-insertion';
import { User } from '../../classes/class-user';
import { InsertionsProvider } from '../../providers/insertions-prov';
import { UsersProvider } from '../../providers/users-prov';
import { ChatsProvider } from '../../providers/chats-prov';
import { Logger } from '../../providers/logger-prov';

@Component({
    selector: 'modal-insertion',
    templateUrl: 'modal-insertion.html'
})
/**
 * Modal to display an insertion's attributes in full screen
 * The insertion is chosen thanks to its ID, and fetched from the local datacache
 */
export class ModalInsertionComponent {
    // insertion to display
    insertion: Insertion = new Insertion();
    updateDate: string = "";
    profile: User = new User();
    distance: string;

    constructor(
        public params: NavParams, 
        public viewCtrl: ViewController, 
        private insertionsProv: InsertionsProvider, 
        public modalCtrl: ModalController,
        private usersProv: UsersProvider,
        private chatsProv: ChatsProvider) {

        // InsertionID as received by parameter
        var insertionID = params.get('insertionId');
        Logger.debug(this, 'insertionId', insertionID);

        // Gets the insertion thanks to its ID
        insertionsProv.getInsertion(insertionID)
            .then(insertion => {
                // copy the received insertion to the display
                this.insertion = insertion;
                var date = insertion.end; 
                this.updateDate = "" + date.getDay() + "." + date.getMonth() + "." + date.getFullYear();

                return this.usersProv.getProfilePersonID(insertion.creator);
            })
            .then(profile => {
                // copy the received profile to the display
                this.profile = profile;
                this.usersProv.getDistanceToUser(profile)
                .then(distance => {
                    this.distance = distance;
                })
                .catch(err => {
                    Logger.error(this, 'getInsertion', err);
                });
            })
            .catch(err => {
                Logger.error(this, 'getInsertion', err);
            });
    }

    public startChat() {
        this.chatsProv.startChat(this.insertion.title, this.profile)
        .then(chat => {
            this.presentChatModal(chat.id);
        })
        .catch(err => {
            Logger.error(this, 'startChat', err);
        });
    }
    
    private presentChatModal(chatID) {
        let profileModal = this.modalCtrl.create(ModalChatComponent, { chatID: chatID });
        profileModal.present();
    }

    /**
     * Closes modal and returns appropriate data
     */
    public closeModal() {
        let returnData = {};
        this.viewCtrl.dismiss(returnData);
    }

}
