import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainNavigationComponent } from './main-navigation/main-navigation.component';
import { ProductsComponent } from './products/products.component';

import { MatCardModule } from  '@angular/material/card';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { CarSelectorComponent } from './car-selector/car-selector.component';

@NgModule({
  declarations: [
    AppComponent,
    MainNavigationComponent,
    ProductsComponent,
    CarSelectorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
