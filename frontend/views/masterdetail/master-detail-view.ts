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
import '@vaadin/vaadin-text-field/vaadin-number-field';
import '@vaadin/vaadin-text-field/vaadin-email-field';

// import the remote endpoint
import * as viewEndpoint from '../../generated/MasterDetailEndpoint';

// import types used in the endpoint
import Employee from '../../generated/com/example/application/backend/Employee';

// utilities to import style modules
import { CSSModule } from '../../css-utils';

// @ts-ignore
import EmployeeModel from '../../generated/com/example/application/backend/EmployeeModel';
// @ts-ignore
import {EmployeeDataModel} from '../../generated/com/example/application/views/masterdetail/MasterDetailEndpoint/EmployeesDataModel';

import {Binder, field, NotEmpty, Size} from '@vaadin/form';

import styles from './master-detail-view.css';

@customElement('master-detail-view')
export class MasterDetailViewElement extends LitElement {
  static get styles() {
    return [CSSModule('lumo-typography'), unsafeCSS(styles)];
  }

  @query('#grid')
  private grid: any;

  @query('#notification')
  private notification: any;

  private binder = new Binder(this, EmployeeModel);

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
          <vaadin-form-layout>
            <vaadin-text-field label="First name"
            ...="${field(this.binder.model.firstname)}"></vaadin-text-field>
            <vaadin-text-field label="Last name"
            ...="${field(this.binder.model.lastname)}"></vaadin-text-field>
            <vaadin-email-field label="Email"
            ...="${field(this.binder.model.email)}"></vaadin-email-field>
          </vaadin-form-layout>
          <vaadin-horizontal-layout id="button-layout" theme="spacing">
            <vaadin-button theme="tertiary" slot="" @click="${this.resetForm}" ?disabled="${!this.binder.dirty}">
              Reset
            </vaadin-button>
            <vaadin-button theme="primary" @click="${this.save}" ?disabled="${this.binder.invalid || this.binder.submitting}">
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
      const item = event.detail.value;
      this.grid.selectedItems = item ? [item] : [];

      if (item) {
        this.binder.reset(item);
      } else {
        this.binder.clear();
      }
    });

    const firstname = this.binder.model.firstname;
    const lastname = this.binder.model.lastname;
    
    this.binder.for(firstname).addValidator(new NotEmpty({message: 'First name cannot be empty'}));
    this.binder.for(lastname).addValidator(new NotEmpty({message: 'Last name cannot be empty'}));
    this.binder.for(this.binder.model.email).addValidator(new NotEmpty({message: 'Email cannot be empty'}));
    this.binder.for(firstname).addValidator(new Size({max:10, message: 'First name should be less than 10 characters'}));
    this.binder.for(lastname).addValidator(new Size({max:10, message: 'Last name should be less than 10 characters'}));

    this.binder.for(firstname).addValidator({validate: (value:string) => !value.includes('Vaadin'), message: 'How dare you use the secret word!'});
    
    this.binder.addValidator({
      validate(value: Employee) {
        if (value.firstname === value.lastname) {
          return { property: firstname, value, validator: this };
        }
        return;
      },
      message: 'First name and last name cannot be the same'
    })
  }

  private async save() {
    await this.binder.submitTo(viewEndpoint.saveEmployee);
    this.notification.renderer = (root: Element) => (root.textContent = `Data saved!`);
    this.notification.open();
    this.grid.clearCache();
  }

  private resetForm() {
    this.binder.reset();
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
}
