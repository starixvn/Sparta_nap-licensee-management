namespace Fanex.NAP.Licensee.Service
{
    using System;
    using System.Configuration;
    using System.Linq;
    using System.Security.Cryptography;
    using System.Text;
    using IBCCrypt;
    using Model.Enumerations;

    public static class SecurityHelper
    {
        public static string CreateToken()
        {
            return Guid.NewGuid().ToString("N");
        }

        public static string HashText(string plaintext, HashType hashType = HashType.Sha256)
        {
            if (string.IsNullOrWhiteSpace(plaintext))
            {
                return string.Empty;
            }

            byte[] textBuffer = Encoding.UTF8.GetBytes(plaintext);
            byte[] hashBuffer = GetHashAlgorithm(hashType).ComputeHash(textBuffer);
            string hash = BitConverter.ToString(hashBuffer);

            return hash.Replace("-", string.Empty).ToLower();
        }

        private static HashAlgorithm GetHashAlgorithm(HashType hashType)
        {
            HashAlgorithm hashAlgorithm;

            switch (hashType)
            {
                case HashType.Sha1:
                    hashAlgorithm = new SHA1Managed();
                    break;

                case HashType.Sha256:
                    hashAlgorithm = new SHA256Managed();
                    break;

                case HashType.Sha512:
                    hashAlgorithm = new SHA512Managed();
                    break;

                case HashType.MD5:
                default:
                    hashAlgorithm = new MD5CryptoServiceProvider();
                    break;
            }

            return hashAlgorithm;
        }

        public static string GeneratePass(double extendTime)
        {
            Random random = new Random();
            var randomString = "!@#$%&=1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOQPRSTUVWXYZ";

            var userPWD = extendTime.ToString("00");
            userPWD += string.Concat(Enumerable.Repeat(randomString, 5).Select(s => s[random.Next(s.Length)]).ToArray());
            userPWD += DateTime.Now.ToString("ddMMyyHH");

            return userPWD;
        }

        public static string EncryptPass(string pass)
        {
            var UserPasswordKey = ConfigurationManager.AppSettings["UserPasswordKey"];
            var encryptPass = IBCCrypt.GenMD5Key(pass, UserPasswordKey);

            return encryptPass;
        }
    }
}
