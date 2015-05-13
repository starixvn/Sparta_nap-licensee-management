// -----------------------------------------------------------------------
// <copyright file="Product.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Model.DTO.Core
{
    using System;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    [Serializable]
    public class Product
    {
        public int ProductId { get; set; }

        public string ProductName { get; set; }

        public string ProductPrefix { get; set; }
    }
}