// -----------------------------------------------------------------------
// <copyright file="CreateLicenseeViewModel.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Model.ViewModel
{
    using System;
    using System.Collections.Generic;
    using Fanex.NAP.Licensee.Model.DTO.Core;
    using Fanex.NAP.Licensee.Model.DTO.Licensee;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    [Serializable]
    public class CreateLicenseeViewModel
    {
        public CreateLicenseeViewModel()
        {
        }

        public IEnumerable<Licensee> Licensees { get; set; }

        public IEnumerable<LicenseeType> LicenseeTypes { get; set; }

        public IEnumerable<Product> Products { get; set; }

        public IEnumerable<SystemInfo> SystemInfo { get; set; }

        public IEnumerable<FunctionInfo> SpecialFunctions { get; set; }
    }
}