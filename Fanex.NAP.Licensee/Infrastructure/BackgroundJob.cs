namespace Fanex.NAP.Licensee.Infrastructure
{
    using System;
    using System.Configuration;
    using System.Linq;
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
            var userSupports = _vendorService.GetAllUserSupport();

            foreach (var user in userSupports)
            {
                if (_redisService.GetValue(user.UserPWD) == null)
                {
                    var defaultPass = GeneratePass(0);
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

        private string GeneratePass(int extendTime)
        {
            Random random = new Random();
            var randomString = "!@#$%&=1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOQPRSTUVWXYZ";

            var userPWD = extendTime.ToString("00");
            userPWD += string.Concat(Enumerable.Repeat(randomString, 5).Select(s => s[random.Next(s.Length)]).ToArray());
            userPWD += DateTime.Now.ToString("ddMMyyHH");

            return userPWD;
        }
    }
}