namespace Fanex.NAP.Licensee.Service
{
    using Fanex.Data;

    public interface IObjectDbGenerator
    {
        IObjectDb Create(string key, int commandTimeOut = 120);

        //IObjectDb Create(IDbSetting setting, bool ignoreExceptionIsNotParameter = false, int commandTimeOut = 120);
    }
}
