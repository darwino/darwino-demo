import {ListCmp} from 'list';
import {ELEMENT_PROBE_CONFIG} from 'angular2/debug';
import {HTTP_BINDINGS, Http} from 'http/http';
import {
    bootstrap,
    bind,
    Component,
    View
} from 'angular2/angular2';


@Component({
    selector: '[app]',
    bindings: []
})
@View({
    templateUrl: 'app.html',
    directives: [ListCmp]
})
export class AppCmp {
    resources: [Resource];
    constructor(http: Http) {

        //ObservableWrapper.subscribe<Response>(http.get('./people.json'),
        //        res => this.people = res.json());

        //http.get('sample-data.json')
        http.get('http://localhost:8080/ngsocial/jsonstore/databases/ngsocial/stores/Resources/entries')
            //Get the RxJS Subject
            .toRx()
            // Call map on the response observable to get the parsed people object
            .map(res => res.json())
            // Subscribe to the observable to get the parsed people object and attach it to the
            // component
            .subscribe(array => this.resources = array);
    }
}

export interface Resource {
    title: string;
}

//bootstrap(AppCmp, ELEMENT_PROBE_CONFIG);
bootstrap(AppCmp, [HTTP_BINDINGS]);

