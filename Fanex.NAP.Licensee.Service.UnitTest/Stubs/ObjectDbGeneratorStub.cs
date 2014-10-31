// -----------------------------------------------------------------------
// <copyright file="ObjectDbGeneratorStub.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Service.UnitTests.Stubs
{
    using Fanex.Data;
    using NSubstitute;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public class ObjectDbGeneratorStub : IObjectDbGenerator
    {
        public ObjectDbGeneratorStub()
        {
            this.ObjectDb = Substitute.For<IObjectDb>();
        }

        public IObjectDb ObjectDb { get; set; }

        #region IObjectDbGenerator Members        

        public IObjectDb Create(string key, int commandTimeOut = 120)
        {
            return this.ObjectDb;
        }

        public IObjectDb Create(IDbSetting setting, bool ignoreExceptionIsNotParameter = false, int commandTimeOut = 120)
        {
            return this.ObjectDb;
        }

        #endregion
    }
}
