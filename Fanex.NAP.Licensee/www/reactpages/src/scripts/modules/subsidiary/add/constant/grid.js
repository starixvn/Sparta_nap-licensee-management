const gridStyle = {
    Error: 'grid-error',
    Success: 'success'
};

export const MessageStatus = {
    Success: 'Success',
    AddSubsidiaryFailed: 'AddSubsidiaryFailed',
    AddToLicenseeFailed: 'AddToLicenseeFailed',
    ExcludePermissionFailed: 'ExcludePermissionFailed'
};

export const MessageStatuses = {
    Success: () => ({
        message: 'Create successfully!',
        style: gridStyle.Success
    }),
    AddSubsidiaryFailed: ({ quantity }) => ({
        message: `Failed to create ${quantity} subsidiaries!`,
        style: gridStyle.Error
    }),
    AddToLicenseeFailed: () => ({
        message:
            'Unexpected Error [Cannot create Licensee subsidiary/currency in bodb_licensee]. Please contact admin for help!',
        style: gridStyle.Error
    }),
    ExcludePermissionFailed: () => ({
        message: 'Unexpected Error [Cannot remove reports from ignored function]. Please contact admin for help!',
        style: gridStyle.Error
    })
};

export const AgencyStatus = {
    NotCreated: 0,
    Created: 1,
    Failed: 2,
    InProcess: 3
};

export const StatusStorage = [
    {
        message: 'Not Created',
        style: 'not-created'
    }, {
        message: 'Created',
        style: 'created'
    }, {
        message: 'Failed to create account',
        style: 'failed'
    }, {
        message: 'In progress...',
        style: 'in-progress'
    }
];