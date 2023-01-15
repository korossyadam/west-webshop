import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { MainNavigationComponent } from './main-navigation/main-navigation.component';
import { ProductsComponent } from './products/products.component';

import { MatCardModule } from  '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTreeModule } from '@angular/material/tree';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { SidenavComponent } from './sidenav/sidenav.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { CartComponent } from './cart/cart.component';
import { BatteryComponent } from './battery/battery.component';
import { CategoriesComponent } from './categories/categories.component';
import { OfferComponent } from './offer/offer.component';
import { CarComponent } from './car/car.component';
import { ProductComponent } from './product/product.component';
import { FeaturedColumnsComponent } from './featured-columns/featured-columns.component';
import { FeaturedRowsComponent } from './featured-rows/featured-rows.component';
import { AdminComponent } from './admin/admin.component';
import { Categories2Component } from './categories2/categories2.component';
import { FeaturedCategoriesComponent } from './featured-categories/featured-categories.component';
import { OrderDialogComponent } from './dialogs/order-dialog/order-dialog.component';


@NgModule({
  declarations: [
    MainNavigationComponent,
    ProductsComponent,
    SidenavComponent,
    LoginComponent,
    ProfileComponent,
    HomeComponent,
    FooterComponent,
    CartComponent,
    BatteryComponent,
    OfferComponent,
    CarComponent,
    ProductComponent,
    FeaturedColumnsComponent,
    FeaturedRowsComponent,
    CategoriesComponent,
    AdminComponent,
    Categories2Component,
    FeaturedCategoriesComponent,
    OrderDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    MatExpansionModule,
    MatDialogModule,
    MatTreeModule,
    MatProgressBarModule,
    MatRadioModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSidenavModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [SidenavComponent]
})
export class AppModule { }
