import { Services } from './../service.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-new-item',
  templateUrl: './add-new-item.component.html',
  styleUrls: ['./add-new-item.component.css']
})
export class AddNewItemComponent implements OnInit {

  objNewItemData  = {
    itemSize : null
  };
  isMatching = false;

  generateDefaultTableLabel = ['Panna', 'Size', 'Average'];
  addMatchingRowForTable = [];

  generateTableData = [
    {
      name : 'Panna',
      value:null
    },{
      name : 'Size',
      value:null
    },{
      name : 'Average',
      value:null
    }
  ];

  constructor(private service : Services) { }

  ngOnInit() {
  }

  showTable  = false;
  generateTable (){
    this.showTable = true;
    if(this.isMatching){
      for(let data of this.addMatchingRowForTable){
        // let key = data.name;
        // generateJson[data['name']] = null;
        // this.generateTableData.push(generateJson);
        let holdObj = {
          name : data.name,
          value : null
        }
        this.generateTableData.push(holdObj)
      };
      // this.generateTableData.push(generateJson);
      console.log("result",this.generateTableData);
    }else{
      // this.generateTableData.push(generateJson);
    }


    console.log(this.generateTableData)
    
  }


  saveNewItem(){
    console.log(this.generateTableData);
    // let data = this.objNewItemData;
    // data.itemSize = this.objNewItemData.itemSize.split(" ")
    const headers = {
      'Content-Type': 'application/json'
    }
    this.service.postSaveNewItem(this.generateTableData, headers)
    .subscribe(response => {
      if(response.json().success){
        window.location.reload();
      }
    })
  }


  addNewRow(){
    if(this.isMatching){
      this.addMatchingRowForTable.push({
        name : null,
        value : null
      })
    }else{
      this.addMatchingRowForTable = [];
    }

  }

  addMoreMatching(){

    this.addMatchingRowForTable.push({
      name : null,
      value : null
    })

  }

}
