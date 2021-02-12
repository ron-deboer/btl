import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CodesComponent } from './codes/codes.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { ItemsComponent } from './items/items.component';
import { AuthGuardService } from './_services/authguard.service';

const routes: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
    { path: 'codes', component: CodesComponent, canActivate: [AuthGuardService] },
    { path: 'users', component: UsersComponent, canActivate: [AuthGuardService] },
    { path: 'items', component: ItemsComponent, canActivate: [AuthGuardService] },
    { path: 'kanban', redirectTo: '/home', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
