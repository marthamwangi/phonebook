import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { StorageAction } from "../interfaces/types.interface";
import { IContact } from "../models/contact.model";

@Injectable({
  providedIn:'root'
})
export class StorageService {
  private _storageKey:string;
  private _contacts$: BehaviorSubject<Array<IContact>>;

  constructor(){
    this._storageKey = 'phonebook.contacts';
    this._contacts$ = new BehaviorSubject<Array<IContact>>([]);
  }

  public setContacts(){
    this._contacts$.next(this._getAllFromStorage());
  }

  public storageAPI(action: StorageAction, payload:any): any {
    switch(action){
      case 'create':
        return this._create(payload.contact);
      case 'read':
        switch(payload.oneOrMany){
          case 'one':
            return this._read(payload.id);
          default:
            return this._fetchAll();
        }
      case 'update':
        return this._update(payload.updatedContact);
      case 'delete':
        return this._delete(payload.idsToDelete);
    }
  }

  private _create(contact: IContact){
    this._updateStorage([...this._getAllFromStorage(), contact]);
    this.setContacts();
  }

  private _read(contactId: string): any {
    return this._getContactById(contactId);
  }

  private _fetchAll(): Observable<Array<IContact>> {
    return this._contacts$
  }

  private _update(updatedContact: any) {
    const updatedList: Array<IContact> = this._getAllFromStorage().map((contact:any) => {
      if(contact.id === updatedContact.id){
        for (const contactDetail in contact){
          contact[contactDetail] = updatedContact[contactDetail]
        }
      }
      return contact;
    });
    this._updateStorage(updatedList);
    this.setContacts();
  }

  private _getContactById(id:string): IContact | undefined {
    return this._getAllFromStorage().find(contact => contact.id === id);
  }

  private _delete(contactsToDeleteIDs: Array<string>) {
    const contactsToKeep = this._getAllFromStorage().filter(contact => contactsToDeleteIDs.indexOf(contact.id) === -1);
    this._updateStorage(contactsToKeep);
    this.setContacts();
  }

  private _getAllFromStorage(): Array<IContact> {
    const myContactList = localStorage.getItem(this._storageKey);
    if (myContactList){
      return JSON.parse(myContactList);
    }
    return [];
  }

  private _updateStorage(items:Array<any>){
    localStorage.setItem(this._storageKey, JSON.stringify(items))
  }

}
