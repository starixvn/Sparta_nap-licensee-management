// -----------------------------------------------------------------------
// <copyright file="IObjectDbGenerator.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Service
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
using Fanex.Data;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public interface IObjectDbGenerator
    {
        IObjectDb Create(string key, int commandTimeOut = 120);

        IObjectDb Create(IDbSetting setting, bool ignoreExceptionIsNotParameter = false, int commandTimeOut = 120);
    }
}
