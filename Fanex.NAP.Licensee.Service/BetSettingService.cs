// -----------------------------------------------------------------------
// <copyright file="BetSettingService.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Service
{
    using System;
    using System.Collections.Generic;
    using System.Data;
    using System.Linq;
    using Fanex.NAP.Licensee.Model.Criteria.DefaultBetSetting;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.DTO.DefaultBetSetting;
    using Fanex.NAP.Licensee.Model.ViewModel.DefaultBetSetting;
    using Fanex.NAP.Licensee.Service.Core;
   
    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    public class BetSettingService : IBetSettingService
    {
        private const int SuccessCode = 0;
        private const string SB = "SB";
        private const string VS = "VS";
        private const string NG = "NG";
        private const string KN = "KN";
        private const string NoneAgent = "All";

        private IObjectDbGenerator _objectDbGenerator;

        public BetSettingService()
        {
            _objectDbGenerator = new ObjectDbGenerator();
        }

        public BetSettingService(IObjectDbGenerator objectDbGenerator)
        {
            _objectDbGenerator = objectDbGenerator;
        }

        public IList<DefaultBetSetting> GetAll(GetAllDefaultBetSettingCriteria criteria)
        {
            using (var db = _objectDbGenerator.Create(criteria.GetSettingKey()))
            {
                return db.Query<DefaultBetSetting>(criteria).ToList();
            }
        }

        /// <summary>
        /// Get Default bet setting.
        /// </summary>
        /// <param name="criteria">The criterion.</param>
        /// <returns>The Bet setting view model.</returns>
        public SingleDefaultBetSettingViewModel SingleSetting(GetSingleDefaultBetSettingCriteria criteria)
        {
            var result = new SingleDefaultBetSettingViewModel();
            using (var objectDb = _objectDbGenerator.Create(criteria.GetSettingKey()))
            {
                using (var reader = objectDb.ExecuteReader(criteria))
                {
                    while (reader.Read())
                    {
                        BindBetSettingBySport(result, reader);
                    }

                    if (reader.NextResult())
                    {
                        while (reader.Read())
                        {
                            BindBetSettingBySport(result, reader);
                        }
                    }
                }

                result.Licensee = criteria.Licensee;
                result.Agent = new AgentItem
                {
                    Id = criteria.AgentID,
                    Name = criteria.AgentID.HasValue ? objectDb.GetParameterValue("@AgentName").ToString() : NoneAgent
                };
                result.Currency = new CurrencyItem
                {
                    Id = criteria.CurrencyID,
                    Name = objectDb.GetParameterValue("@CurrencyName").ToString()
                };

                result.HasSetting = Convert.ToBoolean(objectDb.GetParameterValue("@HasSetting"));
            }

            return result;
        }

        /// <summary>
        /// Insert Or Update default bet setting.
        /// </summary>
        /// <param name="criteria">The criterion.</param>
        /// <returns>True if successful.</returns>
        public ResultInfo InsertOrUpdate(InsertOrUpdateDefaultBetSetting criteria)
        {
            var result = new ResultInfo();
            using (var db = _objectDbGenerator.Create(criteria.GetSettingKey()))
            {
                db.ExecuteReader(criteria);
                result.IsOk = db.GetParameterValue("@errcode").Equals(SuccessCode);
                var msg = db.GetParameterValue("@ErrMsg");
                result.Message = msg != null ? msg.ToString() : string.Empty;
            }

            return result;
        }

        public IList<AgentItem> GetAgents(GetAgentListCriteria criteria)
        {
            var parameters = new
            {
                criteria.Licensee,
                criteria.CurrencyID,
            };

            using (var db = _objectDbGenerator.Create(criteria.GetSettingKey()))
            {
                var results = db.Query<AgentItem>(parameters).ToList();
                results.Insert(0, new AgentItem { Name = NoneAgent });
                return results;
            }
        }

        public IList<SettingLogItem> GetLogs(GetSettingLogCriteria criteria)
        {
            using (var db = _objectDbGenerator.Create(criteria.GetSettingKey()))
            {
                return db.Query<SettingLogItem>(criteria).ToList();
            }
        }

        /// <summary>
        /// Read setting from data reader.
        /// </summary>
        /// <param name="reader">The reader context.</param>
        /// <returns>The bet setting by sport.</returns>
        private BetSettingBySport ReadBetSettingBySport(IDataReader reader)
        {
            return new BetSettingBySport
            {
                SportOrGame = new SportOrGameItem
                {
                    Id = int.Parse(reader["SportType"].ToString()),
                    Name = ColumnExisted(reader, "SportName") ? reader["SportName"].ToString() : string.Empty
                },
                BetType = int.Parse(reader["Bettype"].ToString()),
                MaxBet = reader["MaxBet"] != DBNull.Value ? decimal.Parse(reader["MaxBet"].ToString()) : new decimal?(),
                MaxPerMatch = reader["MaxPerMatch"] != DBNull.Value ? decimal.Parse(reader["MaxPerMatch"].ToString()) : new decimal?(),
                MaxPerBall = reader["MaxPerBall"] != DBNull.Value ? decimal.Parse(reader["MaxPerBall"].ToString()) : new decimal?(),
            };
        }

        /// <summary>
        /// Bind setting into view model.
        /// </summary>
        /// <param name="result">The view model.</param>
        /// <param name="reader">The data reader.</param>
        private void BindBetSettingBySport(SingleDefaultBetSettingViewModel result, IDataReader reader)
        {
            var group = reader["Group"].ToString().Trim();
            switch (group)
            {
                case SB:
                    result.Sportbook.Add(ReadBetSettingBySport(reader));
                    break;

                case VS:
                    result.VirtualSport.Add(ReadBetSettingBySport(reader));
                    break;

                case NG:
                    result.NumberGame.Add(ReadBetSettingBySport(reader));
                    break;

                case KN:
                    result.Keno.Add(ReadBetSettingBySport(reader));
                    break;
            }
        }

        /// <summary>
        /// Check column existed in data reader.
        /// </summary>
        /// <param name="reader">The data reader.</param>
        /// <param name="columnName">The column name.</param>
        /// <returns>True if column existed.</returns>
        private bool ColumnExisted(IDataReader reader, string columnName)
        {
            for (int i = 0; i < reader.FieldCount; i++)
            {
                if (reader.GetName(i) == columnName)
                {
                    return true;
                }
            }

            return false;
        }
    }
}