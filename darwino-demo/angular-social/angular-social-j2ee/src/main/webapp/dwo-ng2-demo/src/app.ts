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
    resources: {value: Resource}[];
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


interface Resource {
    title:          string,
    url?:           string,
    description?:   string,     // abstract, extracted from the resource (not a review)
    language?:      string,     // 2 chars: en,fr,...
    author?:        string,     // author of the linked resource (article)
    user?:          User,       // user who submitted the resource
    version:        string,     // Angular1, Angular2 or both versions
    category?:      string,     // blog, conference, tutorial, etc.
    reviews?:       Review[],
    socials?:       Social[]
}
interface Review {              // first level, on a Resource
    user:           User,
    text:           string
    comments?:       Comment[],
    socials?:       Social[]
}
interface Comment {             // second level, on a Review
    user:           User,
    text:           string,
    socials?:       Social[]
}
interface User {
    name:           string
}

interface Social {              // on a Resource, Review or Comment, for one user
    user:           string,
    vote?:          number,     // 1 or -1
    favorite?:      boolean,    // starred  [only for a Resource, not a Review of Comment]
    note?:          string,
    keywords?:      string[]    // array of keywords
    inappropriate?: boolean,    // if user flagged as inappropriate
    clicks?:        number      // the number of time the user clicked on the resource link  [only for a resource, not a Review of Comment]
}


interface ResourceIndex {
    resource:       Resource,
    upvotes:        number,     // count of users upvotes
    downvotes:      number,     // count of users downvotes
    favorite:       number,     // count of users favorite flags
    inappropriate:  number,     // count of users inappropriate flags
    // Clicks statistics
    clicks:         number,     // sum of all users clicks
    dayclicks:      number,     // sum of all users clicks in the last 24 hours
    weekclicks:     number,     // sum of all users clicks in the last 7 days
    monthclicks:    number      // sum of all users clicks in the last 30 days
}
interface ReviewIndex {
    resource:       Review,
    upvotes:        number,     // count of users upvotes
    downvotes:      number      // count of users downvotes
    inappropriate:  number,     // count of users inappropriate flags
}
interface CommentIndex {
    resource:       Resource,
    upvotes:        number,     // count of users upvotes
    downvotes:      number,     // count of users downvotes
    inappropriate:  number      // count of users inappropriate flags
}


//bootstrap(AppCmp, ELEMENT_PROBE_CONFIG);
bootstrap(AppCmp, [HTTP_BINDINGS]);

