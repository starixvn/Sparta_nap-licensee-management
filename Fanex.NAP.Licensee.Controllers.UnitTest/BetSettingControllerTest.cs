namespace Fanex.NAP.Licensee.Controllers.UnitTest
{
    using System.Collections.Generic;
    using System.Diagnostics.CodeAnalysis;
    using Fanex.NAP.Licensee.Model.Criteria;
    using Fanex.NAP.Licensee.Model.DTO;
    using Fanex.NAP.Licensee.Service;
    using NSubstitute;
    using NUnit.Framework;

    /// <summary>
    /// Bet Setting Controller Test.
    /// </summary>
    [SuppressMessage("Microsoft.Design", "CA1001:TypesThatOwnDisposableFieldsShouldBeDisposable", Justification = "OK")]
    public class BetSettingControllerTest
    {
        private ICommonService _commonService;
        private IBetSettingService _betSettingService;
        private BetSettingController _controller;

        [SetUp]
        public void SetUp()
        {
            _commonService = Substitute.For<ICommonService>();
            _betSettingService = Substitute.For<IBetSettingService>();

            _controller = new BetSettingController(_commonService, _betSettingService);
        }

        /// <summary>
        /// Test Default Action.
        /// </summary>
        [Test]
        public void Default_CheckSampleData_NotNull()
        {
            var criteria = new GetAllDefaultBetSettingCriteria()
            {
                Licensee = "Foo",
                Currency = "UUS",
                ShowSportBook = true
            };

            var sampleBetSettings = new List<DefaultBetSetting>();

            _betSettingService.GetAll(criteria).ReturnsForAnyArgs(sampleBetSettings);
            var result = _controller.Default(criteria);
            Assert.IsNotNull(result);
        }
    }
}
