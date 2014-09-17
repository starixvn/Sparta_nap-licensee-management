// ---------------------------------------------------------------------------------
// <copyright file="CastHelper.cs" company="Nexcel Solutions Vietnam">
//     Copyright (c) Nexcel Solutions Vietnam. All rights reserved.
// </copyright>
// ---------------------------------------------------------------------------------
// <history>
//     <change who="Marc.Bui" date="2012.11.16">Create</change>
// </history>
// ---------------------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Service.Utilities
{
    using System;
    using System.Globalization;

    /// <summary>
    /// Casting utilities.
    /// </summary>
    public static class CastHelper
    {
        /// <summary>
        /// Convert input value object to decimal.
        /// </summary>
        /// <param name="value">The value.</param>
        /// <returns>The converted value.</returns>
        public static decimal AsDecimal(object value)
        {
            return AsDecimal(value, 0, CultureInfo.CurrentCulture);
        }

        /// <summary>
        /// Convert input value object to decimal.
        /// </summary>
        /// <param name="value">The value.</param>
        /// <param name="defaultValue">The default value.</param>
        /// <returns>The converted value.</returns>
        public static decimal AsDecimal(object value, decimal defaultValue)
        {
            return AsDecimal(value, defaultValue, CultureInfo.CurrentCulture);
        }

        /// <summary>
        /// Convert input value object to decimal.
        /// </summary>
        /// <param name="value">The value.</param>
        /// <param name="provider">The provider.</param>
        /// <returns>The converted value.</returns>
        public static decimal AsDecimal(object value, IFormatProvider provider)
        {
            return AsDecimal(value, 0, provider);
        }

        /// <summary>
        /// Convert input value object to decimal.
        /// </summary>
        /// <param name="value">The value.</param>
        /// <param name="defaultValue">The default value.</param>
        /// <param name="provider">The provider.</param>
        /// <returns>The converted value.</returns>
        public static decimal AsDecimal(object value, decimal defaultValue, IFormatProvider provider)
        {
            if (value == null || value == System.DBNull.Value)
            {
                return defaultValue;
            }

            decimal retval;

            if (provider == null)
            {
                provider = CultureInfo.CurrentCulture;
            }

            try
            {
                retval = Convert.ToDecimal(value, provider);
            }
            catch (InvalidCastException)
            {
                retval = defaultValue;
            }
            catch (FormatException)
            {
                retval = defaultValue;
            }

            return retval;
        }

        /// <summary>
        /// Convert input value object to decimal invariant.
        /// </summary>
        /// <param name="value">The value.</param>
        /// <returns>The converted value.</returns>
        public static decimal AsDecimalInvariant(object value)
        {
            return AsDecimal(value, 0, CultureInfo.InvariantCulture);
        }

        /// <summary>
        /// Convert input value object to decimal invariant.
        /// </summary>
        /// <param name="value">The value.</param>
        /// <param name="defaultValue">The default value.</param>
        /// <returns>The converted value.</returns>
        public static decimal AsDecimalInvariant(object value, decimal defaultValue)
        {
            return AsDecimal(value, defaultValue, CultureInfo.InvariantCulture);
        }
    }
}