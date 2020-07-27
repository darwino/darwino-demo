import stringify from 'json-stable-stringify';

// https://www.npmjs.com/package/json-stable-stringify
const CMP = { 
  cmp:  
    function (a, b) {
      const ao = typeof a.value === 'object'
      const bo = typeof b.value === 'object'
      if(ao===bo) {
        // Compare case insensitive - moreover, sorts '_' after 'A-Z'
        return a.key.toUpperCase()  < b.key.toUpperCase()  ? -1 : 1;
      }
      if(ao) return 1;
      return -1;    
    },
  space: '   ' 
}
export function stringifySorted(obj) {
  return stringify(obj, CMP);
}
