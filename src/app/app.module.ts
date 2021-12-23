//#region Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
//#endregion

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

//#region Components
import { AppComponent } from './index/app.component';
import { AppRoutingModule } from './app-routing.module';
//#endregion

//#region Services
import { TokenInterceptorService } from './core/services/token-interceptor/token-interceptor.service';
import { AuthGuard } from './core/guards/auth/auth.guard';
//#endregion

import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

const config: SocketIoConfig = { url: environment.api_ws, options: { path: environment.path } };

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    HttpClientModule,
    SocketIoModule.forRoot(config)
  ],
  providers: 
  [
    { provide: RouteReuseStrategy, 
      useClass: IonicRouteStrategy 
    },
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
