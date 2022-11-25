import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component'
import { StorageComponent } from './components/storage/storage.component';
import { WarehousesComponent } from './components/warehouses/warehouses.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { ManufacturersComponent } from './components/manufacturers/manufacturers.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';

const routes: Routes = [
  { path: '',   redirectTo: '/storage', pathMatch: 'full' },
  { path: 'storage', title: 'Termékek | StockIT', component: StorageComponent, canActivate: [AuthGuard]},
  { path: 'login', title: 'Bejelentkezés | StockIT', component: LoginComponent },
  { path: 'signup', title: 'Regisztráció | StockIT', component: SignupComponent },
  { path: 'warehouses', title: 'Raktárak | StockIT', component: WarehousesComponent, canActivate: [AuthGuard]},
  { path: 'categories', title: 'Kategóriák | StockIT', component: CategoriesComponent, canActivate: [AuthGuard]},
  { path: 'manufacturers', title: 'Gyártók | StockIT', component: ManufacturersComponent, canActivate: [AuthGuard]},
  {path:'user-settings', title: 'Felhasználói beállítások | StockIT', component: UserSettingsComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
