// publisherComponent
import { api, LightningElement, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import SAMPLEMC from '@salesforce/messageChannel/SampleMessageChannel__c';

export default class Publisher extends LightningElement {
    @wire(MessageContext)
    messageContext;

    @api
    recordId;

    handleClick() {
        const payload = {recordId: this.recordId };
        console.log('handle click');
        publish(this.messageContext, SAMPLEMC, payload);
        console.log('publish id'+this.recordId);
    }
}