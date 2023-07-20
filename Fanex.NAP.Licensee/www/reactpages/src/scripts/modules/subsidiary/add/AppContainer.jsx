import React from 'react';
import { connect } from 'react-redux';
import Loader from '../../../components/Loader';
import FormFilter from './FormFilter';
import DataGrid from './DataGrid';

const AppContainer = ({ isLoading }) => {
    return (
        <div>
            <Loader isLoading={isLoading}/>
            <FormFilter/>
            <DataGrid/>
        </div>
    );
};

const mapStateToProps = state => {
    const { isLoading } = state;
    return { isLoading };
};

export default connect(mapStateToProps)(AppContainer);