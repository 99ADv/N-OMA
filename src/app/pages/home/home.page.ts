//#region Angular
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
//#endregion

//#region Service
import { TicketService } from 'src/app/core/services/ticket/ticket.service';
import { HelpersDevService } from 'src/app/core/services/helperDev/helper-dev.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { ChatService } from 'src/app/core/services/chat/chat.service';
import { NotificactionService } from 'src/app/core/services/notification/notificaction.service';
//#endregion

//#region Interface
import { notification } from 'src/app/interface/others';
//#endregion

//#region Capacitor
import { Storage } from '@capacitor/storage';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token
} from '@capacitor/push-notifications';
import { FCM } from "@capacitor-community/fcm";
//#endregion

//#region Variables
import { TOKEN_KEY } from 'src/app/core/guards/autoLogin/auto-login.guard';
//#endregion

import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  //#region Variables
  notfyTimeout: any = null;

  //#region DOM
  bell: boolean = false;
  chatBell: boolean = true;
  //#endregion

  //#endregion

  //#region Object
  modal: notification = {
    modal: 'hide',
    type_of_message: '',
    message: ''
  }
  user: any = {
    id: -1,
    login: '',
    name: '',
    email: '',
    token: ''
  }
  abstract: any = {
    incoming: 0,
    resolved: 0,
    service: {
      incoming: 0,
      resolved: 0
    },
    chat: {
      incoming: 0,
      resolved: 0
    },
    email: {
      incoming: 0,
      resolved: 0
    },
    tel: {
      incoming: 0,
      resolved: 0
    },
  }
  //#endregion

  //#region Index
  constructor(
    private router: Router,
    private ticketService: TicketService,
    private helperDev: HelpersDevService,
    private userSerivce: UserService,
    private socket: Socket,
    private chatService: ChatService,
    private platform: Platform,
    private notification: NotificactionService
  ) { }

  //#region life cycle
  async ionViewWillEnter() {
    this.user = JSON.parse((await Storage.get({ key: 'user' })).value);
    this.userSerivce.token = JSON.parse((await Storage.get({ key: TOKEN_KEY })).value);
    let notoficatioPoint = await Storage.get({ key: 'notification' });
    let chatPoint = await Storage.get({ key: 'chat' });

    if (notoficatioPoint && notoficatioPoint.value == 'true') this.bell = true;
    else this.bell = false;

    if (chatPoint && chatPoint.value == 'true') this.chatBell = true;
    else this.chatBell = false;

    this.GetAbstract();
    this.GetMessages(false);
    this.GetNotification();
  }

  async ngOnInit() {
    // this.LocalNotification();
    this.SocketEvents();
  }
  //#endregion

  //#endregion

  //#region API
  GetAbstract() {
    this.Notify('show-loading', 'Cargando contendido', '', false)
    this.ticketService.GetAbstract({ userLogin: this.user.login }).subscribe(
      (result: any) => {
        let interpretResponse = this.helperDev.InterpretResponse(result);
        if (interpretResponse.status == false) {
          this.Notify('show-message', 'bug', 'Error interno.', true)
          return false;
        }
        this.Notify('hide', '', '', false)
        this.abstract = result.result;
      }
      ,
      error => this.Notify('show-message', 'bug', '(404) Error interno.', true)
    )
  }

  GetMessages(sw: boolean) {
    this.chatService.GetNewMessages({ fromPage: '1' }).subscribe(
      async (result: any) => {
        let interpretResponse = this.helperDev.InterpretResponse(result);
        if (interpretResponse.status == false) {
          this.Notify('show-message', 'bug', 'Error interno.', true)
          return;
        }
        const chats = result.result.new_messages;

        await Storage.remove({ key: 'chat' });
        this.chatBell = false;
        if (chats > 0) {
          await Storage.set({ key: 'chat', value: 'true' });
          this.chatBell = true;
          if (sw) {
            const audio = new Audio('../../../../assets/audio/timbre2.mp3')
            audio.play();
          }
        }
      },
      error => this.Notify('show-message', 'bug', '(404) Error interno.', true)
    )
  }

  GetNotification() {
    this.notification.Get({fromPage: '1'}).subscribe(
      async (result: any) => {
        
        let interpretResponse = this.helperDev.InterpretResponse(result);
        if (interpretResponse.status == false) {
          this.Notify('show-message', 'bug', 'Error interno.', true)
          return;
        }
        this.Notify('hide', '', '', false);
        
        await Storage.remove({ key: 'notification' });
        this.bell = false;
        
        if(result.notifications.length > 0) {
          await Storage.set({ key: 'notification', value: 'true' });
          this.bell = true;
        }
      },
      error => this.Notify('show-message', 'bug', '(404) Error interno.', false)
    )
  }
  //#endregion

  //#region Event
  async SingOut() {
    await Storage.remove({ key: TOKEN_KEY });
    await Storage.remove({ key: 'user' });
    await Storage.remove({ key: 'notification' });
    await Storage.remove({ key: 'chat' });
    await Storage.remove({ key: '01e' });
    this.router.navigate(['/login']);
  }

  SocketEvents() {
    this.socket.fromEvent('ticket_closed').subscribe(
      (result: any) => {
        if (this.user.login == result.to) {
          this.GetAbstract();
        }
      }
    )

    this.socket.fromEvent('notification').subscribe(
      async (result: any) => {
        await Storage.remove({ key: 'notification' });
        this.bell = false;
        if ((result.permissions == '2' || result.permissions == '0') && result.show == '1') {
          const audio = new Audio('../../../../assets/audio/timbre1.mp3')
          audio.play();
          await Storage.set({ key: 'notification', value: 'true' });
          this.bell = true;
          this.Notify('show-message', 'message', result.message, false)
        }
      }
    )

    this.socket.fromEvent('call_log').subscribe(
      (result: any) => {
        if (result == this.user.login) this.GetAbstract();
      }
    )

    this.socket.fromEvent('message').subscribe(
      (result: any) => {
        if (this.user.login == result.to) {
          this.GetMessages(true);
        }
      }
    )
  }

  LocalNotification(): void {
    if (this.platform.is('capacitor')) {
      PushNotifications.requestPermissions().then(result => {
        if (result.receive === 'granted') {
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register();
          // console.log("Permisos concedidos");
        } else {
          // Show some error
          // console.log("no se consedieron los permisos");
        }
      });

      //#region ...
      // On success, we should be able to receive notifications
      // PushNotifications.addListener('registration',
      //   (token: Token) => {
      //     // console.log('Push registration success, token: ' + token.value);
      //   }
      // );

      // Some issue with our setup and push will not work
      // PushNotifications.addListener('registrationError',
      //   (error: any) => {
      //     // console.log('Error on registration: ' + JSON.stringify(error));
      //   }
      // );

      // Show us the notification payload if the app is open on our device
      // PushNotifications.addListener('pushNotificationReceived',
      //   (notification: PushNotificationSchema) => {
      //     // console.log('Push received: ' + JSON.stringify(notification));
      //   }
      // );

      // Method called when tapping on a notification
      // PushNotifications.addListener('pushNotificationActionPerformed',
      //   (notification: ActionPerformed) => {
      //     // console.log('Push action performed: ' + JSON.stringify(notification));
      //   }
      // );
      //#endregion

      FCM.subscribeTo({ topic: "not" })
      .then((r) => console.log(`subscribed to topic`))
      .catch((err) => console.log(err));
    }
  }
  //#endregion

  //#region DOM
  Notify(modal: string, messageType: string, message: string, setTimeout_vr: boolean) {
    this.modal.modal = modal;
    this.modal.type_of_message = messageType;
    this.modal.message = message;
    if (setTimeout_vr) {
      if (this.notfyTimeout) clearTimeout(this.notfyTimeout);
      this.notfyTimeout = setTimeout(() => {
        this.Notify('hide', '', '', false);
      }, 5000);
    }
  }
  //#endregion
}