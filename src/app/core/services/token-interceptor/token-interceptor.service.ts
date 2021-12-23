import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http'

//#region Service
import { UserService } from '../user/user.service';
//#endregion

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor(private authService: UserService) { }

  intercept(req: any, next: any) {
    let tokenizeReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${ this.authService.token }`
      }
    });
    return next.handle(tokenizeReq);
  }
}