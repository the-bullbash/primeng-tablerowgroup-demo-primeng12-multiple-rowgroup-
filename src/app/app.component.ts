import { Component, OnInit } from '@angular/core';
import { Customer, Representative } from './customer';
import { CustomerService } from './customerservice';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  customers: Customer[];

  _multiSortMeta: any[];
  _groupRowsBy: string[];

  countryGroupMetadata: any;
  represGroupMetaData: any;

  constructor(private customerService: CustomerService) {}

  ngOnInit() {
    this.customerService.getCustomersMedium().then((data) => {
      this._multiSortMeta = [];
      this._multiSortMeta.push({ field: 'representative.name', order: 1 });
      this._multiSortMeta.push({ field: 'country.name', order: 1 });

      this._groupRowsBy = [];
      this._groupRowsBy.push('representative.name');
      //   this._groupRowsBy.push('country.name');

      this.customers = data;

      this.customers.forEach((customer: Customer) => {
        customer.representative.id = customer.representative.name.replace(
          /\s/g,
          ''
        );
      });

      this.updateRowGroupMetaData(this.customers);
    });
  }

  updateRowGroupMetaData(customers: Customer[]) {
    this.represGroupMetaData = {};
    this.countryGroupMetadata = {};
    if (customers) {
      var _customers: Customer[] = customers.sort((obj1, obj2) => {
        if (obj1.representative.name > obj2.representative.name) {
          return 1;
        } else if (obj1.representative.name < obj2.representative.name) {
          return -1;
        } else {
          if (obj1.country.name > obj2.country.name) {
            return 1;
          } else if (obj1.country.name < obj2.country.name) {
            return -1;
          } else {
            return 0;
          }
        }
      });

      for (let i = 0; i < _customers.length; i++) {
        let rowData = _customers[i];
        let repres = rowData.representative.id;
        let represCountry = repres + '_' + rowData.country.name;
        if (i == 0) {
          this.represGroupMetaData[repres] = { index: 0, size: 1 };
          this.countryGroupMetadata[represCountry] = { index: 0, size: 1 };
        } else {
          let previousRowData = _customers[i - 1];
          let previousRepresGroup = previousRowData.representative.id;
          if (repres === previousRepresGroup)
            this.represGroupMetaData[repres].size++;
          else this.represGroupMetaData[repres] = { index: i, size: 1 };

          let previousCountryGroup =
            previousRepresGroup + '_' + previousRowData.country.name;
          if (represCountry === previousCountryGroup)
            this.countryGroupMetadata[represCountry].size++;
          else this.countryGroupMetadata[represCountry] = { index: i, size: 1 };
        }
      }
    }
  }

  calculateCustomerTotal(name) {
    let total = 0;

    if (this.customers) {
      for (let customer of this.customers) {
        if (customer.representative.name === name) {
          total++;
        }
      }
    }

    return total;
  }
}
