// -----------------------------------------------------------------------
// <copyright file="SettingItemHelper.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Model
{
    using System;
    using System.Collections.Generic;
    using System.Xml.Linq;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.DTO.XmlLog;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    internal static class SettingItemHelper
    {
        private const string XMLHEADER = "<?xml version=\"1.0\" encoding=\"utf-8\" ?>";
        private const string SPORTTYPE = "sporttype";
        private const string BETTYPE = "bettype";
        private const string MAXBET = "maxbet";
        private const string MAXPERMATCH = "maxpermatch";
        private const string MAXPERBALL = "maxperball";
        private const string ENGLISHLANGCODE = "en";
        private const int MIXPARLAYBETTYPE = 9;
        private const int ORTHERSPORT = 99;
        private const string MIXPARLAYSPORTNAME = "Mix Sports Parlay";
        private const string ORTHERSPORTNAME = "Other Sports";

        public static IList<BetSettingBySport> Map(string xmlData, string xmlTemplate)
        {
            IList<BetSettingBySport> result = new List<BetSettingBySport>();
            if (!string.IsNullOrEmpty(xmlData) && !string.IsNullOrEmpty(xmlTemplate))
            {
                var template = GetTemplate(xmlTemplate);
                var xmlDoc = XDocument.Parse(XMLHEADER + xmlData);
                var settings = xmlDoc.Descendants("st");
                foreach (var setting in settings)
                {
                    result.Add(new BetSettingBySport
                    {
                        BetType = GetIntXMlAttribute(setting, template.BetType),
                        MaxBet = GetDecXMlAttribute(setting, template.MaxBet),
                        MaxPerBall = GetDecXMlAttribute(setting, template.MaxPerBall),
                        MaxPerMatch = GetDecXMlAttribute(setting, template.MaxPerMatch),
                        SportOrGame = GetSportOrGame(setting, template)
                    });
                }
            }

            return result;
        }

        private static SportOrGameItem GetSportOrGame(XElement row, LogTemplate template)
        {
            var result = new SportOrGameItem();
            var bettype = GetIntXMlAttribute(row, template.BetType);
            var sport = GetIntXMlAttribute(row, template.SportType);
            if (bettype > 0 && sport > 0)
            {
                result.Id = sport;
                result.Name = RemotingRef.RefData.GetSportName(sport.ToString(), ENGLISHLANGCODE);
                if (sport == ORTHERSPORT)
                {
                    if (bettype == MIXPARLAYBETTYPE)
                    {
                        result.Name = MIXPARLAYSPORTNAME;
                    }
                    else
                    {
                        result.Name = ORTHERSPORTNAME;
                    }
                }
            }

            return result;
        }

        private static LogTemplate GetTemplate(string xmlTemplate)
        {
            var result = new LogTemplate();
            var xmlDoc = XDocument.Parse(XMLHEADER + xmlTemplate);
            var rows = xmlDoc.Descendants("row");
            foreach (var row in rows)
            {
                var key = GetStringXMlAttribute(row, "item");
                var alias = GetStringXMlAttribute(row, "alias");
                switch (key)
                {
                    case SPORTTYPE:
                        result.SportType = alias;
                        break;

                    case BETTYPE:
                        result.BetType = alias;
                        break;

                    case MAXBET:
                        result.MaxBet = alias;

                        break;

                    case MAXPERMATCH:
                        result.MaxPerMatch = alias;

                        break;

                    case MAXPERBALL:
                        result.MaxPerBall = alias;

                        break;
                }
            }
            return result;
        }

        private static string GetStringXMlAttribute(XElement row, string attributeName)
        {
            try
            {
                return row.Attribute(attributeName).Value;
            }
            catch (ArgumentNullException)
            {
            }
            return string.Empty;
        }

        private static int GetIntXMlAttribute(XElement row, string attributeName)
        {
            var value = GetStringXMlAttribute(row, attributeName);
            return string.IsNullOrEmpty(value) ? 0 : int.Parse(value);
        }

        private static decimal? GetDecXMlAttribute(XElement row, string attributeName)
        {
            var value = GetStringXMlAttribute(row, attributeName);
            try
            {
                if (!string.IsNullOrEmpty(value))
                {
                    return Decimal.Parse(value);
                }
            }
            catch (ArgumentNullException)
            {
            }
            catch (FormatException)
            {
            }
            catch (OverflowException)
            {
            }

            return null;
        }
    }
}