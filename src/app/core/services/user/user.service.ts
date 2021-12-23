//#region Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
//#endregion

//#region Capacitor
import { Storage } from '@capacitor/storage';
//#endregion

//#region Others
import { environment } from 'src/environments/environment';
//#endregion

import { TOKEN_KEY } from '../../guards/autoLogin/auto-login.guard';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  //#region Variables
  private token$: Subject<boolean>;
  public token: string = '';
  //#endregion

  //#region Start
  constructor(private http: HttpClient) {
    this.token$ = new Subject();
   }
  //#endregion
  
  //#region Login
  LogIn(user: any) {
    return this.http.get(environment.api_url + 'user/login', {
      params: user
    });
  }

  async LoadToken(data: any): Promise<any> {
    if(!data.token && data.ow == '') return;
    this.token = data.token;
    await Storage.set({key: TOKEN_KEY, value: JSON.stringify(data['token'])});
    await Storage.set({key: '01e', value: JSON.stringify(data['ow'])});
    await Storage.set({key: 'user', value: JSON.stringify(data['userData'])});

    this.token$.next(true);
  }

  async LogOut(): Promise<any> {
    await Storage.remove({key: TOKEN_KEY});
    this.token$.next(false);
  }
  //#endregion
}