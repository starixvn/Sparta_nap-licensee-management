// -----------------------------------------------------------------------
// <copyright file="CustomHandleErrorAttributeTest.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace Fanex.NAP.Licensee.Controllers.UnitTests.Attributes
{
    using System;
    using System.Web;
    using System.Web.Mvc;
    using Fanex.NAP.Licensee.Controllers.Attributes;
    using NSubstitute;
    using NUnit.Framework;

    /// <summary>
    /// TODO: Update summary.
    /// </summary>
    [TestFixture]
    public class CustomHandleErrorAttributeTest
    {
        /// <summary>
        /// Test OnException method.
        /// </summary>
        [Test]
        public void OnException_CheckViewName_AreEqual()
        {
            // Arrange
            var expectedViewName = "Error";
            var httpRequest = Substitute.For<HttpRequestBase>();
            httpRequest.Headers.Returns(new System.Collections.Specialized.NameValueCollection());            

            var httpContext = Substitute.For<HttpContextBase>();
            httpContext.IsCustomErrorEnabled.Returns(true);
            httpContext.Request.Returns(httpRequest);

            var exceptionContext = new ExceptionContext();
            exceptionContext.HttpContext = httpContext;
            exceptionContext.Exception = new InvalidCastException();
            exceptionContext.RouteData.Values.Add("controller", "Foo");
            exceptionContext.RouteData.Values.Add("action", "FooAction");
            exceptionContext.Controller = Substitute.For<Controller>();

            var attribute = new CustomHandleErrorAttribute();

            // Act
            attribute.OnException(exceptionContext);

            // Assert
            Assert.AreEqual((exceptionContext.Result as ViewResult).ViewName, expectedViewName);
        }
    }
}
