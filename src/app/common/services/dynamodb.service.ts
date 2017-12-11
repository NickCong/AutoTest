import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';

import 'rxjs/add/operator/toPromise';
import { defaults, Dictionary } from 'lodash';
import { AWS_CONFIGURATION } from '../../../environments/environment';

@Injectable()
export class DynamoDBService {

    dynamodb: AWS.DynamoDB;
    docClient: AWS.DynamoDB.DocumentClient;
    constructor() {
        const  config = {
            region: AWS_CONFIGURATION.region,
            accessKeyId: AWS_CONFIGURATION.accessKeyId,
            secretAccessKey: AWS_CONFIGURATION.secretAccessKey,
            endpoint: AWS_CONFIGURATION.endpoint
            //endpoint: 'http://localhost:4200',
        };

        AWS.config.update(config);
        this.dynamodb = new AWS.DynamoDB();
        this.docClient = new AWS.DynamoDB.DocumentClient();

    }

    createTable(params: any,
        callback: (err: any, data: any) => void): void {
        {
            this.dynamodb.createTable(params, callback);
        }
    }


    deleteTable(params: any,
        callback: (err: any, data: any) => void): void {
        {
            this.dynamodb.deleteTable(params, callback);
        }
    }
    updateTable(params: any,
        callback: (err: any, data: any) => void): void {
        {
            this.dynamodb.updateTable(params, callback);
        }
    }
    /**
     * Creates a new item, or replaces an old item with a new item by delegating to AWS.DynamoDB.putItem().
     */
    insertData(params: any,
        callback: (err: any, data: any) => void): void {
        {
            this.docClient.put(params, callback);
        }
    }

    /**
     * Returns a set of attributes for the item with the given primary key by delegating to AWS.DynamoDB.getItem().
     */
    readData(params: any,
        callback: (err: any, data: any) => void): void {
        {
            this.docClient.get(params, callback);
        }
    }

    /**
     * Edits an existing item's attributes, or adds a new item to the table
     * if it does not already exist by delegating to AWS.DynamoDB.updateItem().
     */
    updateData(params: any,
        callback: (err: any, data: any) => void): void {
        {
            this.docClient.update(params, callback);
        }
    }

    /**
     * Deletes a single item in a table by primary key by delegating to AWS.DynamoDB.deleteItem().
     */
    deleteData(params: any,
        callback: (err: any, data: any) => void): void {
        {
            this.docClient.delete(params, callback);
        }
    }

    /**
      * Directly access items from a table by primary key or a secondary index.
      */
    queryData(params: any,
        callback: (err: any, data: any) => void): void {
        {
            this.docClient.query(params, callback);
        }
    }

    /**
     * Returns one or more items and item attributes by accessing every item in a table or a secondary index.
     */
    scanData(params: any,
        callback: (err: any, data: any) => void): void {
        {
            this.docClient.scan(params, callback);
        }
    }


    batchInsertItem(params: any,
        callback: (err: any, data: any) => void): void {
        {
            this.dynamodb.batchWriteItem(params, callback);
        }

    }
    batchGetItem(params: any,
        callback: (err: any, data: any) => void): void {
        {
            this.dynamodb.batchGetItem(params, callback)
        }
    }
}

