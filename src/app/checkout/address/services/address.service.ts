import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Address } from '../../../core/models/address';
import { map, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { getCurrentUser } from '../../../auth/reducers/selectors';
import { Store } from '@ngrx/store';
import { AppState } from '../../../interfaces';

@Injectable()
export class AddressService {
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastrService: ToastrService,
    private store: Store<AppState>,
  ) { }

  initAddressForm() {
    return this.fb.group({
      'first_name': ['', Validators.required],
      'last_name': ['', Validators.required],
      'address_line_1': ['', Validators.required],
      'address_line_2': ['', Validators.required],
      'city': ['', Validators.required],
      'phone': ['', Validators.required],
      'zip_code': ['', Validators.required],
      'state_name': ['', Validators.required]
    });
  }

  initEmailForm() {
    return this.fb.group({
      email: ['', Validators.required]
    });
  }

  createAddresAttributes(address) {
    return {
      order: {
        bill_address_attributes: address,
        ship_address_attributes: address
      }
    };
  }

  createGuestAddressAttributes(address, email) {
    return {
      order: {
        email: email,
        bill_address_attributes: address,
        ship_address_attributes: address
      }
    };
  }
  // Country ID: 105 is for INDIA.
  getAllStates(): Observable<any> {
    return this.http.get<any>(`api/v1/countries/105/states`)
  }

  updateAddress(updatedAddress, addressId, orderNumber) {
    const url = `api/v1/orders/${orderNumber}/addresses/${addressId}?`
      + `address[firstname]=${updatedAddress.firstname}`
      + `&address[lastname]=${updatedAddress.lastname}`
      + `&address[address1]=${updatedAddress.address1}`
      + `&address[address2]=${updatedAddress.address2}`
      + `&address[city]=${updatedAddress.city}`
      + `&address[state_name]=${updatedAddress.state_name}`
      + `&address[phone]=${updatedAddress.phone}`
      + `&address[zipcode]=${updatedAddress.zipcode}`
      + `&address[state_id]=${updatedAddress.state_id}`
      + `&address[country_id]=${updatedAddress.country_id}`
      
    return this.http.put(url, {}).pipe(
      map(resp => { return resp }
      ), tap(_ => { this.toastrService.success('Address Updated SuccesFully!', 'Success'); },
        _ => { this.toastrService.error('Address Could not be Updated', 'Failed'); }
      )
    )
  }

  saveUserAddress(address: Address): Observable<Address> {
    let userId: string;
    this.store.select(getCurrentUser).subscribe(user => userId = user.id);
    const params = this.buildAddressJson(address, userId);
    return this.http.post<Address>(`http://localhost:3000/api/v1/addresses`, params).pipe(
      map(resp => {
        return resp;
      }), tap(_ => { this.toastrService.success('Address added successfully!', 'Success!') },
        _ => { this.toastrService.error('Could not save address!', 'Failed!') }
      )
    )
  }

  buildAddressJson(address: Address, userId: string) {
    const params = {
      'data':
      {
        'type': 'address',
        'attributes':
          address
        , 'relationships':
        {
          'user':
          {
            'data':
            {
              'id': userId
            }
          }
        }
      }
    };
    return params;
  }
}
