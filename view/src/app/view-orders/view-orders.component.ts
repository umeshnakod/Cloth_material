import { Services } from './../service.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.css']
})
export class ViewOrdersComponent implements OnInit {
  constructor(private service : Services) {}

  vendorsList = [];
  selectedVendor : any;
  responseOfSelectedVendorOrders = [];
  showOrderedItemOnModal = [];
  showOrderedItemOnModalBackup = [];
  settlementCloth = null;
  error = false;
  showOrderDetailsTableTitleForPlain = ['Date', 'Item Name', 'Total Plain Cloth Required', 'Total Plain Cloth Give'];
  showOrderDetailsTableTitleForMatching = ['Date', 'Item Name', 'Total Plain Cloth Required', 'Total Plain Cloth Give'];
  showOrderDetailsModalTableTitleForMatching = ['Panna', 'Size', 'Quantity', 'Average'];
  isMatchingTrueTable : Array<any> = [];
  isMatchingFalseTable : Array<any> = [];
  emptyList = true;
  formattedObject = [];
  modalTabName = 'settlement';
  vendorListWithDetails : Array<any> = [];
  isMatching = false;
  requestHeader = {
    id:null,
    vendorName:null
  }
  holdReceivedEntry : Array<any> = [];
  settlementClothObject = {
    'plainCloth': 0
  }
  initialLoading = false;
  noteForReceiveEntry = null;

  fctnGetSelectedVendorOrderDetails(selectedVendor){
    this.responseOfSelectedVendorOrders = [];
    this.isMatchingTrueTable=[];
    this.isMatchingFalseTable=[];
    this.showOrderDetailsTableTitleForPlain = ['Date', 'Item Name', 'Total Plain Cloth Required', 'Total Plain Cloth Give'];
    this.showOrderDetailsTableTitleForMatching = ['Date', 'Item Name'];
    let obj = {
      name : selectedVendor
    }
    const headers = {
      'Content-Type': 'application/json'
    }
    this.service.getSelectedVendorOrderList(obj,headers)
    .subscribe(response => {
      let result = response.json();
      if(result.length){
        this.emptyList = false;
        for(let order of result){
          order['orderedDate'] = new Date(parseInt(order['orderedDate']))
        }

        for (let index = 0; index < result.length; index++) {
          for (let index2 = 0; index2 < result[index]['orders'].length; index2++) {
            result[index]['orders'][index2]['orderGeneratedDate'] = result[index]['orderedDate'];
            result[index]['vendorDetails']['id'] = result[index]['_id']; 
            result[index]['orders']['vendorDetails'] = result[index]['vendorDetails'];
            
          }
          this.isMatchingTrueTable.push(result[index]['orders'])
          
        }
      for (let index = 0; index < this.isMatchingTrueTable.length; index++) {
            for (let index2 = 0; index2 < this.isMatchingTrueTable[index].length; index2++) {
             
              let requiredClothTotal = 0;
              let givenClothTotal = 0;
              for(let item in this.isMatchingTrueTable[index][index2]['totalClothGiven']){
                // console.log("itemmmmmmmmm",item);
                givenClothTotal += +this.isMatchingTrueTable[index][index2]['totalClothGiven'][item];
                requiredClothTotal += +this.isMatchingTrueTable[index][index2]['totalClothRequired'][item]
              }
              if(givenClothTotal < requiredClothTotal){
                this.isMatchingTrueTable[index][index2]['colorToShow'] = 'G';
              }else if(givenClothTotal > requiredClothTotal){
                this.isMatchingTrueTable[index][index2]['colorToShow'] = 'R';
              }else if(givenClothTotal == requiredClothTotal){
                this.isMatchingTrueTable[index][index2]['colorToShow'] = 'Y';
              }
              console.log("-------------",this.isMatchingTrueTable[index][index2]);
              for (let i = 0; i < this.isMatchingTrueTable[index][index2]['order'].length; i++) {
                for (let index3 = 0; index3 < this.isMatchingTrueTable[index][index2]['order'][i].length; index3++) {
                  if(!this.isMatchingTrueTable[index][index2]['order'][i][index3].hasOwnProperty('totalCloth')){
                    this.isMatchingTrueTable[index][index2]['order'][i][index3]['totalCloth'] = 0;
                  }
                }                  
              }
              for(let title in this.isMatchingTrueTable[index][index2]['totalClothRequired']){
                this.showOrderDetailsTableTitleForMatching.push(title);
              }
            
            }
      }
      this.showOrderDetailsTableTitleForMatching = Array.from(new Set(this.showOrderDetailsTableTitleForMatching));
      }else{
        this.responseOfSelectedVendorOrders = [];
        this.emptyList = true;
      }
      
    })
  }


