import { ViewOrdersComponent } from './view-orders/view-orders.component';
import { AddNewItemComponent } from './add-new-item/add-new-item.component';
import { ViewContractorDetailsComponent } from './view-contractor-details/view-contractor-details.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { AddNewContractorComponent } from './add-new-contractor/add-new-contractor.component';
import { AddNewEntryComponent } from './add-new-entry/add-new-entry.component';

const routes: Routes = [
  {
    path : '', component : HomePageComponent
  },
    {
        path: 'add-new-contractor', component : AddNewContractorComponent
    },
    {
      path: 'add-new-entry', component : AddNewEntryComponent
  },
    {
      path : 'view-contractor-list', component : ViewContractorDetailsComponent
    },

    {
      path : 'add-new-item', component : AddNewItemComponent
    },

    {
      path : 'view-orders', component : ViewOrdersComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
