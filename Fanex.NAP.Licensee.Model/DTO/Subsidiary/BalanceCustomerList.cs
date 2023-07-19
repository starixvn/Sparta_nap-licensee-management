using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Ajax.Utilities;

namespace Fanex.NAP.Licensee.Model.DTO.Subsidiary
{
    public class BalanceCustomerList
    {
        private const int IdIndex = 0;

        private const int NameIndex = 0;

        public BalanceCustomerList(string rawBalExceptCustomers)
        {
            ExceptCustomers = RawStringToBalUsers(rawBalExceptCustomers);
        }


        public List<BalanceExceptCustomer> ExceptCustomers { get; set; }

        private static List<BalanceExceptCustomer> RawStringToBalUsers(string rawBalExceptCustomers)
        {
            var result = new List<BalanceExceptCustomer>();
            if (rawBalExceptCustomers.IsNullOrWhiteSpace())
            {
                return result;
            }

            var users = rawBalExceptCustomers.Split(',');
            result.AddRange(users
                           .Select(user => user.Split(';'))
                           .Select(userInfo => new BalanceExceptCustomer(
                                                                         Convert.ToInt32(userInfo[IdIndex]),
                                                                         userInfo[NameIndex])));

            return result;
        }
    }
}