  showModal(orderDetails, index, vendorDetails){
    this.isMatching = orderDetails.matching;
    this.modalTabName = 'settlement';
    this.formattedObject = [];
    this.showOrderDetailsModalTableTitleForMatching = ['Panna', 'Size', 'Quantity', 'Average'];
    for(let title in orderDetails['totalClothRequired']){
      this.showOrderDetailsModalTableTitleForMatching.push(title);
    }
    this.showOrderedItemOnModal = [];
    this.showOrderedItemOnModalBackup = [];
    // Get the modal
    const modal = document.getElementById("myModal");
    modal.style.display = "block";  
    this.showOrderedItemOnModalBackup = orderDetails
    this.showOrderedItemOnModal = orderDetails;
    this.showOrderedItemOnModal['vendorDetails'] = vendorDetails;
    for(let item of this.showOrderedItemOnModal['order'][0]){
      let obj = {}
      obj = {
        'panna':item['panna'],
        'size':item['size'],
        'quantity':item['quantity'],
        'receivedQuantity':0,
        'submit':true
      };

      if(item.hasOwnProperty("matching")){
        for(let matching of item['matching']){
          if(item.totalCloth === 0){
            obj['totalCloth'] = item['avg'];
            obj['totalCloth'] += matching.totalAvg;
            obj['totalCloth'] = obj['totalCloth'].toFixed(2)
            obj['totalCloth'] = parseFloat(obj['totalCloth']);
            item['totalCloth'] = obj['totalCloth']; 
          }else{
            obj['totalCloth'] = item.totalCloth;

          }
        }
      }else{
        if(item.hasOwnProperty('totalCloth') && item.totalCloth > 0){
          obj['totalCloth'] = item['totalCloth'];  
        }else{
          obj['totalCloth'] = item['avg'];
        }
        
      }

      this.formattedObject.push(obj)
    }    
  }



