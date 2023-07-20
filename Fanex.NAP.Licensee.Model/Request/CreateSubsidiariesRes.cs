using System.Collections.Generic;
using Fanex.NAP.Licensee.Model.DTO;
using Fanex.NAP.Licensee.Model.DTO.Subsidiary;

namespace Fanex.NAP.Licensee.Model.Request
{
    public class CreateSubsidiariesRes
    {
        public List<ResultData<SubsidiaryAccount>> Subsidiaries { get; set; }

        public string FailedStep { get; set; }
    }

    public enum CreateSubsidiariesError
    {
        AddToLicenseeFailed,
        ExcludePermissionFailed
    }
}
