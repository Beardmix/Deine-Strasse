import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { ModalInsertionComponent } from '../../components/modal-insertion/modal-insertion';
import { User } from '../../classes/class-user';
import { Insertion } from '../../classes/class-insertion';
import { UsersProvider } from '../../providers/users-prov';
import { InsertionsProvider } from '../../providers/insertions-prov';
import { Logger } from '../../providers/logger-prov';

@Component({
    selector: 'modal-profile',
    templateUrl: 'modal-profile.html'
})
/**
 * Modal to display a profile's attributes in full screen
 * The profile is chosen thanks to its ID, and fetched from the local datacache
 */
export class ModalProfileComponent {
    // Profile to display
    profile: User = new User();
    insertions: Insertion[] = [];

    constructor(
        public params: NavParams, 
        public modalCtrl: ModalController,
        public viewCtrl: ViewController, 
        private insertionsProv: InsertionsProvider,
        private usersProv: UsersProvider) {

        // userID as received by parameter
        var userID = params.get('userID');
        Logger.debug(this, 'userID', userID);

        // Gets the user profile thanks to its ID
        usersProv.getProfile(userID)
            .then(profile => {
                // copy the received profile to the display
                this.profile = profile;
                return this.insertionsProv.getInsertions({personID: this.profile.personID}); 
            })
            .then(insertions => {
                Logger.debug(this, 'insertions for the user received', insertions);
                // copies insertions to the display
                this.insertions = insertions;
            })
            .catch(err => {
                Logger.error(this, 'getProfile', err);
            });
    }

    /**
     * Closes modal and returns appropriate data
     */
    public closeModal() {
        let returnData = {};
        this.viewCtrl.dismiss(returnData);
    }

    /**
     * Presents the insertion modal when clicked on a list element
     * @param insertionId ID of the insertion to display
     */
    presentInsertionModal(insertionId) {
        let profileModal = this.modalCtrl.create(ModalInsertionComponent, { insertionId: insertionId });
        profileModal.present();
    }

}