  fctnReceiveEntry(itemData, itemIndex){


    if(itemData.receivedQuantity == NaN || itemData.receivedQuantity == '') itemData.receivedQuantity = 0;

    // if(this.holdReceivedEntry.length){

      const index = this.holdReceivedEntry.findIndex((e) => e.size === itemData.size);
      itemData.receivedQuantity = parseInt(itemData.receivedQuantity);
      if (index === -1) {
        this.holdReceivedEntry.push(itemData);
      } else {
        this.holdReceivedEntry[index] = itemData;
      }
    // }else{
    //   itemData.receivedQuantity = parseInt(itemData.receivedQuantity);
    //   this.holdReceivedEntry.push(itemData)
    // }

    // itemData.receivedQuantity = parseInt(itemData.receivedQuantity);
    // if(itemData.receivedQuantity > 0){
    //   itemData.quantity = parseInt(itemData.quantity);
    //   itemData.quantity = itemData.quantity - itemData.receivedQuantity; 
    //   this.showOrderedItemOnModal['order'][0][itemIndex]['quantity'] = parseInt(this.showOrderedItemOnModal['order'][0][itemIndex]['quantity']);
    //   this.showOrderedItemOnModal['order'][0][itemIndex]['quantity'] = itemData.quantity;
    // }

    // let totalAvg : any;
    // for (let index = 0; index < this.vendorListWithDetails.length; index++) {
    //   if(this.vendorListWithDetails[index]['vendorName'] === this.selectedVendor){
    //     if(this.vendorListWithDetails[index]['items'].length){
    //       for (let index2 = 0; index2 < this.vendorListWithDetails[index]['items'].length; index2++) {
    //         if(this.showOrderedItemOnModal['selectedItem'] == this.vendorListWithDetails[index]['items'][index2]['itemName']){
    //           this.requestHeader.vendorName = this.vendorListWithDetails[index]['vendorName'];
    //           this.requestHeader.id = this.vendorListWithDetails[index]['_id'];
    //           for (let index3 = 0; index3 < this.vendorListWithDetails[index]['items'][index2]['itemList'].length; index3++) {
    //             if(this.vendorListWithDetails[index]['items'][index2]['itemList'][index3].hasOwnProperty('matching')){
    //               if(itemData.panna == this.vendorListWithDetails[index]['items'][index2]['itemList'][index3]['panna'] && itemData.size == this.vendorListWithDetails[index]['items'][index2]['itemList'][index3]['size']){
    //                 totalAvg = this.vendorListWithDetails[index]['items'][index2]['itemList'][index3]['plainAverage'];
    //                 for (let index4 = 0; index4 < this.vendorListWithDetails[index]['items'][index2]['itemList'][index3]['matching'].length; index4++) {
    //                   totalAvg += this.vendorListWithDetails[index]['items'][index2]['itemList'][index3]['matching'][index4]['Average'];
                      
    //                 } 
    //               }
                    
    //             }
    //           }
    //         }
            
    //       }
    //     }
    //     totalAvg  = totalAvg.toFixed(2);
    //     totalAvg = parseFloat(totalAvg) * itemData.receivedQuantity;
    //     itemData.totalCloth = itemData.totalCloth - totalAvg; 
    //     this.showOrderedItemOnModal['order'][0][itemIndex]['totalCloth'] = itemData.totalCloth;
    //     return true;
    //   }      
    // }
  }


