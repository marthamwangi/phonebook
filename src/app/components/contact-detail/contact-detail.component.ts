import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { IContact } from 'src/app/shared/models/contact.model';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.scss']
})
export class ContactDetailComponent implements OnInit {
  public contact: IContact | null;
  constructor(private _storageService: StorageService, private _activatedRoute: ActivatedRoute) {
    this.contact = null;
   }

  ngOnInit(): void {
    this._getContactById();
  }

  private _getContactById(){
      this._activatedRoute.params.pipe(map((params: any) => params.id )).subscribe(
      id =>{
        this.contact = this._storageService.storageAPI('read',{
          oneOrMany:'one',
          id
        })
      }
    )
  }

}
