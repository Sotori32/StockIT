import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component'
import { StorageComponent } from './components/storage/storage.component';

const routes: Routes = [
  { path: '',   redirectTo: '/storage', pathMatch: 'full' },
  { path: 'storage', title: 'Storage | StockIT', component: StorageComponent, canActivate: [AuthGuard]},
  { path: 'login', title: 'Log into your account | StockIT', component: LoginComponent },
  { path: 'signup', title: 'Sign up and create your account | StockIT', component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
