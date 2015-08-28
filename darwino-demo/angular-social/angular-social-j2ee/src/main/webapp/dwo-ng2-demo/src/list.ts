import {ResourceCmp} from 'resource';
import {Resource} from 'app';
import {Http, Response, HTTP_BINDINGS} from 'http/http';
import {
    bootstrap,
    bind,
    Component,
    View,
    NgFor
} from 'angular2/angular2';


@Component({
    selector: '[list]',
    properties: ['modelList']
})
@View({
    templateUrl: 'list.html',
    directives: [ResourceCmp, NgFor]
})
export class ListCmp {
    modelList: [Resource];
    constructor() {
    }
}


