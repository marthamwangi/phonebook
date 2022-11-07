import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ContactDetailComponent } from './components/contact-detail/contact-detail.component';
import { CreateOrUpdateContactComponent } from './components/create-or-update-contact/create-or-update-contact.component';
import { ListContactsComponent } from './components/list-contacts/list-contacts.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

const routes: Array<Route> = [
  { path: 'all', component:ListContactsComponent},
  { path: 'create/:id', component:CreateOrUpdateContactComponent},
  { path: 'view/:id', component:ContactDetailComponent},
  { path: '', pathMatch:'full', redirectTo: 'all'},
  { path: '**', component:NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