  fctnAddReceivedEntry(){
    let holdExtraQuantityCloth = 0;
    let remainingCloth = 0;
    // adding holdReceivedEntry loop beacuse in this array we will have all enetered received entrys list.
    for (let receivedIndex = 0; receivedIndex < this.holdReceivedEntry.length; receivedIndex++) {

      // adding this.showOrderedItemOnModal loop because in this array we will get all the items of ordered.

      for (let orderedItemsIndex = 0; orderedItemsIndex < this.showOrderedItemOnModal['order'][0].length; orderedItemsIndex++) {
        
        // here we are holding total cloth addition including matching average also.
        let holdTotalAverageOfCloth = 0;

        //  we are matching here. if holdReceivedEntry one of items size is matched with this.showOrderedItemOnModal items size.
        if(this.holdReceivedEntry[receivedIndex]['size'] == this.showOrderedItemOnModal['order'][0][orderedItemsIndex]['size']){
          // here we are getting plainCLoth average.
          holdTotalAverageOfCloth += this.showOrderedItemOnModal['order'][0][orderedItemsIndex]['plainAverage'];

          // if is matching true then only.
          if(this.showOrderedItemOnModal['matching']){
            // here using loop to get all matching cloth average.
            for(let matchingItem of this.showOrderedItemOnModal['order'][0][orderedItemsIndex]['matching']){
              //here we are adding each matching cloth average into  holdTotalAverageOfCloth
              holdTotalAverageOfCloth += matchingItem['Average'];
            }
          }

            console.log("this.holdReceivedEntry[receivedIndex]['receivedQuantity']",this.holdReceivedEntry[receivedIndex]['receivedQuantity']);
            console.log("this.showOrderedItemOnModal['order'][0][orderedItemsIndex]['quantity']",this.showOrderedItemOnModal['order'][0][orderedItemsIndex]['quantity']);




          // here we are doing multiplication with totalaverage of all cloth *  entered quantity of perticulare size which is received.
            holdTotalAverageOfCloth = holdTotalAverageOfCloth * this.holdReceivedEntry[receivedIndex]['receivedQuantity'];
            
            // here we are substracting total quantity from received quantity. 
            this.showOrderedItemOnModal['order'][0][orderedItemsIndex]['quantity'] = +this.showOrderedItemOnModal['order'][0][orderedItemsIndex]['quantity'] - this.holdReceivedEntry[receivedIndex]['receivedQuantity'];

            //if received quantity greater than ordered quantity or given quantity

            // here we are dont substract total cloth quantity from received quantity cloth average.

            if(holdTotalAverageOfCloth > this.showOrderedItemOnModal['order'][0][orderedItemsIndex]['totalCloth']){
              holdExtraQuantityCloth =  holdTotalAverageOfCloth - this.showOrderedItemOnModal['order'][0][orderedItemsIndex]['totalCloth']; 
              this.showOrderedItemOnModal['order'][0][orderedItemsIndex]['totalCloth'] = '0';
            }else{

            this.showOrderedItemOnModal['order'][0][orderedItemsIndex]['totalCloth'] = this.holdReceivedEntry[receivedIndex]['totalCloth'] - holdTotalAverageOfCloth;
            this.showOrderedItemOnModal['order'][0][orderedItemsIndex]['totalCloth'] = this.showOrderedItemOnModal['order'][0][orderedItemsIndex]['totalCloth'] == 0 ? '0' : this.showOrderedItemOnModal['order'][0][orderedItemsIndex]['totalCloth'];

            }
        }
      }
    }

    console.log("this.showOrderedItemOnModal",this.showOrderedItemOnModal)

    this.showOrderedItemOnModal['note'] = this.noteForReceiveEntry;

    const headers = {
      'Content-Type': 'application/json'
    }
    const holdObj = {
      changedData :this.showOrderedItemOnModal,
      reqHeader : this.showOrderedItemOnModal['vendorDetails'],
      isClothSettlement : false
    }
    this.service.postSettlementOfCloth(holdObj, headers)
    .subscribe(response => {
      console.log('==============',response.json());
      this.holdReceivedEntry = [];
      let holdResponse = response.json()
      if(holdResponse.success){
        const modal = document.getElementById("myModal");
        modal.style.display = "none";
        this.settlementCloth = null;
      }
    })
  }




  closeModal(){
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
    this.settlementCloth = null;
  }

