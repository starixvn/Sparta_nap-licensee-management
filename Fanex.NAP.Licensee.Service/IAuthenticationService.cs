namespace Fanex.NAP.Licensee.Service
{
    using System.Web;
    using Fanex.NAP.Core.Web.Session;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.Enumerations;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public interface IAuthenticationService
    {
        NapLoginStatus ValidateUser(LoginUser loginUser);

        string GetLoginStatusError(NapLoginStatus loginStatus);

        HttpCookie CreateAuthenticationCookie(ICurrentSession currentSession);
    }
}