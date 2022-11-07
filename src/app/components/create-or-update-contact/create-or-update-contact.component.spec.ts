import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrUpdateContactComponent } from './create-or-update-contact.component';

describe('CreateOrUpdateContactComponent', () => {
  let component: CreateOrUpdateContactComponent;
  let fixture: ComponentFixture<CreateOrUpdateContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOrUpdateContactComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOrUpdateContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
