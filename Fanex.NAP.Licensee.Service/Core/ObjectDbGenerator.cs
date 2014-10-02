// -----------------------------------------------------------------------
// <copyright file="ObjectDbGenerator.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Service.Core
{
    using Fanex.Data;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public class ObjectDbGenerator : IObjectDbGenerator
    {
        #region IObjectDbWrapper Members

        public IObjectDb Create(string key, int commandTimeOut = 120)
        {
            return new ObjectDb(key, commandTimeOut);
        }

        public IObjectDb Create(IDbSetting setting, bool ignoreExceptionIsNotParameter = false, int commandTimeOut = 120)
        {
            return new ObjectDb(setting, ignoreExceptionIsNotParameter, commandTimeOut);
        }

        #endregion
    }
}
