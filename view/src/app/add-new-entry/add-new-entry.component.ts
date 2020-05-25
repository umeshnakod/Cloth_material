import { Services } from './../service.component';
import { Http } from '@angular/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-new-entry',
  templateUrl: './add-new-entry.component.html',
  styleUrls: ['./add-new-entry.component.css']
})
export class AddNewEntryComponent implements OnInit {

  contractorListWithDetails : Array<any> =  [];
  selectedVendorDetails : any;
  selectedVendorName : any;
  selectedItem = null;
  selectedItemPannaSize : Array<any> = [];
  selectedItemSize : Array<any> = [];
  selectedItemAvg : Array<any> = [];
  private fieldArray: Array<any> = [];
  private selectedVendorItemList : Array<any> = [];
  orderDescription : any;
  partyName : any;
  totalClothRequire : Number = 0;
  givenCloth = {
    plainCloth: 0
  }

  requiredCloth = {
    plainCloth : 0
  }
  recieptNumber : any;
  totalClothHoldValue  = [];
  holdSelectedItemDetails : Array<any> = [];
  newEntryTableDataTitles : Array<any> = ['Panna', 'Size', 'Quantity', 'Plain Cloth Average'];
  isMatching = false;
  matchingName : Array<any> = [];
  holdMatchingListDetails :Array<any> = [];
  hideSuccess = false;
  

  constructor(private service : Services) { }

  ngOnInit() {
    this.service.getVendorsListWithDetails()
      .subscribe(response => {
        let vendorDetails = response.json()
        for(let vendorName in vendorDetails){
          this.selectedVendorDetails = response.json();
          this.contractorListWithDetails.push(vendorDetails[vendorName]['vendorName'])
        }
        this.contractorListWithDetails = Array.from(new Set(this.contractorListWithDetails));      
      })
  }

  selectedVendor(vendor, index){
    this.fieldArray = [];
    this.selectedVendorItemList = [];
    if(this.selectedItem){
      this.selectedItem = null;
      this.orderDescription = null;
      this.partyName = null;
    }

      for(let vendorName in this.selectedVendorDetails){
        if(this.selectedVendorDetails[vendorName]['vendorName'] === vendor){
          let itemList = this.selectedVendorDetails[vendorName]['items'];
          for (let index = 0; index < itemList.length; index++) {
            this.selectedVendorItemList.push(itemList[index]['itemName'])
          }
        }
      }
      this.selectedVendorItemList = this.selectedVendorItemList.filter((a,b) => this.selectedVendorItemList.indexOf(a) === b);
  }

      // 

  getUnique(arr, comp) {

        // store the comparison  values in array
  const unique =  arr.map(e => e[comp])

      // store the indexes of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)

      // eliminate the false indexes & return unique objects
    .filter((e) => arr[e]).map(e => arr[e]);

  return unique;
  }


// ------------------------------------



// 


fctnAddRowBasedOnIsMatching(index){

  let holdObjectToAddNewRecord = {
    panna : null,
    size : null,
    quantity : null,
    avg : null
  }

  const holdMatchingObject: Array<any> = [];
  if(this.isMatching){
    for(let item of this.matchingName){
      let holdObj = {
        name : item.name,
        totalAvg : 0
      }
      holdMatchingObject.push(holdObj)
    }
    holdObjectToAddNewRecord['matching'] = holdMatchingObject;
    this.fieldArray.push(holdObjectToAddNewRecord);
  }else{
    this.fieldArray.push(holdObjectToAddNewRecord)
  }

}

// --------------------------------------------



fctnSelectedItem(selectedItem, selectedVendorName){
  this.selectedItemPannaSize = [];
  this.selectedItemSize = [];
  this.selectedItemAvg = [];
  this.holdSelectedItemDetails = [];
  this.fieldArray = [];
  this.matchingName = [];

  
  let vendorsLength = this.selectedVendorDetails;
  for (let index = 0; index < vendorsLength.length; index++) {
    if(this.selectedVendorDetails[index]['vendorName'] === selectedVendorName){
      let itemsList = this.selectedVendorDetails[index]['items'];
      // let matchingNames = [];
      for (let index_second = 0; index_second < itemsList.length; index_second++) {
        if(itemsList[index_second]['itemName'] === selectedItem){

          for (let index_third = 0; index_third < itemsList[index_second]['itemList'].length; index_third++) {

            // if matching true

            if(itemsList[index_second]['isMatching']){
              this.isMatching = true;
              let matchingData = itemsList[index_second]['itemList'][0]['matching'];
              for(let MatchingIndex = 0; MatchingIndex < matchingData.length; MatchingIndex++){

                const index = this.newEntryTableDataTitles.findIndex((e) => e.name === itemsList[index_second]['itemList'][0]['matching'][MatchingIndex]['name']);
                if (index === -1) {
                  this.newEntryTableDataTitles.push(itemsList[index_second]['itemList'][0]['matching'][MatchingIndex]['name'])
                }  
               
                const index2 = this.matchingName.findIndex((e) => e.name === matchingData[MatchingIndex].name);
                if (index2 === -1) {
                  this.matchingName.push(matchingData[MatchingIndex]);
                }         
                
              }

              for (let index_fourth = 0; index_fourth < itemsList[index_second]['itemList'].length; index_fourth++) {
                this.holdMatchingListDetails.push(itemsList[index_second]['itemList'][index_fourth]);
                
              }


              this.newEntryTableDataTitles =  Array.from(new Set(this.newEntryTableDataTitles));
              this.matchingName = Array.from(new Set(this.matchingName));
              this.holdMatchingListDetails = this.getUnique(this.holdMatchingListDetails, 'name');
              this.holdMatchingListDetails.forEach(element => {
                this.requiredCloth[element.name] = 0;
              });
            }else{
              // if matching false

              this.isMatching = false;
              this.newEntryTableDataTitles = ['Panna', 'Size', 'Quantity', 'Plain Cloth Average'];
            }              
            this.selectedItemPannaSize.push(itemsList[index_second]['itemList'][index_third]['panna'])
            this.holdSelectedItemDetails.push(itemsList[index_second]['itemList'][index_third]) 
            //holiding the selected item related data with all panna and size, average
          }
        }
      }
    }      
  }
  this.selectedItemPannaSize = Array.from(new Set(this.selectedItemPannaSize));
  this.fctnAddRowBasedOnIsMatching(this.fieldArray.length);

}
  fctngetSelectedPannaSize(selectedPanna, selectedItem){
    this.selectedItemSize = [];
    for (let index = 0; index < this.holdSelectedItemDetails.length; index++) {
      if(this.holdSelectedItemDetails[index]['panna'] === selectedPanna){
        this.selectedItemSize.push(this.holdSelectedItemDetails[index]['size'])
      } 
    }

  }

