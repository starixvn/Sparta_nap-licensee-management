// -----------------------------------------------------------------------
// <copyright file="SettingLogItem.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Model.DTO.DefaultBetSetting
{
    using System;
    using System.Collections.Generic;
    using Fanex.NAP.Licensee.Model.DataDomain;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    [Serializable]
    public class SettingLogItem
    {
        private string _data;
        private string _oldData;
        private string _items;

        public DateTime LogDate { get; set; }

        public string EditedBy { get; set; }

        public string ActionName { get; set; }

        public LogActionType ActionId { get; set; }

        public string AgentName { get; set; }

        public string Data
        {
            get { return _data; }
            set { _data = value; }
        }

        public string OldData
        {
            get { return _oldData; }
            set { _oldData = value; }
        }

        /// <summary>
        /// Gets or sets log template.
        /// </summary>
        /// <value>The template.</value>
        public string Items
        {
            get { return _items; }
            set { _items = value; }
        }

        public IList<BetSettingBySport> Settings
        {
            get
            {
                return SettingItemHelper.Map(this._data, this._items);
            }
        }

        public IList<BetSettingBySport> OldSettings
        {
            get
            {
                return SettingItemHelper.Map(this._oldData, this._items);
            }
        }
    }
}