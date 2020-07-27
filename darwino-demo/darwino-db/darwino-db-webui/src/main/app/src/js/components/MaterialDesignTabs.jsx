import React    from 'react';
import {Tabs} from 'react-bootstrap';
import './MaterialDesignTabs.css';

// https://bootsnipp.com/snippets/b2eVW
class MaterialDesignTabs extends React.Component {

    static propTypes = Tabs.propTypes;

    render() {
      return (
        <div className='materialdesigntabs'>
          <Tabs {...this.props}></Tabs>
        </div>
      );
    }
};

export default MaterialDesignTabs;
