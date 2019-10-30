namespace Fanex.NAP.Licensee.Infrastructure
{
    using System;
    using System.Diagnostics;
    using Model.Criteria.Vendor;
    using Quartz;
    using Service;
    using Service.Redis;

    public class BackgroundJob : IJob
    {
        private readonly ILicenseeVendorService _vendorService;
        private readonly IRedisService _redisService;

        public BackgroundJob()
        {
            _vendorService = new LicenseeVendorService();
            _redisService = new RedisService();
        }

        public void Execute(IJobExecutionContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            UpdatePassExpried();
        }

        private void UpdatePassExpried()
        {
            var userSupports = _vendorService.GetITSupportAccount();

            foreach (var user in userSupports)
            {
                if (_redisService.GetValue(user.UserPWD) == null)
                {
                    var defaultPass = SecurityHelper.GeneratePass(0);
                    var criteria = new LAPUserCriteria
                    {
                        SiteName = user.SiteName,
                        UserID = user.UserID
                    };
                    criteria.UserPWD = SecurityHelper.EncryptPass(defaultPass);

                    _vendorService.UpdateUserPassword(criteria, true);
                }
            }
        }
    }
}