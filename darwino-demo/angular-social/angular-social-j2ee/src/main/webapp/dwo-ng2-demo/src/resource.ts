import {Resource} from 'app';
import {
    bootstrap,
    bind,
    Component,
    View
} from 'angular2/angular2';


@Component({
    selector: '[resource]',
    properties: ['modelItem']
})
@View({
    templateUrl: 'resource.html',
    directives: []
})
export class ResourceCmp {
    modelItem: Resource;
    constructor() {
        this.modelItem = {title: 'aaaa'};
    }
}


