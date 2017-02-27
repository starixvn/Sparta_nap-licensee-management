namespace Fanex.NAP.Licensee.Service
{
    using Fanex.NAP.Core.Web.Session;
    using Model.DTO;

    public interface ICommonAuthenticationService
    {
        RecheckInStatus RecheckIn(ICurrentSession currentSession);

        void Logout(ICurrentSession currentSession);
    }
}