  generateAverage(data){
    this.selectedVendorDetails.itemList.forEach(element => {
      if(data.panna === element.panna && data.size === element.size){
        data.avg = parseFloat(data.quantity) * parseFloat(element.avg);
      }
    })

  }


  saveRecord(){
    for (let index = 0; index < this.fieldArray.length; index++) {

      if(this.fieldArray[index]['panna'] == null && this.fieldArray[index]['size'] == null){
        if(this.fieldArray.length === 1 && this.fieldArray[index]['size'] == null){
           alert("Please enter the quantity");
        }else{
          this.fieldArray.splice(index, 1)
        }
        
      }else{
        this.fieldArray[index]['item'] = this.selectedItem;
      }
      
    }

    if(this.fieldArray.length){
      if(!this.recieptNumber){
        alert("Please Provide Reciept Number");
      }else{

        const generateOrder =  {
          vendorDetails : {
            name : this.selectedVendorName
          },
          orders : [
            {
              description : this.orderDescription,
              PartyName : this.partyName,
              selectedItem : this.selectedItem,
              order :[],
              totalClothRequired : this.requiredCloth,
              totalClothGiven : this.givenCloth,
              calculationOfGivenAndRequiredPlainCloth : 0,
              recipetNumber : this.recieptNumber,
              matching : this.isMatching
            }
          ]
        }

        if(this.isMatching){
          this.requiredCloth.plainCloth = +this.requiredCloth.plainCloth;
          this.givenCloth.plainCloth = +this.givenCloth.plainCloth;
          let calculationOfGivenAndRequiredPlainCloth = (this.requiredCloth.plainCloth - this.givenCloth.plainCloth).toFixed(2);
          generateOrder.orders[0]['calculationOfGivenAndRequiredPlainCloth'] = parseFloat(calculationOfGivenAndRequiredPlainCloth);
          let holdRequiredCloth = {...this.requiredCloth};
          for(var match in holdRequiredCloth){
            if(this.givenCloth[match]){
                holdRequiredCloth[match] = (holdRequiredCloth[match] - this.givenCloth[match]).toFixed(2)
                holdRequiredCloth[match] = parseFloat(holdRequiredCloth[match]);  
            }
        }
        let calculationOfGiveAndRequiredMatchingClothList = holdRequiredCloth;
        generateOrder.orders[0]['calculationOfGiveAndRequiredMatchingClothList'] = holdRequiredCloth;
        }else{
          let calculationOfGivenAndRequiredPlainCloth = +this.requiredCloth.plainCloth - +this.givenCloth.plainCloth;
          generateOrder.orders[0]['calculationOfGivenAndRequiredPlainCloth'] = calculationOfGivenAndRequiredPlainCloth;
        }
        generateOrder['orders'][0]['order'].push(this.fieldArray);
        generateOrder['orders'][0]['Note'] = '';
        const headers = {
          'Content-Type': 'application/json'
        }
        this.service.postCreateNewOrder(generateOrder, headers)
          .subscribe(response => {
            if(response.json().success){
              // window.location.reload();
              this.fieldArray = [];
              this.givenCloth = {
                plainCloth: 0
              }
            
              this.requiredCloth = {
                plainCloth : 0
              }
              this.recieptNumber = '';
              this.matchingName = [];
              this.selectedVendorName = null;
              this.selectedItem = null;
              this.hideSuccess = true;
              this.selectedVendorItemList = [];
              setTimeout(() => {
                this.hideSuccess = false;
              },4000)

            }
          })
      }

    }
  }

