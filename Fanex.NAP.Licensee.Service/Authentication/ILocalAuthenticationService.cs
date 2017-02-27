namespace Fanex.NAP.Licensee.Service
{
    using Model.DTO;
    using Model.Enumerations;
    using NAP.Core.Web.Session;

    public interface ILocalAuthenticationService
    {
        NapLoginStatus Login(LoginUser loginUser, ICurrentSession napCurrentSession);
    }
}
