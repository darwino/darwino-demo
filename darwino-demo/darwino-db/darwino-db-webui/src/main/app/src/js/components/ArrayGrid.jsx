/**
 * Grid for displaying an SQL grid.
 */
import { JSArrayDataFetcher } from '@darwino/darwino'
import { CursorGrid } from '@darwino/darwino-react-bootstrap'

class ArrayGrid extends CursorGrid {

    shouldReinitData(prevProps) {
        const p = this.props;
        if (   p.columns!==prevProps.columns 
            || p.rows!==prevProps.rows ) {
                return true;
        }    
        return false;
    }

    createDataLoader() {
        return null;
    }

    createDataFetcher(dataLoader) {
        const props = this.props;
        return new JSArrayDataFetcher({values:props.rows});
    }
}

export default ArrayGrid;
