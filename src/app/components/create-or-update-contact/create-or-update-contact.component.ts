import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { IContact } from 'src/app/shared/models/contact.model';
import { StorageService } from 'src/app/shared/services/storage.service';
type formActions = 'create'| 'update';
@Component({
  selector: 'app-create-or-update-contact',
  templateUrl: './create-or-update-contact.component.html',
  styleUrls: ['./create-or-update-contact.component.scss']
})
export class CreateOrUpdateContactComponent implements OnInit {
  public contactForm: FormGroup;
  public action: formActions;

  constructor(private _activatedRoute: ActivatedRoute, private _storageService: StorageService,
    private _router: Router) {
    this.contactForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phoneNumber: new FormControl('', [Validators.required]),
      contactImage: new FormControl(''),
      physicalAddress: new FormControl(''),
      id: new FormControl(''),
    });
    this.action = 'create';
  }

  ngOnInit(): void {
    this._inspectQueryParams();
  }

  private _inspectQueryParams(){
    this._activatedRoute.params.pipe(map((params:any) => params.id)).subscribe({
      next: id => {
      if(id !== 'new'){
        this._getContact(id);
      }
      }
    })
  }

  private _getContact(id:string) {
    this.action = 'update';
    const matchedContact = this._storageService.storageAPI('read',{
      oneOrMany: 'one',
      id
    });
    if(matchedContact){
      for (const contactField in matchedContact){
        this.contactForm.get(contactField)?.patchValue(matchedContact[contactField])
      }
    }
  }

  public addOrUpdate(action: formActions){
    const contactDetails = this.contactForm.value;
    if(action === 'create'){
      return this._createContact(contactDetails);
    }
    return this._updateContact(contactDetails);
  }

  private _createContact(details: IContact) {
    details.id = Math.floor(Math.random()*1000000).toString();
    this._storageService.storageAPI('create',{contact: details});
    this._goBackHome();
  }

  private _updateContact(details: IContact) {
    this._storageService.storageAPI('update',{updatedContact: details})
    this._goBackHome();
  }

  private _goBackHome(){
    this._router.navigate(['all'])
  }

}
