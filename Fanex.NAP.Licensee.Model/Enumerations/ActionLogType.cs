namespace Fanex.NAP.Licensee.Model.Enumerations
{
    public enum ActionLogType
    {
        UpdateLapVendorInfo = 5512,

        InsertOperator = 5522,
        UpdateOperator = 5523,
        ImportOperator = 5524,
        DeleteOperator = 5525,

        Licensee_Insert = 5526,
        Licensee_AddAgent = 5527,
        Licensee_OfferProduct = 5528,
        Licensee_AddPullService = 5529,
        Licensee_RemoveProduct = 5530,
        Licensee_Terminate = 5531,
        Licensee_ActivateSystem = 5538,

        SourceLicensee_Insert = 5532,
        SourceLicensee_Update = 5533,

        LrfFunction_Insert = 5536,
        LrfFunction_Update = 5537,
        LrfFunction_AssignToLicensee = 5539,

        ITUser_Insert = 5539,
        ITUser_AssignToLicensee = 5540
    }
}