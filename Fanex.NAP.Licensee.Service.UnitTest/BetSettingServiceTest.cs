// -----------------------------------------------------------------------
// <copyright file="BetSettingServiceTest.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Service.UnitTests
{
    using System.Collections.Generic;
    using System.Data;
    using Fanex.NAP.Licensee.Model.Criteria.DefaultBetSetting;
    using Fanex.NAP.Licensee.Model.DTO.DefaultBetSetting;
    using Fanex.NAP.Licensee.Service.UnitTests.Stubs;
    using NSubstitute;
    using NUnit.Framework;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    [TestFixture]
    public class BetSettingServiceTest
    {
        private IBetSettingService _service;
        private ObjectDbGeneratorStub _objectDbGeneratorStub;

        [SetUp]
        public void SetUp()
        {
            _objectDbGeneratorStub = new ObjectDbGeneratorStub();
            _service = new BetSettingService(_objectDbGeneratorStub);
        }

        /// <summary>
        /// Test SingleSetting method.
        /// </summary>
        [Test]
        public void SingleSetting_CheckNumberOfSportbooks_AreEqual()
        {
            // Arrange
            var expectedSportBooksCount = 2;
            var reader = Substitute.For<IDataReader>();
            reader.Read().Returns(true, false, true, false);
            reader.NextResult().Returns(true);
            reader[string.Empty].ReturnsForAnyArgs((x) => (x[0].ToString() == "Group" ? "SB" : "0"));
            
            _objectDbGeneratorStub.ObjectDb.ExecuteReader(string.Empty).ReturnsForAnyArgs(reader);
            _objectDbGeneratorStub.ObjectDb.GetParameterValue("@CurrencyName").Returns(string.Empty);
            _objectDbGeneratorStub.ObjectDb.GetParameterValue("@HasSetting").Returns(default(bool));

            // Act
            var model = _service.SingleSetting(new GetSingleDefaultBetSettingCriteria());

            // Assert
            Assert.AreEqual(model.Sportbook.Count, expectedSportBooksCount);
        }

        /// <summary>
        /// Test InsertOrUpdate method.
        /// </summary>
        [Test]
        public void InsertOrUpdate_CheckErrorCodeAndMessage_AreEqual()
        {
            // Arrange
            var errorCode = 999;
            var errorMessage = "Unknown";
            _objectDbGeneratorStub.ObjectDb.GetParameterValue("@errcode").Returns(errorCode);
            _objectDbGeneratorStub.ObjectDb.GetParameterValue("@ErrMsg").Returns(errorMessage);

            // Act
            var result = _service.InsertOrUpdate(new InsertOrUpdateDefaultBetSetting());

            // Assert
            Assert.IsTrue(result.IsOk == false && result.Message == errorMessage);
        }

        /// <summary>
        /// Test GetAgents method.
        /// </summary>
        [Test]
        public void GetAgents_CheckFirstAgentName_AreEqual()
        {
            // Arrange
            var expectedFirstAgentName = "All";
            _objectDbGeneratorStub.ObjectDb.Query<AgentItem>(string.Empty).ReturnsForAnyArgs(new List<AgentItem>());
            
            // Act
            var agentItems = _service.GetAgents(new GetAgentListCriteria());

            // Assert
            Assert.AreEqual(agentItems[0].Name, expectedFirstAgentName);
        }
    }
}
