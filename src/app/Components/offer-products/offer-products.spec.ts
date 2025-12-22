import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferProducts } from './offer-products';

describe('OfferProducts', () => {
  let component: OfferProducts;
  let fixture: ComponentFixture<OfferProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
