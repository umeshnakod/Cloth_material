import { Component, OnInit, OnDestroy } from '@angular/core';
import { Services } from '../service.component';
import { Http } from '@angular/http';
import { LocalStorageService } from 'angular-2-local-storage';
import {ViewChild, ElementRef} from '@angular/core';


@Component({
  selector: 'app-add-new-contractor',
  templateUrl: './add-new-contractor.component.html',
  styleUrls: ['./add-new-contractor.component.css']
})
export class AddNewContractorComponent implements OnInit {


  tableData: Array<any> = [];
  addNewRow = {};
  itemList = [];
  pannaSize = [];
  size = null;
  constructor(private service: Services, private localStorageService: LocalStorageService) {}
  @ViewChild('panna1', {static: false}) pannaElement : ElementRef; 
  JsonForItemAndPanna: any;
  private fieldArray: Array<any> = [];
  private newAttribute: any = {}
  private contractorDetails : any = {};
  private selectedItem : any;

  addFieldValue(item, index) {
    if ( !item || item.length === index + 1) {
      this.fieldArray.push(this.newAttribute)
      this.newAttribute = {
        item: null,
        panna: null
      };
    }
  }

  setPannaSize(item, event){
    // this.fieldArray = [];
    // this.size = [];

    if(this.fieldArray.length != 1){
      this.addFieldValue(null, null)
    }
    
    if(event.currentTarget.value || event.currentTarget.value == 'default'){
      this.JsonForItemAndPanna.itemList.forEach(data => {
        if(data['itemName'] == item){
          this.size = data['itemSize']
        }
      })
    }else{
      this.pannaSize = [];
      this.size = null; 
    }

  };

  deleteFieldValue(index) {
    this.fieldArray.splice(index, 1);
  }


  saveRecord() {
    this.fieldArray.forEach(response => {response.item = this.selectedItem})
    const obj = {
      itemList: this.fieldArray,
      contractorName: this.contractorDetails
    }
    const headers = {
      'Content-Type': 'application/json'
    }
    this.service.postAddNewContractor(obj, headers)
      .subscribe(response => {
        if(response.json().success){
          this.localStorageService.set('contractorDetails',this.contractorDetails);
          window.location.reload();
        }
      })
  }

  removeLastEntry(){
    this.fieldArray.splice(-1, 1)
  }

  ngOnInit() {

    if(this.localStorageService.get('contractorDetails')){
      let getStoredContaractorDetails = this.localStorageService.get('contractorDetails');
      this.contractorDetails.name = getStoredContaractorDetails['name'];
      this.contractorDetails.age = getStoredContaractorDetails['age'];
    }
    this.localStorageService.set('passval','value1');
    console.log(this.localStorageService.get('passval12'))
    // this.localStorageService.remove('passval')

    // this.contractorDetails.age = 'other';
   this.service.getItemAndPannSize()
      .subscribe(response => {
        this.JsonForItemAndPanna = response.json();
        this.pannaSize = this.JsonForItemAndPanna.pannaSize;
        for (var key in this.JsonForItemAndPanna.itemList) {
            this.itemList.push(this.JsonForItemAndPanna.itemList[key]['itemName'])
        }
      this.itemList = Array.from(new Set(this.itemList))
      this.newAttribute = {
        item: '',
        panna: this.JsonForItemAndPanna[this.itemList[0]],
        size: '',
        avg: ''
      };
      this.addFieldValue(null, null)
    })
  }

  ngOnDestroy(){
    this.localStorageService.remove('contractorDetails');
  }
}
