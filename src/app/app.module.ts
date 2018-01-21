import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';

import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { ListPage } from '../pages/list/list';
import { ChatsPage } from '../pages/chats/chats';
import { ProfilesPage } from '../pages/profiles/profiles';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ChatsProvider } from '../providers/chats-prov';
import { UsersProvider } from '../providers/users-prov';
import { InsertionsProvider } from '../providers/insertions-prov';
import { DataCtrlProvider } from '../providers/data-ctrl';
import { DataModel } from '../providers/data-model';
import { ModalInsertionComponent } from '../components/modal-insertion/modal-insertion';
import { ModalProfileComponent } from '../components/modal-profile/modal-profile';
import { Logger } from '../providers/logger-prov';
import { ConnectivityProvider } from '../providers/connectivity-prov';
import { MapProvider } from '../providers/map-prov';

import { Network } from '@ionic-native/network';
import { ModalChatComponent } from '../components/modal-chat/modal-chat';
import { ModalInsertionFieldsComponent } from '../components/modal-insertion-fields/modal-insertion-fields';

@NgModule({
    declarations: [
        MyApp,
        ChatsPage,
        ProfilesPage,
        LoginPage,
        ListPage,
        MapPage,
        TabsPage,
        ModalInsertionComponent,
        ModalProfileComponent,
        ModalChatComponent,
        ModalInsertionFieldsComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        ChatsPage,
        ProfilesPage,
        LoginPage,
        MapPage,
        ListPage,
        TabsPage,
        ModalInsertionComponent,
        ModalProfileComponent,
        ModalChatComponent,
        ModalInsertionFieldsComponent
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        ChatsProvider,
        ChatsProvider,
        UsersProvider,
        InsertionsProvider,
        DataCtrlProvider,
        DataModel,
        Logger,
        ConnectivityProvider,
        MapProvider,
        Network
    ]
})
export class AppModule { }
