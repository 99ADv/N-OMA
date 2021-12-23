//#region Angular
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
//#endregion

//#region Services
import { HelpersDevService } from 'src/app/core/services/helperDev/helper-dev.service';
import { UserService } from 'src/app/core/services/user/user.service';
//#endregion

//#region Interface
import { notification } from 'src/app/interface/others';
//#endregion

//#region Capacitor
import { Storage } from '@capacitor/storage';
import { TOKEN_KEY } from 'src/app/core/guards/autoLogin/auto-login.guard';
//#endregion

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  //#region Variables
  notfyTimeout: any;

  //#region DOM
  loginButtonStyle: string = 'login-btn-event';
  //#endregion

  //#endregion

  //#region Object
  loginForm = new FormGroup({
    userLogin: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    fromPage: new FormControl('1', [Validators.required])
  })
  modal: notification = {
    modal: 'hide',
    type_of_message: 'messae',
    message: ''
  }
  //#endregion

  //#region Index
  constructor(
    private userService: UserService,
    private router: Router,
    private helperDev: HelpersDevService,
  ) { }

  //#region Live Cycle
  async ionViewWillEnter() {
    let token = JSON.parse((await Storage.get({key: TOKEN_KEY})).value);
    if(token && token != null && token != undefined && token != ''){
      this.router.navigate(['/home'])
    }
  }

  ngOnInit() {
  }
  //#endregion

  //#endregion

  //#region API
  async Verify(op: number) {
    this.loginButtonStyle = 'login-btn-loading';
    this.userService.LogIn(this.loginForm.value).subscribe(
      async (result: any) => {
        this.loginButtonStyle = 'login-btn-event';
        let interpretResponse = this.helperDev.InterpretResponse(result);
        if (interpretResponse.status == true) {
          await this.userService.LoadToken(result);
          if(op == 2) {
            let navigateTo ='http://161.35.62.68/otrs/customer.pl/customer.pl' + '?' + 'OTRSCustomerInterface' + '=' + result.SessionID;
            window.open(navigateTo, "_blank");
          }
          this.router.navigate(['/home']);
        } else this.Notify('show-message', 'alert', interpretResponse.message, true);
      }
      , error => {
        this.loginButtonStyle = 'login-btn-event';
        this.Notify('show-message', 'bug', '(404)Error interno.', true)
      }
    )
  }
  //#endregion

  //#region DOM
  Notify(modal: string, messageType: string, message: string, setTimeout_vr: boolean) {
    this.modal.modal = modal;
    this.modal.type_of_message = messageType;
    this.modal.message = message;
    if (setTimeout_vr) {
      if(this.notfyTimeout) clearTimeout(this.notfyTimeout);
      this.notfyTimeout = setTimeout(() => {
        this.Notify('hide', '', '', false);
      }, 5000);
    }
  }
  //#endregion
}
