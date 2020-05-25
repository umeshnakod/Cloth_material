import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddNewContractorComponent } from './add-new-contractor/add-new-contractor.component';
import { HomePageComponent } from './home-page/home-page.component';
import { Services } from './service.component';
import { ViewContractorDetailsComponent } from './view-contractor-details/view-contractor-details.component';
import { AddNewEntryComponent } from './add-new-entry/add-new-entry.component';
import { FilterDuplicateItemPipe } from './filter-duplicate-item.pipe';
import { AddNewItemComponent } from './add-new-item/add-new-item.component';
import { LocalStorageModule } from 'angular-2-local-storage';
import { ViewOrdersComponent } from './view-orders/view-orders.component';

@NgModule({
  declarations: [
    AppComponent,
    AddNewContractorComponent,
    HomePageComponent,
    ViewContractorDetailsComponent,
    AddNewEntryComponent,
    FilterDuplicateItemPipe,
    AddNewItemComponent,
    ViewOrdersComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpModule,
    FormsModule,
    LocalStorageModule.forRoot({
      prefix: 'my-root',
      storageType: 'localStorage'
  })
  ],
  providers: [Services],
  bootstrap: [AppComponent]
})
export class AppModule { }
