import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { ModalProfileComponent } from '../../components/modal-profile/modal-profile';
import { User } from '../../classes/class-user';
import { DataCtrlProvider } from '../../providers/data-ctrl';
import { UsersProvider } from '../../providers/users-prov';
import { Logger } from '../../providers/logger-prov';

@Component({
    selector: 'page-profiles',
    templateUrl: 'profiles.html'
})
export class ProfilesPage {
    neighbours: User[] = [];
    currentUser: User = new User;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public modalCtrl: ModalController,
        private users: UsersProvider) {

    }

    ionViewDidLoad() {
        Logger.info(this, 'ionViewDidLoad');

        this.users.getCurrentUser()
            .then(currentUser => {
                this.currentUser = currentUser;
            })
            .catch(err => {
                Logger.error(this, 'getCurrentUser', err);
            })

        this.users.getNeighbours()
            .then(neighbours => {
                this.neighbours = neighbours;
            })
            .catch(err => {
                Logger.error(this, 'getNeighbours', err);
            })
    }

    presentProfileModal(userID) {
        let profileModal = this.modalCtrl.create(ModalProfileComponent, { userID: userID });
        profileModal.present();
    }

    openSettings() {
        Logger.info(this, 'Opening Settings');
    }

}