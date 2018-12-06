import React, { Component } from 'react'
import { connect } from 'react-redux'

import Loader from '../../../components/Loader'
import LicenseeInfo from './LicenseeInfo'
import ProductGrid from './ProductGrid'
import AddAgent from './AddAgent';
import LAPExclusions from './LAPExclusions';
import TerminateLicensee from './TerminateLicensee';
import OfferProductForm from './OfferProductForm';

export class AppContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { isLoading, licensee } = this.props;

        return (
            <div className='edit-form'>
                <Loader isLoading={isLoading} />
                <LicenseeInfo />
                { 
                    licensee.IsActive &&
                    <div className='row'>
                        <div className='col-xs-12 col-md-6'>
                            <div className='form-group button-group'>
                                <TerminateLicensee />
                                <AddAgent />
                                <OfferProductForm />
                                <LAPExclusions />
                            </div>
                        </div>
                    </div>
                }
                <ProductGrid />
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { isLoading, licensee } = state;
    return { isLoading, licensee };
};

export default connect(mapStateToProps)(AppContainer);