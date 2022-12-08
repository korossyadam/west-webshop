import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { BatteryComponent } from './battery/battery.component';
import { CarComponent } from './car/car.component';
import { CartComponent } from './cart/cart.component';
import { CategoriesComponent } from './categories/categories.component';
import { Categories2Component } from './categories2/categories2.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { OfferComponent } from './offer/offer.component';
import { ProductComponent } from './product/product.component';
import { ProductsComponent } from './products/products.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: 'main', component: HomeComponent },
  { path: 'profile/:tab', component: ProfileComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'cart', component: CartComponent },
  { path: 'battery', component: BatteryComponent },
  { path: 'offer', component: OfferComponent },
  { path: 'car/:index', component: CarComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:category', component: ProductsComponent },
  { path: 'products/:searchedCategory', component: ProductsComponent },
  { path: 'product/:partNumber', component: ProductComponent },
  { path: 'categories/:category', component: CategoriesComponent },
  { path: 'categories2/:category', component: Categories2Component },
  { path: 'admin', component: AdminComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
