import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ModalChatComponent } from './modal-chat';

@NgModule({
    declarations: [
        ModalChatComponent,
    ],
    imports: [
        IonicModule,
    ],
    exports: [
        ModalChatComponent
    ]
})
export class ModalChatComponentModule { }
