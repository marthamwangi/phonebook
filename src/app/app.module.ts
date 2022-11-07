import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListContactsComponent } from './components/list-contacts/list-contacts.component';
import { ContactDetailComponent } from './components/contact-detail/contact-detail.component';
import { CreateOrUpdateContactComponent } from './components/create-or-update-contact/create-or-update-contact.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const UI_COMPONENTS = [
  ListContactsComponent,
  ContactDetailComponent,
  CreateOrUpdateContactComponent,
  NotFoundComponent
]
@NgModule({
  declarations: [
    AppComponent,
    /**
     * Any new ui components will need to be added to this list to make code cleaner
     */
    ...UI_COMPONENTS,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
