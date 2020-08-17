namespace Fanex.NAP.Licensee.Service
{
    using Fanex.NAP.Licensee.Model.Criteria.BetTicket;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Service.Core;
    using System;
    using System.Collections.Generic;

    public class BetTicketService : IBetTicketService
    {
        private readonly IObjectDbGenerator _objectDbGenerator;

        public BetTicketService()
        {
            _objectDbGenerator = new ObjectDbGenerator();
        }

        public IEnumerable<string> GetSiteNames()
        {
            using (var db = _objectDbGenerator.Create("Nap_LM_SubsidiarySiteName_Select"))
            {
                return db.Query<string>();
            }
        }

        public ResultGridData<BetTicket> GetBetTicketList(SearchBetTicketCriteria criteria)
        {
            var result = new ResultGridData<BetTicket>();

            //using (var db = _objectDbGenerator.Create("Nap_LM_ITUser_Select"))
            //{
            //    result.Data = db.Query<BetTicket>(criteria);
            //}
            Random rnd = new Random();
            List<BetTicket> lstData = new List<BetTicket>();
            for(int i=0; i<10; i++)
            {
                BetTicket ticketObj = new BetTicket();
                ticketObj.ProductId = i;
                ticketObj.ProductName = "product-" + i.ToString();
                ticketObj.Percent = rnd.Next(0, 100);
                ticketObj.ExpectedWL = rnd.Next(0, 100000);
                ticketObj.AccumulatedWL = rnd.Next(0, 100000);
                ticketObj.RemainingWL = rnd.Next(0, 100000);
                ticketObj.ExpectedTurnover = rnd.Next(0, 100000);
                ticketObj.AccumulatedTurnover = rnd.Next(0, 100000);
                ticketObj.RemainingTurnover = rnd.Next(0, 100000);
                lstData.Add(ticketObj);
            }
            result.Data = lstData;
            result.TotalItem = criteria.TotalItem == 0 ? lstData.Count : criteria.TotalItem; 

            return result;
        }
    }
}
