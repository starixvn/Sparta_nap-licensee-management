namespace Fanex.NAP.Licensee.Infrastructure
{
    using System;
    using System.Configuration;
    using IBCCrypt;
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
            var defaultPass = "00abcde" + DateTime.Now.ToString("ddMMyyHH");
            var userSupports = _vendorService.GetAllUserSupport();

            foreach (var user in userSupports)
            {
                if (_redisService.GetValue(user.UserPWD) == null)
                {
                    var criteria = new VendorUserCriteria
                    {
                        SiteName = user.SiteName,
                        UserID = user.UserID
                    };
                    criteria.UserPWD = EncryptPass(defaultPass);

                    _vendorService.UpdateUserPWA(criteria);
                }
            }
        }

        private string EncryptPass(string pass)
        {
            var userPasswordKey = ConfigurationManager.AppSettings["UserPasswordKey"];
            var encryptPass = IBCCrypt.GenMD5Key(pass, userPasswordKey);

            return encryptPass;
        }
    }
}