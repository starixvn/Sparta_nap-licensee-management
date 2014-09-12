// -----------------------------------------------------------------------
// <copyright file="BetSettingService.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Service
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Fanex.Data;
    using Fanex.NAP.Licensee.Model.Criteria;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Model.ViewModel;

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

        public IList<DefaultBetSetting> GetAll(Model.Criteria.GetAllDefaultBetSettingCriteria criteria)
        {
            using (var db = new ObjectDb(criteria.GetSettingKey()))
            {
                return db.Query<DefaultBetSetting>(criteria.GetSpParams()).ToList();
            }
        }

        public SingleDefaultBetSettingViewModel Single(GetSingleDefaultBetSettingCriteria criteria)
        {
            var result = new SingleDefaultBetSettingViewModel();
            using (var db = new ObjectDb(criteria.GetSettingKey()))
            {
                using (var reader = db.ExecuteReader(criteria.GetSpParams()))
                {
                    if (reader.Read())
                    {
                        result.Licensee = reader["Licensee"].ToString();
                        if (reader["AgentID"] != DBNull.Value)
                        {
                            result.AgentId = int.Parse(reader["AgentID"].ToString());
                        }
                        result.AgentName = reader["AgentName"].ToString();
                        result.Currency = new CurrencyItem
                        {
                            Id = int.Parse(reader["CurrencyID"].ToString()),
                            Name = reader["Currency"].ToString()
                        };
                        BindBetSettingBySport(result, reader);
                        while (reader.Read())
                        {
                            BindBetSettingBySport(result, reader);
                        }
                    }

                    if (reader.NextResult())
                    {
                        while (reader.Read())
                        {
                            BindBetSettingBySport(result, reader);
                        }
                    }
                }
            }

            return result;
        }

        private void BindBetSettingBySport(SingleDefaultBetSettingViewModel result, System.Data.IDataReader reader)
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

        private BetSettingBySport ReadBetSettingBySport(System.Data.IDataReader reader)
        {
            return new BetSettingBySport
            {
                SportOrGame = new SportOrGameItem
                {
                    Id = int.Parse(reader["SportType"].ToString()),
                    Name = reader["SportName"].ToString()
                },
                BetType = int.Parse(reader["Bettype"].ToString()),
                MaxBet = reader["MaxBet"] != DBNull.Value ? decimal.Parse(reader["MaxBet"].ToString()) : new Nullable<decimal>(),
                MaxPerMatch = reader["MaxPerMatch"] != DBNull.Value ? decimal.Parse(reader["MaxPerMatch"].ToString()) : new Nullable<decimal>(),
                MaxPerBall = reader["MaxPerBall"] != DBNull.Value ? decimal.Parse(reader["MaxPerBall"].ToString()) : new Nullable<decimal>(),
            };
        }

        public ResultInfo InsertOrUpdate(InsertOrUpdateDefaultBetSetting criteria)
        {
            var result = new ResultInfo();
            using (var db = new ObjectDb(criteria.GetSettingKey()))
            {
                db.ExecuteReader(criteria.GetSpParams());
                result.IsOk = db.GetParameterValue("@errcode").Equals(SuccessCode);
                result.Message = db.GetParameterValue("@ErrMsg").ToString();
            }
            return result;
        }
    }
}