  removeLastEntry(){
    this.fieldArray.splice(-1, 1);
  }

  addRow(itemData,itemIndex){
    if(itemData.panna && itemData.size){
    }else{
      alert("Please select Size")
    }

  }

  addOtherItem(itemData, itemIndex){
    
    this.requiredCloth['plainCloth'] = 0;
    this.requiredCloth = {
      plainCloth: 0
    }
    itemData['matching_panna'] = [];
    for(let element of this.holdSelectedItemDetails){
      if(element.panna === itemData.panna && element.size == itemData.size){
        this.fieldArray[itemIndex]['avg'] = parseFloat(itemData.quantity) * element.plainAverage;
        this.fieldArray[itemIndex]['plainAverage'] = element.plainAverage;
        if(this.isMatching){
          for (let index = 0; index < element.matching.length; index++) {
            itemData['matching_panna'].push(element['matching'][index]['panna']);
            this.fieldArray[itemIndex]['matching'][index]['Average'] = element['matching'][index]['Average'];
            this.fieldArray[itemIndex]['matching'][index]['totalAvg'] = parseFloat(this.fieldArray[itemIndex]['quantity']) *  element['matching'][index]['Average']
            itemData['matching'][index]['totalAvg'] = this.fieldArray[itemIndex]['matching'][index]['totalAvg'];
          }
        }
      }
    }
     
    for(let index = 0; index < this.fieldArray.length; index++){
      this.requiredCloth['plainCloth'] += this.fieldArray[index].avg;
      let match = this.fieldArray[index]['matching'];

      if(this.isMatching){
        for(let matchingItems of this.fieldArray[index]['matching']){
          console.log(matchingItems);
          this.requiredCloth[matchingItems['name']] = this.requiredCloth[matchingItems['name']] ==  undefined ? 0 : this.requiredCloth[matchingItems['name']] 
          this.requiredCloth[matchingItems['name']] +=  +matchingItems['totalAvg'];
          this.requiredCloth[matchingItems['name']] = this.requiredCloth[matchingItems['name']].toFixed(2);
          this.requiredCloth[matchingItems['name']] = +this.requiredCloth[matchingItems['name']];
        }
      }
    }
    this.fctnAddRowBasedOnIsMatching(itemIndex)
  }


  fctnJustMakeCalculation(itemData, itemIndex){

    this.requiredCloth['plainCloth'] = 0;
    this.requiredCloth = {
      plainCloth: 0
    }
    itemData['matching_panna'] = [];
    for(let element of this.holdSelectedItemDetails){
      if(element.panna === itemData.panna && element.size == itemData.size){
        this.fieldArray[itemIndex]['avg'] = parseFloat(itemData.quantity) * element.plainAverage;
        this.fieldArray[itemIndex]['plainAverage'] = element.plainAverage;
        if(this.isMatching){
          for (let index = 0; index < element.matching.length; index++) {
            itemData['matching_panna'].push(element['matching'][index]['panna']);
            this.fieldArray[itemIndex]['matching'][index]['Average'] = element['matching'][index]['Average'];
            this.fieldArray[itemIndex]['matching'][index]['totalAvg'] = parseFloat(this.fieldArray[itemIndex]['quantity']) *  element['matching'][index]['Average']
            itemData['matching'][index]['totalAvg'] = this.fieldArray[itemIndex]['matching'][index]['totalAvg'];
          }
        }
      }
    }
     
    for(let index = 0; index < this.fieldArray.length; index++){
      this.requiredCloth['plainCloth'] += this.fieldArray[index].avg;
      let match = this.fieldArray[index]['matching'];

      if(this.isMatching){
        for(let matchingItems of this.fieldArray[index]['matching']){
          console.log(matchingItems);
          this.requiredCloth[matchingItems['name']] = this.requiredCloth[matchingItems['name']] ==  undefined ? 0 : this.requiredCloth[matchingItems['name']] 
          this.requiredCloth[matchingItems['name']] +=  +matchingItems['totalAvg'];
        }
      }
    }
    
  }

}
