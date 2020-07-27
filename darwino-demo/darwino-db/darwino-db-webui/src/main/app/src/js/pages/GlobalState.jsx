// Should this be in Redux?

import {fetchJson, makeUrl} from '@darwino/darwino'
import { MicroServices } from '@darwino/darwino';

class State {
  _treeView
  _databases = {}

  treeView(force) {
    if(this._treeView && !force) {
      return Promise.resolve(this._treeView);
    }
    return new MicroServices()
      .name("TreeView")
      .fetch()
      .then((r) => {
        this._treeView = r;
        return r;
      })
      .catch((e) => {
        // TODO err msg
      }
    )
  }

  database(id,force) {
    // if(this._databases[id] && !force) {
    //   return Promise.resolve(this._databases[id]);
    // }
    const url = makeUrl(null,['$darwino-jstore','databases',id]);
    return fetchJson(url)
      .then((r) => {
        return this._databases[id] = r;
      })
  }
}
export default new State();
