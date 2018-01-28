import { Component } from "@angular/core";
import { ModalController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Logger } from '../../providers/logger-prov';

import { DataModel } from '../../providers/data-model';
import { DataCtrlProvider } from '../../providers/data-ctrl';

import { LoginPage } from "../login/login";
import { ChatsPage } from "../chats/chats";
import { ListPage } from "../list/list";
import { ProfilesPage } from "../profiles/profiles";
import { MapPage } from "../map/map";

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {

    tab1Root = MapPage;
    tab2Root = ListPage;
    tab3Root = ChatsPage;
    tab4Root = ProfilesPage;

    constructor(
        public modalCtrl: ModalController,
        private splashScreen: SplashScreen,
        private dataCtrl: DataCtrlProvider) {

        DataModel.restoreLoginData()
            .then((data) => {
                this.dataCtrl.loginWithToken(data);
                this.splashScreen.hide();
            }).catch((err) => {
                this.presentsignInModal();
            });
    }

    presentsignInModal() {
        let profileModal = this.modalCtrl.create(LoginPage);
        profileModal.present()
            .then(() => {
                this.splashScreen.hide();
            }).catch(err => {
                Logger.error(this, 'presentsignInModal', err);
                this.splashScreen.hide();
            });
    }
}
