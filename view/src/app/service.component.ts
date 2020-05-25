import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()

export class Services {
  // private url: string = 'http://ec2-13-232-159-123.ap-south-1.compute.amazonaws.com:9000';
  private url: string = 'http://localhost:3000';
  constructor(private http: Http) { }

  getItemAndPannSize() {
    return this.http.get(this.url)

  }

  postAddNewContractor(data,header) {
    return this.http.post(this.url + '/post',data, header);
  }

  postCreateNewOrder(data, header){
    return this.http.post(this.url + '/create-new-order',data, header)
  }

  getVendorsListWithDetails(){
    return this.http.get(this.url + '/get_vendor_list');
  }

  postSaveNewItem(data, header){
    return this.http.post(this.url + '/save_new_item', data, header);
  }

  getVendorsNameList(){
    return this.http.get(this.url + '/get_vendors_name_list');
  }

  getSelectedVendorOrderList(data,header){
    return this.http.post(this.url + '/get_orders',data, header);
  }

  postSettlementOfCloth(data,header){
    return this.http.post(this.url + '/make_cloth_settlement',data, header);
  }

}
