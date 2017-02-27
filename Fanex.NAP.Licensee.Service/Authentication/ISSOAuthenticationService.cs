namespace Fanex.NAP.Licensee.Service
{
    using Model.DTO;
    using Model.Enumerations;
    using NAP.Core.Web.Session;

    public interface ISSOAuthenticationService
    {
        NapLoginStatus SingleSignOn(SSOLogin ssoLogin, ICurrentSession napCurrentSession);
    }
}
