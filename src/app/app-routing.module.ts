import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

//#region Guards
import { IntroGuard } from './core/guards/intro/intro.guard';
import { AutoLoginGuard } from './core/guards/autoLogin/auto-login.guard';
import { AuthGuard } from './core/guards/auth/auth.guard';
//#endregion

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    // canLoad: [AutoLoginGuard]
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'intro',
    loadChildren: () => import('./pages/intro/intro.module').then( m => m.IntroPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'ticket',
    loadChildren: () => import('./pages/ticket/ticket.module').then( m => m.TicketPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'history',
    loadChildren: () => import('./pages/history/history.module').then( m => m.HistoryPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'notifications',
    loadChildren: () => import('./pages/notifications/notifications.module').then( m => m.NotificationsPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'call',
    loadChildren: () => import('./pages/call/call.module').then( m => m.CallPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'chat',
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatPageModule)
      },
      {
        path: ':chatID',
        loadChildren: () => import('./pages/messages/messages.module').then( m => m.MessagesPageModule)
      }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
