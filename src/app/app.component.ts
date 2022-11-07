import { Component, OnInit } from '@angular/core';
import { StorageService } from './shared/services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(private _storageService: StorageService){}
  title = 'phonebook';

  ngOnInit(){
    this._initializeContacts();
  }

  private _initializeContacts(){
    this._storageService.setContacts();
  }
}
