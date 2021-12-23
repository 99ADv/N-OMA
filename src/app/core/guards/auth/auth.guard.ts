//#region Angular
import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
//#endregion

//#region Service
import { UserService } from '../../services/user/user.service';
//#endregion

//#region Capacitor
import { Storage } from '@capacitor/storage';
//#endregion

import { TOKEN_KEY } from '../autoLogin/auto-login.guard';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  
  constructor (private userService: UserService,private router: Router) {} 

  async canLoad(): Promise<boolean> {
    const token = await Storage.get({key: TOKEN_KEY})
    if(token && token.value != '' && token.value != null && token.value != undefined){
      return true;
    }
    else  {
      this.router.navigateByUrl('/login', {replaceUrl: true})
      return false;
    }
  }
}
