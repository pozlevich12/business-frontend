import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdEditComponent } from './ad-edit/ad-edit.component';
import { AdListComponent } from './ad-list/ad-list.component';
import { AdComponent } from './ad/ad.component';
import { CreateAdComponent } from './create-ad/create-ad.component';
import { FavoriteBoardComponent } from './favorite-board/favorite-board.component';
import { MyAdComponent } from './my-ad/my-ad.component';
import { UserBoardComponent } from './user-board/user-board.component';

const routes: Routes = [
  { path: 'profile', component: UserBoardComponent },
  { path: 'my-ad', component: MyAdComponent },
  { path: 'create-ad', component: CreateAdComponent },
  { path: 'ad', component: AdComponent },
  { path: 'ad-list', component: AdListComponent },
  { path: 'ad-edit', component: AdEditComponent },
  { path: 'favorite-board', component: FavoriteBoardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
