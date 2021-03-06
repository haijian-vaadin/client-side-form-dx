import { customElement, html, LitElement, query, unsafeCSS } from 'lit-element';
import { render } from 'lit-html';

import '@vaadin/vaadin-button/vaadin-button';
import '@vaadin/vaadin-form-layout/vaadin-form-item';
import '@vaadin/vaadin-form-layout/vaadin-form-layout';
import '@vaadin/vaadin-grid/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-column';
import '@vaadin/vaadin-notification/vaadin-notification';
import '@vaadin/vaadin-ordered-layout/vaadin-horizontal-layout';
import '@vaadin/vaadin-split-layout/vaadin-split-layout';
import '@vaadin/vaadin-text-field/vaadin-password-field';
import '@vaadin/vaadin-text-field/vaadin-text-field';
import '@vaadin/vaadin-text-field/vaadin-email-field';

// import the remote endpoint
import * as viewEndpoint from '../../generated/MasterDetailEndpoint';

// import types used in the endpoint
import Employee from '../../generated/com/example/application/backend/Employee';

// utilities to import style modules
import { CSSModule } from '../../css-utils';

// @ts-ignore
import {EmployeeDataModel} from '../../generated/com/example/application/views/masterdetail/MasterDetailEndpoint/EmployeesDataModel';

import styles from './master-detail-view.css';

@customElement('master-detail-view')
export class MasterDetailViewElement extends LitElement {
  static get styles() {
    return [CSSModule('lumo-typography'), unsafeCSS(styles)];
  }

  @query('#grid')
  private grid: any;

  @query('#notification')
  // @ts-ignore
  private notification: any;

  render() {
    return html`
      <vaadin-split-layout class="splitLayout">
        <div class="splitLayout__gridTable">
          <vaadin-grid id="grid" class="splitLayout" theme="no-border">
            <vaadin-grid-column .renderer=${this.firstNameRenderer}>
              <template class="header">
                First name
              </template>
            </vaadin-grid-column>
            <vaadin-grid-column .renderer=${this.lastNameRenderer}>
              <template class="header">
                Last name
              </template>
            </vaadin-grid-column>
            <vaadin-grid-column .renderer=${this.emailRenderer}>
              <template class="header">
                Email
              </template>
            </vaadin-grid-column>
          </vaadin-grid>
        </div>
        <div id="editor-layout">
          <!-- TODO: add bindngs to the fields in this form-->
          <vaadin-form-layout>
            <vaadin-text-field label="First name"></vaadin-text-field>
            <vaadin-text-field label="Last name"></vaadin-text-field>
            <vaadin-email-field label="Email"></vaadin-email-field>
          </vaadin-form-layout>
          <vaadin-horizontal-layout id="button-layout" theme="spacing">
            <vaadin-button theme="tertiary" slot="" @click="${this.reset}">
              Reset
            </vaadin-button>
            <vaadin-button theme="primary" @click="${this.save}">
              Save
            </vaadin-button>
          </vaadin-horizontal-layout>
        </div>
      </vaadin-split-layout>
      <vaadin-notification duration="5000" id="notification"> </vaadin-notification>
    `;
  }

  // Wait until all elements in the template are ready to set their properties
  async firstUpdated(changedProperties: any) {
    super.firstUpdated(changedProperties);

    // Retrieve data from the server-side endpoint.
    this.grid.dataProvider = async (params: any, callback: any) => {
      const index = params.page * params.pageSize;
      const employeesData = await viewEndpoint.getEmployeesData(index, params.pageSize);
      callback(employeesData.employees, employeesData.totalSize);
    };

    this.grid.addEventListener('active-item-changed', (event: any)=>{
      const employee = event.detail.value;
      this.grid.selectedItems = employee ? [employee] : [];

      if (employee) {
        //TODO: set the item to binder
        
      } else {
        //TODO: set an empty value to binder
        
      }
    });
  }

  private firstNameRenderer(root: Element, _: any, rowData: { item: Employee }) {
    render(html` <span>${rowData.item.firstname}</span> `, root);
  }

  private lastNameRenderer(root: Element, _: any, rowData: { item: Employee }) {
    render(html` <span>${rowData.item.lastname}</span> `, root);
  }

  private emailRenderer(root: Element, _: any, rowData: { item: Employee }) {
    render(html` <span>${rowData.item.email}</span> `, root);
  }

  //TODO: implement the save function
  private save(){
    console.log("save");
  }

  //TODO: implement the reset function
  private reset(){
    console.log("reset");
  }
}
