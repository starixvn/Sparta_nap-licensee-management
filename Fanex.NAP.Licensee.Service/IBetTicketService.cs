namespace Fanex.NAP.Licensee.Service
{
    using Fanex.NAP.Licensee.Model.Criteria.BetTicket;
    using Fanex.NAP.Licensee.Model.DTO;
    using System.Collections.Generic;

    public interface IBetTicketService
    {
        IEnumerable<string> GetSiteNames();

        ResultGridData<BetTicket> GetBetTicketList(SearchBetTicketCriteria criteria);
    }
}