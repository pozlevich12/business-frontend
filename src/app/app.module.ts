import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { authInterceptorProviders } from '../_helpers/auth.intreceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateAdComponent } from './create-ad/create-ad.component';
import { AdComponent } from './ad/ad.component';
import { AdListComponent } from './ad-list/ad-list.component';
import { HoverClassDirective } from 'src/_helpers/dnd/hover-class.directive';
import { AdEditComponent } from './ad-edit/ad-edit.component';
import { DndDirectiveEditAd } from '../_helpers/dnd/dnd-edit-ad.directive';
import { DndDirective } from 'src/_helpers/dnd/dnd.directive';
import { FavoriteBoardComponent } from './favorite-board/favorite-board.component';
import { LoginComponent } from './login/login.component';
import { UserBoardComponent } from './user-board/user-board.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    HomeComponent,
    CreateAdComponent,
    DndDirective,
    DndDirectiveEditAd,
    AdComponent,
    AdListComponent,
    HoverClassDirective,
    AdEditComponent,
    FavoriteBoardComponent,
    LoginComponent,
    UserBoardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
