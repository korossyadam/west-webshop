import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BatteryComponent } from './battery/battery.component';
import { CarSelectorComponent } from './car-selector/car-selector.component';
import { CartComponent } from './cart/cart.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { OfferComponent } from './offer/offer.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
    { path: '', redirectTo: '/main', pathMatch: 'full' },
    { path: 'main', component: HomeComponent },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService] },
    { path: 'login', component: LoginComponent },
    { path: 'cart', component: CartComponent },
    { path: 'battery', component: BatteryComponent },
    { path: 'offer', component: OfferComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuardService]
})
export class AppRoutingModule { }
