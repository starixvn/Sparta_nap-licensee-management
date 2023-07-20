import actionType from './types'
import { toggleLoader } from '../../../actions/loaderAction'
import Site from '../../../lib/site';
import { AgencyStatus, MessageStatus } from './constant/grid';
export { toggleLoader }

const firstItemIndex = 0;
const getFirstItem = (data) => {
    let selectedItem = null;

    if (data.length) {
        selectedItem = data[firstItemIndex];
    }

    return selectedItem;
};
const fetchLicensees = (params) => {
    return async (dispatch) => {
        const response = await Site.fetchData(params, 'LicenseeSubsidiary/GetLicensees');
        const data = response.data;

        const firstItem = getFirstItem(data);

        dispatch(setSelectLicensee(firstItem));
        dispatch(setLicensees(data));
    };
};

const setLicensees = (data) => {
    return {
        type: actionType.SET_LICENSEES,
        data: data
    };
};

const setSelectLicensee = (data) => {
    return {
        type: actionType.SET_SELECT_LICENSEE,
        data: data
    };
};

const fetchCurrencies = ({ siteName }) => {
    return async (dispatch) => {
        const response = await Site.fetchData({ siteName }, 'LicenseeSubsidiary/GetCurrencies');
        const data = response.data;

        const firstItem = getFirstItem(data);

        dispatch(setSelectCurrency(firstItem));
        dispatch(setCurrencies(data));
    };
};

const setCurrencies = (data) => {
    return {
        type: actionType.SET_CURRENCIES,
        data: data
    };
};

const setSelectCurrency = (data) => {
    return {
        type: actionType.SET_SELECT_CURRENCY,
        data: data
    };
};

const fetchSourceAgent = ({ customerId }) => {
    return async (dispatch) => {
        const response = await Site.fetchData({ customerId }, 'LicenseeSubsidiary/GetSourceAgent');
        const data = response.data;

        dispatch(setSourceAgent(data));
    };
};

const setSourceAgent = (data) => {
    return {
        type: actionType.SET_SOURCE_AGENT,
        data: data
    };
};

const fetchSubUsernames = ({ sourceAgency, quantity }) => {
    return async (dispatch) => {
        try {
            dispatch(toggleLoader(true));

            const response = await Site.fetchData({ sourceAgency, quantity }, 'LicenseeSubsidiary/GenerateSubUserName');
            const data = response.data;

            if (!data || !Array.isArray(data) || data.length === 0) {
                return;
            }

            const subUsers = [];
            for (let subUser of data) {
                subUsers.push({
                    username: subUser,
                    status: AgencyStatus.NotCreated
                });
            }

            dispatch(setAgencies(subUsers));
        } finally {
            dispatch(toggleLoader(false));
        }
    };
};

const createAgencies = params => {
    return async (dispatch) => {
        try {
            dispatch(toggleLoader(true));

            const response = await Site.fetchData(params,
                'LicenseeSubsidiary/CreateSubsidiaries');
            const data = response.data;

            let countErr = 0;
            const subUsers = [];
            for (let subUser of data.Subsidiaries) {
                let status = AgencyStatus.Created;
                if (!subUser.IsSuccess) {
                    status = AgencyStatus.Failed;
                    countErr++;
                }

                subUsers.push({
                    username: subUser.Data.Username,
                    status: status
                });
            }

            if (countErr > 0) {
                dispatch(
                    addAgencyMessage({ status: MessageStatus.AddSubsidiaryFailed, params: { quantity: countErr } }));
            }

            if (data.FailedStep) {
                dispatch(addAgencyMessage({ status: data.FailedStep }));
            }

            dispatch(setAgencies(subUsers));
        } finally {
            dispatch(toggleLoader(false));
        }
    };
};

const toggleProcess = (agencies, fromStatus, targetStatus) => {
    return async (dispatch) => {
        const toggledAgencies = agencies.map(agency => {
            if (agency.status === fromStatus) {
                agency.status = targetStatus;
            }
            return agency;
        });

        dispatch(setAgencies(toggledAgencies));
    };
};

const setAgencies = (data) => {
    return {
        type: actionType.SET_AGENCIES,
        data: data
    };
};

const addAgencyMessage = (data) => {
    return {
        type: actionType.ADD_GRID_MESSAGE,
        data: data
    };
};

const setAgencyMessages = (data) => {
    return {
        type: actionType.SET_GRID_MESSAGE,
        data: data
    };
};

export default {
    toggleLoader,
    fetchLicensees,
    fetchCurrencies,
    toggleProcess,
    fetchSourceAgent,
    setSourceAgent,
    setCurrencies,
    setSelectCurrency,
    setLicensees,
    setSelectLicensee,
    fetchSubUsernames,
    createAgencies,
    setAgencies,
    addAgencyMessage,
    setAgencyMessages
}