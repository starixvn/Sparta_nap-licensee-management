// -----------------------------------------------------------------------
// <copyright file="ProductService.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Service.Core
{
    using System.Collections.Generic;
    using Fanex.Data;
    using Fanex.NAP.Licensee.Model.Criteria.Core;
    using Fanex.NAP.Licensee.Model.DTO.Core;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public class ProductService : IProductService
    {
        public IEnumerable<Product> GetAllProduct(GetAllProductCriteria criteria)
        {
            using (var objectDb = new ObjectDb(criteria.GetSettingKey()))
            {
                return objectDb.Query<Product>(criteria.GetSpParams());
            }
        }
    }
}