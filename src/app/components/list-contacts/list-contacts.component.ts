import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, Subject, takeUntil } from 'rxjs';
import { IContact } from 'src/app/shared/models/contact.model';
import { StorageService } from 'src/app/shared/services/storage.service';
import {faGripVertical, faPencil, faList, faPlus,faSearch,IconDefinition, faTrash} from '@fortawesome/free-solid-svg-icons';

type LayoutTypes = 'list' | 'grid';

interface ILayout {
  style: LayoutTypes;
  icon: IconDefinition;
}

@Component({
  selector: 'app-list-contacts',
  templateUrl: './list-contacts.component.html',
  styleUrls: ['./list-contacts.component.scss']
})
export class ListContactsComponent implements OnInit, OnDestroy{
  faPlus = faPlus;
  faGripVertical = faGripVertical;
  faList=faList;
  faSearch=faSearch;
  faPencil = faPencil;
  faTrash =faTrash;
  public renderedContacts$: BehaviorSubject<Array<IContact>>;
  private _unsubscribe$: Subject<boolean>;
  private _contacts: Array<IContact>;
  public searchForm:FormGroup;
  public contactIdsToDelete: Array<string>;
  public contactToDelete: IContact | null;
  public layout: ILayout;
  public layoutStyles: Array<ILayout>;

  constructor(private _storageService: StorageService) {
    this.renderedContacts$ = new BehaviorSubject<Array<IContact>>([]);
    this._unsubscribe$ = new Subject<boolean>();
    this._contacts = [];
    this.searchForm = new FormGroup({
      searchQuery: new FormControl()
    });
    this.contactIdsToDelete = [];
    this.contactToDelete = null;
    this.layoutStyles = [
      {style: 'list', icon: this.faList},
      {style: 'grid', icon: this.faGripVertical}
    ]
    this.layout = this.layoutStyles[1]
  }

  ngOnInit(): void {
    /**
     * 1. prevent always creating initialization for
     * contacts by moving the initialization logic to AppComponent ngOnInit
     * 2. listen for contacts changes
    */
    this._listenContactsChanges();
    this._listenForSearchInput();
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next(true);
    this._unsubscribe$.complete();
  }

  public changeLayoutStyle(layoutStyle: ILayout){
    this.layout = layoutStyle;

  }

  private _listenContactsChanges(){
    (this._storageService.storageAPI('read', {
      oneOrMany: 'many'
    }) as Observable<Array<IContact>>).pipe(
      takeUntil(this._unsubscribe$)
    ).subscribe({
      next: contacts => {
        this._contacts = contacts;
        this.renderedContacts$.next(contacts);
      }
    })
  }



  private _listenForSearchInput(){
    this.searchForm.get('searchQuery')?.valueChanges.pipe(
      //when component is destroyed stop listening
      takeUntil(this._unsubscribe$),
      //only listen for distinct changes
      distinctUntilChanged(),
      //only search after N ms since last user's input to avoid unnecessary requests to data store
      debounceTime(300)
    ).subscribe({
      next: value => this._filterContacts(value.toLowerCase().trim())
    })
  }

  private _filterContacts(searchTerm: string) {
    console.log(searchTerm)
    this.renderedContacts$.next(this._contacts.filter(contact => (`${contact.firstName} ${contact.lastName}`).toLowerCase().includes(searchTerm)))
  }

  public addOrRemoveFromContactsToDelete(action:'add' | 'remove', contactId: string){
    if(action === 'add'){
      this.contactIdsToDelete.push(contactId);
    }else{
      this.contactIdsToDelete = this.contactIdsToDelete.filter(contactToDelete => contactToDelete !== contactId);
    }
  }

  public deleteSelectedContacts(){
    this._doDeletion(this.contactIdsToDelete);
  }

  public markContactToDelete(contact: IContact){
    this.contactToDelete = contact;
  }

  public deleteOneContact(contactId: string | undefined){
    if(!contactId){
      return
    }
    this._doDeletion([contactId]);
  }

  private _doDeletion(idsToDelete: Array<string>){
    this._storageService.storageAPI('delete',{
      idsToDelete
    });
    this._resetAllDeletions();
  }

  private _resetAllDeletions(){
    this.contactToDelete = null;
    this.contactIdsToDelete = [];
  }

  public trackFunction(index: number, contact: IContact) {
    return contact.id
  }
}
