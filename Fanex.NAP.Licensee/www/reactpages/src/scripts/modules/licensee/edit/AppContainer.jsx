import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Panel, Title, Content } from  '../../../components/collapsible-panel'
import Loader from '../../../components/Loader'
import LicenseeInfo from './LicenseeInfo'
import ProductGrid from './ProductGrid'
import AddAgent from './AddAgent';
import LAPExclusions from './LAPExclusions';
import TerminateLicensee from './TerminateLicensee';
import OfferProductForm from './OfferProductForm';
import SystemGrid from './SystemGrid';
import ActivateNewSystemForm from './ActivateNewSystemForm';

export class AppContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { isLoading, licensee } = this.props;

        return (
            <div className='edit-form'>
                <div className='row'>
                    <div className='col-xs-12 col-lg-8'>
                        <Loader isLoading={isLoading} />
                        <Panel collapsed={false}>
                            <Title>
                                {licensee.LicenseeName}
                            </Title>
                            <Content>
                                <LicenseeInfo />
                                { 
                                    licensee.IsActive &&
                                    <div className='row'>
                                        <div className='col-xs-12'>
                                            <div className='form-group button-group'>
                                                <TerminateLicensee />
                                                <AddAgent />
                                                <LAPExclusions />
                                            </div>
                                        </div>
                                    </div>
                                }
                            </Content>
                        </Panel>
                        <Panel collapsed={true}>
                            <Title>
                                Offered Products
                            </Title>
                            <Content>
                                { 
                                    licensee.IsActive &&
                                    <div className='row'>
                                        <div className='col-xs-12'>
                                            <div className='form-group button-group'>
                                                <OfferProductForm />
                                            </div>
                                        </div>
                                    </div>
                                }
                                <ProductGrid />
                            </Content>
                        </Panel>
                        <Panel collapsed={true}>
                            <Title>
                                Active Systems
                            </Title>
                            <Content>
                                { 
                                    licensee.IsActive &&
                                    <div className='row'>
                                        <div className='col-xs-12'>
                                            <div className='form-group button-group'>
                                                <ActivateNewSystemForm />
                                            </div>
                                        </div>
                                    </div>
                                }
                                <SystemGrid />
                            </Content>
                        </Panel>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const { isLoading, licensee } = state;
    return { isLoading, licensee };
};

export default connect(mapStateToProps)(AppContainer);