  makeSettlement(){

    
    console.log("settlement object", this.settlementClothObject);
    for(let cloth in this.showOrderedItemOnModal['totalClothGiven']){
      console.log("result",cloth);
        this.showOrderedItemOnModal['totalClothGiven'][cloth] = parseInt(this.showOrderedItemOnModal['totalClothGiven'][cloth]);
            if(this.showOrderedItemOnModal['totalClothGiven'][cloth] > this.showOrderedItemOnModal['totalClothRequired'][cloth]){
              if(this.settlementClothObject.hasOwnProperty(cloth)){
                if(this.settlementClothObject[cloth] != 0 || this.settlementClothObject[cloth] != ''){
                  this.settlementClothObject[cloth] = parseInt(this.settlementClothObject[cloth]);
                  this.showOrderedItemOnModal['totalClothGiven'][cloth] = this.showOrderedItemOnModal['totalClothGiven'][cloth] - this.settlementClothObject[cloth];
                  if(cloth== 'plainCloth'){
                    this.showOrderedItemOnModal['calculationOfGivenAndRequiredPlainCloth'] = this.showOrderedItemOnModal['calculationOfGivenAndRequiredPlainCloth'] + this.settlementClothObject[cloth];
                  }

                  if(this.showOrderedItemOnModal['matching']){
                    this.showOrderedItemOnModal['calculationOfGiveAndRequiredMatchingClothList'][cloth] = this.showOrderedItemOnModal['calculationOfGiveAndRequiredMatchingClothList'][cloth] + this.settlementClothObject[cloth];
                  }                  
                }
              }
            }else if(this.showOrderedItemOnModal['totalClothGiven'][cloth] < this.showOrderedItemOnModal['totalClothRequired'][cloth]){
              if(this.settlementClothObject.hasOwnProperty(cloth)){
                if(this.settlementClothObject[cloth] != 0 || this.settlementClothObject[cloth] != ''){
                  this.settlementClothObject[cloth] = parseInt(this.settlementClothObject[cloth]);
                  this.showOrderedItemOnModal['totalClothGiven'][cloth] = this.showOrderedItemOnModal['totalClothGiven'][cloth] + this.settlementClothObject[cloth];
                  if(cloth== 'plainCloth'){
                    this.showOrderedItemOnModal['calculationOfGivenAndRequiredPlainCloth'] = this.showOrderedItemOnModal['calculationOfGivenAndRequiredPlainCloth'] - this.settlementClothObject[cloth];
                  }

                  if(this.showOrderedItemOnModal['matching']){
                    this.showOrderedItemOnModal['calculationOfGiveAndRequiredMatchingClothList'][cloth] = this.showOrderedItemOnModal['calculationOfGiveAndRequiredMatchingClothList'][cloth] - this.settlementClothObject[cloth];
                  } 
                }
              }
            }
    }
    console.log("----------",this.showOrderedItemOnModal);

    // if(this.showOrderedItemOnModalBackup['totalClothHaveToTakeOrToGive'] < 0){
    //   this.showOrderedItemOnModalBackup['totalClothHaveToTakeOrToGive'] = parseFloat(this.showOrderedItemOnModalBackup['totalClothHaveToTakeOrToGive'].toFixed(2)) + parseFloat(this.settlementCloth);
    //   this.showOrderedItemOnModalBackup['totalClothGiven'] = this.showOrderedItemOnModalBackup['totalClothGiven'] -  parseFloat(this.settlementCloth);
    // }else if(this.showOrderedItemOnModalBackup['totalClothHaveToTakeOrToGive'] > 0){
    //   this.showOrderedItemOnModalBackup['totalClothHaveToTakeOrToGive'] = this.showOrderedItemOnModalBackup['totalClothHaveToTakeOrToGive'] - parseFloat(this.settlementCloth);
    //   this.showOrderedItemOnModalBackup['totalClothGiven'] = this.showOrderedItemOnModalBackup['totalClothGiven'] +  parseFloat(this.settlementCloth); 
    // }
    // const modal = document.getElementById("myModal");
    // modal.style.display = "none";
    // let formatedObject = this.showOrderedItemOnModalBackup
    // formatedObject['vendorName'] = this.responseOfSelectedVendorOrders[0]['vendorDetails']['name'];
    // formatedObject['_id'] = this.responseOfSelectedVendorOrders[0]['_id']
    const headers = {
      'Content-Type': 'application/json'
    }
    const holdObj = {
      changedData :this.showOrderedItemOnModal,
      reqHeader : this.showOrderedItemOnModal['vendorDetails'],
      isClothSettlement : true
    }
    this.service.postSettlementOfCloth(holdObj, headers)
    .subscribe(response => {
      console.log(response);
      let result = response.json();
      if(result.success){
        this.settlementClothObject = {
          'plainCloth': 0
        }
        const modal = document.getElementById("myModal");
        modal.style.display = "none";
      }
      
    },error =>{
      this.settlementClothObject = {
        'plainCloth': 0
      }
      this.error = true;
    })
  }


  ngOnInit() {
    this.initialLoading = true;
    this.service.getVendorsNameList()
      .subscribe(response => {
        this.vendorListWithDetails = response.json();
        for(let vendor of response.json()){
          this.vendorsList.push(vendor.vendorName)
        }
        this.vendorsList = Array.from(new Set(this.vendorsList));
        this.initialLoading = false;
      },error =>{
        console.log("errorrrrrrr");
        this.error = true;
      })
  }

}
