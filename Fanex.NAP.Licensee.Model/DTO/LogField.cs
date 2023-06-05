namespace Fanex.NAP.Licensee.Model.DTO
{
    using System;

    public class LogField
    {
        public int LogId { get; set; }

        public DateTime LogDate { get; set; }

        public string LogDateString => LogDate.ToString("MM/dd/yyyy h:mm:ss tt");

        public string EditedBy { get; set; }

        public string ActionName { get; set; }

        public int ActionId { get; set; }

        public string Data { get; set; }

        public string OldData { get; set; }
    }
}
