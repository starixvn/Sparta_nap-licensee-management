namespace Fanex.NAP.Licensee.Service
{
    using System;
    using System.Security.Cryptography;
    using System.Text;
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
    }
}
