// -----------------------------------------------------------------------
// <copyright file="IProductService.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Service.Core
{
    using System.Collections.Generic;
    using Fanex.NAP.Licensee.Model.Criteria.Core;
    using Fanex.NAP.Licensee.Model.DTO.Core;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public interface IProductService
    {
        IEnumerable<Product> GetAllProduct(GetAllProductCriteria criteria);
    }
}