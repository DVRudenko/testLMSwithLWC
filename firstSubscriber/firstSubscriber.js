import { api, LightningElement, wire} from 'lwc';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import SAMPLEMC from '@salesforce/messageChannel/SampleMessageChannel__c';

import NAME_FIELD from '@salesforce/schema/Account.Owner.Name';
import PHONE_FIELD from '@salesforce/schema/Account.Owner.Phone';
import EMAIL_FIELD from '@salesforce/schema/Account.Owner.Email';

export default class Subscriber extends LightningElement {
    subscription = null;

    relatedRecordId;

    @wire(getRecord, { recordId: '$relatedRecordId', 
    fields: [
        NAME_FIELD,
        PHONE_FIELD,
        EMAIL_FIELD
        ] 
    })
    user;

    get name() {
        console.log('name');
        return getFieldValue(this.user.data, NAME_FIELD);
    }

    get phone() {
        return getFieldValue(this.user.data, PHONE_FIELD);
    }

    get email() {
        return getFieldValue(this.user.data, EMAIL_FIELD);
    }


    @wire(MessageContext)
    messageContext;

    // Encapsulate logic for Lightning message service subscribe and unsubsubscribe
        subscribeToMessageChannel() {
            this.subscription = subscribe(
                this.messageContext,
                SAMPLEMC,
                (message) => this.handleMessage(message)
                
            );
            console.log('subscribed');
        }

    unsubscribeMC() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    handleMessage(message) {
        this.relatedRecordId = message.recordId;
        console.log('handle Id'+this.relatedRecordId);
    }

    // Standard lifecycle hooks used to subscribe and unsubsubscribe to the message channel
    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }

    // Helper
    dispatchToast(error) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error loading',
                message: reduceErrors(error).join(', '),
                variant: 'error'
            })
        );
    }
}