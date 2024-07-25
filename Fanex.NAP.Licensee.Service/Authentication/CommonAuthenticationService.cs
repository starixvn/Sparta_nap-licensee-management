namespace Fanex.NAP.Licensee.Service
{
    using System.Web;
    using System.Web.Security;
    using Model.DTO;
    using NAP.Core.Configuration;
    using NAP.Core.Service.Impl;
    using NAP.Core.Service.Interface;
    using NAP.Core.Web.Session;
    using ONEbook.UM;
    using ONEbook.UM.Services;

    public class CommonAuthenticationService : ICommonAuthenticationService
    {
        private readonly ISiteService _siteService;
        private readonly ISecurityService _securityService;
        private readonly IMaintenanceService _maintenanceService;

        public CommonAuthenticationService()
            : this(null, null, null)
        {
        }

        public CommonAuthenticationService(
            ISiteService siteService,
            ISecurityService securityService,
            IMaintenanceService maintenanceService)
        {
            _siteService = siteService ?? new SiteService();
            _securityService = securityService ?? new SecurityService();
            _maintenanceService = maintenanceService ?? new MaintenanceService(
                      UMClientManager.RestClient,
                      UMClientManager.CacheService,
                      UMClientManager.UMClientConfigs,
                      UMClientManager.HttpContext);
        }

        public RecheckInStatus RecheckIn(ICurrentSession currentSession)
        {
            var settings = NapSettings.Settings;

            if (!settings.EnableReCheckIn)
            {
                return RecheckInStatus.Success;
            }

            if (_maintenanceService.IsUnderMaintenance())
            {
                return RecheckInStatus.UnderMaintenance;
            }

            if (currentSession == null || currentSession.OnUserId == 0)
            {
                return RecheckInStatus.KickOut;
            }

            var status = _securityService.ReCheckIn(currentSession.OnUserId, settings.SiteId);

            return status > 0 ? RecheckInStatus.KickOut : RecheckInStatus.Success;
        }

        public void Logout(ICurrentSession currentSession)
        {
            if (currentSession != null)
            {
                if (currentSession.OnUserId > 0)
                {
                    _securityService.Logout(currentSession.OnUserId);
                }

                currentSession.ClearAll();
            }

            HttpContext.Current.Response.Cookies.Clear();
            FormsAuthentication.SignOut();
        }
    }
}